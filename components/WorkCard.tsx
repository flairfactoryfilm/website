import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { Link } from 'react-router-dom';

interface WorkCardProps {
  project: Project;
  baseUrl?: string;
}

const WorkCard: React.FC<WorkCardProps> = ({ project, baseUrl = '/video' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 뷰포트 진입 감지 — 한 번 보이면 유지
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' } // 뷰포트 200px 전에 미리 로드 시작
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const thumbnailSource = project.thumbnail_url || (project.images && project.images.length > 0 ? project.images[0] : '');

  // 영상은 뷰포트에 들어온 뒤에만 렌더링
  const renderMedia = () => {
    if (!isVisible) return null;

    if (project.vimeo_id) {
      return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeo_id}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
            className="w-full h-full scale-[1.3]"
            allow="autoplay; fullscreen; picture-in-picture"
            title={project.title}
            frameBorder="0"
            loading="lazy"
          />
        </div>
      );
    }

    if (project.video_url) {
      return (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={project.video_url}
          poster={thumbnailSource}
          autoPlay muted loop playsInline
          preload="none"
        />
      );
    }

    return (
      <img
        src={thumbnailSource}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    );
  };

  return (
    <Link to={`${baseUrl}/${project.id}`} className="block group" ref={cardRef}>
      {/* Media Container */}
      <div 
        className="relative w-full aspect-video bg-neutral-900 overflow-hidden cursor-pointer mb-5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 1. Base Thumbnail — 항상 즉시 표시 */}
        {thumbnailSource && (
          <img 
            src={thumbnailSource} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            loading="lazy"
          />
        )}

        {/* 2. Active Media — 뷰포트 진입 후에만 마운트 */}
        {renderMedia()}

        {/* 3. Overlay */}
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
