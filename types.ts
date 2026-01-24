export interface Project {
  id: string;
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
