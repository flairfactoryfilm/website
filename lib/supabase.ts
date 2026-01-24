// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Vite에서는 process.env 대신 import.meta.env를 써야 합니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 키가 없으면 아예 에러를 띄워서 개발자가 알 수 있게 합니다.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
