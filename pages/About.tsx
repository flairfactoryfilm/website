import React from 'react';
import { 
  Users, Globe, Layers, 
  Video, MonitorPlay, MessageSquare, 
  ArrowRight, CheckCircle2 
} from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="w-full animate-fade-in pb-20">
      
      {/* 1. Hero Section */}
      <section className="px-4 md:px-6 mb-24 md:mb-32">
        <div className="max-w-7xl mx-auto border-b border-primary/10 pb-12">
          <span className="block text-xs font-bold text-secondary uppercase tracking-widest mb-4 animate-slide-up">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary leading-[1.1] mb-8 break-keep animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Boundless Creativity,<br />
            <span className="text-secondary/60">One Unified Team.</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary font-light max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            플레어 팩토리는 영상 제작을 넘어 비디오 전략, 디지털 마케팅, 
            다국어 서비스까지 제공하는 <strong className="text-primary font-medium">올인원 크리에이티브 그룹</strong>입니다.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {['#All-in-House', '#Global-Ready', '#Cross-Genre'].map((keyword) => (
              <span key={keyword} className="px-4 py-2 rounded-full border border-primary/10 text-sm font-bold text-primary bg-surface/50">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Why Flair Factory? (Killer Content) */}
      <section className="px-4 md:px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Why Flair Factory?</h2>
            <p className="text-sm text-secondary uppercase tracking-widest mt-4 md:mt-0">Our Core Competencies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Point 1 */}
            <div className="p-8 bg-surface rounded-xl border border-primary/5 hover:border-primary/20 transition-colors group">
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">100% In-House System</h3>
              <p className="text-secondary leading-relaxed text-sm">
                기획부터 촬영, 편집, 납품까지. 외주 없이 모든 과정을 내부 전문가 팀이 직접 수행하여 최상의 퀄리티와 일관성을 보장합니다.
              </p>
            </div>

            {/* Point 2 */}
            <div className="p-8 bg-surface rounded-xl border border-primary/5 hover:border-primary/20 transition-colors group">
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Global Localization</h3>
              <p className="text-secondary leading-relaxed text-sm">
                단순 번역이 아닙니다. 내부 전문 번역가를 통해 언어적 뉘앙스까지 고려한 완벽한 다국어 마케팅 영상을 제작합니다.
              </p>
            </div>

            {/* Point 3 */}
            <div className="p-8 bg-surface rounded-xl border border-primary/5 hover:border-primary/20 transition-colors group">
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Cross-Genre Expert</h3>
              <p className="text-secondary leading-relaxed text-sm">
                실사 촬영과 2D/3D 모션그래픽의 경계를 넘나듭니다. 다양한 기법을 융합하여 프로젝트 목적에 가장 적합한 결과물을 만듭니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Business Areas */}
      <section className="px-4 md:px-6 mb-32 bg-surface/30 py-24 border-y border-primary/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-16 text-center">Business Areas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-background rounded-full border border-primary/10 text-primary mb-2">
                <Video size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-primary">Film Production</h3>
              <ul className="text-secondary text-sm space-y-2">
                <li>인터뷰 / 제품 촬영</li>
                <li>드론 촬영 (Drone Cinematography)</li>
                <li>실시간 송출 (Live Streaming)</li>
              </ul>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-background rounded-full border border-primary/10 text-primary mb-2">
                <MonitorPlay size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-primary">3D & Motion Graphics</h3>
              <ul className="text-secondary text-sm space-y-2">
                <li>3D 제품 모델링 & 렌더링</li>
                <li>기업 소개 애니메이션</li>
                <li>바이럴 모션그래픽</li>
              </ul>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-background rounded-full border border-primary/10 text-primary mb-2">
                <MessageSquare size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-primary">Global Strategy</h3>
              <ul className="text-secondary text-sm space-y-2">
                <li>전문 번역가 상주</li>
                <li>다국어 버전 영상 제작</li>
                <li>해외 마케팅용 콘텐츠 현지화</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Process */}
      <section className="px-4 md:px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">Process</h2>
              <p className="text-secondary leading-relaxed">
                체계적인 워크플로우를 통해<br className="hidden md:block"/> 
                기획부터 납품까지 빈틈없는 결과물을 만듭니다.
              </p>
            </div>
            
            <div className="md:w-2/3 space-y-8">
              {[
                { step: '01', title: 'Kick-off Meeting', desc: '프로젝트 목표 및 니즈 정밀 분석' },
                { step: '02', title: 'Planning & Strategy', desc: '기획안 및 스토리보드 구성' },
                { step: '03', title: 'Production', desc: '촬영 / 3D / 모션그래픽 제작 (All In-house)' },
                { step: '04', title: 'Post-Production', desc: '편집, 합성, 사운드 믹싱' },
                { step: '05', title: 'Delivery', desc: '최종 피드백 반영 및 납품' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-6 group">
                  <span className="text-2xl font-display font-bold text-primary/20 group-hover:text-primary transition-colors">
                    {item.step}
                  </span>
                  <div className="flex-1 border-b border-primary/10 pb-8 group-hover:border-primary/30 transition-colors">
                    <h4 className="text-lg font-bold text-primary mb-2">{item.title}</h4>
                    <p className="text-secondary text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Partners (Simple Grid Placeholder) */}
      <section className="px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-8 border-t border-primary/10 pt-8">
            Trusted Partners
          </h3>
          {/* 로고 이미지가 준비되면 img 태그로 교체, 현재는 텍스트 플레이스홀더 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Trade World', 'Denotisia', 'Partner A', 'Partner B', 'Partner C'].map((partner, i) => (
              <div key={i} className="h-24 bg-surface rounded-lg flex items-center justify-center text-primary/30 font-bold border border-primary/5 hover:border-primary/20 transition-colors">
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
