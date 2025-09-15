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
  totalLogos: number;
  currentPage: number;
  hasMore: boolean;
  pageSize: number;
  isLoadingMore: boolean;
  loadedPages: Set<number>;
  addLogo: (logoData: CreateLogoData) => Promise<Logo>;
  updateLogo: (logoData: UpdateLogoData) => Promise<Logo>;
  deleteLogo: (id: string) => Promise<void>;
  getLogo: (id: string) => Promise<Logo | null>;
  incrementDownloads: (id: string) => Promise<void>;
  incrementLikes: (id: string) => Promise<void>;
  searchLogos: (query: string) => Promise<Logo[]>;
  filterLogos: (filters: { industry?: string; type?: string; color?: string }) => Promise<Logo[]>;
  refreshLogos: () => Promise<void>;
  loadMoreLogos: () => Promise<void>;
  getTotalLogoCount: () => Promise<number>;
  fetchAllLogos: () => Promise<Logo[]>;
  // Server-side filtering functions
  fetchLogosWithFilters: (filters: LogoFilters, page: number, pageSize: number) => Promise<{ logos: Logo[]; total: number; hasMore: boolean }>;
  getLogosWithServerSideFiltering: (filters: LogoFilters, page: number, pageSize: number) => Promise<{ logos: Logo[]; total: number; hasMore: boolean }>;
  // Debug functions

}

// New interface for server-side filtering
export interface LogoFilters {
  searchQuery?: string;
  selectedTypes?: string[];
  selectedColors?: string[];
  selectedShapes?: string[];
  activeCategory?: string;
  activeSubcategory?: string;
  sortBy?: string;
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
  const [totalLogos, setTotalLogos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [pageSize, setPageSize] = useState(200); // Start with smaller page size for better UX
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([1]));

  // Helper function to get public URL for image
  const getImageUrl = (imagePath?: string): string | undefined => {
    if (!imagePath) return undefined;
    
    try {
      const assetBase = (import.meta as any).env?.VITE_ASSET_BASE_URL as string | undefined;
      if (assetBase && assetBase.length > 0) {
        const normalizedBase = assetBase.replace(/\/+$/, '');
        return `${normalizedBase}/${STORAGE_BUCKET}/${imagePath}`;
      }
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
      subcategory: row.subcategory || undefined,
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color || undefined,
      shape: row.shape,
      information: row.information || undefined,
      designerUrl: row.designer_url || undefined,
      imagePath: row.image_path || undefined,
      imageUrl: imageUrl,
      imageName: row.image_name || undefined,
      fileSize: row.file_size || undefined,
      fileType: row.file_type || undefined,
      isPublic: row.is_public,
      downloads: row.downloads || 0,
      likes: row.likes || 0,
      createdBy: row.created_by || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  };

  // Smart fetch logos with automatic page size detection and lazy loading
  const fetchLogos = async (page: number = 1, requestedPageSize: number = 200): Promise<{ logos: Logo[]; total: number; hasMore: boolean; actualPageSize: number }> => {
    try {
      
      // First, get the total count
      const { count, error: countError } = await supabase
        .from('logos')
        .select('*', { count: 'exact', head: true })
        .eq('is_public', true);

      if (countError) {
        console.warn('Supabase count error:', countError.message);
        throw countError;
      }

      
      // Detect optimal page size based on Supabase limits
      let actualPageSize = requestedPageSize;
      if (requestedPageSize > 1000) {
        console.warn(`⚠️ Requested page size ${requestedPageSize} exceeds Supabase limit, reducing to 1000`);
        actualPageSize = 1000;
      }

      // Calculate range
      const from = (page - 1) * actualPageSize;
      const to = from + actualPageSize - 1;

      

      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.warn('Supabase error:', error.message);
        throw error;
      }
      
      
      const mappedLogos = data?.map(mapDatabaseRowToLogo) || [];
      const total = count || 0;
      
      // Determine if there are more pages
      // hasMore should be true if we got a full page OR if there are more records
      const hasMore = (data?.length === actualPageSize) || (from + actualPageSize < total);
      
      
      
      return { logos: mappedLogos, total, hasMore, actualPageSize };
    } catch (err) {
      console.error('❌ Error fetching logos:', err);
      // Return empty result instead of throwing to prevent app crash
      return { logos: [], total: 0, hasMore: false, actualPageSize: 0 };
    }
  };

