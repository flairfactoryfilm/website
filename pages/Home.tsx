import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDownRight } from 'lucide-react';

const Home: React.FC = () => {
  // CTA Cursor Logic
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorCurrent = useRef({ x: 0, y: 0, rot: 0, rotVel: 0 });
  const cursorTarget = useRef({ x: 0, y: 0 });
  const cursorRaf = useRef<number>();

  // Footer Magnetic Logic
  const footerTriggerRef = useRef<HTMLDivElement>(null);
  const isSequenceActive = useRef(false);
  const isLockedAtBottom = useRef(false);
  
  // Check session storage to ensure it only happens once per session
  const [hasSnappedFooter, setHasSnappedFooter] = useState(() => {
    try {
      return sessionStorage.getItem('hasSnappedFooter') === 'true';
    } catch {
      return false;
    }
  });

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

  // Custom Smooth Scroll Animation Function
  const animateScrollToBottom = (duration: number, onComplete: () => void) => {
    const startY = window.scrollY;
    const targetY = document.body.scrollHeight - window.innerHeight;
    const distance = targetY - startY;
    let startTime: number | null = null;

    const easeOutQuint = (x: number): number => {
      return 1 - Math.pow(1 - x, 5);
    };

    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeOutQuint(progress);
      window.scrollTo(0, startY + (distance * ease));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        onComplete();
      }
    };
    requestAnimationFrame(step);
  };

  // Footer Magnetic Effect
  useEffect(() => {
    const preventDefault = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    const triggerMagneticSequence = (currentRectBottom: number) => {
      if (isSequenceActive.current) return;
      isSequenceActive.current = true;
      isLockedAtBottom.current = true; 
      
      setHasSnappedFooter(true);
      sessionStorage.setItem('hasSnappedFooter', 'true');
      
      const targetScrollY = window.scrollY + currentRectBottom - window.innerHeight;
      window.scrollTo({ top: targetScrollY, behavior: 'auto' });
      
      document.body.style.overflow = 'hidden';
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
      window.addEventListener('keydown', preventDefault, { passive: false });
      
      setTimeout(() => {
        isLockedAtBottom.current = false; 
        animateScrollToBottom(2500, () => {
          document.body.style.overflow = '';
          window.removeEventListener('wheel', preventDefault);
          window.removeEventListener('touchmove', preventDefault);
          window.removeEventListener('keydown', preventDefault);
          isSequenceActive.current = false;
        }); 
      }, 1000);
    };

    const handleScroll = () => {
      if (!footerTriggerRef.current) return;

      const rect = footerTriggerRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight;
      
      if (isLockedAtBottom.current) {
         if (Math.abs(rect.bottom - triggerPoint) > 1) {
             const target = window.scrollY + rect.bottom - triggerPoint;
             window.scrollTo({ top: target, behavior: 'auto' });
         }
         return;
      }

      if (hasSnappedFooter && !isSequenceActive.current) return;
      
      if (!isSequenceActive.current && rect.bottom <= triggerPoint + 2) {
        triggerMagneticSequence(rect.bottom);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('keydown', preventDefault);
      document.body.style.overflow = '';
    };
  }, [hasSnappedFooter]);

  return (
    <div className="w-full bg-background text-primary">
      
      {/* 1. Typography Motion Hero */}
      <section className="relative h-screen flex flex-col justify-between px-4 md:px-6 pt-32 pb-12 overflow-hidden z-10 bg-background">
        <div className="flex justify-between items-start text-xs font-bold uppercase tracking-widest text-secondary animate-fade-in">
          <div className="flex flex-col gap-1">
            <span>Based in Seoul</span>
            <span>Global Vision</span>
          </div>
          <div className="text-right">
            <span>Scroll for Showcase</span>
            <div className="animate-bounce mt-2 flex justify-end">
              <ArrowDownRight size={16} />
            </div>
          </div>
        </div>

        <div className="relative z-10 select-none">
          <h1 className="text-[14vw] leading-[0.8] font-display font-bold tracking-tighter mix-blend-exclusion">
            <div className="overflow-hidden"><span className="block animate-slide-up">FLAIR</span></div>
            <div className="overflow-hidden ml-[10vw]"><span className="block animate-slide-up" style={{ animationDelay: '0.15s' }}>FACTORY</span></div>
            <div className="overflow-hidden"><span className="block animate-slide-up text-primary/20" style={{ animationDelay: '0.3s' }}>FILM</span></div>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="md:col-span-4">
            <p className="text-sm md:text-base text-secondary leading-relaxed max-w-xs break-keep">
              Defining the future of cinematic experiences through motion, technology, and art.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Featured Projects Area - REMOVED per request */}

      {/* 3. CTA Section */}
      <Link 
        to="/contact"
        className="relative min-h-screen flex flex-col justify-between px-4 md:px-6 pt-32 pb-12 overflow-hidden bg-background z-20 cursor-none group"
        onMouseEnter={() => setIsHoveringCTA(true)}
        onMouseLeave={() => setIsHoveringCTA(false)}
        onMouseMove={handleMouseMove}
      >
         <div className="absolute inset-0 bg-background pointer-events-none -z-10" />
         <div className="w-full h-px bg-primary/10 mb-auto" />
         
         <div className="relative z-10 select-none mb-12">
          <h1 className="text-[14vw] leading-[0.8] font-display font-bold tracking-tighter mix-blend-exclusion text-primary group-hover:opacity-80 transition-opacity duration-500">
            <div className="overflow-hidden"><span className="block">LET'S</span></div>
            <div className="overflow-hidden ml-[10vw]"><span className="block text-secondary/50 group-hover:text-primary transition-colors duration-500">TALK</span></div>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
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
        
        {/* Trigger for magnetic footer effect */}
        <div ref={footerTriggerRef} className="absolute bottom-0 left-0 w-full h-px bg-transparent" />
      </Link>

    </div>
  );
};

export default Home;
