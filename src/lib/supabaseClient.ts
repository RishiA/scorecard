import { createClient } from '@supabase/supabase-js';

// These vars come from the .env.local file and are publicly accessible
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Public (anon) client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
