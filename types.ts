export interface Project {
  id: string;
  title: string;
  client: string;
  vimeo_id?: string;
  video_url?: string;
  thumbnail_url: string;
  images: string[]; // Array of image URLs for the gallery
  industry_tags: string[];
  type_tags: string[];
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
  description?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  budget: string;
  message: string;
}

export interface FilterState {
  industry: string[];
  type: string[];
}