import { supabase, isSupabaseConfigured } from './supabase';
import { Project, ContactForm } from '../types';

// Mock Data
let MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: '네온 드리프트',
    client: '사이버 모터스',
    vimeo_id: '375468729', // Example Vimeo ID
    video_url: 'https://cdn.coverr.co/videos/coverr-driving-at-night-in-the-rain-4547/1080p.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=1920&auto=format&fit=crop'
    ],
    industry_tags: ['자동차', '테크'],
    type_tags: ['광고', 'VFX'],
    is_featured: true,
    is_visible: true,
    created_at: '2024-01-15T10:00:00Z',
    description: '도시의 미학과 실시간 렌더링 기술을 결합한 하이옥탄 광고 프로젝트입니다. 우리는 자동차 시각화의 한계를 뛰어넘었습니다.'
  },
  {
    id: '2',
    title: '이터널 스레드',
    client: '보그 코리아',
    vimeo_id: '76979871', // Example Vimeo ID
    video_url: 'https://cdn.coverr.co/videos/coverr-fashion-model-posing-in-neon-lights-5674/1080p.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1537832816519-0439d612e480?q=80&w=1920&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1537832816519-0439d612e480?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-b8491715402f?q=80&w=1920&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1920&auto=format&fit=crop'
    ],
    industry_tags: ['패션'],
    type_tags: ['에디토리얼', '소셜'],
    is_featured: true,
    is_visible: true,
    created_at: '2024-02-01T14:30:00Z',
    description: '디지털 패션과 물리적 움직임의 경계를 허무는 실험적인 영상입니다. 8K로 촬영하여 극대화된 디테일을 선사합니다.'
  },
  {
    id: '3',
    title: '어반 리듬',
    client: '스포티파이',
    vimeo_id: '81846682', // Example Vimeo ID
    video_url: 'https://cdn.coverr.co/videos/coverr-person-playing-drums-5527/1080p.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1920&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1920&auto=format&fit=crop'],
    industry_tags: ['음악', '엔터테인먼트'],
    type_tags: ['뮤직비디오'],
    is_featured: false,
    is_visible: true,
    created_at: '2023-12-10T09:15:00Z',
    description: '도시의 소음을 리듬으로 재해석한 사운드 비주얼라이제이션 프로젝트입니다.'
  },
  {
    id: '4',
    title: '퓨처 홈',
    client: '스마트 리빙',
    vimeo_id: '155403282', // Example Vimeo ID
    video_url: 'https://cdn.coverr.co/videos/coverr-waking-up-in-a-smart-home-4752/1080p.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1558002038-109177381785?q=80&w=1920&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1558002038-109177381785?q=80&w=1920&auto=format&fit=crop'],
    industry_tags: ['부동산', '테크'],
    type_tags: ['브랜드 필름'],
    is_featured: false,
    is_visible: true,
    created_at: '2023-11-20T16:45:00Z',
    description: '연결된 생활 공간의 미래를 시각화한 브랜드 필름입니다.'
  },
  {
    id: '5',
    title: '미식의 정원',
    client: '오마카세 젠',
    vimeo_id: '433544669', // Example Vimeo ID
    video_url: 'https://cdn.coverr.co/videos/coverr-chef-preparing-sushi-4778/1080p.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1920&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1920&auto=format&fit=crop'],
    industry_tags: ['F&B'],
    type_tags: ['광고'],
    is_featured: true,
    is_visible: true,
    created_at: '2024-03-05T11:20:00Z',
    description: '요리의 예술적 과정을 시네마틱한 호흡으로 담아냈습니다.'
  }
];

// Available Tags State (Mock Persistence)
let AVAILABLE_TAGS = {
  industry: ['자동차', '테크', '패션', '음악', '엔터테인먼트', '부동산', 'F&B', '라이프스타일'],
  type: ['광고', 'VFX', '에디토리얼', '소셜', '뮤직비디오', '브랜드 필름', '다큐멘터리']
};

const sortProjects = (projects: Project[]) => {
  return projects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// --- Project Operations ---

export const getProjects = async (): Promise<Project[]> => {
  // Simulate DB fetch
  return new Promise((resolve) => {
    setTimeout(() => resolve(sortProjects([...MOCK_PROJECTS])), 300);
  });
};

export const getProjectById = async (id: string): Promise<Project | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PROJECTS.find(p => p.id === id)), 200);
  });
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at'>): Promise<Project> => {
  const newProject = {
    ...project,
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString()
  };
  MOCK_PROJECTS = [newProject, ...MOCK_PROJECTS];
  return newProject;
};

export const updateProject = async (project: Project): Promise<Project> => {
  MOCK_PROJECTS = MOCK_PROJECTS.map(p => p.id === project.id ? project : p);
  return project;
};

export const deleteProject = async (id: string): Promise<void> => {
  MOCK_PROJECTS = MOCK_PROJECTS.filter(p => p.id !== id);
};

// --- Tag Operations ---

export const getAllTags = async (): Promise<{industry: string[], type: string[]}> => {
  return Promise.resolve(AVAILABLE_TAGS);
};

export const addTag = async (name: string, category: 'industry' | 'type'): Promise<void> => {
  if (!AVAILABLE_TAGS[category].includes(name)) {
    AVAILABLE_TAGS[category] = [...AVAILABLE_TAGS[category], name].sort();
  }
};

export const renameTag = async (oldName: string, newName: string, category: 'industry' | 'type'): Promise<void> => {
  // Update available list
  AVAILABLE_TAGS[category] = AVAILABLE_TAGS[category].map(t => t === oldName ? newName : t).sort();
  
  // Update all projects using this tag
  MOCK_PROJECTS = MOCK_PROJECTS.map(p => {
    if (category === 'industry') {
      return { ...p, industry_tags: p.industry_tags.map(t => t === oldName ? newName : t) };
    } else {
      return { ...p, type_tags: p.type_tags.map(t => t === oldName ? newName : t) };
    }
  });
};

export const deleteTag = async (name: string, category: 'industry' | 'type'): Promise<void> => {
  // Remove from available list
  AVAILABLE_TAGS[category] = AVAILABLE_TAGS[category].filter(t => t !== name);
  
  // Remove from all projects (but do not delete the project)
  MOCK_PROJECTS = MOCK_PROJECTS.map(p => {
    if (category === 'industry') {
      return { ...p, industry_tags: p.industry_tags.filter(t => t !== name) };
    } else {
      return { ...p, type_tags: p.type_tags.filter(t => t !== name) };
    }
  });
};

// --- Contact Operations ---

export const submitContact = async (form: ContactForm): Promise<{ success: boolean; error?: string }> => {
  console.log('Mock submission:', form);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
};

export const getContacts = async (): Promise<any[]> => {
  return [
    { id: 1, name: 'John Doe', email: 'alice@example.com', subject: 'Commercial', budget: '20k-50k', message: 'Inquiry about TV ad production.', created_at: new Date().toISOString() },
    { id: 2, name: 'Jane Smith', email: 'bob@example.com', subject: 'Music Video', budget: '<5k', message: 'Quote for indie band MV.', created_at: new Date(Date.now() - 86400000).toISOString() }
  ];
};