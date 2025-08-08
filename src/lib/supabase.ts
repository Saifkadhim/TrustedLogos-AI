import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Validate that we have proper Supabase credentials
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Using placeholder values. Please update your .env file with actual Supabase credentials.')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  console.error('Invalid VITE_SUPABASE_URL format. Please ensure it is a valid URL (e.g., https://your-project-id.supabase.co)')
  throw new Error('Invalid Supabase URL format')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (will be auto-generated later)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          company: string | null
          role: 'user' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          company?: string | null
          role?: 'user' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          company?: string | null
          role?: 'user' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}