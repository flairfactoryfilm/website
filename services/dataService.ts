import { supabase } from '../lib/supabase'; // 경로가 ../lib/supabase 인지 확인해주세요.
import { Project, ContactForm } from '../types';

// --- Projects (포트폴리오) ---

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return data || [];
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  return data;
};

export const createProject = async (project: Project) => {
  // id, created_at은 DB에서 자동 생성되므로 제외하고 보냄
  const { id, created_at, ...newProject } = project;
  
  const { data, error } = await supabase
    .from('projects')
    .insert([newProject])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProject = async (project: Project) => {
  const { error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', project.id);
  if (error) throw error;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// --- Contacts (문의하기) ---

export const getContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// Contact 페이지에서 사용하는 함수
export const submitContact = async (form: ContactForm) => {
    const { error } = await supabase
        .from('contacts')
        .insert([form]);
        
    if (error) return { success: false, error: error.message };
    return { success: true };
};

// --- Tags (태그 관리) ---

export const getAllTags = async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('*');
    
  if (error) {
    console.error('Error fetching tags:', error);
    return { industry: [], type: [] };
  }

  // DB에서 가져온 태그를 카테고리별로 분류
  const industry = data?.filter((t: any) => t.category === 'industry').map((t: any) => t.name) || [];
  const type = data?.filter((t: any) => t.category === 'type').map((t: any) => t.name) || [];

  return { industry, type };
};

export const addTag = async (name: string, category: 'industry' | 'type') => {
    const { error } = await supabase
        .from('tags')
        .insert([{ name, category }]);
    if(error) console.error('Error adding tag:', error);
};

export const renameTag = async (oldName: string, newName: string, category: string) => {
   // 1. 태그 테이블 이름 변경
   await supabase
     .from('tags')
     .update({ name: newName })
     .eq('name', oldName)
     .eq('category', category);
     
   // 2. (옵션) 기존 프로젝트들에 저장된 태그 이름도 업데이트 로직이 필요할 수 있음
   // 복잡성을 줄이기 위해 여기서는 태그 테이블만 수정합니다.
};

export const deleteTag = async (name: string, category: string) => {
    await supabase
        .from('tags')
        .delete()
        .eq('name', name)
        .eq('category', category);
};

// --- Storage (이미지 업로드) ---
// Admin 페이지에서 이미지를 업로드할 때 사용합니다.

export const uploadImage = async (file: File): Promise<string> => {
  // 파일명 중복 방지를 위해 랜덤 문자열 추가
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('works') // Supabase Storage 버킷 이름
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // 업로드된 이미지의 공개 URL 가져오기
  const { data } = supabase.storage
    .from('works')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
