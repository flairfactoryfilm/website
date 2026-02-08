import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';

// Original SVG Logo (절대 수정 금지 - 유지)
const LogoSvg = ({ className }: { className?: string }) => (
  <svg className={className} id="Layer_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 663.2 64" fill="currentColor">
    <path d="M11.7,21.3h28.7v12H11.7v29.5H0V1.3h41.1v12H11.7v8ZM49.6,1.3h11.8v49.5h29.2v12.1h-41V1.3ZM134.3,33.3h-23.1c-3.7,8.8-3.4,16.5-3.4,29.6h-12v-10.5c0-13.8,3.8-27.3,10.8-39.1h-10.5V1.3h50.2v61.6h-12s0-29.6,0-29.6ZM120.1,13.3c-1.1,1.5-3.4,6.5-4.4,8h18.6v-8s-14.2,0-14.2,0ZM156.4,1.3h12v61.6h-12V1.3ZM207.3,46.7c-7.5,7.1-16.5,12.7-28.6,16.8V1.4h50.5c-1.5,14.3-6.4,26.1-13.7,36l15.6,25.5h-14.1l-9.7-16.2ZM190.7,44.6c11.7-7.7,19.1-17.9,24-31.2h-24v31.2ZM282.4,21.3h28.7v12h-28.7v29.5h-11.7V1.3h41.1v12h-29.4v8ZM357.1,33.3h-23.1c-3.7,8.8-3.4,16.5-3.4,29.6h-12v-10.5c0-13.8,3.8-27.3,10.8-39.1h-10.5V1.3h50.2v61.6h-12s0-29.6,0-29.6ZM342.9,13.3c-1.1,1.5-3.4,6.5-4.4,8h18.6v-8s-14.2,0-14.2,0ZM426.3,1.3v12h-36c6.8,17.7,17.5,29.8,36,37.9v12.2c-27.8-9.4-47.3-32.9-50.4-62.2h50.4v.1ZM464,62.9h-12V13.3h-19.4V1.3h50.2v12h-18.8v49.6ZM482.4,32C482.4,14.4,496.8,0,514.4,0s32,14.4,32,32-14.4,32-32,32-32-14.4-32-32h0ZM494.4,32c0,11,8.9,20,20,20s20-8.9,20-20-8.9-20-20-20-20,8.9-20,20h0ZM582.7,46.7c-7.5,7.1-16.5,12.7-28.6,16.8V1.4h50.5c-1.5,14.3-6.4,26.1-13.7,36l15.6,25.5h-14.1l-9.7-16.2ZM566.1,44.6c11.7-7.7,19.1-17.9,24-31.2h-24v31.2ZM643.7,62.9h-12v-27.3l-21-34.3h14l12.8,21.1,11.7-21.1h13.9l-19.5,34.3v27.3h.1Z"/>
  </svg>
);

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'dark' | 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Works', path: '/works' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-primary selection:bg-primary/20 transition-colors duration-300">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-5 flex items-center justify-between">
        {/* Background Blur for Header */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-primary/5 -z-10 transition-colors duration-300" />
        
        {/* Logo (Original SVG) */}
        <NavLink to="/" className="text-primary hover:opacity-80 transition-opacity" aria-label="Home">
          <LogoSvg className="h-5 md:h-6 w-auto" />
        </NavLink>

        <div className="flex items-center gap-6">
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium uppercase tracking-widest transition-colors duration-300 ${
                    isActive ? 'text-primary' : 'text-primary/50 hover:text-primary'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary/5 text-primary transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-primary"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background z-40 flex flex-col items-center justify-center space-y-8 animate-fade-in text-primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-4xl font-display font-bold hover:opacity-50 transition-colors"
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full pt-24 md:pt-32">
        <Outlet />
      </main>

      {/* Minimal Footer (Admin Link Removed) */}
      <footer className="w-full px-4 md:px-6 py-12 border-t border-primary/5 mt-20 bg-background transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          
          {/* Left: Logo & Copyright */}
          <div>
            <div className="mb-4 text-primary">
              <LogoSvg className="h-5 md:h-6 w-auto" />
            </div>
            <p className="text-xs text-secondary">
              © {new Date().getFullYear()} Flair Factory Film. All rights reserved.
            </p>
          </div>

          {/* Right: Essential Contact Info */}
          <div className="flex flex-col md:items-end gap-1 text-sm text-secondary">
            {/* 실제 주소/연락처 */}
            <address className="not-italic">서울특별시 강동구 성안로 92 4층</address>
            <a href="tel:+15550000000" className="hover:text-primary transition-colors">+82-2-488-9712</a>
            <a href="mailto:hello@lumina.studio" className="hover:text-primary transition-colors">flairfactoryfilm@gmail.com</a>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Layout;