  // Load initial logos with smart page size detection
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const loadInitialLogos = async () => {
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
        
        const logoData = await Promise.race([fetchLogos(1, pageSize), timeoutPromise]);
        
        if (mounted) {
          setLogos(logoData.logos);
          setTotalLogos(logoData.total);
          setCurrentPage(1);
          setHasMore(logoData.hasMore);
          setPageSize(logoData.actualPageSize); // Update page size based on what Supabase actually returned
          setLoadedPages(new Set([1]));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load logos';
        setError(errorMessage);
        // Set empty array so app doesn't crash
        setLogos([]);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInitialLogos();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []); // Remove pageSize dependency to prevent infinite loops

  // Load more logos (lazy loading)
  const loadMoreLogos = async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }
    
    // Check if we've already loaded this page
    const nextPage = currentPage + 1;
    if (loadedPages.has(nextPage)) {
      return;
    }
    
    try {
      setIsLoadingMore(true);
      
      const logoData = await fetchLogos(nextPage, pageSize);
      
      if (logoData.logos.length > 0) {
        // Append new logos to existing ones
        setLogos(prev => [...prev, ...logoData.logos]);
        setCurrentPage(nextPage);
        setHasMore(logoData.hasMore);
        setLoadedPages(prev => new Set([...prev, nextPage]));
        
        
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('❌ Error loading more logos:', err);
      setError('Failed to load more logos');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Refresh logos (reload from beginning)
  const refreshLogos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const logoData = await fetchLogos(1, pageSize);
      
      setLogos(logoData.logos);
      setTotalLogos(logoData.total);
      setCurrentPage(1);
      setHasMore(logoData.hasMore);
      setPageSize(logoData.actualPageSize);
      setLoadedPages(new Set([1]));
      
    } catch (err) {
      console.error('❌ Error refreshing logos:', err);
      setError('Failed to refresh logos');
    } finally {
      setLoading(false);
    }
  };

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
  };

  const incrementLikes: LogosContextType['incrementLikes'] = async (id) => {
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

  // Remove duplicate refreshLogos - using the one defined above

  // Get total count of logos without fetching all data
  const getTotalLogoCount = async (): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('logos')
        .select('*', { count: 'exact', head: true })
        .eq('is_public', true);

      if (error) {
        console.warn('Supabase count error:', error.message);
        return 0;
      }

      return count || 0;
    } catch (err) {
      return 0;
    }
  };

  // Fetch all logos without pagination (use with caution for large datasets)
  const fetchAllLogos = async (): Promise<Logo[]> => {
    try {
      // Get total count first
      const total = await getTotalLogoCount();
      
      if (total > 10000) {
        console.warn('⚠️ Large dataset detected, consider using pagination');
      }
      
      // Fetch all logos in batches if needed
      const allLogos: Logo[] = [];
      let currentPage = 1;
      const batchSize = pageSize; // Use the current pageSize state instead of hardcoded 1000
      
      while (true) {
        const batch = await fetchLogos(currentPage, batchSize);
        allLogos.push(...batch.logos);
        
        if (!batch.hasMore) break;
        currentPage++;
      }
      
      return allLogos;
    } catch (err) {
      console.error('❌ fetchAllLogos failed:', err);
      return [];
    }
  };



  // New server-side filtering functions
  const fetchLogosWithFilters: LogosContextType['fetchLogosWithFilters'] = async (filters, page, pageSize) => {
    try {
      // Construct the base query with all filters
      let query = supabase
        .from('logos')
        .select('*', { count: 'exact', head: true });

      // Apply all filters to the query
      if (filters.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,industry.ilike.%${filters.searchQuery}%`);
      }
      if (filters.selectedTypes && filters.selectedTypes.length > 0) {
        query = query.in('type', filters.selectedTypes);
      }
      if (filters.selectedColors && filters.selectedColors.length > 0) {
        query = query.in('primary_color', filters.selectedColors);
      }
      if (filters.selectedShapes && filters.selectedShapes.length > 0) {
        query = query.in('shape', filters.selectedShapes);
      }
      if (filters.activeCategory && filters.activeCategory !== 'All') {
        query = query.eq('industry', filters.activeCategory);
      }
      if (filters.activeSubcategory && filters.activeSubcategory !== 'All') {
        query = query.eq('subcategory', filters.activeSubcategory);
      }
      query = query.eq('is_public', true);

      // Apply sorting
      if (filters.sortBy) {
        if (filters.sortBy === 'created_at') {
          // For created_at, default to descending (newest first) unless explicitly specified
          query = query.order(filters.sortBy, { ascending: false });
        } else {
          query = query.order(filters.sortBy, { ascending: filters.sortBy.includes('-') ? false : true });
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Get the count first
      const { count, error: countError } = await query;

      if (countError) {
        console.warn('Supabase count error:', countError.message);
        throw countError;
      }

      // Apply pagination to the same filtered query
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Reconstruct the same filtered query but with pagination
      let paginatedQuery = supabase
        .from('logos')
        .select('*');

      // Reapply all filters
      if (filters.searchQuery) {
        paginatedQuery = paginatedQuery.or(`name.ilike.%${filters.searchQuery}%,industry.ilike.%${filters.searchQuery}%`);
      }
      if (filters.selectedTypes && filters.selectedTypes.length > 0) {
        paginatedQuery = paginatedQuery.in('type', filters.selectedTypes);
      }
      if (filters.selectedColors && filters.selectedColors.length > 0) {
        paginatedQuery = paginatedQuery.in('primary_color', filters.selectedColors);
      }
      if (filters.selectedShapes && filters.selectedShapes.length > 0) {
        paginatedQuery = paginatedQuery.in('shape', filters.selectedShapes);
      }
      if (filters.activeCategory && filters.activeCategory !== 'All') {
        paginatedQuery = paginatedQuery.eq('industry', filters.activeCategory);
      }
      if (filters.activeSubcategory && filters.activeSubcategory !== 'All') {
        paginatedQuery = paginatedQuery.eq('subcategory', filters.activeSubcategory);
      }
      paginatedQuery = paginatedQuery.eq('is_public', true);

      // Apply sorting and pagination
      if (filters.sortBy) {
        if (filters.sortBy === 'created_at') {
          // For created_at, default to descending (newest first) unless explicitly specified
          paginatedQuery = paginatedQuery.order(filters.sortBy, { ascending: false });
        } else {
          paginatedQuery = paginatedQuery.order(filters.sortBy, { ascending: filters.sortBy.includes('-') ? false : true });
        }
      } else {
        paginatedQuery = paginatedQuery.order('created_at', { ascending: false });
      }
      
      paginatedQuery = paginatedQuery.range(from, to);

      const { data, error } = await paginatedQuery;

      if (error) {
        console.warn('Supabase error:', error.message);
        throw error;
      }
      
      const mappedLogos = data?.map(mapDatabaseRowToLogo) || [];
      const total = count || 0;
      const hasMore = from + pageSize < total;
      
      return { logos: mappedLogos, total, hasMore };
    } catch (err) {
      // Return empty result instead of throwing to prevent app crash
      return { logos: [], total: 0, hasMore: false };
    }
  };

  const getLogosWithServerSideFiltering: LogosContextType['getLogosWithServerSideFiltering'] = async (filters, page, pageSize) => {
    try {
      // Construct the base query with all filters
      let query = supabase
        .from('logos')
        .select('*', { count: 'exact', head: true });

      // Apply all filters to the query
      if (filters.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,industry.ilike.%${filters.searchQuery}%`);
      }
      if (filters.selectedTypes && filters.selectedTypes.length > 0) {
        query = query.in('type', filters.selectedTypes);
      }
      if (filters.selectedColors && filters.selectedColors.length > 0) {
        query = query.in('primary_color', filters.selectedColors);
      }
      if (filters.selectedShapes && filters.selectedShapes.length > 0) {
        query = query.in('shape', filters.selectedShapes);
      }
      if (filters.activeCategory && filters.activeCategory !== 'All') {
        query = query.eq('industry', filters.activeCategory);
      }
      if (filters.activeSubcategory && filters.activeSubcategory !== 'All') {
        query = query.eq('subcategory', filters.activeSubcategory);
      }
      query = query.eq('is_public', true);

      // Apply sorting
      if (filters.sortBy) {
        if (filters.sortBy === 'created_at') {
          // For created_at, default to descending (newest first) unless explicitly specified
          query = query.order(filters.sortBy, { ascending: false });
        } else {
          query = query.order(filters.sortBy, { ascending: filters.sortBy.includes('-') ? false : true });
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Get the count first
      const { count, error: countError } = await query;

      if (countError) {
        console.warn('Supabase count error:', countError.message);
        throw countError;
      }

      // Apply pagination to the same filtered query
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Reconstruct the same filtered query but with pagination
      let paginatedQuery = supabase
        .from('logos')
        .select('*');

      // Reapply all filters
      if (filters.searchQuery) {
        paginatedQuery = paginatedQuery.or(`name.ilike.%${filters.searchQuery}%,industry.ilike.%${filters.searchQuery}%`);
      }
      if (filters.selectedTypes && filters.selectedTypes.length > 0) {
        paginatedQuery = paginatedQuery.in('type', filters.selectedTypes);
      }
      if (filters.selectedColors && filters.selectedColors.length > 0) {
        paginatedQuery = paginatedQuery.in('primary_color', filters.selectedColors);
      }
      if (filters.selectedShapes && filters.selectedShapes.length > 0) {
        paginatedQuery = paginatedQuery.in('shape', filters.selectedShapes);
      }
      if (filters.activeCategory && filters.activeCategory !== 'All') {
        paginatedQuery = paginatedQuery.eq('industry', filters.activeCategory);
      }
      if (filters.activeSubcategory && filters.activeSubcategory !== 'All') {
        paginatedQuery = paginatedQuery.eq('subcategory', filters.activeSubcategory);
      }
      paginatedQuery = paginatedQuery.eq('is_public', true);

      // Apply sorting and pagination
      if (filters.sortBy) {
        if (filters.sortBy === 'created_at') {
          // For created_at, default to descending (newest first) unless explicitly specified
          paginatedQuery = paginatedQuery.order(filters.sortBy, { ascending: false });
        } else {
          paginatedQuery = paginatedQuery.order(filters.sortBy, { ascending: filters.sortBy.includes('-') ? false : true });
        }
      } else {
        paginatedQuery = paginatedQuery.order('created_at', { ascending: false });
      }
      
      paginatedQuery = paginatedQuery.range(from, to);

      const { data, error } = await paginatedQuery;

      if (error) {
        console.warn('Supabase error:', error.message);
        throw error;
      }
      
      const mappedLogos = data?.map(mapDatabaseRowToLogo) || [];
      const total = count || 0;
      const hasMore = from + pageSize < total;
      
      return { logos: mappedLogos, total, hasMore };
    } catch (err) {
      // Return empty result instead of throwing to prevent app crash
      return { logos: [], total: 0, hasMore: false };
    }
  };

  const value: LogosContextType = {
    logos,
    loading,
    error,
    totalLogos,
    currentPage,
    hasMore,
    pageSize,
    isLoadingMore,
    loadedPages,
    addLogo,
    updateLogo,
    deleteLogo,
    getLogo,
    incrementDownloads,
    incrementLikes,
    searchLogos,
    filterLogos,
    refreshLogos,
    loadMoreLogos,
    getTotalLogoCount,
    fetchAllLogos,
    fetchLogosWithFilters,
    getLogosWithServerSideFiltering,
    
  };

  return (
    <LogosContext.Provider value={value}>
      {children}
    </LogosContext.Provider>
  );
};