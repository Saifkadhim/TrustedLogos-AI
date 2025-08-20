import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseUrl = typeof rawSupabaseUrl === 'string' ? rawSupabaseUrl.trim() : ''
let supabaseAnonKey = typeof rawSupabaseAnonKey === 'string' ? rawSupabaseAnonKey.trim() : ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using placeholder values. Please update your .env file with actual Supabase credentials.')
}

const isValidUrl = /^https?:\/\/[\w.-]+\.supabase\.co\/?$/i.test(supabaseUrl)

if (!isValidUrl) {
  console.warn('Invalid VITE_SUPABASE_URL format. Falling back to placeholder URL (https://placeholder.supabase.co).')
  supabaseUrl = 'https://placeholder.supabase.co'
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('Invalid VITE_SUPABASE_ANON_KEY. Using placeholder key.')
  supabaseAnonKey = 'placeholder-key'
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