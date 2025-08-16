import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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

  // Convert Supabase user to our User type
  const convertSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      // Get user profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        fullName: profile?.full_name || '',
        company: profile?.company || undefined,
        role: profile?.role || 'user',
        avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=0066cc&color=fff`,
        createdAt: profile?.created_at || supabaseUser.created_at
      };
    } catch (error) {
      console.error('Error converting Supabase user:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
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
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // User state will be updated by the auth state change listener
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      // Validate admin code if admin signup
      if (data.role === 'admin' && data.adminCode !== 'TRUSTEDLOGOS2025') {
        throw new Error('Invalid admin code');
      }

      // First, try to sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
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

      if (authError) {
        throw new Error(authError.message);
      }

      // The profile creation is handled by the database trigger
      // If the trigger fails, the user is still created in auth.users
      console.log('User signup successful:', authData.user?.email);

      // Note: User will need to confirm email before they can sign in
    } catch (error) {
      console.error('Sign up error:', error);
      // Provide more user-friendly error messages
      if (error.message?.includes('Database error')) {
        throw new Error('Account created but profile setup incomplete. Please try signing in.');
      } else if (error.message?.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else {
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      
      // User state will be updated by the auth state change listener
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // The redirect will handle the rest of the authentication flow
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
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

      if (error) {
        throw new Error(error.message);
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithTempCredentials = async (role: 'admin' | 'user') => {
    // Create a temporary user object without Supabase session
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