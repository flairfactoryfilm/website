import React from 'react';
import { 
  Users, Globe, Layers, 
  Video, MonitorPlay, MessageSquare, 
  ArrowDownRight, Sparkles
} from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="w-full animate-fade-in pb-32">
      
      {/* 1. Hero Section: Cinematic Typography */}
      <section className="relative px-4 md:px-6 pt-20 mb-32 md:mb-48">
        {/* Background subtle element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(var(--primary-rgb), 0.1) 0%, transparent 70%)' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-8 animate-slide-up">
            <Sparkles size={16} /> Who We Are
          </span>
          
          <h1 className="text-[12vw] md:text-[10vw] font-display font-bold text-primary leading-[0.9] tracking-tighter mb-12 break-keep animate-slide-up mix-blend-overlay" style={{ animationDelay: '0.1s' }}>
            BOUNDLESS<br />
            <span className="text-primary/40">CREATIVITY.</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="md:col-span-5 lg:col-span-4">
               <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">One Unified Team.</h2>
            </div>
            <div className="md:col-span-7 lg:col-span-8 max-w-2xl">
              <p className="text-lg md:text-xl text-secondary font-light leading-relaxed mb-8">
                플레어 팩토리는 기획, 제작, 그리고 글로벌 마케팅까지. <br className="hidden md:block" />
                영상의 모든 과정을 내부에서 완결하는 <strong className="text-primary font-medium">올인원 크리에이티브 파트너</strong>입니다.
              </p>
              <div className="flex flex-wrap gap-3">
                {['#All-in-House', '#Global-Ready', '#Cross-Genre'].map((keyword) => (
                  <span key={keyword} className="px-4 py-1.5 rounded-full border border-primary/20 text-xs font-bold uppercase tracking-wider text-primary bg-primary/5">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </section>

      {/* 2. The Difference (Magazine Layout) */}
      <section className="px-4 md:px-6 mb-32 md:mb-48">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-24 border-b border-primary/10 pb-4">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-primary leading-none">The Flair<br/>Difference</h2>
            <ArrowDownRight size={32} className="text-primary/40 mb-2" />
          </div>

          <div className="space-y-24">
            {/* Point 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group">
              <div className="md:col-span-3">
                <span className="block text-[8rem] md:text-[10rem] font-display font-bold leading-none text-primary/5 group-hover:text-primary/10 transition-colors">01</span>
              </div>
              <div className="md:col-span-4 pt-8">
                 <div className="flex items-center gap-3 mb-4 text-primary">
                    <Users size={24} />
                    <h3 className="text-2xl font-bold uppercase tracking-wide">100% In-House</h3>
                 </div>
              </div>
              <div className="md:col-span-5 pt-8">
                <p className="text-lg text-secondary leading-relaxed">
                  기획부터 촬영, 편집, 납품까지. 외주 없이 모든 과정을 내부 전문가 팀이 직접 수행하여 최상의 퀄리티와 일관된 톤앤매너를 보장합니다.
                </p>
              </div>
            </div>

             {/* Point 2 */}
             <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group">
              <div className="md:col-span-3">
                <span className="block text-[8rem] md:text-[10rem] font-display font-bold leading-none text-primary/5 group-hover:text-primary/10 transition-colors">02</span>
              </div>
              <div className="md:col-span-4 pt-8">
                 <div className="flex items-center gap-3 mb-4 text-primary">
                    <Globe size={24} />
                    <h3 className="text-2xl font-bold uppercase tracking-wide">Global Native</h3>
                 </div>
              </div>
              <div className="md:col-span-5 pt-8">
                <p className="text-lg text-secondary leading-relaxed">
                  단순 번역이 아닙니다. 내부 전문 번역가와 글로벌 마케터가 협업하여 문화적 맥락과 뉘앙스까지 고려한 완벽한 현지화 콘텐츠를 제작합니다.
                </p>
              </div>
            </div>

             {/* Point 3 */}
             <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group">
              <div className="md:col-span-3">
                <span className="block text-[8rem] md:text-[10rem] font-display font-bold leading-none text-primary/5 group-hover:text-primary/10 transition-colors">03</span>
              </div>
              <div className="md:col-span-4 pt-8">
                 <div className="flex items-center gap-3 mb-4 text-primary">
                    <Layers size={24} />
                    <h3 className="text-2xl font-bold uppercase tracking-wide">Cross-Genre</h3>
                 </div>
              </div>
              <div className="md:col-span-5 pt-8">
                <p className="text-lg text-secondary leading-relaxed">
                  실사 촬영의 리얼리티와 2D/3D 모션그래픽의 상상력. 장르의 경계를 넘나드는 융합을 통해 프로젝트 목적에 가장 강력한 임팩트를 만듭니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Craft (Premium Dark Cards) */}
      <section className="px-4 md:px-6 mb-32 md:mb-48">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-12">Our Craft Fields</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative h-[400px] bg-surface rounded-2xl overflow-hidden border border-primary/5 hover:border-primary/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10"></div>
              {/* 배경 이미지 플레이스홀더 (나중에 실제 이미지로 교체) */}
              <div className="absolute inset-0 bg-neutral-900 group-hover:scale-105 transition-transform duration-700 opacity-50"></div>
              
              <div className="relative z-20 h-full flex flex-col justify-end p-8">
                <div className="mb-auto opacity-30 group-hover:opacity-100 transition-opacity">
                    <Video size={48} className="text-primary" strokeWidth={1} />
                </div>
                <h3 className="text-3xl font-display font-bold text-primary mb-4">Film Production</h3>
                <ul className="text-secondary text-sm space-y-2 font-medium tracking-wide uppercase">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span>인터뷰 / 제품 / 광고 촬영</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span>드론 시네마토그래피</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span>4K 실시간 송출</li>
                </ul>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative h-[400px] bg-surface rounded-2xl overflow-hidden border border-primary/5 hover:border-primary/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10"></div>
              <div className="absolute inset-0 bg-neutral-800 group-hover:scale-105 transition-transform duration-700 opacity-50"></div>
              
              <div className="relative z-20 h-full flex flex-col justify-end p-8">
                <div className="mb-auto opacity-30 group-hover:opacity-100 transition-opacity">
                    <MonitorPlay size={48} className="text-primary" strokeWidth={1} />
                </div>
                <h3 className="text-3xl font-display font-bold text-primary mb-4">3D & Motion</h3>
                <ul className="text-secondary text-sm space-y-2 font-medium tracking-wide uppercase">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span>3D 제품 모델링 & 렌더링</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span>기업 소개 애니메이션</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span>바이럴 모션그래픽</li>
                </ul>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative h-[400px] bg-surface rounded-2xl overflow-hidden border border-primary/5 hover:border-primary/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10"></div>
              <div className="absolute inset-0 bg-neutral-700 group-hover:scale-105 transition-transform duration-700 opacity-50"></div>
              
              <div className="relative z-20 h-full flex flex-col justify-end p-8">
                <div className="mb-auto opacity-30 group-hover:opacity-100 transition-opacity">
                    <MessageSquare size={48} className="text-primary" strokeWidth={1} />
                </div>
                <h3 className="text-3xl font-display font-bold text-primary mb-4">Global Strategy</h3>
                <ul className="text-secondary text-sm space-y-2 font-medium tracking-wide uppercase">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span>전문 번역가 상주</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span>다국어 버전 영상 제작</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span>해외 마케팅 현지화</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Workflow (Connected Timeline) */}
      <section className="px-4 md:px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
            <div className="md:w-1/3 sticky top-32 self-start">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6 leading-tight">Seamless<br/>Workflow.</h2>
              <p className="text-secondary leading-relaxed">
                복잡한 과정을 단순하고 투명하게.<br/>
                체계적인 파이프라인이 성공적인 결과를 만듭니다.
              </p>
            </div>
            
            <div className="md:w-2/3 py-8 relative">
              {/* Connecting Line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-primary/10 hidden md:block"></div>

              <div className="space-y-16">
                {[
                  { step: '01', title: 'Kick-off & Analysis', desc: '프로젝트 목표, 타겟 오디언스, 핵심 메시지 정밀 분석 및 전략 수립' },
                  { step: '02', title: 'Creative Planning', desc: '트렌드를 반영한 컨셉 도출, 스토리보드 구성 및 스타일 프레임 제작' },
                  { step: '03', title: 'All-in-One Production', desc: '내부 팀을 통한 촬영, 3D 에셋 제작, 모션 디자인 동시 진행' },
                  { step: '04', title: 'Post & Polish', desc: '컷 편집, VFX 합성, 컬러 그레이딩, 사운드 믹싱 등 최종 퀄리티업' },
                  { step: '05', title: 'Global Delivery', desc: '매체별 최적화 포맷 및 다국어 버전 최종 납품' },
                ].map((item, index) => (
                  <div key={index} className="relative flex items-start gap-8 group">
                    {/* Step Number Bubble */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface border border-primary/10 flex items-center justify-center text-sm font-bold font-display text-primary z-10 group-hover:border-primary transition-colors">
                      {item.step}
                    </div>
                    <div className="pt-2">
                      <h4 className="text-xl font-bold text-primary mb-3 group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-secondary text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Partners (Premium Grid with Fade edges) */}
      <section className="px-4 md:px-6">
        <div className="max-w-7xl mx-auto border-t border-primary/10 pt-16">
          <h3 className="text-sm font-bold text-primary/40 uppercase tracking-widest mb-12 text-center">
            Trusted By Innovative Companies
          </h3>
          
          <div className="relative">
             {/* Fade Edges for scroll hint feel */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
            
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-px bg-primary/10 border border-primary/10 rounded-lg overflow-hidden">
              {/* 나중에 실제 클라이언트 로고 이미지(흰색 또는 단색 PNG 권장)로 교체하세요 */}
              {['Client 01', 'Client 02', 'Client 03', 'Client 04', 'Client 05', 'Client 06', 'Client 07', 'Client 08', 'Client 09', 'Client 10', 'Client 11', 'Client 12'].map((client, i) => (
                <div key={i} className="h-32 bg-background flex items-center justify-center p-4 hover:bg-surface transition-colors group">
                  <span className="text-primary/30 font-bold uppercase tracking-widest text-xs group-hover:text-primary/60 transition-colors">{client}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
