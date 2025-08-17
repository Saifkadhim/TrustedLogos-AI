import { createClient } from '@supabase/supabase-js'

// Safe Supabase client that won't crash the app if env vars are missing
let supabaseUrl = 'https://placeholder.supabase.co'
let supabaseAnonKey = 'placeholder-key'

try {
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'
  
  // Validate URL format only if it's not the placeholder
  if (supabaseUrl !== 'https://placeholder.supabase.co') {
    new URL(supabaseUrl)
  }
  
  console.log('✅ Supabase config loaded:', { 
    url: supabaseUrl.substring(0, 30) + '...', 
    hasKey: !!supabaseAnonKey 
  })
} catch (error) {
  console.warn('⚠️ Supabase config issue, using placeholders:', error.message)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

console.log('✅ Supabase client created successfully')