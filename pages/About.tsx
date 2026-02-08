import React from 'react';

const About: React.FC = () => {
  return (
    <div className="w-full animate-fade-in pb-20 pt-32 px-6">
      <div className="max-w-7xl mx-auto border-b border-primary/10 pb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-primary mb-8">
          About Page Test
        </h1>
        <p className="text-xl text-secondary">
          이 글씨가 보이면 페이지 연결은 성공한 것입니다.<br />
          이제 아이콘을 하나씩 추가하며 디자인을 입히면 됩니다.
        </p>
      </div>
    </div>
  );
};

export default About;
