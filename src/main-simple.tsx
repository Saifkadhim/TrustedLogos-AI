import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

console.log('🚀 Simple main.tsx starting...');

// Simple test component
const SimpleApp = () => {
  console.log('✅ SimpleApp rendering');
  
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>
        🎉 TrustedLogos - Basic Version Working!
      </h1>
      
      <div style={{ 
        background: '#f0f9ff', 
        padding: '20px', 
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #0ea5e9'
      }}>
        <h2 style={{ color: '#0c4a6e', margin: '0 0 10px 0' }}>✅ Status: React App is Running</h2>
        <p style={{ margin: '0', color: '#075985' }}>
          This simplified version confirms that React is working properly.
          If you can see this, the issue is likely in one of the complex components.
        </p>
      </div>
      
      <div style={{ 
        background: '#fef3c7', 
        padding: '15px', 
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #f59e0b'
      }}>
        <h3 style={{ color: '#92400e', margin: '0 0 10px 0' }}>🔧 Troubleshooting</h3>
        <ul style={{ color: '#b45309', margin: '0', paddingLeft: '20px' }}>
          <li>React: ✅ Working</li>
          <li>Router: ✅ Working</li>
          <li>Environment: ✅ Working</li>
          <li>Supabase: Testing...</li>
        </ul>
      </div>
      
      <div style={{ 
        background: '#ecfdf5', 
        padding: '15px', 
        borderRadius: '6px',
        border: '1px solid #10b981'
      }}>
        <h3 style={{ color: '#047857', margin: '0 0 10px 0' }}>🎯 Next Steps</h3>
        <ol style={{ color: '#065f46', margin: '0', paddingLeft: '20px' }}>
          <li>Visit the <a href="/diagnostic.html" style={{ color: '#059669' }}>diagnostic page</a> for detailed tests</li>
          <li>Check browser console (F12) for any error messages</li>
          <li>Try hard refresh (Ctrl+F5) on the main app</li>
          <li>Test the main app: <a href="/" style={{ color: '#059669' }}>http://127.0.0.1:5175/</a></li>
        </ol>
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'center', color: '#6b7280' }}>
        <small>Simple test version • Port: 5175</small>
      </div>
    </div>
  );
};

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('✅ Root element found');
  
  const root = createRoot(rootElement);
  console.log('✅ React root created');
  
  root.render(
    <StrictMode>
      <BrowserRouter>
        <SimpleApp />
      </BrowserRouter>
    </StrictMode>
  );
  
  console.log('✅ Simple app rendered successfully');
  
} catch (error) {
  console.error('❌ Error in simple main:', error);
  
  // Fallback error display
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; color: #dc2626; background: #fef2f2; margin: 20px; border-radius: 8px; border: 1px solid #fecaca;">
        <h1>❌ Simple React App Failed</h1>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>This indicates a fundamental React setup issue.</p>
      </div>
    `;
  }
}