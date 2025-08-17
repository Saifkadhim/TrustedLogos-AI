import { supabase } from '../lib/supabase-safe';

/**
 * Debug utility to check Supabase connection and permissions
 */
export async function debugSupabaseConnection() {
  console.log('🔍 Debugging Supabase Connection...');
  
  try {
    // Check if Supabase client is initialized
    console.log('✅ Supabase client initialized');
    console.log('📍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔑 Anon Key configured:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Check current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('👤 Current user:', user ? `${user.email} (${user.id})` : 'Not authenticated');
    
    if (userError) {
      console.error('❌ Auth error:', userError);
    }
    
    // Test database connection
    const { data, error } = await supabase
      .from('logos')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection error:', error);
      
      // Check specific error types
      if (error.message.includes('row-level security')) {
        console.log('🔒 RLS Error detected. Solutions:');
        console.log('1. Run: ALTER TABLE logos DISABLE ROW LEVEL SECURITY;');
        console.log('2. Or authenticate as admin user');
        console.log('3. Or update RLS policies');
      }
      
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('📋 Table not found. Run the migration:');
        console.log('- Go to Supabase Dashboard → SQL Editor');
        console.log('- Run the create_logos_table.sql migration');
      }
      
      return false;
    } else {
      console.log('✅ Database connection successful');
      console.log('📊 Logos table accessible');
      return true;
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return false;
  }
}

/**
 * Test logo insertion with detailed error reporting
 */
export async function testLogoInsertion() {
  console.log('🧪 Testing logo insertion...');
  
  const testLogo = {
    name: 'Test Logo',
    type: 'Wordmarks',
    industry: 'Technology',
    primary_color: '#000000',
    secondary_color: '#ffffff',
    shape: 'rectangle',
    information: 'This is a test logo for debugging',
    is_public: true,
  };
  
  const { data, error } = await supabase
    .from('logos')
    .insert(testLogo)
    .select()
    .single();
  
  if (error) {
    console.error('❌ Logo insertion failed:', error);
    
    // Specific error handling
    if (error.code === '42501') {
      console.log('🔒 Permission denied - RLS policy issue');
      console.log('💡 Quick fix: ALTER TABLE logos DISABLE ROW LEVEL SECURITY;');
    }
    
    return false;
  } else {
    console.log('✅ Logo insertion successful:', data);
    
    // Clean up test logo
    await supabase.from('logos').delete().eq('id', data.id);
    console.log('🧹 Test logo cleaned up');
    
    return true;
  }
}

/**
 * Test storage bucket access
 */
export async function testStorageAccess() {
  console.log('📁 Testing storage access...');
  
  try {
    const { data, error } = await supabase.storage
      .from('logos')
      .list('', { limit: 1 });
    
    if (error) {
      console.error('❌ Storage access failed:', error);
      
      if (error.message.includes('not found')) {
        console.log('📋 Storage bucket not found. Create it:');
        console.log('1. Go to Supabase Dashboard → Storage');
        console.log('2. Create bucket named "logos"');
        console.log('3. Make it public');
      }
      
      return false;
    } else {
      console.log('✅ Storage access successful');
      return true;
    }
  } catch (error) {
    console.error('💥 Storage test error:', error);
    return false;
  }
}

/**
 * Run all debug tests
 */
export async function runAllDebugTests() {
  console.log('🚀 Running Supabase Debug Tests...\n');
  
  const results = {
    connection: await debugSupabaseConnection(),
    insertion: await testLogoInsertion(),
    storage: await testStorageAccess(),
  };
  
  console.log('\n📊 Debug Results:');
  console.log('- Connection:', results.connection ? '✅' : '❌');
  console.log('- Logo Insertion:', results.insertion ? '✅' : '❌');
  console.log('- Storage Access:', results.storage ? '✅' : '❌');
  
  const allPassed = Object.values(results).every(Boolean);
  console.log(`\n${allPassed ? '🎉' : '⚠️'} Overall Status: ${allPassed ? 'All tests passed!' : 'Some tests failed'}`);
  
  return results;
}