import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export let supabase = null;

if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log('✅ Supabase client initialized');
    } catch (error) {
        console.warn('⚠️ Supabase initialization failed:', error.message);
    }
} else {
    console.warn('⚠️ Supabase credentials not found or invalid. Frontend will run without data integration.');
}
