import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface FontItem {
  id: string;
  name: string;
  designer: string;
  category: string;
  style: string;
  tags: string[];
  license: string;
  formats: string[];
  weights: string[];
  featured: boolean;
  isPublic: boolean;
  downloads: number;
  likes: number;
  rating: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFontData {
  name: string;
  designer: string;
  category: string;
  style: string;
  tags?: string[];
  license: string;
  formats?: string[];
  weights?: string[];
  featured?: boolean;
  isPublic?: boolean;
}

export interface UpdateFontData extends Partial<CreateFontData> {
  id: string;
}

interface FontsContextType {
  fonts: FontItem[];
  loading: boolean;
  error: string | null;
  addFont: (fontData: CreateFontData) => Promise<FontItem>;
  updateFont: (fontData: UpdateFontData) => Promise<FontItem>;
  deleteFont: (id: string) => Promise<void>;
  incrementDownloads: (id: string) => Promise<void>;
  incrementLikes: (id: string) => Promise<void>;
  refreshFonts: () => Promise<void>;
}

const FontsContext = createContext<FontsContextType | undefined>(undefined);

export const useFonts = (): FontsContextType => {
  const ctx = useContext(FontsContext);
  if (!ctx) throw new Error('useFonts must be used within a FontsProvider');
  return ctx;
};

const TABLE_NAME = 'fonts';

export const FontsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fonts, setFonts] = useState<FontItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapRowToFont = (row: any): FontItem => {
    const parseMaybeJsonArray = (value: any): string[] => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try { return JSON.parse(value); } catch { return []; }
      }
      return [];
    };

    return {
      id: row.id,
      name: row.name,
      designer: row.designer,
      category: row.category,
      style: row.style,
      tags: parseMaybeJsonArray(row.tags),
      license: row.license,
      formats: parseMaybeJsonArray(row.formats),
      weights: parseMaybeJsonArray(row.weights),
      featured: !!row.featured,
      isPublic: !!row.is_public,
      downloads: row.downloads ?? 0,
      likes: row.likes ?? 0,
      rating: row.rating ?? 0,
      createdBy: row.created_by ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  };

  const fetchFonts = async (): Promise<FontItem[]> => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRowToFont);
    } catch (e) {
      console.warn('Failed to fetch fonts:', e);
      return [];
    }
  };

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;
    const load = async () => {
      if (!mounted) return;
      try {
        setLoading(true);
        setError(null);
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Fonts loading timed out')), 10000);
        });
        const data = await Promise.race([fetchFonts(), timeoutPromise]);
        if (mounted) setFonts(data);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load fonts');
          setFonts([]);
        }
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; if (timeoutId) clearTimeout(timeoutId); };
  }, []);

  const addFont: FontsContextType['addFont'] = async (fontData) => {
    try {
      setError(null);
      const insertData: any = {
        name: fontData.name,
        designer: fontData.designer,
        category: fontData.category,
        style: fontData.style,
        tags: JSON.stringify(fontData.tags || []),
        license: fontData.license,
        formats: JSON.stringify(fontData.formats || []),
        weights: JSON.stringify(fontData.weights || []),
        featured: fontData.featured ?? false,
        is_public: fontData.isPublic ?? true,
      };
      const { data, error } = await supabase.from(TABLE_NAME).insert(insertData).select().single();
      if (error) throw error;
      const created = mapRowToFont(data);
      setFonts(prev => [created, ...prev]);
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add font';
      setError(message);
      throw new Error(message);
    }
  };

  const updateFont: FontsContextType['updateFont'] = async (fontData) => {
    try {
      setError(null);
      const updateData: any = {};
      if (fontData.name !== undefined) updateData.name = fontData.name;
      if (fontData.designer !== undefined) updateData.designer = fontData.designer;
      if (fontData.category !== undefined) updateData.category = fontData.category;
      if (fontData.style !== undefined) updateData.style = fontData.style;
      if (fontData.tags !== undefined) updateData.tags = JSON.stringify(fontData.tags);
      if (fontData.license !== undefined) updateData.license = fontData.license;
      if (fontData.formats !== undefined) updateData.formats = JSON.stringify(fontData.formats);
      if (fontData.weights !== undefined) updateData.weights = JSON.stringify(fontData.weights);
      if (fontData.featured !== undefined) updateData.featured = fontData.featured;
      if (fontData.isPublic !== undefined) updateData.is_public = fontData.isPublic;

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updateData)
        .eq('id', fontData.id)
        .select()
        .single();
      if (error) throw error;
      const updated = mapRowToFont(data);
      setFonts(prev => prev.map(f => f.id === fontData.id ? updated : f));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update font';
      setError(message);
      throw new Error(message);
    }
  };

  const deleteFont: FontsContextType['deleteFont'] = async (id) => {
    try {
      setError(null);
      const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
      if (error) throw error;
      setFonts(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete font';
      setError(message);
      throw new Error(message);
    }
  };

  const incrementDownloads: FontsContextType['incrementDownloads'] = async (id) => {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({ downloads: supabase.raw('downloads + 1') })
        .eq('id', id);
      if (error) throw error;
      setFonts(prev => prev.map(f => f.id === id ? { ...f, downloads: f.downloads + 1 } : f));
    } catch {}
  };

  const incrementLikes: FontsContextType['incrementLikes'] = async (id) => {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({ likes: supabase.raw('likes + 1') })
        .eq('id', id);
      if (error) throw error;
      setFonts(prev => prev.map(f => f.id === id ? { ...f, likes: f.likes + 1 } : f));
    } catch {}
  };

  const refreshFonts: FontsContextType['refreshFonts'] = async () => {
    const data = await fetchFonts();
    setFonts(data);
  };

  const value: FontsContextType = {
    fonts,
    loading,
    error,
    addFont,
    updateFont,
    deleteFont,
    incrementDownloads,
    incrementLikes,
    refreshFonts,
  };

  return (
    <FontsContext.Provider value={value}>
      {children}
    </FontsContext.Provider>
  );
};

