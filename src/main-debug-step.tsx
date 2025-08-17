import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

console.log('🚀 Step-by-step debug main.tsx starting...');

const DebugApp = () => {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [components, setComponents] = useState<any>({});

  const steps = [
    { name: 'Basic React', component: null },
    { name: 'Router Setup', component: null },
    { name: 'Supabase Client', component: null },
    { name: 'Industry Categories', component: null },
    { name: 'Auth Hooks', component: null },
    { name: 'Logo Hooks', component: null },
    { name: 'Main App Component', component: null }
  ];

  useEffect(() => {
    const loadNextStep = async () => {
      try {
        console.log(`🔍 Loading step ${step}: ${steps[step]?.name}`);
        
        switch (step) {
          case 0:
            // Basic React - already working
            setTimeout(() => setStep(1), 1000);
            break;
            
          case 1:
            // Router - already loaded
            setTimeout(() => setStep(2), 1000);
            break;
            
          case 2:
            // Load Supabase client
            const supabaseModule = await import('./lib/supabase');
            setComponents(prev => ({ ...prev, supabase: supabaseModule }));
            console.log('✅ Supabase client loaded');
            setTimeout(() => setStep(3), 1000);
            break;
            
          case 3:
            // Load industry categories
            const categoriesModule = await import('./utils/industryCategories');
            setComponents(prev => ({ ...prev, categories: categoriesModule }));
            console.log('✅ Industry categories loaded:', categoriesModule.INDUSTRY_CATEGORIES.length);
            setTimeout(() => setStep(4), 1000);
            break;
            
          case 4:
            // Load auth hooks
            const authModule = await import('./hooks/useAuth');
            setComponents(prev => ({ ...prev, auth: authModule }));
            console.log('✅ Auth hooks loaded');
            setTimeout(() => setStep(5), 1000);
            break;
            
          case 5:
            // Load logo hooks
            const logoModule = await import('./hooks/useLogos');
            setComponents(prev => ({ ...prev, logos: logoModule }));
            console.log('✅ Logo hooks loaded');
            setTimeout(() => setStep(6), 1000);
            break;
            
          case 6:
            // Load main app
            const appModule = await import('./App');
            setComponents(prev => ({ ...prev, app: appModule }));
            console.log('✅ Main App component loaded');
            
            // Try to render the actual app after a delay
            setTimeout(() => {
              console.log('🎯 All components loaded successfully! Attempting to render full app...');
              setStep(7);
            }, 2000);
            break;
            
          case 7:
            // Full app loaded - this should trigger the actual app
            break;
            
          default:
            break;
        }
      } catch (err) {
        console.error(`❌ Error in step ${step}:`, err);
        setError(`Step ${step} (${steps[step]?.name}): ${err.message}`);
      }
    };

    if (step < 7) {
      loadNextStep();
    }
  }, [step]);

  if (step === 7 && !error) {
    // Render the actual app
    const { AuthProvider } = components.auth;
    const { LogoProvider } = components.logos;
    const { AdminAuthProvider } = components.auth;
    const AppComponent = components.app.default;
    
    try {
      return (
        <AuthProvider>
          <AdminAuthProvider>
            <LogoProvider>
              <BrowserRouter>
                <AppComponent />
              </BrowserRouter>
            </LogoProvider>
          </AdminAuthProvider>
        </AuthProvider>
      );
    } catch (renderError) {
      console.error('❌ Render error:', renderError);
      setError(`Render error: ${renderError.message}`);
    }
  }

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
      <h1 style={{ color: '#2563eb', marginBottom: '30px' }}>
        🔍 TrustedLogos Step-by-Step Loading
      </h1>
      
      {error ? (
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #fecaca',
          padding: '20px', 
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>❌ Error Detected</h3>
          <p style={{ color: '#b91c1c', margin: '0' }}>{error}</p>
          <p style={{ color: '#7f1d1d', fontSize: '14px', marginTop: '10px' }}>
            This is the component causing the blinking issue!
          </p>
        </div>
      ) : (
        <div style={{ 
          background: '#f0f9ff', 
          padding: '20px', 
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#0c4a6e', margin: '0 0 15px 0' }}>
            Loading Progress: {step + 1} / {steps.length}
          </h3>
          
          {steps.map((stepInfo, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '8px',
              color: index < step ? '#059669' : index === step ? '#0ea5e9' : '#6b7280'
            }}>
              <span style={{ marginRight: '10px', fontSize: '16px' }}>
                {index < step ? '✅' : index === step ? '🔄' : '⏳'}
              </span>
              <span>{stepInfo.name}</span>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ 
        background: '#fef3c7', 
        padding: '15px', 
        borderRadius: '6px',
        border: '1px solid #f59e0b'
      }}>
        <h4 style={{ color: '#92400e', margin: '0 0 10px 0' }}>🎯 Purpose</h4>
        <p style={{ color: '#b45309', margin: '0', fontSize: '14px' }}>
          This debug version loads each component step-by-step to identify exactly which one 
          is causing the blinking issue. Once we find it, we can fix the specific problem.
        </p>
      </div>
    </div>
  );
};

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <DebugApp />
    </StrictMode>
  );
  
  console.log('✅ Debug app started successfully');
  
} catch (error) {
  console.error('❌ Critical error in debug main:', error);
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; color: #dc2626; background: #fef2f2; margin: 20px; border-radius: 8px;">
        <h1>❌ Debug App Failed to Start</h1>
        <p><strong>Error:</strong> ${error.message}</p>
      </div>
    `;
  }
}