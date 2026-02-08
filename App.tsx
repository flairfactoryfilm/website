import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis'; // Lenis 추가
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/Works';
import WorksDetail from './pages/WorksDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

const App: React.FC = () => {
  
  // [NEW] Lenis 스무스 스크롤 초기화 코드
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // 스크롤 부드러움 정도 (숫자가 클수록 더 부드럽고 느리게 멈춤)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="works" element={<Works />} />
          <Route path="works/:id" element={<WorksDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
