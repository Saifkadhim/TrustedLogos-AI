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

  // Helper function to upload image to Supabase Storage
  const uploadImage = async (file: File, logoName: string): Promise<{ path: string; url: string }> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${logoName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
    const filePath = `originals/${fileName}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return { path: filePath, url: publicUrl };
  };

  // Helper function to delete image from storage
  const deleteImage = async (imagePath: string): Promise<void> => {
    if (!imagePath) return;
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([imagePath]);
    
    if (error) console.warn('Failed to delete image:', error);
  };

  // Full implementations of CRUD operations
  const addLogo: LogosContextType['addLogo'] = async (logoData) => {
    try {
      setError(null);
      
      // Upload image if provided
      let imagePath: string | undefined;
      let imageUrl: string | undefined;
      
      if (logoData.imageFile) {
        const uploadResult = await uploadImage(logoData.imageFile, logoData.name);
        imagePath = uploadResult.path;
        imageUrl = uploadResult.url;
      }

      // Insert logo record (only include subcategory if it exists)
      const insertData: any = {
        name: logoData.name,
        type: logoData.type,
        industry: logoData.industry,
        primary_color: logoData.primaryColor,
        secondary_color: logoData.secondaryColor,
        shape: logoData.shape,
        information: logoData.information,
        designer_url: logoData.designerUrl,
        image_path: imagePath,
        image_name: logoData.imageFile?.name,
        file_size: logoData.imageFile?.size,
        file_type: logoData.imageFile?.type,
        is_public: logoData.isPublic ?? true,
      };
      
      // Only add subcategory if it exists (for backward compatibility)
      if (logoData.subcategory) {
        insertData.subcategory = logoData.subcategory;
      }

      const { data, error } = await supabase
        .from('logos')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      const newLogo = mapDatabaseRowToLogo(data);
      setLogos(prev => [newLogo, ...prev]);
      return newLogo;
    } catch (err) {
      // Clean up uploaded image if database insert failed
      if (logoData.imageFile) {
        try {
          await deleteImage(logoData.imageFile.name);
        } catch {}
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to add logo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateLogo: LogosContextType['updateLogo'] = async (logoData) => {
    try {
      setError(null);
      
      const existingLogo = logos.find(l => l.id === logoData.id);
      if (!existingLogo) throw new Error('Logo not found');

      // Upload new image if provided
      let imagePath = existingLogo.imagePath;
      let imageUrl = existingLogo.imageUrl;
      
      if (logoData.imageFile) {
        // Delete old image
        if (existingLogo.imagePath) {
          await deleteImage(existingLogo.imagePath);
        }
        
        // Upload new image
        const uploadResult = await uploadImage(logoData.imageFile, logoData.name || existingLogo.name);
        imagePath = uploadResult.path;
        imageUrl = uploadResult.url;
      }

      // Update logo record
      const updateData: any = {};
      if (logoData.name !== undefined) updateData.name = logoData.name;
      if (logoData.type !== undefined) updateData.type = logoData.type;
      if (logoData.industry !== undefined) updateData.industry = logoData.industry;
      // Only update subcategory if the column exists in the database
      if (logoData.subcategory !== undefined) {
        try {
          updateData.subcategory = logoData.subcategory;
        } catch (e) {
          console.warn('Subcategory column may not exist yet, skipping...');
        }
      }
      if (logoData.primaryColor !== undefined) updateData.primary_color = logoData.primaryColor;
      if (logoData.secondaryColor !== undefined) updateData.secondary_color = logoData.secondaryColor;
      if (logoData.shape !== undefined) updateData.shape = logoData.shape;
      if (logoData.information !== undefined) updateData.information = logoData.information;
      if (logoData.designerUrl !== undefined) updateData.designer_url = logoData.designerUrl;
      if (logoData.isPublic !== undefined) updateData.is_public = logoData.isPublic;
      
      if (logoData.imageFile) {
        updateData.image_path = imagePath;
        updateData.image_name = logoData.imageFile.name;
        updateData.file_size = logoData.imageFile.size;
        updateData.file_type = logoData.imageFile.type;
      }

      const { data, error } = await supabase
        .from('logos')
        .update(updateData)
        .eq('id', logoData.id)
        .select()
        .single();

      if (error) throw error;

      const updatedLogo = mapDatabaseRowToLogo(data);
      setLogos(prev => prev.map(l => l.id === logoData.id ? updatedLogo : l));
      return updatedLogo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update logo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteLogo: LogosContextType['deleteLogo'] = async (id) => {
    try {
      setError(null);
      
      const existingLogo = logos.find(l => l.id === id);
      if (!existingLogo) throw new Error('Logo not found');

      // Delete from database first
      const { error } = await supabase
        .from('logos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete image from storage
      if (existingLogo.imagePath) {
        await deleteImage(existingLogo.imagePath);
      }

      // Update local state
      setLogos(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete logo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
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