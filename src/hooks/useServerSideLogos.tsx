import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Logo } from './useLogos-safe';

export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  filters?: {
    type?: string[];
    industry?: string[];
    shape?: string[];
    colors?: string[];
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult {
  logos: Logo[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilterState {
  search: string;
  type: string[];
  industry: string[];
  shape: string[];
  colors: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const STORAGE_BUCKET = 'logos';

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
    showInBrandPalettes: row.show_in_brand_palettes || false,
    tags: row.tags || [],
    brandColors: row.brand_colors || undefined,
    downloads: row.downloads || 0,
    likes: row.likes || 0,
    createdBy: row.created_by || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
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

export const useServerSideLogos = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: [],
    industry: [],
    shape: [],
    colors: [],
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Build optimized database query
  const buildLogoQuery = useCallback((params: PaginationParams) => {
    let query = supabase
      .from('logos')
      .select('*', { count: 'exact' })
      .eq('is_public', true);

    // Text search using ILIKE for case-insensitive matching
    if (params.search && params.search.trim()) {
      const searchTerm = params.search.trim();
      query = query.or(`name.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%,information.ilike.%${searchTerm}%`);
    }

    // Apply filters
    if (params.filters?.type?.length) {
      query = query.in('type', params.filters.type);
    }
    
    if (params.filters?.industry?.length) {
      query = query.in('industry', params.filters.industry);
    }
    
    if (params.filters?.shape?.length) {
      query = query.in('shape', params.filters.shape);
    }
    
    if (params.filters?.colors?.length) {
      query = query.in('primary_color', params.filters.colors);
    }

    // Apply sorting
    const sortField = params.sortBy || 'created_at';
    query = query.order(sortField, { 
      ascending: params.sortOrder === 'asc' 
    });

    // Apply pagination
    const from = (params.page - 1) * params.pageSize;
    const to = from + params.pageSize - 1;
    query = query.range(from, to);

    return query;
  }, []);

  // Fetch logos with server-side pagination
  const fetchLogos = useCallback(async (params: PaginationParams): Promise<PaginationResult> => {
    try {
      
      
      const query = buildLogoQuery(params);
      const { data, error, count } = await query;

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      const mappedLogos = data?.map(mapDatabaseRowToLogo) || [];
      const totalCount = count || 0;
      const totalPagesCount = Math.ceil(totalCount / params.pageSize);
      
      

      return {
        logos: mappedLogos,
        total: totalCount,
        totalPages: totalPagesCount,
        currentPage: params.page,
        hasNext: params.page < totalPagesCount,
        hasPrev: params.page > 1
      };
    } catch (err) {
      console.error('❌ Error fetching logos:', err);
      throw err;
    }
  }, [buildLogoQuery]);

  // Load logos for current page and filters
  const loadLogos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: PaginationParams = {
        page: currentPage,
        pageSize,
        search: filters.search,
        filters: {
          type: filters.type.length > 0 ? filters.type : undefined,
          industry: filters.industry.length > 0 ? filters.industry : undefined,
          shape: filters.shape.length > 0 ? filters.shape : undefined,
          colors: filters.colors.length > 0 ? filters.colors : undefined,
        },
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      const result = await fetchLogos(params);
      
      setLogos(result.logos);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setHasNext(result.hasNext);
      setHasPrev(result.hasPrev);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load logos';
      setError(errorMessage);
      setLogos([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters, fetchLogos]);

  // Load logos when dependencies change
  useEffect(() => {
    loadLogos();
  }, [loadLogos]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.type, filters.industry, filters.shape, filters.colors, filters.sortBy, filters.sortOrder]);

  // Change page
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  // Change page size
  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      type: [],
      industry: [],
      shape: [],
      colors: [],
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  }, []);

  // Refresh current page
  const refresh = useCallback(() => {
    loadLogos();
  }, [loadLogos]);

  // Get logo by ID
  const getLogo = useCallback((id: string): Logo | undefined => {
    return logos.find(logo => logo.id === id);
  }, [logos]);

  // Update logo in local state (for optimistic updates)
  const updateLogoInState = useCallback((updatedLogo: Logo) => {
    setLogos(prev => prev.map(logo => 
      logo.id === updatedLogo.id ? updatedLogo : logo
    ));
  }, []);

  // Update logo in database
  const updateLogo = useCallback(async (updateData: {
    id: string;
    name?: string;
    type?: string;
    industry?: string;
    subcategory?: string;
    shape?: string;
    information?: string;
    designerUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    showInBrandPalettes?: boolean;
    tags?: string[];
    brandColors?: string[];
    imageFile?: File;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      
      const existingLogo = logos.find(l => l.id === updateData.id);
      if (!existingLogo) throw new Error('Logo not found');

      // Handle image upload if provided
      let imagePath = existingLogo.imagePath;
      let imageUrl = existingLogo.imageUrl;
      
      if (updateData.imageFile) {
        // Delete old image
        if (existingLogo.imagePath) {
          await deleteImage(existingLogo.imagePath);
        }
        
        // Upload new image
        const uploadResult = await uploadImage(updateData.imageFile, updateData.name || existingLogo.name);
        imagePath = uploadResult.path;
        imageUrl = uploadResult.url;
      }
      
      // Prepare the data for database update
      const dbUpdateData: any = {};
      if (updateData.name !== undefined) dbUpdateData.name = updateData.name;
      if (updateData.type !== undefined) dbUpdateData.type = updateData.type;
      if (updateData.industry !== undefined) dbUpdateData.industry = updateData.industry;
      if (updateData.subcategory !== undefined) dbUpdateData.subcategory = updateData.subcategory;
      if (updateData.shape !== undefined) dbUpdateData.shape = updateData.shape;
      if (updateData.information !== undefined) dbUpdateData.information = updateData.information;
      if (updateData.designerUrl !== undefined) dbUpdateData.designer_url = updateData.designerUrl;
      if (updateData.primaryColor !== undefined) dbUpdateData.primary_color = updateData.primaryColor;
      if (updateData.secondaryColor !== undefined) dbUpdateData.secondary_color = updateData.secondaryColor;
      if (updateData.showInBrandPalettes !== undefined) dbUpdateData.show_in_brand_palettes = updateData.showInBrandPalettes;
      if (updateData.tags !== undefined) dbUpdateData.tags = updateData.tags;
      if (updateData.brandColors !== undefined) dbUpdateData.brand_colors = updateData.brandColors;
      
      // Add image data if file was uploaded
      if (updateData.imageFile) {
        dbUpdateData.image_path = imagePath;
        dbUpdateData.image_name = updateData.imageFile.name;
        dbUpdateData.file_size = updateData.imageFile.size;
        dbUpdateData.file_type = updateData.imageFile.type;
      }
      
      // Add updated_at timestamp
      dbUpdateData.updated_at = new Date().toISOString();

      // Update in database
      const { error: dbError } = await supabase
        .from('logos')
        .update(dbUpdateData)
        .eq('id', updateData.id);

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      // Get the updated logo from database
      const { data: updatedLogoData, error: fetchError } = await supabase
        .from('logos')
        .select('*')
        .eq('id', updateData.id)
        .single();

      if (fetchError || !updatedLogoData) {
        throw new Error('Failed to fetch updated logo data');
      }

      // Convert to Logo interface and update local state
      const updatedLogo = mapDatabaseRowToLogo(updatedLogoData);
      updateLogoInState(updatedLogo);
      
      return true;
    } catch (error) {
      console.error('Error updating logo:', error);
      setError(error instanceof Error ? error.message : 'Failed to update logo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateLogoInState, logos]);

  // Remove logo from local state
  const removeLogoFromState = useCallback((id: string) => {
    setLogos(prev => prev.filter(logo => logo.id !== id));
    setTotal(prev => Math.max(0, prev - 1));
  }, []);

  // Delete logo from database and storage
  const deleteLogo = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // First, get the logo to find the image path
      const logoToDelete = logos.find(logo => logo.id === id);
      if (!logoToDelete) {
        throw new Error('Logo not found');
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('logos')
        .delete()
        .eq('id', id);

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      // If logo has an image, delete from storage
      if (logoToDelete.imagePath) {
        try {
          const { error: storageError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([logoToDelete.imagePath]);

          if (storageError) {
            console.warn('Failed to delete image from storage:', storageError);
            // Don't throw error here as the database deletion was successful
          }
        } catch (storageError) {
          console.warn('Storage deletion failed:', storageError);
          // Don't throw error here as the database deletion was successful
        }
      }

      // Remove from local state
      removeLogoFromState(id);
      
      // Refresh the current page to ensure proper pagination
      await loadLogos();
      
      return true;
    } catch (error) {
      console.error('Error deleting logo:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete logo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [logos, removeLogoFromState, loadLogos]);

  // Add logo to local state
  const addLogoToState = useCallback((newLogo: Logo) => {
    setLogos(prev => [newLogo, ...prev]);
    setTotal(prev => prev + 1);
  }, []);

  return {
    // Data
    logos,
    total,
    currentPage,
    pageSize,
    totalPages,
    hasNext,
    hasPrev,
    
    // State
    loading,
    error,
    filters,
    
    // Actions
    goToPage,
    changePageSize,
    updateFilters,
    clearFilters,
    refresh,
    getLogo,
    updateLogoInState,
    updateLogo,
    removeLogoFromState,
    deleteLogo,
    addLogoToState,
    
    // Computed values
    isEmpty: logos.length === 0 && !loading,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
    startItem: (currentPage - 1) * pageSize + 1,
    endItem: Math.min(currentPage * pageSize, total),
  };
}; 