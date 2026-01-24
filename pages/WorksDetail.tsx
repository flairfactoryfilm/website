import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, getProjects } from '../services/dataService';
import { Project } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const WorksDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [prevProject, setPrevProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (id) {
        const [current, all] = await Promise.all([
          getProjectById(id),
          getProjects()
        ]);
        
        const visibleProjects = all.filter(p => p.is_visible);
        
        setProject(current || null);

        if (current && visibleProjects.length > 0) {
          const currentIndex = visibleProjects.findIndex(p => p.id === current.id);
          setPrevProject(currentIndex > 0 ? visibleProjects[currentIndex - 1] : null);
          setNextProject(currentIndex < visibleProjects.length - 1 ? visibleProjects[currentIndex + 1] : null);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // 날짜 포맷 변환 함수 (YYYY-MM-DD -> YYYY. MM)
  const formatWorkDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}. ${month}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-sm font-mono text-secondary">LOADING PROJECT...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-display font-bold text-primary">Project Not Found</h2>
        <Link to="/works" className="text-sm underline underline-offset-4 hover:text-secondary text-primary">
          Back to Works
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      {/* Back Navigation */}
      <div className="px-4 md:px-6 mb-6">
        <Link to="/works" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={14} />
          Back to Works
        </Link>
      </div>

      {/* Hero Video Player (Full Width) */}
      <div className="w-full px-4 md:px-6 mb-16">
        <div className="w-full aspect-video bg-surface relative overflow-hidden group">
          {project.vimeo_id ? (
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeo_id}?autoplay=1&title=0&byline=0&portrait=0`}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={project.title}
            ></iframe>
          ) : (
            <video 
              src={project.video_url}
              className="w-full h-full object-cover"
              controls
              autoPlay
              playsInline
              poster={project.thumbnail_url}
            />
          )}
        </div>
      </div>

      {/* Unified Content Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Title Section */}
        <div className="border-b border-primary/10 pb-8 mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight text-primary break-keep">
            {project.title}
          </h1>
        </div>

        {/* Info Grid (Split Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
          
          {/* Left Column: Metadata Stack */}
          <div className="lg:col-span-4 space-y-10">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-10">
                <div>
                   <h4 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Client</h4>
                   <p className="text-lg font-bold text-primary">{project.client}</p>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Year</h4>
                   {/* 수정됨: 등록일 대신 작업 시기(work_date) 표시 */}
                   <p className="text-lg font-bold text-primary">{formatWorkDate(project.work_date)}</p>
                </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-3">Industry</h4>
              <div className="flex flex-wrap gap-2">
                {project.industry_tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-primary/20 rounded-full text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-3">Work Type</h4>
              <div className="flex flex-wrap gap-2">
                {project.type_tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-primary/20 rounded-full text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Overview */}
          <div className="lg:col-span-8">
            <h3 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-6">Overview</h3>
            <p className="text-lg leading-relaxed text-primary/80 font-light whitespace-pre-line break-keep">
              {project.description || "No description available for this project."}
            </p>
          </div>
        </div>

        {/* Project Stills (Aligned with Info) */}
        {project.images && project.images.length > 0 && (
          <div className="mb-32">
            <h3 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-8 border-t border-primary/10 pt-4 inline-block w-full">Project Stills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((url, index) => (
                 <div key={index} className="relative group overflow-hidden bg-surface aspect-[4/3]">
                   <img 
                    src={url} 
                    alt={`Still ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                   />
                   <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                 </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="border-t border-primary/10">
        <div className="grid grid-cols-2 divide-x divide-primary/10">
          
          <div className="p-6 md:p-12 hover:bg-surface transition-colors group">
            {prevProject ? (
              <Link to={`/works/${prevProject.id}`} className="flex flex-col items-start gap-4">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">
                  <ArrowLeft size={14} /> Previous Project
                </span>
                <span className="text-2xl md:text-3xl font-display font-bold text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                  {prevProject.title}
                </span>
              </Link>
            ) : (
              <div className="opacity-20 cursor-not-allowed select-none">
                <span className="text-xs font-bold uppercase tracking-widest mb-2 block">Start</span>
                <span className="text-2xl md:text-3xl font-display font-bold">No Previous</span>
              </div>
            )}
          </div>

          <div className="p-6 md:p-12 hover:bg-surface transition-colors group text-right">
             {nextProject ? (
              <Link to={`/works/${nextProject.id}`} className="flex flex-col items-end gap-4">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">
                  Next Project <ArrowRight size={14} />
                </span>
                <span className="text-2xl md:text-3xl font-display font-bold text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                  {nextProject.title}
                </span>
              </Link>
            ) : (
              <div className="opacity-20 cursor-not-allowed select-none">
                <span className="text-xs font-bold uppercase tracking-widest mb-2 block">End</span>
                <span className="text-2xl md:text-3xl font-display font-bold">No Next</span>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default WorksDetail;
