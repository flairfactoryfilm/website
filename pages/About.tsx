import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, Globe, Layers, 
  Video, MonitorPlay, MessageSquare, 
  ArrowRight, Sparkles, ArrowDownRight
} from 'lucide-react';

const About: React.FC = () => {
  // --- Process Section Hover Logic ---
  const [activeProcess, setActiveProcess] = useState<number | null>(null);
  const cursorImgRef = useRef<HTMLDivElement>(null);

  // --- Refs for Sections ---
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null); // [NEW] 히어로 텍스트 패럴랙스용 Ref
  
  const whySectionRef = useRef<HTMLElement>(null);
  const businessSectionRef = useRef<HTMLElement>(null);
  const processSectionRef = useRef<HTMLElement>(null);
  
  // [NEW] Partners Section Logic
  const partnersSectionRef = useRef<HTMLElement>(null);
  const [isPartnersVisible, setIsPartnersVisible] = useState(false);

  // 마우스 커서 팔로워 (Process 섹션용)
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorImgRef.current && activeProcess !== null) {
        const x = e.clientX + 20; 
        const y = e.clientY + 20;
        cursorImgRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [activeProcess]);

  // [NEW] Partners Intersection Observer (도착 시 순차 재생)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPartnersVisible(true);
          observer.disconnect(); // 한 번 실행 후 연결 해제
        }
      },
      { threshold: 0.2 } // 20% 정도 보이면 실행
    );

    if (partnersSectionRef.current) {
      observer.observe(partnersSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // --- 통합 스크롤 핸들러 ---
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;

      // 1. Hero Section Logic (Image Expansion + Text Parallax)
      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect();
        const totalDistance = rect.height - windowHeight;

        if (totalDistance > 0) {
          let progress = -rect.top / totalDistance;
          // 범위 제한 없음 (자연스러운 움직임을 위해)
          
          // (1) 이미지 확장 (기존 로직 유지)
          if (imageContainerRef.current) {
             const clampedProgress = Math.min(Math.max(progress, 0), 1);
             const currentHeight = Math.min(clampedProgress * 130, 100); 
             imageContainerRef.current.style.height = `${currentHeight}vh`;
          }

          // (2) [NEW] 텍스트 패럴랙스 (화면 하단에서 시작해 천천히 위로 올라감)
          if (heroTextRef.current) {
            // progress가 커질수록(스크롤 내릴수록) 위로(-Y) 이동
            // 0.4를 곱해 이미지보다 느리게 움직이도록 설정 (리듬감)
            const parallaxY = progress * 40; 
            heroTextRef.current.style.transform = `translateY(-${parallaxY}vh)`;
          }
        }
      }

      // 2. Generic Sequential Reveal Animation Helper
      const animateSectionItems = (sectionRef: React.RefObject<HTMLElement>) => {
        if (!sectionRef.current) return;
        
        const rect = sectionRef.current.getBoundingClientRect();
        const totalDistance = rect.height - windowHeight;
        
        // 섹션 진행률 (0.0 ~ 1.0)
        let progress = -rect.top / totalDistance;
        
        const items = sectionRef.current.querySelectorAll('.reveal-item');
        
        items.forEach((item, index) => {
          // 등장 타이밍 (간격 좁힘: 0.15 -> 0.12)
          const triggerPoint = 0.05 + (index * 0.12); 
          
          if (progress > triggerPoint) {
            (item as HTMLElement).style.opacity = '1';
            (item as HTMLElement).style.transform = 'translateY(0)';
          } else {
            (item as HTMLElement).style.opacity = '0';
            (item as HTMLElement).style.transform = 'translateY(40px)';
          }
        });
      };

      animateSectionItems(whySectionRef);
      animateSectionItems(businessSectionRef);
      animateSectionItems(processSectionRef);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 임시 이미지 배열
  const processImages = [
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80", 
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80", 
    "https://images.unsplash.com/photo-1601506521937-244b01c84346?auto=format&fit=crop&w=800&q=80", 
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44c?auto=format&fit=crop&w=800&q=80", 
    "https://images.unsplash.com/photo-1512428559087-560fa0cec34e?auto=format&fit=crop&w=800&q=80", 
  ];

  return (
    <div className="w-full animate-fade-in pb-20">
      
      {/* 1. Hero Section (Parallax Text + Rising Image) */}
      <section ref={heroSectionRef} className="relative h-[550vh]">
        
        {/* Layer 2: Parallax Text (Starts at Bottom, Moves Up) */}
        {/* justify-center -> justify-end로 변경하여 하단 시작 */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-end px-4 md:px-6 pb-20 z-20 mix-blend-exclusion text-white pointer-events-none">
          <div ref={heroTextRef} className="max-w-7xl mx-auto w-full pointer-events-auto will-change-transform">
            <span className="block text-xs font-bold uppercase tracking-widest mb-4 animate-slide-up opacity-80">
              Who We Are
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-8 break-keep animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Boundless Creativity,<br />
              <span className="opacity-60">One Unified Team.</span>
            </h1>
            <p className="text-lg md:text-xl font-light max-w-2xl leading-relaxed animate-slide-up opacity-90" style={{ animationDelay: '0.2s' }}>
              플레어 팩토리는 영상 제작을 넘어 비디오 전략, 디지털 마케팅, 
              다국어 서비스까지 제공하는 <strong className="font-medium">올인원 크리에이티브 그룹</strong>입니다.
            </p>
            
            <div className="flex flex-wrap gap-3 mt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {['#All-in-House', '#Global-Ready', '#Cross-Genre'].map((keyword) => (
                <span key={keyword} className="px-4 py-2 rounded-full border border-white/30 text-sm font-bold bg-white/10">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Layer 1: Rising Image */}
        <div className="absolute inset-0 z-10">
           <div className="sticky top-0 h-screen w-full flex flex-col justify-end overflow-hidden">
              <div 
                ref={imageContainerRef} 
                className="w-full absolute bottom-0 left-0 transition-height duration-75 ease-linear will-change-[height]"
                style={{ height: '0vh' }} 
              >
                <img 
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2000&q=80" 
                  alt="Cinematic View" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
           </div>
        </div>
      </section>

      {/* 2. Why Flair Factory? */}
      {/* 높이 축소: 800vh -> 600vh (75%) */}
      <section ref={whySectionRef} className="relative h-[600vh] bg-background z-30">
        <div className="sticky top-0 h-screen flex flex-col pt-32 px-4 md:px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Why Flair Factory?</h2>
              <p className="text-sm text-secondary uppercase tracking-widest mt-4 md:mt-0">Our Core Competencies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Point 1 */}
              <div className="reveal-item opacity-0 translate-y-10 transition-all duration-1000 ease-out group aspect-square p-8 md:p-10 bg-surface rounded-2xl border border-primary/5 hover:bg-primary flex flex-col justify-between">
                <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:bg-background group-hover:text-primary transition-colors">
                  <Users size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-background transition-colors">100% In-House</h3>
                  <p className="text-secondary text-sm leading-relaxed group-hover:text-background/80 transition-colors">
                    기획부터 촬영, 편집, 납품까지. 외주 없이 모든 과정을 내부 전문가 팀이 직접 수행하여 최상의 퀄리티를 보장합니다.
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="reveal-item opacity-0 translate-y-10 transition-all duration-1000 ease-out group aspect-square p-8 md:p-10 bg-surface rounded-2xl border border-primary/5 hover:bg-primary flex flex-col justify-between">
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

              {/* Point 3 */}
              <div className="reveal-item opacity-0 translate-y-10 transition-all duration-1000 ease-out group aspect-square p-8 md:p-10 bg-surface rounded-2xl border border-primary/5 hover:bg-primary flex flex-col justify-between">
                <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:bg-background group-hover:text-primary transition-colors">
                  <Layers size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-background transition-colors">Cross-Genre</h3>
                  <p className="text-secondary text-sm leading-relaxed group-hover:text-background/80 transition-colors">
                    실사 촬영과 모션그래픽의 경계를 허무는 융합 콘텐츠로 프로젝트 목적에 가장 강력한 임팩트를 만듭니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Business Areas */}
      {/* 높이 축소: 800vh -> 600vh (75%) */}
      <section ref={businessSectionRef} className="relative h-[600vh] bg-background z-30">
        <div className="sticky top-0 h-screen flex flex-col pt-32 px-4 md:px-6">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-12 border-b border-primary/10 pb-6">
              Business Areas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Area 1 */}
              <div className="reveal-item opacity-0 translate-y-10 transition-all duration-1000 ease-out space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <div className="p-3 bg-surface rounded-lg">
                    <Video size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Film Production</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {['인터뷰 / 제품 촬영', '드론 시네마토그래피', '4K 실시간 송출'].map((item, i) => (
                    <div key={i} className="px-5 py-4 bg-surface/50 border border-primary/5 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:border-primary/30 hover:bg-surface transition-all cursor-default">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Area 2 */}
              <div className="reveal-item opacity-0 translate-y-10 transition-all duration-1000 ease-out space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <div className="p-3 bg-surface rounded-lg">
                    <MonitorPlay size={24} />
                  </div>
                  <h3 className="text-xl font-bold">3D & Motion</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {['3D 제품 모델링 & 렌더링', '기업 소개 애니메이션', '바이럴 모션그래픽'].map((item, i) => (
                    <div key={i} className="px-5 py-4 bg-surface/50 border border-primary/5 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:border-primary/30 hover:bg-surface transition-all cursor-default">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Area 3 */}
              <div className="reveal-item opacity-0 translate-y-10 transition-all duration-1000 ease-out space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <div className="p-3 bg-surface rounded-lg">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Global Strategy</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {['전문 번역가 상주', '다국어 버전 제작', '해외 마케팅 현지화'].map((item, i) => (
                    <div key={i} className="px-5 py-4 bg-surface/50 border border-primary/5 rounded-xl text-sm font-medium text-secondary hover:text-primary hover:border-primary/30 hover:bg-surface transition-all cursor-default">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Process */}
      {/* 높이 축소: 800vh -> 600vh (75%) */}
      <section ref={processSectionRef} className="relative h-[600vh] bg-background z-30">
        <div className="sticky top-0 h-screen flex flex-col pt-32 px-4 md:px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
              <div className="md:w-1/3">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">Process</h2>
                <p className="text-secondary leading-relaxed">
                  체계적인 워크플로우를 통해<br className="hidden md:block"/> 
                  기획부터 납품까지 빈틈없는 결과물을 만듭니다.
                </p>
              </div>
              
              <div className="md:w-2/3 space-y-4">
                {[
                  { step: '01', title: 'Kick-off Meeting', desc: '프로젝트 목표 및 니즈 정밀 분석' },
                  { step: '02', title: 'Planning & Strategy', desc: '기획안 및 스토리보드 구성' },
                  { step: '03', title: 'Production', desc: '촬영 / 3D / 모션그래픽 제작 (All In-house)' },
                  { step: '04', title: 'Post-Production', desc: '편집, 합성, 사운드 믹싱' },
                  { step: '05', title: 'Delivery', desc: '최종 피드백 반영 및 납품' },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    // 간격 축소: py-8 -> py-6
                    className="reveal-item opacity-0 translate-y-10 transition-all duration-1000 ease-out flex items-center gap-6 py-6 border-b border-primary/10 group cursor-none hover:pl-4"
                    onMouseEnter={() => setActiveProcess(index)}
                    onMouseLeave={() => setActiveProcess(null)}
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

          {/* Floating Image Container */}
          <div 
            ref={cursorImgRef}
            className="fixed top-0 left-0 w-64 h-40 pointer-events-none z-50 overflow-hidden rounded-lg shadow-2xl opacity-0 transition-opacity duration-300"
            style={{ opacity: activeProcess !== null ? 1 : 0 }}
          >
            {activeProcess !== null && (
              <img 
                src={processImages[activeProcess]} 
                alt="Process" 
                className="w-full h-full object-cover animate-fade-in"
              />
            )}
          </div>
        </div>
      </section>

      {/* 5. Partners (Intersection Observer Reveal) */}
      <section ref={partnersSectionRef} className="px-4 md:px-6 py-32 bg-background border-t border-primary/5 relative z-30">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-12 text-center">
            Trusted Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Trade World', 'Denotisia', 'Partner A', 'Partner B', 'Partner C'].map((partner, i) => (
              <div 
                key={i} 
                className={`h-24 bg-surface rounded-lg flex items-center justify-center text-primary/30 font-bold border border-primary/5 hover:border-primary/20 transition-all duration-700
                  ${isPartnersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{ transitionDelay: `${i * 100}ms` }}
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
