import React, { useRef, useEffect, useState } from 'react';
import { Project } from '../types';
import { Link } from 'react-router-dom';

interface WorkCardProps {
  project: Project;
}

const WorkCard: React.FC<WorkCardProps> = ({ project }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(e => console.log('Autoplay blocked:', e));
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.6 } // Video plays when 60% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <Link to={`/works/${project.id}`} className="block group">
      <div 
        ref={containerRef}
        className="relative w-full aspect-video bg-neutral-900 overflow-hidden cursor-pointer mb-5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Video Layer */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={project.video_url}
          poster={project.thumbnail_url}
          muted
          loop
          playsInline
        />

        {/* Subtle Overlay for focus */}
        <div className={`absolute inset-0 bg-black/0 transition-colors duration-500 ${isHovered ? 'group-hover:bg-black/10' : ''}`} />
      </div>

      {/* Info Below Card */}
      <div>
        <p className="text-xs font-bold text-secondary mb-1 uppercase tracking-normal">
          {project.client}
        </p>
        <h3 className="text-2xl font-display font-bold text-primary leading-tight group-hover:opacity-70 transition-opacity">
          {project.title}
        </h3>
      </div>
    </Link>
  );
};

export default WorkCard;