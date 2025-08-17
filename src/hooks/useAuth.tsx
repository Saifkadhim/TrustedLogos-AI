import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-safe';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  fullName: string;
  company?: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  signInWithTempCredentials: (role: 'admin' | 'user') => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  company?: string;
  role: 'user' | 'admin';
  adminCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Supabase user to our User type (resilient if profiles table/row missing)
  const convertSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.warn('Profile fetch warning:', error.message);
      }

      const fullName = (profile?.full_name as string) || (supabaseUser.user_metadata?.full_name as string) || '';
      const company = (profile?.company as string) || undefined;
      const role = (profile?.role as 'user' | 'admin') || ((supabaseUser.user_metadata?.role as 'user' | 'admin') || 'user');
      const avatarUrl = (profile?.avatar_url as string) || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || (supabaseUser.email || 'User'))}&background=0066cc&color=fff`;

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        fullName,
        company,
        role,
        avatar: avatarUrl,
        createdAt: profile?.created_at || (supabaseUser.created_at as string),
      };
    } catch (error) {
      console.error('Error converting Supabase user:', error);
      // As a last resort, return a minimal user so UI stays functional
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        fullName: (supabaseUser.user_metadata?.full_name as string) || '',
        role: (supabaseUser.user_metadata?.role as 'user' | 'admin') || 'user',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email || 'User')}&background=0066cc&color=fff`,
        createdAt: (supabaseUser.created_at as string) || new Date().toISOString(),
      };
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        if (mounted) {
          setSession(initialSession);
          if (initialSession?.user) {
            const convertedUser = await convertSupabaseUser(initialSession.user);
            setUser(convertedUser);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        setSession(session);
        if (session?.user) {
          const convertedUser = await convertSupabaseUser(session.user);
          setUser(convertedUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      if (data.role === 'admin' && data.adminCode !== 'TRUSTEDLOGOS2025') {
        throw new Error('Invalid admin code');
      }
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            company: data.company || null,
            role: data.role,
          }
        }
      });
      if (authError) throw new Error(authError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` }
      });
      if (error) throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          company: data.company,
          avatar_url: data.avatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      if (error) throw new Error(error.message);
      setUser(prev => prev ? { ...prev, ...data } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithTempCredentials = async (role: 'admin' | 'user') => {
    const tempUser: User = {
      id: `temp-${role}-${Date.now()}`,
      email: role === 'admin' ? 'admin@example.com' : 'user@example.com',
      fullName: role === 'admin' ? 'Temp Admin' : 'Temp User',
      role,
      createdAt: new Date().toISOString()
    };
    setUser(tempUser);
    setSession(null);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    updateProfile,
    signInWithTempCredentials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};