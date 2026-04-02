import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Globe, Layers, 
  ArrowRight
} from 'lucide-react';

const About: React.FC = () => {
  // --- Process Tab State ---
  const [processTab, setProcessTab] = useState<'video' | 'design'>('video');

  // Partners Logic
  const partnersSectionRef = useRef<HTMLElement>(null);
  const [isPartnersVisible, setIsPartnersVisible] = useState(false);

  // Partners Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPartnersVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.2 } 
    );

    if (partnersSectionRef.current) {
      observer.observe(partnersSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Business Items Data
  const videoBusinessItems = [
    {
      id: 1,
      title: "시네마틱 실사 촬영",
      sub: "Cinematic Reality",
      desc: "브랜드의 이야기를 가장 진솔하게 담아내는 힘. 현장의 공기까지 포착하는 인터뷰 촬영부터, 제품의 디테일을 극대화하는 매크로 촬영까지. 피사체의 본질을 영화적 미장센으로 완성합니다.",
      img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80"
    },
    {
      id: 2,
      title: "드론 시네마토그래피",
      sub: "Perspective from Above",
      desc: "지상에서는 볼 수 없었던 압도적인 스케일. 숙련된 전문가의 드론 컨트롤을 통해 평범한 풍경을 비범한 시각적 경험으로 바꿉니다. 공간의 깊이와 역동성을 더해 영상의 품격을 높입니다.",
      img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1600&q=80"
    },
    {
      id: 3,
      title: "3D 제품 모델링",
      sub: "Hyper-Realistic Visualization",
      desc: "실사를 뛰어넘는 완벽한 제어. 물리적으로 촬영 불가능한 제품의 내부 구조나 가상의 공간을 3D로 구현합니다. 빛과 질감을 정교하게 설계하여, 제품이 가진 최상의 아름다움을 시각화합니다.",
      img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=80"
    },
    {
      id: 4,
      title: "기업 모션그래픽",
      sub: "Visualizing Vision",
      desc: "보이지 않는 비전을 보이게 만드는 기술. 복잡한 비즈니스 모델이나 추상적인 데이터를 직관적인 모션그래픽으로 변환합니다. 기업 가치가 대중에게 명확하고 세련되게 전달되도록 디자인합니다.",
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80"
    }
  ];

  const designBusinessItems = [
    {
      id: 1,
      title: "브로슈어 / 리플렛",
      sub: "Brochure & Leaflet",
      desc: "기업과 브랜드의 핵심 메시지를 가장 효과적으로 전달하는 인쇄 매체. 정보 구조 설계부터 시각적 완성도까지, 읽히는 디자인을 만듭니다.",
      img: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1600&q=80"
    },
    {
      id: 2,
      title: "포스터 / 전시 그래픽",
      sub: "Poster & Exhibition",
      desc: "공간 안에서 시선을 사로잡는 비주얼 커뮤니케이션. 전시 부스, 행사장, 옥외 매체 등 다양한 환경에 최적화된 대형 그래픽을 제작합니다.",
      img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=80"
    },
    {
      id: 3,
      title: "제품 매뉴얼",
      sub: "Product Manual",
      desc: "복잡한 제품 정보를 사용자 관점에서 명확하게 정리합니다. 다국어 대응, 기술 일러스트, 인쇄 규격 관리까지 체계적으로 수행합니다.",
      img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80"
    }
  ];

  // Process Data
  const videoProcess = [
    { step: '01', title: 'Kick-off Meeting', desc: '프로젝트 목표 및 니즈 정밀 분석' },
    { step: '02', title: 'Planning & Strategy', desc: '기획안 및 스토리보드 구성' },
    { step: '03', title: 'Production', desc: '촬영 / 3D / 모션그래픽 제작 (All In-house)' },
    { step: '04', title: 'Post-Production', desc: '편집, 합성, 사운드 믹싱' },
    { step: '05', title: 'Delivery', desc: '최종 피드백 반영 및 납품' },
  ];

  const designProcess = [
    { step: '01', title: 'Briefing', desc: '요구사항 파악 및 프로젝트 범위 정의' },
    { step: '02', title: 'Content & Structure', desc: '원고 정리, 정보 구조 설계' },
    { step: '03', title: 'Design', desc: '레이아웃, 타이포그래피, 비주얼 작업' },
    { step: '04', title: 'Review & Revision', desc: '클라이언트 피드백 반영, 교정·교열' },
    { step: '05', title: 'Press Check & Delivery', desc: '인쇄 감리, 후가공 관리, 납품' },
  ];

  const activeProcess = processTab === 'video' ? videoProcess : designProcess;

  return (
    <div className="w-full animate-fade-in pb-20">
      
      {/* 1. Hero Section (Sticky Parallax / Overlay) */}
      <section className="relative h-[200vh] bg-background">
        <div className="sticky top-0 h-screen flex flex-col justify-center items-center text-center px-4 md:px-6 z-20 mix-blend-exclusion text-white">
          <span className="block text-xs font-bold uppercase tracking-widest mb-4 animate-slide-up">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-8 break-keep animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Boundless Creativity,<br />
            <span className="opacity-60">One Unified Team.</span>
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl leading-relaxed animate-slide-up opacity-90" style={{ animationDelay: '0.2s' }}>
            플레어 팩토리는 영상 제작과 디자인을 아우르는<br className="hidden md:block" />
            <strong className="font-medium">올인원 크리에이티브 그룹</strong>입니다.
          </p>
        </div>

        <div className="absolute bottom-0 w-full h-screen z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
           <img 
             src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2000&q=80" 
             alt="Cinematic View" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-black/20" />
        </div>
      </section>

      {/* 2. Why Flair Factory? — 순차 모션 제거, 동시 표시 */}
      <section className="relative bg-background z-30 pt-24 md:pt-32 px-4 md:px-6 pb-20">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Why Flair Factory?</h2>
            <p className="text-sm text-secondary uppercase tracking-widest mt-4 md:mt-0">Our Core Competencies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: In-House — 영상+디자인 포괄 */}
            <div className="group aspect-square p-8 md:p-10 bg-surface rounded-2xl border border-primary/5 hover:bg-primary flex flex-col justify-between transition-colors duration-300">
              <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:bg-background group-hover:text-primary transition-colors">
                <Users size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-background transition-colors">100% In-House</h3>
                <p className="text-secondary text-sm leading-relaxed group-hover:text-background/80 transition-colors">
                  기획부터 촬영, 편집, 디자인, 인쇄 감리까지. 외주 없이 모든 과정을 내부 전문가 팀이 직접 수행하여 최상의 퀄리티를 보장합니다.
                </p>
              </div>
            </div>

            {/* Card 2: Global Native */}
            <div className="group aspect-square p-8 md:p-10 bg-surface rounded-2xl border border-primary/5 hover:bg-primary flex flex-col justify-between transition-colors duration-300">
              <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:bg-background group-hover:text-primary transition-colors">
                <Globe size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-background transition-colors">Global Native</h3>
                <p className="text-secondary text-sm leading-relaxed group-hover:text-background/80 transition-colors">
                  내부 전문 번역가를 통해 언어적 뉘앙스까지 고려한 완벽한 다국어 콘텐츠를 제작하여 글로벌 시장을 공략합니다.
                </p>
              </div>
            </div>

            {/* Card 3: Video × Design */}
            <div className="group aspect-square p-8 md:p-10 bg-surface rounded-2xl border border-primary/5 hover:bg-primary flex flex-col justify-between transition-colors duration-300">
              <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:bg-background group-hover:text-primary transition-colors">
                <Layers size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-background transition-colors">Video × Design</h3>
                <p className="text-secondary text-sm leading-relaxed group-hover:text-background/80 transition-colors">
                  영상 제작과 인쇄 디자인을 하나의 팀에서 수행합니다. 브랜드 톤을 매체 간 일관되게 유지하며 통합 크리에이티브를 실현합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Business Areas — 세로 스크롤, Video + Design 그룹 분리 */}
      <section className="relative bg-background z-30 pt-24 md:pt-32 px-4 md:px-6 pb-20 border-t border-primary/5">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Business Areas</h2>
            <p className="text-secondary leading-relaxed max-w-xl">
              영상과 디자인, 두 축의 전문성을 바탕으로 프로젝트의 목적에 맞는 최적의 결과물을 제작합니다.
            </p>
          </div>

          {/* Video Group */}
          <div className="mb-24">
            <div className="flex items-center justify-between mb-10 border-b border-primary/10 pb-4">
              <h3 className="text-xl md:text-2xl font-display font-bold text-primary">Video</h3>
              <Link to="/video" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                View Works <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoBusinessItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-surface rounded-2xl overflow-hidden border border-primary/5 group"
                >
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">{item.sub}</p>
                    <h4 className="text-lg md:text-xl font-bold text-primary mb-3">{item.title}</h4>
                    <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Design Group */}
          <div>
            <div className="flex items-center justify-between mb-10 border-b border-primary/10 pb-4">
              <h3 className="text-xl md:text-2xl font-display font-bold text-primary">Design</h3>
              <Link to="/design" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                View Works <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {designBusinessItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-surface rounded-2xl overflow-hidden border border-primary/5 group"
                >
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">{item.sub}</p>
                    <h4 className="text-lg md:text-xl font-bold text-primary mb-3">{item.title}</h4>
                    <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. Process — B안: Video / Design 탭 분리 */}
      <section className="relative bg-background z-30 pt-24 md:pt-32 px-4 md:px-6 pb-20 border-t border-primary/5">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
            
            {/* Left: Title + Tab */}
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">Process</h2>
              <p className="text-secondary leading-relaxed mb-8">
                각 분야에 최적화된 워크플로우를 통해<br className="hidden md:block"/> 
                기획부터 납품까지 빈틈없는 결과물을 만듭니다.
              </p>
              
              {/* Tab Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setProcessTab('video')}
                  className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider rounded-full border transition-all duration-200 ${
                    processTab === 'video'
                      ? 'bg-primary text-background border-primary'
                      : 'bg-transparent text-primary/60 border-primary/20 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  Video
                </button>
                <button
                  onClick={() => setProcessTab('design')}
                  className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider rounded-full border transition-all duration-200 ${
                    processTab === 'design'
                      ? 'bg-primary text-background border-primary'
                      : 'bg-transparent text-primary/60 border-primary/20 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  Design
                </button>
              </div>
            </div>
            
            {/* Right: Process Steps */}
            <div className="md:w-2/3 space-y-0">
              {activeProcess.map((item, index) => (
                <div 
                  key={`${processTab}-${index}`}
                  className="flex items-center gap-6 py-6 border-b border-primary/10 group hover:pl-4 transition-all duration-300"
                >
                  <span className="text-sm font-bold text-primary/30 group-hover:text-primary transition-colors">
                    {item.step}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-primary mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-secondary text-sm group-hover:text-primary/70 transition-colors">{item.desc}</p>
                  </div>
                  <ArrowRight className="text-primary/0 group-hover:text-primary -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Partners — 순차 등장(transitionDelay) 제거, 동시 표시 */}
      <section ref={partnersSectionRef} className="px-4 md:px-6 py-32 bg-background border-t border-primary/5 relative z-30">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-12 text-center">
            Trusted Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Partner A', 'Partner B', 'Partner C', 'Partner D', 'Partner E', 'Partner F', 'Partner G'].map((partner, i) => (
              <div 
                key={i} 
                className={`h-24 bg-surface rounded-lg flex items-center justify-center text-primary/30 font-bold border border-primary/5 hover:border-primary/20 transition-all duration-500
                  ${isPartnersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
