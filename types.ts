export interface Project {
  id: string;
  category?: 'video' | 'design'; // [NEW] 비디오/디자인 구분용 카테고리 추가
  title: string;
  client: string;
  work_date: string;        // 실제 작업 시기 (YYYY-MM-DD) - 새로 추가됨
  vimeo_id?: string;        // Optional
  video_url?: string;       // Optional
  thumbnail_url?: string;   // Optional (DB에서 null일 경우 에러 방지)
  images: string[];
  industry_tags: string[];
  type_tags: string[];
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
  description?: string;     // Optional
}

export interface ContactForm {
  name: string;
  email: string;
  subject?: string;         // Optional (DB 스키마에 따라 선택 사항일 수 있음)
  budget?: string;          // Optional
  message: string;
}

export interface FilterState {
  industry: string[];
  type: string[];
}

export interface Popup {
  id?: string;
  title: string;
  content?: string;
  image_url?: string;
  link_url?: string;
  is_active: boolean;
  created_at?: string;
}
