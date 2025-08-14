import { supabase } from './supabase';

export const checkDatabaseConnection = async () => {
  try {
    console.log('🔍 Checking database connection...');
    
    // Check if environment variables are properly set
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('Environment variables:');
    console.log('- VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return {
        connected: false,
        error: error.message,
        details: error
      };
    }
    
    console.log('✅ Database connection successful');
    console.log('📊 Profiles table count:', data);
    
    // Test authentication status
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.warn('⚠️ Auth check failed:', authError);
    } else {
      console.log('🔐 Auth status:', session ? 'Authenticated' : 'Not authenticated');
    }
    
    return {
      connected: true,
      profilesCount: data,
      authStatus: session ? 'authenticated' : 'not_authenticated',
      user: session?.user || null
    };
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
};

// Auto-run the check when this module is imported
checkDatabaseConnection().then(result => {
  console.log('🏁 Database check result:', result);
});