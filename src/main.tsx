import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { LogoProvider } from './hooks/useLogos-safe';
import { AdminAuthProvider } from './hooks/useAdminAuth';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AdminAuthProvider>
        <LogoProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LogoProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </StrictMode>
);
