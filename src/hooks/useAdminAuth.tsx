import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AdminAccount {
  username: string;
  passwordHash: string;
  createdAt: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  currentUsername: string | null;
  admins: AdminAccount[];
  noAdmins: boolean;
  ownerVerified: boolean;
  verifyOwner: (code: string) => Promise<boolean>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  addAdmin: (username: string, password: string) => Promise<void>;
  removeAdmin: (username: string) => void;
  changePassword: (username: string, newPassword: string) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMINS_KEY = 'trustedlogos.admins.v1';
const SESSION_KEY = 'trustedlogos.adminSession.v1';
const OWNER_VERIFIED_KEY = 'trustedlogos.ownerVerified.v1';

async function hashPassword(input: string): Promise<string> {
  if (window && window.crypto && window.crypto.subtle) {
    const enc = new TextEncoder();
    const data = enc.encode(input);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    const bytes = Array.from(new Uint8Array(hash));
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return `plain:${input}`;
}

export const useAdminAuth = (): AdminAuthContextType => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [ownerVerified, setOwnerVerified] = useState<boolean>(false);

  useEffect(() => {
    try {
      const rawAdmins = localStorage.getItem(ADMINS_KEY);
      if (rawAdmins) setAdmins(JSON.parse(rawAdmins));
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (rawSession) setCurrentUsername(JSON.parse(rawSession));
      const rawOwner = sessionStorage.getItem(OWNER_VERIFIED_KEY);
      if (rawOwner) setOwnerVerified(JSON.parse(rawOwner));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(ADMINS_KEY, JSON.stringify(admins)); } catch {}
  }, [admins]);

  useEffect(() => {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(currentUsername)); } catch {}
  }, [currentUsername]);

  useEffect(() => {
    try { sessionStorage.setItem(OWNER_VERIFIED_KEY, JSON.stringify(ownerVerified)); } catch {}
  }, [ownerVerified]);

  const verifyOwner: AdminAuthContextType['verifyOwner'] = async (code) => {
    const ownerCode = import.meta.env.VITE_OWNER_CODE?.toString() || '';
    // Compare hashed values so we never store plain text in memory longer than needed
    const given = await hashPassword(code);
    const expected = ownerCode ? await hashPassword(ownerCode) : '';
    const ok = !!ownerCode && given === expected;
    setOwnerVerified(ok);
    return ok;
  };

  const signIn: AdminAuthContextType['signIn'] = async (username, password) => {
    const found = admins.find(a => a.username === username);
    if (!found) throw new Error('Invalid credentials');
    const pw = await hashPassword(password);
    if (found.passwordHash !== pw) throw new Error('Invalid credentials');
    setCurrentUsername(username);
  };

  const signOut = () => setCurrentUsername(null);

  const addAdmin: AdminAuthContextType['addAdmin'] = async (username, password) => {
    if (!ownerVerified) throw new Error('Owner verification required');
    if (!username || !password) throw new Error('Username and password are required');
    if (admins.some(a => a.username === username)) throw new Error('Username already exists');
    const passwordHash = await hashPassword(password);
    const newAdmin: AdminAccount = { username, passwordHash, createdAt: new Date().toISOString() };
    setAdmins(prev => [newAdmin, ...prev]);
  };

  const removeAdmin: AdminAuthContextType['removeAdmin'] = (username) => {
    if (!ownerVerified) throw new Error('Owner verification required');
    setAdmins(prev => prev.filter(a => a.username !== username));
    if (currentUsername === username) setCurrentUsername(null);
  };

  const changePassword: AdminAuthContextType['changePassword'] = async (username, newPassword) => {
    if (!ownerVerified) throw new Error('Owner verification required');
    const hash = await hashPassword(newPassword);
    setAdmins(prev => prev.map(a => a.username === username ? { ...a, passwordHash: hash } : a));
  };

  const value = useMemo(() => ({
    isAuthenticated: !!currentUsername,
    currentUsername,
    admins,
    noAdmins: admins.length === 0,
    ownerVerified,
    verifyOwner,
    signIn,
    signOut,
    addAdmin,
    removeAdmin,
    changePassword,
  }), [admins, currentUsername, ownerVerified]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};