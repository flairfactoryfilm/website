import React, { useState, useEffect, useMemo } from 'react';
import { getProjects } from '../services/dataService';
import { Project } from '../types';
import WorkCard from '../components/WorkCard';
import { Search, X, Filter } from 'lucide-react';

const Works: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        // Only show visible projects on the public page
        setProjects(data.filter(p => p.is_visible));
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Extract unique tags
  const availableIndustries = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.industry_tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  const availableTypes = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.type_tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  // Filtering Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // 1. Search Text (Title or Client)
      const matchesSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Industry Filter (OR logic within group: project must have AT LEAST ONE of the selected industries)
      const matchesIndustry =
        selectedIndustries.length === 0 ||
        p.industry_tags.some(tag => selectedIndustries.includes(tag));

      // 3. Type Filter (OR logic within group)
      const matchesType =
        selectedTypes.length === 0 ||
        p.type_tags.some(tag => selectedTypes.includes(tag));

      return matchesSearch && matchesIndustry && matchesType;
    });
  }, [projects, searchQuery, selectedIndustries, selectedTypes]);

  // Handlers
  const toggleIndustry = (tag: string) => {
    setSelectedIndustries(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleType = (tag: string) => {
    setSelectedTypes(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustries([]);
    setSelectedTypes([]);
  };

  const hasActiveFilters = searchQuery || selectedIndustries.length > 0 || selectedTypes.length > 0;

  if (loading) {
    return (
      <div className="px-4 md:px-6 h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-sm font-mono text-primary/50">LOADING ASSETS...</div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 min-h-screen pb-20">
      {/* Header Section */}
      <div className="mb-8 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-primary">SELECTED WORKS</h2>
          <span className="text-secondary text-sm uppercase tracking-widest hidden md:block">
            {filteredProjects.length} Projects Found
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative group mb-10">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="프로젝트, 클라이언트 검색..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b border-primary/20 py-4 pl-10 text-xl md:text-2xl font-light text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-primary/20"
          />
          {searchQuery && (
             <button onClick={() => setSearchQuery('')} className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary">
               <X size={20} />
             </button>
          )}
        </div>

        {/* Filters Container */}
        <div className="flex flex-col gap-6">
          {/* Mobile Filter Toggle */}
          <button 
            className="md:hidden flex items-center gap-2 text-sm uppercase font-bold tracking-widest border border-primary/20 px-4 py-3 w-full justify-between text-primary"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <span>Filters {(selectedIndustries.length + selectedTypes.length) > 0 ? `(${selectedIndustries.length + selectedTypes.length})` : ''}</span>
            <Filter size={16} />
          </button>

          {/* Filter Groups */}
          <div className={`${isMobileFiltersOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-8 md:gap-16 animate-fade-in`}>
            
            {/* Industry Group */}
            <div className="flex-1">
              <h4 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-4">Industry</h4>
              <div className="flex flex-wrap gap-2 items-center">
                 {/* All Tag */}
                 <button
                    onClick={() => setSelectedIndustries([])}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-full transition-all duration-200 ${
                      selectedIndustries.length === 0
                        ? 'bg-primary text-background border-primary hover:opacity-90' 
                        : 'bg-transparent text-primary/60 border-primary/10 hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    All
                  </button>
                
                {availableIndustries.map(tag => {
                  const isSelected = selectedIndustries.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleIndustry(tag)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-full transition-all duration-200 ${
                        isSelected 
                          ? 'bg-primary text-background border-primary hover:opacity-90' 
                          : 'bg-transparent text-primary/60 border-primary/10 hover:border-primary/40 hover:text-primary'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}

                {/* Conditional Reset Button */}
                {selectedIndustries.length > 0 && (
                   <button 
                     onClick={() => setSelectedIndustries([])}
                     className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-red-500 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-2"
                   >
                     초기화
                   </button>
                )}
              </div>
            </div>

            {/* Type Group */}
            <div className="flex-1">
              <h4 className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-4">Work Type</h4>
              <div className="flex flex-wrap gap-2 items-center">
                {/* All Tag */}
                 <button
                    onClick={() => setSelectedTypes([])}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-full transition-all duration-200 ${
                      selectedTypes.length === 0
                        ? 'bg-primary text-background border-primary hover:opacity-90' 
                        : 'bg-transparent text-primary/60 border-primary/10 hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    All
                  </button>

                {availableTypes.map(tag => {
                  const isSelected = selectedTypes.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleType(tag)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-full transition-all duration-200 ${
                        isSelected 
                          ? 'bg-primary text-background border-primary hover:opacity-90' 
                          : 'bg-transparent text-primary/60 border-primary/10 hover:border-primary/40 hover:text-primary'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}

                {/* Conditional Reset Button */}
                {selectedTypes.length > 0 && (
                   <button 
                     onClick={() => setSelectedTypes([])}
                     className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-red-500 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-2"
                   >
                     초기화
                   </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-1 md:gap-4 lg:gap-6 mt-12">
        {filteredProjects.map((project) => (
          <div key={project.id} className="animate-slide-up">
            <WorkCard project={project} />
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center text-center text-primary/30 space-y-4">
          <div className="text-4xl font-display font-bold opacity-50">검색 결과 없음</div>
          <p className="tracking-wide text-sm">검색어 또는 필터를 변경해보세요.</p>
          <button onClick={clearFilters} className="mt-4 px-6 py-2 border border-primary/20 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-background transition-colors">
            초기화
          </button>
        </div>
      )}
    </div>
  );
};

export default Works;