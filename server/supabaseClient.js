// Supabase Client Setup
import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

export function initSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in environment variables');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
}

export function getSupabase() {
  if (!supabaseInstance) {
    throw new Error('Supabase not initialized. Call initSupabase() first.');
  }
  return supabaseInstance;
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error) {
  if (error?.message) {
    return { message: error.message, code: error.code };
  }
  return { message: 'An unknown error occurred', code: 'UNKNOWN_ERROR' };
}
