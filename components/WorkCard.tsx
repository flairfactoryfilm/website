import React, { useState } from 'react';
import { Project } from '../types';
import { Link } from 'react-router-dom';

interface WorkCardProps {
  project: Project;
}

const WorkCard: React.FC<WorkCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 1. 썸네일 소스 결정 (thumbnail_url이 없으면 images 배열의 첫 번째 사진 사용)
  const thumbnailSource = project.thumbnail_url || (project.images && project.images.length > 0 ? project.images[0] : '');

  // 2. 비디오 렌더링 로직 함수
  const renderMedia = () => {
    // Case A: Vimeo ID가 있는 경우 (가장 우선)
    if (project.vimeo_id) {
      return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
           {/* scale-[1.3]은 Vimeo 특유의 검은 테두리를 가리기 위한 확대 트릭입니다. 필요 없으면 제거하세요. */}
          <iframe
            src={`https://player.vimeo.com/video/${project.vimeo_id}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
            className="w-full h-full scale-[1.3]"
            allow="autoplay; fullscreen; picture-in-picture"
            title={project.title}
            frameBorder="0"
          />
        </div>
      );
    }

    // Case B: 직접 비디오 URL이 있는 경우
    if (project.video_url) {
      return (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={project.video_url}
          poster={thumbnailSource} // 로딩 전 보여줄 이미지
          autoPlay
          muted
          loop
          playsInline
        />
      );
    }

    // Case C: 비디오가 둘 다 없는 경우 (이미지만 렌더링)
    return (
      <img
        src={thumbnailSource}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    );
  };

  return (
    <Link to={`/works/${project.id}`} className="block group">
      {/* Media Container */}
      <div 
        className="relative w-full aspect-video bg-neutral-900 overflow-hidden cursor-pointer mb-5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 1. Base Image Layer (비디오 로딩 전 찰나의 순간이나 비디오가 없을 때 보임) */}
        {thumbnailSource && (
            <img 
                src={thumbnailSource} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover opacity-50" // 비디오 뒤에 은은하게 깔아둠
            />
        )}

        {/* 2. Active Media Layer */}
        {renderMedia()}

        {/* 3. Overlay Layer (호버 시 어두워지는 효과) */}
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
