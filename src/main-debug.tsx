import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

console.log('🚀 Debug main.tsx starting...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('✅ Root element found');
  
  const root = createRoot(rootElement);
  console.log('✅ React root created');
  
  // Test 1: Simple component
  const TestComponent = () => {
    console.log('✅ TestComponent rendering');
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🎉 React App is Working!</h1>
        <p>This is a debug version to test if React is loading properly.</p>
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
          <strong>Status:</strong> React components are rendering successfully
        </div>
      </div>
    );
  };
  
  root.render(
    <StrictMode>
      <TestComponent />
    </StrictMode>
  );
  
  console.log('✅ Initial render complete');
  
  // Test 2: Try loading industry categories after 2 seconds
  setTimeout(async () => {
    try {
      console.log('🔍 Testing industry categories import...');
      const { INDUSTRY_CATEGORIES } = await import('./utils/industryCategories');
      console.log('✅ Industry categories loaded:', INDUSTRY_CATEGORIES.length, 'categories');
      
      // Test 3: Try loading Supabase client
      setTimeout(async () => {
        try {
          console.log('🔍 Testing Supabase client import...');
          const { supabase } = await import('./lib/supabase-safe');
          console.log('✅ Supabase client loaded successfully');
          
          // Update the UI to show success
          const UpdatedComponent = () => (
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
              <h1>🎉 React App is Working!</h1>
              <p>This is a debug version to test if React is loading properly.</p>
              <div style={{ background: '#d4edda', padding: '10px', margin: '10px 0', color: '#155724' }}>
                <strong>✅ Status:</strong> All core modules loaded successfully!
              </div>
              <ul>
                <li>✅ React rendering</li>
                <li>✅ Industry categories ({INDUSTRY_CATEGORIES.length} categories)</li>
                <li>✅ Supabase client initialized</li>
              </ul>
              <div style={{ background: '#fff3cd', padding: '10px', margin: '10px 0', color: '#856404' }}>
                <strong>Next:</strong> The main app should work now. Try refreshing to load the full app.
              </div>
            </div>
          );
          
          root.render(
            <StrictMode>
              <UpdatedComponent />
            </StrictMode>
          );
          
        } catch (supabaseError) {
          console.error('❌ Supabase client error:', supabaseError);
          
          const ErrorComponent = () => (
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
              <h1>⚠️ Partial Success</h1>
              <div style={{ background: '#f8d7da', padding: '10px', margin: '10px 0', color: '#721c24' }}>
                <strong>❌ Issue:</strong> Supabase client failed to load
              </div>
              <p>Error: {supabaseError.message}</p>
              <ul>
                <li>✅ React rendering</li>
                <li>✅ Industry categories</li>
                <li>❌ Supabase client</li>
              </ul>
            </div>
          );
          
          root.render(
            <StrictMode>
              <ErrorComponent />
            </StrictMode>
          );
        }
      }, 1000);
      
    } catch (categoriesError) {
      console.error('❌ Industry categories error:', categoriesError);
      
      const ErrorComponent = () => (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1>⚠️ Partial Success</h1>
          <div style={{ background: '#f8d7da', padding: '10px', margin: '10px 0', color: '#721c24' }}>
            <strong>❌ Issue:</strong> Industry categories failed to load
          </div>
          <p>Error: {categoriesError.message}</p>
        </div>
      );
      
      root.render(
        <StrictMode>
          <ErrorComponent />
        </StrictMode>
      );
    }
  }, 2000);
  
} catch (error) {
  console.error('❌ Critical error in main-debug.tsx:', error);
  
  // Fallback: show error in the page
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; color: #721c24; background: #f8d7da; margin: 20px; border-radius: 4px;">
        <h1>❌ React App Failed to Load</h1>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Check the browser console for more details.</p>
      </div>
    `;
  }
}