// prerender.mjs — 빌드 후 각 페이지를 미리 그려서 정적 HTML로 저장합니다.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const DIST = path.resolve('dist');
const ORIGIN = 'https://www.flairfactory.co.kr';

// 페이지별 제목/설명. 새 페이지가 생기면 여기에 추가하면 됩니다.
const ROUTES = [
  {
    path: '/',
    title: '플레어팩토리 | Flair Factory Film',
    description:
      '플레어 팩토리는 홍보영상·브랜드 영상 제작과 디자인을 아우르는 올인원 크리에이티브 그룹입니다. 수출바우처 홍보영상 제작도 함께합니다.',
  },
  {
    path: '/about',
    title: '회사 소개 | 플레어팩토리 Flair Factory Film',
    description:
      '플레어팩토리는 시네마틱 실사 촬영, 드론 시네마토그래피, 3D 제품 모델링, 기업 모션그래픽을 모두 자체 제작하는 올인원 크리에이티브 그룹입니다.',
  },
  {
    path: '/video',
    title: '영상 포트폴리오 | 플레어팩토리 Flair Factory Film',
    description:
      '플레어팩토리가 제작한 기업 홍보영상, 브랜드 필름, 수출바우처 홍보영상, 3D·모션그래픽 포트폴리오를 확인하세요.',
  },
  {
    path: '/design',
    title: '디자인 포트폴리오 | 플레어팩토리 Flair Factory Film',
    description:
      '플레어팩토리의 브랜드 디자인, 인쇄물, 편집 디자인 작업 포트폴리오를 확인하세요.',
  },
  {
    path: '/contact',
    title: '문의하기 | 플레어팩토리 Flair Factory Film',
    description:
      '홍보영상 제작, 수출바우처 홍보영상, 브랜드 영상과 디자인 작업 문의. 서울 강동구 진황도로 172 3층 · flairfactoryfilm@gmail.com',
  },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// dist 폴더를 띄우는 아주 작은 정적 서버 (SPA 라우팅 지원)
function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let filePath = path.join(DIST, urlPath);

    if (!filePath.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST, 'index.html'); // SPA fallback
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    throw new Error('dist/index.html 이 없습니다. vite build 가 먼저 실행되어야 합니다.');
  }

  const { server, port } = await startServer();
  const browser = await puppeteer.launch({
    args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage'],
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const failures = [];

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      // 외부 영상 임베드는 렌더링에 필요 없고 대기만 길어지므로 차단
      await page.setRequestInterception(true);
      page.on('request', (r) => {
        const url = r.url();
        if (/player\.vimeo\.com|youtube\.com|youtu\.be|googletagmanager|google-analytics/.test(url)) {
          r.abort().catch(() => {});
        } else {
          r.continue().catch(() => {});
        }
      });

      const url = `http://127.0.0.1:${port}${route.path}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      } catch {
        console.warn(`  · ${route.path}: networkidle 대기 시간 초과 — 계속 진행`);
      }

      // Supabase 데이터 로딩 등 늦게 들어오는 내용 대기
      await sleep(2500);

      // 실제 내용이 그려졌는지 확인
      const textLength = await page.evaluate(
        () => (document.getElementById('root')?.innerText || '').trim().length
      );
      if (textLength < 30) {
        failures.push(`${route.path} (본문 ${textLength}자)`);
        await page.close();
        continue;
      }

      // 페이지별 메타 정보 주입
      await page.evaluate((r, origin) => {
        const canonical = origin + (r.path === '/' ? '/' : r.path);
        document.title = r.title;

        const setMeta = (sel, attr, value) => {
          let el = document.head.querySelector(sel);
          if (!el) {
            el = document.createElement('meta');
            const [, key, val] = sel.match(/\[(.+?)="(.+?)"\]/) || [];
            if (key && val) el.setAttribute(key, val);
            document.head.appendChild(el);
          }
          el.setAttribute(attr, value);
        };

        setMeta('meta[name="description"]', 'content', r.description);
        setMeta('meta[property="og:title"]', 'content', r.title);
        setMeta('meta[property="og:description"]', 'content', r.description);
        setMeta('meta[property="og:url"]', 'content', canonical);
        setMeta('meta[name="twitter:title"]', 'content', r.title);
        setMeta('meta[name="twitter:description"]', 'content', r.description);

        let link = document.head.querySelector('link[rel="canonical"]');
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', 'canonical');
          document.head.appendChild(link);
        }
        link.setAttribute('href', canonical);
      }, route, ORIGIN);

      const html = '<!DOCTYPE html>\n' + (await page.content()).replace(/^<!DOCTYPE html>/i, '').trim();

      const outPath =
        route.path === '/'
          ? path.join(DIST, 'index.html')
          : path.join(DIST, route.path, 'index.html');
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, 'utf-8');

      console.log(`  ✓ ${route.path.padEnd(9)} → ${path.relative(DIST, outPath)} (본문 ${textLength}자)`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failures.length) {
    throw new Error(
      '다음 페이지가 비어 있어 빌드를 중단합니다: ' + failures.join(', ')
    );
  }
  console.log('프리렌더링 완료');
}

run().catch((err) => {
  console.error('\n[프리렌더링 실패] ' + err.message);
  process.exit(1);
});
