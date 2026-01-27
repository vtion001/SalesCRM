import { createClient } from '@supabase/supabase-js';

// Debug logging
console.log('Supabase Environment Check:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY_EXISTS: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  MODE: import.meta.env.MODE
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Available env:', import.meta.env);
  throw new Error('Missing Supabase credentials in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
