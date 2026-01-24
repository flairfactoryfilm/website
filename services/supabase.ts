import { createClient } from '@supabase/supabase-js';

// Note: In a real environment, these are pulled from process.env
// We provide fallbacks to ensure the app doesn't crash in this generated preview if keys aren't set.
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// We only initialize the real client if keys are present
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = !!supabase;