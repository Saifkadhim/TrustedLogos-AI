import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BookCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  isbn: string | null;
  rating: number;
  cover_image_url: string | null;
  amazon_url: string | null;
  goodreads_url: string | null;
  publisher: string | null;
  publication_year: number | null;
  page_count: number | null;
  category_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  likes: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  category?: BookCategory;
}

export interface CreateBookData {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  rating?: number;
  cover_image_url?: string;
  amazon_url?: string;
  goodreads_url?: string;
  publisher?: string;
  publication_year?: number;
  page_count?: number;
  category_id?: string;
  is_featured?: boolean;
  is_published?: boolean;
}

export interface UpdateBookData extends Partial<CreateBookData> {
  id: string;
}

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all book categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('book_categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    }
  };

  // Fetch all books with categories
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          category:book_categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  // Fetch books by category
  const fetchBooksByCategory = async (categoryName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          category:book_categories(*)
        `)
        .eq('book_categories.name', categoryName)
        .eq('is_published', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching books by category:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new book
  const createBook = async (bookData: CreateBookData): Promise<Book | null> => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([{
          ...bookData,
          rating: bookData.rating || 0,
          is_featured: bookData.is_featured || false,
          is_published: bookData.is_published !== false, // Default to true
        }])
        .select(`
          *,
          category:book_categories(*)
        `)
        .single();

      if (error) throw error;
      
      // Add to local state
      if (data) {
        setBooks(prev => [data, ...prev]);
      }
      
      return data;
    } catch (err) {
      console.error('Error creating book:', err);
      setError(err instanceof Error ? err.message : 'Failed to create book');
      return null;
    }
  };

  // Update a book
  const updateBook = async (bookData: UpdateBookData): Promise<Book | null> => {
    try {
      const { id, ...updateData } = bookData;
      const { data, error } = await supabase
        .from('books')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(`
          *,
          category:book_categories(*)
        `)
        .single();

      if (error) throw error;

      // Update local state
      if (data) {
        setBooks(prev => prev.map(book => book.id === id ? data : book));
      }

      return data;
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err instanceof Error ? err.message : 'Failed to update book');
      return null;
    }
  };

  // Delete a book
  const deleteBook = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setBooks(prev => prev.filter(book => book.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete book');
      return false;
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string, is_featured: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('books')
        .update({ 
          is_featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBooks(prev => prev.map(book => 
        book.id === id ? { ...book, is_featured } : book
      ));
      return true;
    } catch (err) {
      console.error('Error toggling featured status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update featured status');
      return false;
    }
  };

  // Toggle published status
  const togglePublished = async (id: string, is_published: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('books')
        .update({ 
          is_published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBooks(prev => prev.map(book => 
        book.id === id ? { ...book, is_published } : book
      ));
      return true;
    } catch (err) {
      console.error('Error toggling published status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update published status');
      return false;
    }
  };

  // Increment view count
  const incrementViews = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('books')
        .update({ 
          views: books.find(b => b.id === id)?.views || 0 + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  // Search books
  const searchBooks = async (query: string): Promise<Book[]> => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          category:book_categories(*)
        `)
        .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_published', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error searching books:', err);
      return [];
    }
  };

  // Initialize data
  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, []);

  return {
    books,
    categories,
    loading,
    error,
    fetchBooks,
    fetchCategories,
    fetchBooksByCategory,
    createBook,
    updateBook,
    deleteBook,
    toggleFeatured,
    togglePublished,
    incrementViews,
    searchBooks,
    setError,
  };
};