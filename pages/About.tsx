import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Globe, Layers, 
  ArrowRight
} from 'lucide-react';

const About: React.FC = () => {
  // --- Process Section Hover Logic ---
  const [activeProcess, setActiveProcess] = useState<number | null>(null);

  // --- Refs for Sections ---
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null); 
  
  const whySectionRef = useRef<HTMLElement>(null);
  
  // Business Section Refs
  const businessSectionRef = useRef<HTMLElement>(null);
  const businessScrollContainerRef = useRef<HTMLDivElement>(null);

  const processSectionRef = useRef<HTMLElement>(null);
  
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

  // --- 통합 스크롤 핸들러 ---
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;

      // 1. Hero Section Logic (CSS Sticky used, removed JS logic for optimization)

      // 2. Business Section Horizontal Scroll Logic
      if (businessSectionRef.current && businessScrollContainerRef.current) {
        const rect = businessSectionRef.current.getBoundingClientRect();
        const totalDistance = rect.height - windowHeight;
        
        if (totalDistance > 0) {
          let progress = -rect.top / totalDistance;
          progress = Math.min(Math.max(progress, 0), 1);
          
          const scrollWidth = businessScrollContainerRef.current.scrollWidth - window.innerWidth;
          const translateX = progress * scrollWidth;
          
          businessScrollContainerRef.current.style.transform = `translateX(-${translateX}px)`;
        }
      }

      // 3. Generic Sequential Reveal Helper
      const animateSectionItems = (sectionRef: React.RefObject<HTMLElement>) => {
        if (!sectionRef.current) return;
        
        const rect = sectionRef.current.getBoundingClientRect();
        const totalDistance = rect.height - windowHeight;
        
        let progress = -rect.top / totalDistance;
        
        const items = sectionRef.current.querySelectorAll('.reveal-item');
        
        // 동적 간격 조절
        const interval = items.length > 4 ? 0.15 : 0.25;

        items.forEach((item, index) => {
          const triggerPoint = 0.15 + (index * interval); 
          
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
      animateSectionItems(processSectionRef);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Business Items Data
  const businessItems = [
    {
      id: 1,
      title: "시네마틱 실사 촬영",
      sub: "Cinematic Reality",
      desc: "브랜드의 이야기를 가장 진솔하게 담아내는 힘. 현장의 공기까지 포착하는 인터뷰 촬영부터, 제품의 디테일을 극대화하는 매크로 촬영까지. 우리는 피사체의 본질을 영화적 미장센으로 완성합니다.",
      img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80"
    },
    {
      id: 2,
      title: "드론 시네마토그래피",
      sub: "Perspective from Above",
      desc: "지상에서는 볼 수 없었던 압도적인 스케일. 숙련된 전문가의 드론 컨트롤을 통해 평범한 풍경을 비범한 시각적 경험으로 바꿉니다. 공간의 깊이와 역동성을 더해 영상의 품격을 높이세요.",
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
      desc: "보이지 않는 비전을 보이게 만드는 기술. 복잡한 비즈니스 모델이나 추상적인 데이터를 직관적인 모션그래픽으로 변환합니다. 당신의 기업 가치가 대중에게 명확하고 세련되게 전달되도록 디자인합니다.",
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80"
    }
  ];

  return (
    <div className="w-full animate-fade-in pb-20">
      
      {/* 1. Hero Section (Sticky Parallax / Overlay) */}
      <section className="relative h-[200vh] bg-background">
        
        {/* Layer 1: Text (Sticky, On Top with Blend Mode) */}
        {/* z-20으로 올려서 이미지 위로 오게 하고, mix-blend-exclusion 적용 */}
        <div className="sticky top-0 h-screen flex flex-col justify-center items-center text-center px-4 md:px-6 z-20 mix-blend-exclusion text-white">
          <span className="block text-xs font-bold uppercase tracking-widest mb-4 animate-slide-up">
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
        </div>

        {/* Layer 2: Image (Scrolls up from bottom) */}
        {/* z-10으로 설정하여 텍스트 아래에 위치 */}
        <div className="absolute bottom-0 w-full h-screen z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
           <img 
             src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2000&q=80" 
             alt="Cinematic View" 
             className="w-full h-full object-cover"
           />
           {/* 이미지 자체를 살짝 어둡게 눌러주어 흰색 텍스트와 합성 시 가독성 보조 */}
           <div className="absolute inset-0 bg-black/20" />
        </div>
      </section>

      {/* 2. Why Flair Factory? */}
      <section ref={whySectionRef} className="relative h-[700vh] bg-background z-30">
        <div className="sticky top-0 h-screen flex flex-col pt-32 px-4 md:px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Why Flair Factory?</h2>
              <p className="text-sm text-secondary uppercase tracking-widest mt-4 md:mt-0">Our Core Competencies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cards */}
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

      {/* 3. Business Areas (Horizontal Sticky Scroll) */}
      <section ref={businessSectionRef} className="relative h-[600vh] bg-background z-30">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          
          {/* Header */}
          <div className="absolute top-0 left-0 w-full px-4 md:px-6 pt-32 pointer-events-none">
            <div className="max-w-7xl mx-auto border-b border-primary/10 pb-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Business Areas</h2>
            </div>
          </div>

          {/* Horizontal Track (pt-24 추가해서 헤더랑 간격 띄움) */}
          <div 
            ref={businessScrollContainerRef}
            className="flex items-center pl-[5vw] pr-[5vw] pt-24 will-change-transform z-10"
            style={{ width: 'max-content' }}
          >
            {businessItems.map((item) => (
              <div 
                key={item.id} 
                className="w-[85vw] md:w-[70vw] h-[60vh] md:h-[65vh] flex-shrink-0 mr-[5vw] bg-surface rounded-2xl overflow-hidden border border-primary/5 flex flex-col md:flex-row group"
              >
                {/* Left: Image (60%) */}
                <div className="w-full md:w-[60%] h-1/2 md:h-full relative overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:hidden" />
                </div>

                {/* Right: Content (40%) */}
                <div className="w-full md:w-[40%] h-1/2 md:h-full p-8 md:p-10 flex flex-col justify-center bg-surface border-l border-primary/5">
                  {/* 숫자(ID) 삭제됨 */}
                  
                  {/* 타이틀 크기 축소: text-xl md:text-2xl, 간격 mb-3 */}
                  <h3 className="text-xl md:text-2xl font-display font-bold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-6">
                    {item.sub}
                  </p>
                  <p className="text-secondary leading-relaxed text-sm mb-8">
                    {item.desc}
                  </p>
                  <div className="mt-auto pt-6 border-t border-primary/10">
                    <Link to="/works" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors">
                      View Portfolio <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Process (Hover Background Removed) */}
      <section ref={processSectionRef} className="relative h-[600vh] bg-background z-30">
        <div className="sticky top-0 h-screen flex flex-col pt-32 px-4 md:px-6 relative z-10">
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
        </div>
      </section>

      {/* 5. Partners */}
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
