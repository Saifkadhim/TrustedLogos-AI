import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  currentUsername: string | null;
  ownerVerified: boolean;
  verifyOwner: (code: string) => Promise<boolean>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const SESSION_KEY = 'trustedlogos.adminSession.v1';
const OWNER_VERIFIED_KEY = 'trustedlogos.ownerVerified.v1';

export const useAdminAuth = (): AdminAuthContextType => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [ownerVerified, setOwnerVerified] = useState<boolean>(false);

  // Get admin credentials from environment (robust against undefined)
  const adminUsername = (import.meta.env.VITE_ADMIN_USERNAME ?? '').toString().trim();
  const adminPassword = (import.meta.env.VITE_ADMIN_PASSWORD ?? '').toString().trim();

  useEffect(() => {
    try {
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (rawSession) {
        const sessionUser = JSON.parse(rawSession);
        // Verify the stored session is still valid
        if (sessionUser === adminUsername) {
          setCurrentUsername(sessionUser);
        }
      }
      const rawOwner = sessionStorage.getItem(OWNER_VERIFIED_KEY);
      if (rawOwner) setOwnerVerified(JSON.parse(rawOwner));
    } catch {}
  }, [adminUsername]);

  useEffect(() => {
    try { 
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUsername)); 
    } catch {}
  }, [currentUsername]);

  useEffect(() => {
    try { 
      sessionStorage.setItem(OWNER_VERIFIED_KEY, JSON.stringify(ownerVerified)); 
    } catch {}
  }, [ownerVerified]);

  const verifyOwner: AdminAuthContextType['verifyOwner'] = async (code) => {
    const ownerCode = (import.meta.env.VITE_OWNER_CODE?.toString() || '').trim();
    const provided = (code || '').trim();
    const ok = !!ownerCode && provided === ownerCode;
    setOwnerVerified(ok);
    return ok;
  };

  const signIn: AdminAuthContextType['signIn'] = async (username, password) => {
    const providedUsername = (username || '').trim();
    const providedPassword = (password || '').trim();
    
    // Check against environment variables
    if (!adminUsername || !adminPassword) {
      throw new Error('Admin credentials not configured. Please set VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD in your .env file.');
    }
    
    if (providedUsername !== adminUsername || providedPassword !== adminPassword) {
      throw new Error('Invalid credentials');
    }
    
    setCurrentUsername(adminUsername);
  };

  const signOut = () => {
    setCurrentUsername(null);
    setOwnerVerified(false);
  };

  const value = useMemo(() => ({
    isAuthenticated: !!currentUsername,
    currentUsername,
    ownerVerified,
    verifyOwner,
    signIn,
    signOut,
  }), [currentUsername, ownerVerified, adminUsername]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};