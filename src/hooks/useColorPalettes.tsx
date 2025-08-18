import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface ColorPalette {
  id: string;
  name: string;
  description?: string;
  colors: string[];
  category: string;
  tags: string[];
  isPublic: boolean;
  downloads: number;
  likes: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateColorPaletteData {
  name: string;
  description?: string;
  colors: string[];
  category: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateColorPaletteData extends Partial<CreateColorPaletteData> {
  id: string;
}

interface ColorPalettesContextType {
  palettes: ColorPalette[];
  loading: boolean;
  error: string | null;
  addPalette: (paletteData: CreateColorPaletteData) => Promise<ColorPalette>;
  updatePalette: (paletteData: UpdateColorPaletteData) => Promise<ColorPalette>;
  deletePalette: (id: string) => Promise<void>;
  getPalette: (id: string) => Promise<ColorPalette | null>;
  incrementDownloads: (id: string) => Promise<void>;
  incrementLikes: (id: string) => Promise<void>;
  searchPalettes: (query: string) => Promise<ColorPalette[]>;
  filterPalettes: (filters: { category?: string; tags?: string[] }) => Promise<ColorPalette[]>;
  refreshPalettes: () => Promise<void>;
}

const ColorPalettesContext = createContext<ColorPalettesContextType | undefined>(undefined);

export const useColorPalettes = (): ColorPalettesContextType => {
  const ctx = useContext(ColorPalettesContext);
  if (!ctx) throw new Error('useColorPalettes must be used within a ColorPalettesProvider');
  return ctx;
};

export const ColorPalettesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert database row to ColorPalette interface
  const mapDatabaseRowToPalette = (row: any): ColorPalette => {
    // Parse colors from JSON string if needed
    let colors = [];
    if (typeof row.colors === 'string') {
      try {
        colors = JSON.parse(row.colors);
      } catch (e) {
        console.warn('Failed to parse colors JSON:', row.colors);
        colors = [];
      }
    } else if (Array.isArray(row.colors)) {
      colors = row.colors;
    }

    // Parse tags from JSON string if needed
    let tags = [];
    if (typeof row.tags === 'string') {
      try {
        tags = JSON.parse(row.tags);
      } catch (e) {
        console.warn('Failed to parse tags JSON:', row.tags);
        tags = [];
      }
    } else if (Array.isArray(row.tags)) {
      tags = row.tags;
    }

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      colors: colors,
      category: row.category,
      tags: tags,
      isPublic: row.is_public,
      downloads: row.downloads,
      likes: row.likes,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  };

  // Fetch all public color palettes
  const fetchPalettes = async (): Promise<ColorPalette[]> => {
    try {
      console.log('🎨 Fetching color palettes from Supabase...');
      
      const { data, error } = await supabase
        .from('color_palettes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase error:', error.message);
        throw error;
      }
      
      const mappedPalettes = data?.map(mapDatabaseRowToPalette) || [];
      console.log('✅ Successfully fetched', mappedPalettes.length, 'color palettes');
      return mappedPalettes;
    } catch (err) {
      console.error('❌ Error fetching color palettes:', err);
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  };

  // Load palettes on mount with timeout protection
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const loadPalettes = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Set a timeout to prevent hanging
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Color palette loading timed out'));
          }, 10000); // 10 second timeout
        });
        
        const palettePromise = fetchPalettes();
        
        // Race between fetch and timeout
        const paletteData = await Promise.race([palettePromise, timeoutPromise]);
        
        if (mounted) {
          setPalettes(paletteData);
          console.log('✅ Color palettes loaded successfully');
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load color palettes';
          setError(errorMessage);
          console.warn('⚠️ Color palette loading failed, continuing with empty array:', errorMessage);
          // Set empty array so app doesn't crash
          setPalettes([]);
        }
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPalettes();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const addPalette: ColorPalettesContextType['addPalette'] = async (paletteData) => {
    try {
      setError(null);
      
      const insertData = {
        name: paletteData.name,
        description: paletteData.description,
        colors: JSON.stringify(paletteData.colors),
        category: paletteData.category,
        tags: JSON.stringify(paletteData.tags || []),
        is_public: paletteData.isPublic ?? true,
      };

      const { data, error } = await supabase
        .from('color_palettes')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      const newPalette = mapDatabaseRowToPalette(data);
      setPalettes(prev => [newPalette, ...prev]);
      return newPalette;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add color palette';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updatePalette: ColorPalettesContextType['updatePalette'] = async (paletteData) => {
    try {
      setError(null);
      
      const existingPalette = palettes.find(p => p.id === paletteData.id);
      if (!existingPalette) throw new Error('Color palette not found');

      const updateData: any = {};
      if (paletteData.name !== undefined) updateData.name = paletteData.name;
      if (paletteData.description !== undefined) updateData.description = paletteData.description;
      if (paletteData.colors !== undefined) updateData.colors = JSON.stringify(paletteData.colors);
      if (paletteData.category !== undefined) updateData.category = paletteData.category;
      if (paletteData.tags !== undefined) updateData.tags = JSON.stringify(paletteData.tags);
      if (paletteData.isPublic !== undefined) updateData.is_public = paletteData.isPublic;

      const { data, error } = await supabase
        .from('color_palettes')
        .update(updateData)
        .eq('id', paletteData.id)
        .select()
        .single();

      if (error) throw error;

      const updatedPalette = mapDatabaseRowToPalette(data);
      setPalettes(prev => prev.map(p => p.id === paletteData.id ? updatedPalette : p));
      return updatedPalette;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update color palette';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deletePalette: ColorPalettesContextType['deletePalette'] = async (id) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('color_palettes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setPalettes(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete color palette';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getPalette: ColorPalettesContextType['getPalette'] = async (id) => {
    return palettes.find(palette => palette.id === id) || null;
  };

  const incrementDownloads: ColorPalettesContextType['incrementDownloads'] = async (id) => {
    try {
      const { error } = await supabase
        .from('color_palettes')
        .update({ downloads: supabase.raw('downloads + 1') })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setPalettes(prev => prev.map(p => 
        p.id === id ? { ...p, downloads: p.downloads + 1 } : p
      ));
    } catch (err) {
      console.error('Failed to increment downloads:', err);
    }
  };

  const incrementLikes: ColorPalettesContextType['incrementLikes'] = async (id) => {
    try {
      const { error } = await supabase
        .from('color_palettes')
        .update({ likes: supabase.raw('likes + 1') })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setPalettes(prev => prev.map(p => 
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      ));
    } catch (err) {
      console.error('Failed to increment likes:', err);
    }
  };

  const searchPalettes: ColorPalettesContextType['searchPalettes'] = async (query) => {
    return palettes.filter(palette => 
      palette.name.toLowerCase().includes(query.toLowerCase()) ||
      palette.description?.toLowerCase().includes(query.toLowerCase()) ||
      palette.category.toLowerCase().includes(query.toLowerCase()) ||
      palette.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filterPalettes: ColorPalettesContextType['filterPalettes'] = async (filters) => {
    return palettes.filter(palette => {
      if (filters.category && palette.category !== filters.category) return false;
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          palette.tags.some(paletteTag => paletteTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }
      return true;
    });
  };

  const refreshPalettes: ColorPalettesContextType['refreshPalettes'] = async () => {
    const paletteData = await fetchPalettes();
    setPalettes(paletteData);
  };

  const value: ColorPalettesContextType = {
    palettes,
    loading,
    error,
    addPalette,
    updatePalette,
    deletePalette,
    getPalette,
    incrementDownloads,
    incrementLikes,
    searchPalettes,
    filterPalettes,
    refreshPalettes,
  };

  return (
    <ColorPalettesContext.Provider value={value}>
      {children}
    </ColorPalettesContext.Provider>
  );
};