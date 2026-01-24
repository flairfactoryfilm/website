import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  getProjects, 
  getContacts, 
  createProject, 
  updateProject, 
  deleteProject,
  getAllTags,
  renameTag,
  addTag,
  deleteTag,
  uploadImage
} from '../services/dataService';
import { Project } from '../types';
import { 
  Shield, Plus, Edit2, Trash2, Mail, LayoutGrid, Tags, 
  Eye, EyeOff, X, AlertTriangle, Save, Upload, GripVertical, Star, PenLine, LogOut, Loader2, Calendar
} from 'lucide-react';

const Admin: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- UI State ---
  const [activeTab, setActiveTab] = useState<'works' | 'tags' | 'inquiries'>('works');
  
  // --- Data State ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [availableTags, setAvailableTags] = useState<{industry: string[], type: string[]}>({ industry: [], type: [] });
  
  // --- Modal & Form State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isUploading, setIsUploading] = useState(false);
  
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    industry_tags: [],
    type_tags: [],
    images: [] 
  });
  
  // Work Date String for Input (YYYY-MM)
  // DB의 'YYYY-MM-DD'를 input type="month"에 맞는 'YYYY-MM'으로 변환해서 관리
  const [workDateInput, setWorkDateInput] = useState('');

  // --- Tag Management State ---
  const [newTagInput, setNewTagInput] = useState('');
  const [tagCategory, setTagCategory] = useState<'industry' | 'type'>('industry');

  // --- Drag and Drop State ---
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

  // --- Alert State ---
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean, projectId: string | null }>({ isOpen: false, projectId: null });

  // --- Initialization ---

  const refreshData = () => {
    getProjects().then(setProjects);
    getContacts().then(setContacts);
    getAllTags().then(setAvailableTags);
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoadingAuth(false);
      if (session) refreshData();
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) refreshData();
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Auth Handlers ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("로그인 실패: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // --- Project Handlers ---

  const handleEditClick = (project: Project) => {
    setCurrentProject({ ...project, images: project.images || [] });
    // YYYY-MM-DD -> YYYY-MM 변환
    setWorkDateInput(project.work_date ? project.work_date.substring(0, 7) : '');
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setCurrentProject({
      title: '', client: '', video_url: '', thumbnail_url: '', 
      industry_tags: [], type_tags: [], is_featured: false, is_visible: true, description: '',
      images: []
    });
    // 오늘 날짜 기준 YYYY-MM 설정
    setWorkDateInput(new Date().toISOString().substring(0, 7));
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteAlert({ isOpen: true, projectId: id });
  };

  const confirmDelete = async () => {
    if (deleteAlert.projectId) {
      await deleteProject(deleteAlert.projectId);
      setDeleteAlert({ isOpen: false, projectId: null });
      refreshData();
    }
  };

  const toggleVisibility = async (project: Project) => {
    await updateProject({ ...project, is_visible: !project.is_visible });
    refreshData();
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Thumbnail fallback logic
    const submission = { ...currentProject };
    if (!submission.thumbnail_url && submission.images && submission.images.length > 0) {
      submission.thumbnail_url = submission.images[0];
    }
    
    // YYYY-MM -> YYYY-MM-01 (DB 저장을 위해 1일로 고정)
    if (workDateInput) {
      submission.work_date = `${workDateInput}-01`;
    } else {
      submission.work_date = new Date().toISOString().split('T')[0]; // 없으면 오늘
    }

    try {
      if (modalMode === 'add') {
        await createProject(submission as Project);
      } else {
        await updateProject(submission as Project);
      }
      setIsModalOpen(false);
      refreshData();
    } catch (error: any) {
      alert("저장 실패: " + error.message);
    }
  };

  // --- Image Handling (Real Upload) ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      try {
        const files = Array.from(e.target.files);
        
        // Upload all files in parallel
        const uploadPromises = files.map(file => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        
        setCurrentProject(prev => {
          const updatedImages = [...(prev.images || []), ...uploadedUrls];
          const updatedThumb = prev.thumbnail_url || updatedImages[0];
          return {
            ...prev,
            images: updatedImages,
            thumbnail_url: updatedThumb
          };
        });
      } catch (error: any) {
        alert("이미지 업로드 중 오류가 발생했습니다: " + error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setCurrentProject(prev => {
      const imgToRemove = prev.images![indexToRemove];
      const newImages = prev.images!.filter((_, i) => i !== indexToRemove);
      
      let newThumb = prev.thumbnail_url;
      if (imgToRemove === newThumb) {
        newThumb = newImages.length > 0 ? newImages[0] : '';
      }

      return { ...prev, images: newImages, thumbnail_url: newThumb };
    });
  };

  const setAsCover = (url: string) => {
    setCurrentProject(prev => ({ ...prev, thumbnail_url: url }));
  };

  // --- Drag and Drop Handlers ---

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedImageIndex === null) return;

    const newImages = [...(currentProject.images || [])];
    const draggedItem = newImages[draggedImageIndex];
    newImages.splice(draggedImageIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);

    setCurrentProject(prev => ({ ...prev, images: newImages }));
    setDraggedImageIndex(null);
  };

  // --- Tag Handlers ---

  const toggleModalTag = (tag: string, category: 'industry' | 'type') => {
    setCurrentProject(prev => {
      const currentTags = category === 'industry' ? (prev.industry_tags || []) : (prev.type_tags || []);
      const newTags = currentTags.includes(tag) 
        ? currentTags.filter(t => t !== tag) 
        : [...currentTags, tag];
      
      return category === 'industry' 
        ? { ...prev, industry_tags: newTags }
        : { ...prev, type_tags: newTags };
    });
  };

  const handleAddTag = async () => {
    if (newTagInput.trim()) {
      await addTag(newTagInput.trim(), tagCategory);
      setNewTagInput('');
      refreshData();
    }
  };

  const handleDeleteTag = async (tag: string, category: 'industry' | 'type') => {
    if (confirm(`정말 "${tag}" 태그를 삭제하시겠습니까?`)) {
      await deleteTag(tag, category);
      refreshData();
    }
  };

  const handleRenameTag = async (tag: string, category: 'industry' | 'type') => {
    const newName = prompt(`"${tag}" 태그의 새 이름 입력:`, tag);
    if (newName && newName !== tag) {
      await renameTag(tag, newName, category);
      refreshData();
    }
  };

  // --- Render Views ---

  if (isLoadingAuth) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32}/></div>;
  }

  // 1. Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-surface p-8 rounded-2xl border border-primary/10">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-primary">Admin Portal</h2>
            <p className="text-secondary text-sm">Supabase 계정으로 로그인하세요.</p>
          </div>
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-primary/10 p-3 rounded-lg focus:border-primary outline-none transition-colors text-primary"
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-primary/10 p-3 rounded-lg focus:border-primary outline-none transition-colors text-primary"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-primary text-background font-bold uppercase tracking-widest py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              대시보드 접속
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 2. Dashboard View
  return (
    <div className="px-4 md:px-6 py-10 max-w-7xl mx-auto relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center gap-4">
           <h1 className="text-3xl font-display font-bold text-primary">Dashboard</h1>
           <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 flex items-center gap-1 border border-red-500/20 px-3 py-1 rounded-full hover:bg-red-500/10 transition-colors">
             <LogOut size={12}/> Logout
           </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveTab('works')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'works' ? 'bg-primary text-background' : 'bg-surface text-secondary hover:text-primary'}`}
          >
            <LayoutGrid size={16} /> Works
          </button>
          <button 
             onClick={() => setActiveTab('tags')}
             className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'tags' ? 'bg-primary text-background' : 'bg-surface text-secondary hover:text-primary'}`}
          >
            <Tags size={16} /> Tags
          </button>
          <button 
             onClick={() => setActiveTab('inquiries')}
             className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'inquiries' ? 'bg-primary text-background' : 'bg-surface text-secondary hover:text-primary'}`}
          >
            <Mail size={16} /> Inquiries
          </button>
        </div>
      </div>

      {/* Tab Content: Works */}
      {activeTab === 'works' && (
        <div className="animate-fade-in">
          <div className="flex justify-end mb-4">
            <button 
              onClick={handleAddClick}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Plus size={16} /> 새 작업 추가
            </button>
          </div>
          <div className="grid gap-4">
            {projects.length === 0 ? (
                <div className="text-center py-20 bg-surface rounded-xl border border-primary/5 text-secondary">
                    등록된 프로젝트가 없습니다. (Supabase DB가 비어있음)
                </div>
            ) : (
                projects.map(project => (
                <div key={project.id} className={`bg-surface p-4 rounded-xl border flex flex-col md:flex-row items-center gap-4 group transition-all ${project.is_visible ? 'border-primary/5 hover:border-primary/20' : 'border-red-500/20 opacity-75'}`}>
                    <div className="relative">
                      <img 
                        src={project.thumbnail_url || (project.images && project.images[0]) || 'https://via.placeholder.com/150'} 
                        alt={project.title} 
                        className="w-full md:w-32 h-20 object-cover rounded-lg bg-neutral-900" 
                      />
                      {!project.is_visible && <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg"><EyeOff size={20} className="text-primary"/></div>}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-display font-bold text-lg text-primary">{project.title}</h3>
                      <p className="text-xs text-secondary uppercase tracking-wider">
                         {project.work_date ? project.work_date.substring(0, 7) : 'Date N/A'} • {project.client}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 text-sm text-secondary">
                      {project.is_featured && <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-bold uppercase">Featured</span>}
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => toggleVisibility(project)} className="p-2 hover:bg-primary/10 rounded-full text-secondary hover:text-primary transition-colors" title={project.is_visible ? "숨기기" : "보이기"}>
                        {project.is_visible ? <Eye size={16}/> : <EyeOff size={16}/>}
                      </button>
                      <button onClick={() => handleEditClick(project)} className="p-2 hover:bg-primary/10 rounded-full text-secondary hover:text-primary transition-colors" title="수정">
                        <Edit2 size={16}/>
                      </button>
                      <button onClick={() => handleDeleteClick(project.id)} className="p-2 hover:bg-red-500/10 rounded-full text-secondary hover:text-red-500 transition-colors" title="삭제">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Tags */}
      {activeTab === 'tags' && (
        <div className="animate-fade-in space-y-8">
           <div className="bg-surface p-6 rounded-xl border border-primary/5">
             <h3 className="font-bold text-lg mb-4 text-primary">태그 관리</h3>
             <div className="flex flex-col md:flex-row gap-4 items-end">
               <div className="w-full md:w-1/3">
                 <label className="text-xs font-bold text-secondary uppercase mb-2 block">새 태그 이름</label>
                 <input 
                  type="text" 
                  value={newTagInput} 
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="w-full bg-background border border-primary/10 p-3 rounded-lg text-primary"
                  placeholder="예: 다큐멘터리"
                 />
               </div>
               <div className="w-full md:w-1/4">
                 <label className="text-xs font-bold text-secondary uppercase mb-2 block">카테고리</label>
                 <select 
                  value={tagCategory}
                  onChange={(e) => setTagCategory(e.target.value as 'industry' | 'type')}
                  className="w-full bg-background border border-primary/10 p-3 rounded-lg text-primary appearance-none"
                 >
                   <option value="industry">Industry</option>
                   <option value="type">Work Type</option>
                 </select>
               </div>
               <button 
                onClick={handleAddTag}
                className="w-full md:w-auto px-6 py-3 bg-primary text-background font-bold uppercase tracking-widest rounded-lg hover:opacity-90"
               >
                 태그 추가
               </button>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Industry Tags List */}
            <div className="bg-surface p-6 rounded-xl border border-primary/5">
              <h4 className="text-xs font-bold text-secondary uppercase mb-4">Industry Tags</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.industry.length === 0 && <span className="text-secondary text-sm">태그가 없습니다.</span>}
                {availableTags.industry.map(tag => (
                  <div key={tag} className="group flex items-center gap-2 bg-background border border-primary/10 rounded-full pl-4 pr-1 py-1 transition-all hover:border-primary/30">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">{tag}</span>
                    <div className="flex items-center border-l border-primary/10 pl-1">
                      <button 
                        onClick={() => handleRenameTag(tag, 'industry')}
                        className="p-1.5 hover:text-primary text-secondary transition-colors"
                        title="이름 변경"
                      >
                        <PenLine size={12} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTag(tag, 'industry')}
                        className="p-1.5 hover:text-red-500 text-secondary transition-colors"
                        title="삭제"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Type Tags List */}
            <div className="bg-surface p-6 rounded-xl border border-primary/5">
              <h4 className="text-xs font-bold text-secondary uppercase mb-4">Work Type Tags</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.type.length === 0 && <span className="text-secondary text-sm">태그가 없습니다.</span>}
                {availableTags.type.map(tag => (
                  <div key={tag} className="group flex items-center gap-2 bg-background border border-primary/10 rounded-full pl-4 pr-1 py-1 transition-all hover:border-primary/30">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">{tag}</span>
                    <div className="flex items-center border-l border-primary/10 pl-1">
                      <button 
                        onClick={() => handleRenameTag(tag, 'type')}
                        className="p-1.5 hover:text-primary text-secondary transition-colors"
                        title="이름 변경"
                      >
                        <PenLine size={12} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTag(tag, 'type')}
                        className="p-1.5 hover:text-red-500 text-secondary transition-colors"
                        title="삭제"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-secondary uppercase tracking-widest border-b border-primary/10">
                <tr>
                  <th className="pb-4 pl-4">Date</th>
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Subject</th>
                  <th className="pb-4">Budget</th>
                  <th className="pb-4">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {contacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-surface transition-colors">
                    <td className="py-4 pl-4 text-secondary">{new Date(contact.created_at).toLocaleDateString()}</td>
                    <td className="py-4 font-bold text-primary">{contact.name}</td>
                    <td className="py-4 text-secondary">{contact.email}</td>
                    <td className="py-4"><span className="px-2 py-1 bg-surface rounded text-xs uppercase text-primary">{contact.subject}</span></td>
                    <td className="py-4 text-primary">{contact.budget}</td>
                    <td className="py-4 max-w-xs truncate text-secondary" title={contact.message}>{contact.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length === 0 && (
              <div className="text-center py-10 text-secondary">문의 내역이 없습니다.</div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl border border-primary/10 shadow-2xl flex flex-col animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-primary/5 bg-surface sticky top-0 z-10">
              <h2 className="text-xl font-display font-bold text-primary">{modalMode === 'add' ? '새 작업 추가' : '작업 수정'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-primary"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="p-6 space-y-8">
              {/* 1. Basic Info & Work Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-secondary">Title</label>
                  <input required className="w-full bg-background border border-primary/10 p-3 rounded-lg text-primary focus:border-primary outline-none" value={currentProject.title || ''} onChange={e => setCurrentProject({...currentProject, title: e.target.value})} placeholder="프로젝트 제목" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-secondary">Work Date (Year-Month)</label>
                  <div className="relative">
                    <input 
                      type="month" 
                      required
                      className="w-full bg-background border border-primary/10 p-3 rounded-lg text-primary focus:border-primary outline-none appearance-none" 
                      value={workDateInput} 
                      onChange={e => setWorkDateInput(e.target.value)} 
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                        <Calendar size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Client & Description */}
               <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-secondary">Client</label>
                  <input required className="w-full bg-background border border-primary/10 p-3 rounded-lg text-primary focus:border-primary outline-none" value={currentProject.client || ''} onChange={e => setCurrentProject({...currentProject, client: e.target.value})} placeholder="클라이언트명" />
                </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-secondary">Description</label>
                <textarea className="w-full bg-background border border-primary/10 p-3 rounded-lg text-primary focus:border-primary outline-none" rows={3} value={currentProject.description || ''} onChange={e => setCurrentProject({...currentProject, description: e.target.value})} placeholder="프로젝트 설명..." />
              </div>

              {/* 3. Vimeo Link */}
              <div className="space-y-2">
                 <label className="text-xs uppercase font-bold text-secondary">Vimeo Video ID (Numbers Only)</label>
                 <input className="w-full bg-background border border-primary/10 p-3 rounded-lg text-primary focus:border-primary outline-none" value={currentProject.vimeo_id || ''} onChange={e => setCurrentProject({...currentProject, vimeo_id: e.target.value})} placeholder="예: 375468729" />
                 <p className="text-[10px] text-secondary">Vimeo 주소 뒷부분 숫자만 입력하세요.</p>
              </div>

              {/* 4. Images */}
              <div className="space-y-4">
                <label className="text-xs uppercase font-bold text-secondary flex justify-between">
                  <span>Gallery Images</span>
                  <span className="font-normal normal-case opacity-50">드래그하여 순서 변경 • 별표를 눌러 커버 지정</span>
                </label>
                
                {/* Upload Area */}
                <div className="relative border-2 border-dashed border-primary/10 rounded-xl p-8 text-center hover:border-primary/30 transition-colors bg-background/50">
                   {isUploading && (
                       <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                           <div className="flex flex-col items-center gap-2">
                               <Loader2 className="animate-spin text-primary" size={24}/>
                               <span className="text-xs font-bold text-primary">Uploading...</span>
                           </div>
                       </div>
                   )}
                  <input 
                    type="file" 
                    id="image-upload" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <label htmlFor="image-upload" className={`cursor-pointer flex flex-col items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
                    <Upload size={32} className="text-primary/40" />
                    <span className="text-sm font-bold text-primary">클릭 또는 드래그하여 이미지 업로드</span>
                    <span className="text-xs text-secondary">JPG, PNG, WEBP 지원</span>
                  </label>
                </div>

                {/* Image Grid */}
                {currentProject.images && currentProject.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentProject.images.map((url, index) => (
                      <div 
                        key={`${url}-${index}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`group relative aspect-square bg-neutral-900 rounded-lg overflow-hidden border-2 transition-all cursor-move ${draggedImageIndex === index ? 'opacity-50' : 'opacity-100'} ${currentProject.thumbnail_url === url ? 'border-primary' : 'border-transparent'}`}
                      >
                        <img src={url} className="w-full h-full object-cover" alt="" />
                        
                        {/* Actions Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-end">
                            <button 
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-1 bg-red-500/80 text-white rounded hover:bg-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="p-1 text-white/50"><GripVertical size={16}/></div>
                             <button 
                                type="button"
                                onClick={() => setAsCover(url)}
                                className={`p-1 rounded ${currentProject.thumbnail_url === url ? 'text-yellow-400' : 'text-white/50 hover:text-white'}`}
                                title="커버로 지정"
                             >
                               <Star size={16} fill={currentProject.thumbnail_url === url ? "currentColor" : "none"} />
                             </button>
                          </div>
                        </div>
                        
                        {/* Cover Label */}
                        {currentProject.thumbnail_url === url && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-background text-[10px] font-bold uppercase rounded">Cover</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                  <label className="text-xs uppercase font-bold text-secondary">Industry Tags</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-background/50 border border-primary/5 rounded-xl">
                    {availableTags.industry.length === 0 && <span className="text-xs text-secondary opacity-50">등록된 태그가 없습니다. 상단 Tags 탭에서 추가하세요.</span>}
                    {availableTags.industry.map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleModalTag(tag, 'industry')}
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border rounded-full transition-colors ${
                          currentProject.industry_tags?.includes(tag)
                            ? 'bg-primary text-background border-primary'
                            : 'bg-transparent text-secondary border-primary/10 hover:border-primary/30'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs uppercase font-bold text-secondary">Work Type Tags</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-background/50 border border-primary/5 rounded-xl">
                    {availableTags.type.length === 0 && <span className="text-xs text-secondary opacity-50">등록된 태그가 없습니다. 상단 Tags 탭에서 추가하세요.</span>}
                    {availableTags.type.map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleModalTag(tag, 'type')}
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border rounded-full transition-colors ${
                          currentProject.type_tags?.includes(tag)
                            ? 'bg-primary text-background border-primary'
                            : 'bg-transparent text-secondary border-primary/10 hover:border-primary/30'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6. Checkboxes & Footer */}
              <div className="flex gap-8 pt-4 border-t border-primary/5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 accent-primary" checked={currentProject.is_featured || false} onChange={e => setCurrentProject({...currentProject, is_featured: e.target.checked})} />
                  <span className="text-sm font-bold uppercase text-primary">Featured</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 accent-primary" checked={currentProject.is_visible ?? true} onChange={e => setCurrentProject({...currentProject, is_visible: e.target.checked})} />
                  <span className="text-sm font-bold uppercase text-primary">Visible</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-surface z-10 pb-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide text-secondary hover:text-primary">취소</button>
                <button type="submit" className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide bg-primary text-background hover:opacity-90 flex items-center gap-2">
                  <Save size={16} /> 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      {deleteAlert.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-sm p-6 rounded-xl border border-red-500/20 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">작업 삭제?</h3>
            <p className="text-secondary text-sm mb-6">이 작업은 되돌릴 수 없습니다. 프로젝트가 영구적으로 삭제됩니다.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteAlert({isOpen: false, projectId: null})} className="flex-1 px-4 py-3 rounded-lg text-sm font-bold uppercase border border-primary/10 hover:bg-primary/5 text-primary">취소</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-3 rounded-lg text-sm font-bold uppercase bg-red-500 text-white hover:bg-red-600">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
