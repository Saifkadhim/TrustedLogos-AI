import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Logo {
  id: string;
  name: string;
  type: string;
  industry: string;
  subcategory?: string;
  primaryColor: string;
  secondaryColor?: string;
  shape: string;
  information?: string;
  designerUrl?: string;
  imagePath?: string;
  imageUrl?: string;
  imageName?: string;
  fileSize?: number;
  fileType?: string;
  isPublic: boolean;
  downloads: number;
  likes: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLogoData {
  name: string;
  type: string;
  industry: string;
  subcategory?: string;
  primaryColor: string;
  secondaryColor?: string;
  shape: string;
  information?: string;
  designerUrl?: string;
  imageFile?: File;
  isPublic?: boolean;
}

export interface UpdateLogoData extends Partial<CreateLogoData> {
  id: string;
}

interface LogosContextType {
  logos: Logo[];
  loading: boolean;
  error: string | null;
  addLogo: (logoData: CreateLogoData) => Promise<Logo>;
  updateLogo: (logoData: UpdateLogoData) => Promise<Logo>;
  deleteLogo: (id: string) => Promise<void>;
  getLogo: (id: string) => Promise<Logo | null>;
  incrementDownloads: (id: string) => Promise<void>;
  incrementLikes: (id: string) => Promise<void>;
  searchLogos: (query: string) => Promise<Logo[]>;
  filterLogos: (filters: { industry?: string; type?: string; color?: string }) => Promise<Logo[]>;
  refreshLogos: () => Promise<void>;
}

const LogosContext = createContext<LogosContextType | undefined>(undefined);

export const useLogos = (): LogosContextType => {
  const ctx = useContext(LogosContext);
  if (!ctx) throw new Error('useLogos must be used within a LogoProvider');
  return ctx;
};

const STORAGE_BUCKET = 'logos';

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(false); // Start as false to prevent hanging
  const [error, setError] = useState<string | null>(null);

  // Helper function to get public URL for image
  const getImageUrl = (imagePath?: string): string | undefined => {
    if (!imagePath) return undefined;
    
    try {
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(imagePath);
      
      return publicUrl;
    } catch (error) {
      console.warn('Failed to get image URL:', error);
      return undefined;
    }
  };

  // Convert database row to Logo interface
  const mapDatabaseRowToLogo = (row: any): Logo => {
    const imageUrl = getImageUrl(row.image_path);
    
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      industry: row.industry,
      subcategory: row.subcategory,
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color,
      shape: row.shape,
      information: row.information,
      designerUrl: row.designer_url,
      imagePath: row.image_path,
      imageUrl: imageUrl,
      imageName: row.image_name,
      fileSize: row.file_size,
      fileType: row.file_type,
      isPublic: row.is_public,
      downloads: row.downloads,
      likes: row.likes,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  };

  // Safe fetch logos with timeout
  const fetchLogos = async (): Promise<Logo[]> => {
    try {
      console.log('🔍 Fetching logos from Supabase...');
      
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase error:', error.message);
        throw error;
      }
      
      const mappedLogos = data?.map(mapDatabaseRowToLogo) || [];
      console.log('✅ Successfully fetched', mappedLogos.length, 'logos');
      return mappedLogos;
    } catch (err) {
      console.error('❌ Error fetching logos:', err);
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  };

  // Load logos on mount with timeout protection
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const loadLogos = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Set a timeout to prevent hanging
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Logo loading timed out'));
          }, 10000); // 10 second timeout
        });
        
        const logoPromise = fetchLogos();
        
        // Race between fetch and timeout
        const logoData = await Promise.race([logoPromise, timeoutPromise]);
        
        if (mounted) {
          setLogos(logoData);
          console.log('✅ Logos loaded successfully');
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load logos';
          setError(errorMessage);
          console.warn('⚠️ Logo loading failed, continuing with empty array:', errorMessage);
          // Set empty array so app doesn't crash
          setLogos([]);
        }
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadLogos();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Simplified implementations for other methods
  const addLogo: LogosContextType['addLogo'] = async (logoData) => {
    throw new Error('Add logo not implemented in safe mode');
  };

  const updateLogo: LogosContextType['updateLogo'] = async (logoData) => {
    throw new Error('Update logo not implemented in safe mode');
  };

  const deleteLogo: LogosContextType['deleteLogo'] = async (id) => {
    throw new Error('Delete logo not implemented in safe mode');
  };

  const getLogo: LogosContextType['getLogo'] = async (id) => {
    return logos.find(logo => logo.id === id) || null;
  };

  const incrementDownloads: LogosContextType['incrementDownloads'] = async (id) => {
    console.log('Increment downloads called for:', id);
  };

  const incrementLikes: LogosContextType['incrementLikes'] = async (id) => {
    console.log('Increment likes called for:', id);
  };

  const searchLogos: LogosContextType['searchLogos'] = async (query) => {
    return logos.filter(logo => 
      logo.name.toLowerCase().includes(query.toLowerCase()) ||
      logo.industry.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterLogos: LogosContextType['filterLogos'] = async (filters) => {
    return logos.filter(logo => {
      if (filters.industry && logo.industry !== filters.industry) return false;
      if (filters.type && logo.type !== filters.type) return false;
      if (filters.color && logo.primaryColor !== filters.color) return false;
      return true;
    });
  };

  const refreshLogos: LogosContextType['refreshLogos'] = async () => {
    const logoData = await fetchLogos();
    setLogos(logoData);
  };

  const value: LogosContextType = {
    logos,
    loading,
    error,
    addLogo,
    updateLogo,
    deleteLogo,
    getLogo,
    incrementDownloads,
    incrementLikes,
    searchLogos,
    filterLogos,
    refreshLogos,
  };

  return (
    <LogosContext.Provider value={value}>
      {children}
    </LogosContext.Provider>
  );
};