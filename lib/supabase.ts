import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Automatically refresh tokens before they expire
    autoRefreshToken: true,
    // Persist session in localStorage (survives browser refresh)
    persistSession: true,
    // Detect session in URL (for email confirmations, password resets)
    detectSessionInUrl: true,
    // Use localStorage instead of sessionStorage for longer persistence
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    // Custom storage key to avoid conflicts
    storageKey: 'edumynt-auth-token',
    // Flow type for better security
    flowType: 'pkce'
  }
});

// Add session refresh listener
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Session refreshed successfully');
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      // Clear any cached data if needed
      localStorage.removeItem('edumynt-user-data');
    } else if (event === 'SIGNED_IN') {
      console.log('User signed in');
    }
  });
}