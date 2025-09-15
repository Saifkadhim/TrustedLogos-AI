import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BrandGuidelineCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BrandGuideline {
  id: string;
  brand_name: string;
  title: string;
  description: string | null;
  pdf_url: string;
  thumbnail_url: string | null;
  category_id: string | null;
  industry: string | null;
  year_founded: number | null;
  logo_story: string | null;
  is_public: boolean;
  is_featured: boolean;
  views: number;
  downloads: number;
  tags: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
  category?: BrandGuidelineCategory;
}

export interface CreateBrandGuidelineData {
  brand_name: string;
  title: string;
  description?: string;
  pdf_url: string;
  thumbnail_url?: string;
  category_id?: string;
  industry?: string;
  year_founded?: number;
  logo_story?: string;
  is_public?: boolean;
  is_featured?: boolean;
  tags?: string[];
}

export interface UpdateBrandGuidelineData extends Partial<CreateBrandGuidelineData> {
  id: string;
}

export const useBrandGuidelines = () => {
  const [brandGuidelines, setBrandGuidelines] = useState<BrandGuideline[]>([]);
  const [categories, setCategories] = useState<BrandGuidelineCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all brand guidelines
  const fetchBrandGuidelines = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('brand_guidelines')
        .select(`
          *,
          category:brand_guideline_categories(*)
        `)
        .eq('is_public', true)
        .order('is_featured', { ascending: false })
        .order('brand_name', { ascending: true });

      if (fetchError) throw fetchError;

      setBrandGuidelines(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brand guidelines');
      console.error('Error fetching brand guidelines:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('brand_guideline_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch brand guidelines by category
  const fetchByCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('brand_guidelines')
        .select(`
          *,
          category:brand_guideline_categories(*)
        `)
        .eq('is_public', true)
        .eq('category_id', categoryId)
        .order('brand_name', { ascending: true });

      if (fetchError) throw fetchError;

      setBrandGuidelines(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch brand guidelines by category');
      console.error('Error fetching brand guidelines by category:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search brand guidelines
  const searchBrandGuidelines = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('brand_guidelines')
        .select(`
          *,
          category:brand_guideline_categories(*)
        `)
        .eq('is_public', true)
        .or(`brand_name.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('brand_name', { ascending: true });

      if (fetchError) throw fetchError;

      setBrandGuidelines(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search brand guidelines');
      console.error('Error searching brand guidelines:', err);
    } finally {
      setLoading(false);
    }
  };

  // Increment views
  const incrementViews = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('brand_guidelines')
        .update({ views: brandGuidelines.find(bg => bg.id === id)?.views + 1 })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      setBrandGuidelines(prev => 
        prev.map(bg => 
          bg.id === id ? { ...bg, views: bg.views + 1 } : bg
        )
      );
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  // Increment downloads
  const incrementDownloads = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('brand_guidelines')
        .update({ downloads: brandGuidelines.find(bg => bg.id === id)?.downloads + 1 })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      setBrandGuidelines(prev => 
        prev.map(bg => 
          bg.id === id ? { ...bg, downloads: bg.downloads + 1 } : bg
        )
      );
    } catch (err) {
      console.error('Error incrementing downloads:', err);
    }
  };

  // Create new brand guideline (admin only)
  const createBrandGuideline = async (data: CreateBrandGuidelineData): Promise<BrandGuideline | null> => {
    try {
      const { data: newGuideline, error: createError } = await supabase
        .from('brand_guidelines')
        .insert([data])
        .select(`
          *,
          category:brand_guideline_categories(*)
        `)
        .single();

      if (createError) throw createError;

      setBrandGuidelines(prev => [...prev, newGuideline]);
      return newGuideline;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create brand guideline');
      console.error('Error creating brand guideline:', err);
      return null;
    }
  };

  // Update brand guideline (admin only)
  const updateBrandGuideline = async (data: UpdateBrandGuidelineData): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('brand_guidelines')
        .update(data)
        .eq('id', data.id);

      if (updateError) throw updateError;

      // Update local state
      setBrandGuidelines(prev => 
        prev.map(bg => 
          bg.id === data.id ? { ...bg, ...data } : bg
        )
      );

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update brand guideline');
      console.error('Error updating brand guideline:', err);
      return false;
    }
  };

  // Delete brand guideline (admin only)
  const deleteBrandGuideline = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('brand_guidelines')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local state
      setBrandGuidelines(prev => prev.filter(bg => bg.id !== id));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete brand guideline');
      console.error('Error deleting brand guideline:', err);
      return false;
    }
  };

  // Get featured brand guidelines
  const getFeaturedGuidelines = () => {
    return brandGuidelines.filter(bg => bg.is_featured);
  };

  // Get brand guidelines by industry
  const getByIndustry = (industry: string) => {
    return brandGuidelines.filter(bg => bg.industry === industry);
  };

  // Clear error
  const clearError = () => setError(null);

  // Load data on mount
  useEffect(() => {
    fetchBrandGuidelines();
    fetchCategories();
  }, []);

  return {
    brandGuidelines,
    categories,
    loading,
    error,
    fetchBrandGuidelines,
    fetchByCategory,
    searchBrandGuidelines,
    incrementViews,
    incrementDownloads,
    createBrandGuideline,
    updateBrandGuideline,
    deleteBrandGuideline,
    getFeaturedGuidelines,
    getByIndustry,
    clearError,
  };
}; 