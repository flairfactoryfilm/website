import { supabase } from '../lib/supabase';
import { Project, ContactForm } from '../types';

// ==========================================
// 1. Projects (포트폴리오 작업물 관리)
// ==========================================

// 모든 프로젝트 가져오기 (작업 시기 최신순 정렬)
export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    // 변경됨: created_at -> work_date 기준으로 내림차순 정렬
    .order('work_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return data || [];
};

// 특정 ID의 프로젝트 가져오기 (상세 페이지용)
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

// 새 프로젝트 생성
export const createProject = async (project: Project) => {
  // DB에서 자동 생성되는 id와 created_at은 제외하고 전송
  const { id, created_at, ...newProject } = project;
  
  const { data, error } = await supabase
    .from('projects')
    .insert([newProject])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 기존 프로젝트 수정
export const updateProject = async (project: Project) => {
  const { error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', project.id);

  if (error) throw error;
};

// 프로젝트 삭제
export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};


// ==========================================
// 2. Contacts (문의하기 관리)
// ==========================================

// 모든 문의 내역 가져오기 (관리자용)
export const getContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// 새 문의 등록하기 (사용자용)
export const submitContact = async (form: ContactForm) => {
    const { error } = await supabase
        .from('contacts')
        .insert([form]);
        
    if (error) return { success: false, error: error.message };
    return { success: true };
};


// ==========================================
// 3. Tags (태그 관리)
// ==========================================

// 모든 태그 가져오기 (카테고리별 분류하여 반환)
export const getAllTags = async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('*');
    
  if (error) {
    console.error('Error fetching tags:', error);
    return { industry: [], type: [] };
  }

  // DB의 플랫한 데이터를 UI가 원하는 구조({ industry: [], type: [] })로 변환
  const industry = data?.filter((t: any) => t.category === 'industry').map((t: any) => t.name) || [];
  const type = data?.filter((t: any) => t.category === 'type').map((t: any) => t.name) || [];

  return { industry, type };
};

// 새 태그 추가
export const addTag = async (name: string, category: 'industry' | 'type') => {
    const { error } = await supabase
        .from('tags')
        .insert([{ name, category }]);
    
    if(error) console.error('Error adding tag:', error);
};

// 태그 이름 변경
export const renameTag = async (oldName: string, newName: string, category: string) => {
   // 태그 테이블에서 이름 변경
   await supabase
     .from('tags')
     .update({ name: newName })
     .eq('name', oldName)
     .eq('category', category);
};

// 태그 삭제
export const deleteTag = async (name: string, category: string) => {
    await supabase
        .from('tags')
        .delete()
        .eq('name', name)
        .eq('category', category);
};


// ==========================================
// 4. Storage (이미지 업로드)
// ==========================================

// 이미지 파일을 Supabase Storage에 업로드하고 공개 URL 반환
export const uploadImage = async (file: File): Promise<string> => {
  // 파일명 중복 방지를 위한 랜덤 접두사 생성
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `${fileName}`; 

  // 1. Storage 버킷('works')에 파일 업로드
  const { error: uploadError } = await supabase.storage
    .from('works') 
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // 2. 업로드된 파일의 공개 URL 가져오기
  const { data } = supabase.storage
    .from('works')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
