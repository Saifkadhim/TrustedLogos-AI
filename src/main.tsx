import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { LogoProvider } from './hooks/useLogos-safe';
import { AdminAuthProvider } from './hooks/useAdminAuth';
import { ColorPalettesProvider } from './hooks/useColorPalettes';
import { FontsProvider } from './hooks/useFonts';
import { AIVisibilityProvider } from './hooks/useAIVisibility';
import ErrorBoundary from './ErrorBoundary';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AdminAuthProvider>
          <LogoProvider>
            <ColorPalettesProvider>
              <FontsProvider>
                <AIVisibilityProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </AIVisibilityProvider>
              </FontsProvider>
            </ColorPalettesProvider>
          </LogoProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
