import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface StoredLogo {
  id: string;
  name: string;
  color: string;
  imageDataUrl?: string;
  createdAt: string;
}

interface LogosContextType {
  logos: StoredLogo[];
  addLogo: (logo: Omit<StoredLogo, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void;
  removeLogo: (id: string) => void;
  clearAll: () => void;
}

const LogosContext = createContext<LogosContextType | undefined>(undefined);

export const useLogos = (): LogosContextType => {
  const ctx = useContext(LogosContext);
  if (!ctx) throw new Error('useLogos must be used within a LogoProvider');
  return ctx;
};

const STORAGE_KEY = 'trustedlogos.logos.v1';

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logos, setLogos] = useState<StoredLogo[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLogos(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logos));
    } catch {}
  }, [logos]);

  const addLogo: LogosContextType['addLogo'] = (logo) => {
    const id = logo.id || `logo-${Date.now()}`;
    const createdAt = logo.createdAt || new Date().toISOString();
    const newLogo: StoredLogo = {
      id,
      name: logo.name,
      color: logo.color || '#000000',
      imageDataUrl: logo.imageDataUrl,
      createdAt
    };
    setLogos((prev) => [newLogo, ...prev]);
  };

  const removeLogo = (id: string) => {
    setLogos((prev) => prev.filter((l) => l.id !== id));
  };

  const clearAll = () => setLogos([]);

  const value = useMemo(() => ({ logos, addLogo, removeLogo, clearAll }), [logos]);

  return <LogosContext.Provider value={value}>{children}</LogosContext.Provider>;
};