import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown } from 'lucide-react';

const Home: React.FC = () => {
  // CTA Cursor Logic
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorCurrent = useRef({ x: 0, y: 0, rot: 0, rotVel: 0 });
  const cursorTarget = useRef({ x: 0, y: 0 });
  const cursorRaf = useRef<number>();

  // Cursor Animation Loop
  useEffect(() => {
    const loop = () => {
      if (!isHoveringCTA || !cursorRef.current) return;
      
      const dx = cursorTarget.current.x - cursorCurrent.current.x;
      const dy = cursorTarget.current.y - cursorCurrent.current.y;
      
      cursorCurrent.current.x += dx * 0.1;
      cursorCurrent.current.y += dy * 0.1;
      
      const dist = Math.sqrt(dx*dx + dy*dy);
      let targetRot = 0; 
      
      if (dist > 1) { 
           targetRot = Math.atan2(dy, dx) * (180 / Math.PI);
      }
      
      let rotDiff = targetRot - cursorCurrent.current.rot;
      while (rotDiff > 180) rotDiff -= 360;
      while (rotDiff < -180) rotDiff += 360;
      
      const stiffness = 0.6; 
      const damping = 0.3; 
      
      cursorCurrent.current.rotVel += rotDiff * stiffness;
      cursorCurrent.current.rotVel *= damping;
      cursorCurrent.current.rot += cursorCurrent.current.rotVel;
      
      cursorRef.current.style.transform = `translate3d(${cursorCurrent.current.x}px, ${cursorCurrent.current.y}px, 0) translate(-50%, -50%) rotate(${cursorCurrent.current.rot}deg)`;
      
      cursorRaf.current = requestAnimationFrame(loop);
    };
    
    if (isHoveringCTA) {
      cursorRaf.current = requestAnimationFrame(loop);
    } else {
      if (cursorRaf.current) cancelAnimationFrame(cursorRaf.current);
    }
    return () => { if (cursorRaf.current) cancelAnimationFrame(cursorRaf.current); };
  }, [isHoveringCTA]);

  const handleMouseMove = (e: React.MouseEvent) => {
    cursorTarget.current = { x: e.clientX, y: e.clientY };
    if (!isHoveringCTA) {
      cursorCurrent.current = { x: e.clientX, y: e.clientY, rot: 0, rotVel: 0 };
    }
  };

  return (
    <div className="w-full bg-background text-primary">
      
      {/* 1. Showreel Hero Section (Replaced Typography Hero) */}
      <section className="relative h-screen w-full overflow-hidden bg-black z-10">
        {/* Vimeo Background Iframe */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <iframe 
            src="https://player.vimeo.com/video/663244089?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1" 
            className="absolute top-1/2 left-1/2 w-[177.77vh] h-full min-w-full min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 object-cover"
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowFullScreen
            title="Showreel"
          />
        </div>

        {/* Optional Overlay for text readability (if needed later) or styling */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Scroll Indicator → Works 진입점 */}
        <Link
          to="/works"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 text-xs uppercase tracking-widest font-bold"
        >
          <span>View Works</span>
          <ArrowDown size={14} className="animate-bounce" />
        </Link>
      </section>

      {/* 2. Featured Projects Area - REMOVED per request */}

      {/* 3. CTA Section */}
      <Link 
        to="/contact"
        className="relative flex flex-col justify-between px-4 md:px-6 pt-32 pb-12 overflow-hidden bg-background z-20 cursor-none group"
        onMouseEnter={() => setIsHoveringCTA(true)}
        onMouseLeave={() => setIsHoveringCTA(false)}
        onMouseMove={handleMouseMove}
      >
         <div className="absolute inset-0 bg-background pointer-events-none -z-10" />
         <div className="w-full h-px bg-primary/10 mb-24" />
         
         <div className="relative z-10 select-none mb-12">
          <h1 className="text-[10vw] leading-[0.8] font-display font-bold tracking-tighter mix-blend-exclusion text-primary group-hover:opacity-80 transition-opacity duration-500">
            <div className="overflow-hidden"><span className="block">LET'S</span></div>
            <div className="overflow-hidden ml-[10vw]"><span className="block text-secondary/50 group-hover:text-primary transition-colors duration-500">TALK</span></div>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mt-16">
          <p className="text-lg md:text-xl font-light text-primary/60 max-w-md">
            Ready to start your next visionary project?
          </p>
        </div>

        {isHoveringCTA && (
          <div 
            ref={cursorRef}
            className="fixed top-0 left-0 w-48 h-48 z-50 pointer-events-none flex items-center justify-center mix-blend-difference"
            style={{ willChange: 'transform' }}
          >
            <div className="w-full h-full rounded-full border border-white/40 bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <ArrowRight className="text-white w-16 h-16" strokeWidth={1.5} />
            </div>
          </div>
        )}
      </Link>

    </div>
  );
};

export default Home;
