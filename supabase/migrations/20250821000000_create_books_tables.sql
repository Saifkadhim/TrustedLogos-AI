/*
  # Create books system for learning resources

  1. New Tables
    - `book_categories`
      - `id` (uuid, primary key)
      - `name` (text, not null, unique) - Category name
      - `description` (text, nullable) - Category description
      - `icon` (text, nullable) - Icon name for UI
      - `sort_order` (integer, default: 0) - Display order
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())

    - `books`
      - `id` (uuid, primary key)
      - `title` (text, not null) - Book title
      - `author` (text, not null) - Book author(s)
      - `description` (text, nullable) - Book description
      - `isbn` (text, nullable) - ISBN number
      - `rating` (decimal, default: 0) - Average rating (0-5)
      - `cover_image_url` (text, nullable) - Book cover image URL
      - `amazon_url` (text, nullable) - Amazon purchase link
      - `goodreads_url` (text, nullable) - Goodreads link
      - `publisher` (text, nullable) - Publisher name
      - `publication_year` (integer, nullable) - Year published
      - `page_count` (integer, nullable) - Number of pages
      - `category_id` (uuid, references book_categories) - Category
      - `is_featured` (boolean, default: false) - Featured book
      - `is_published` (boolean, default: true) - Published status
      - `views` (integer, default: 0) - View counter
      - `likes` (integer, default: 0) - Like counter
      - `created_by` (uuid, nullable) - Admin who added
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for admin write access

  3. Indexes
    - Add indexes for performance optimization
*/

-- Create book_categories table
CREATE TABLE IF NOT EXISTS book_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  author text NOT NULL,
  description text,
  isbn text,
  rating decimal(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  cover_image_url text,
  amazon_url text,
  goodreads_url text,
  publisher text,
  publication_year integer,
  page_count integer,
  category_id uuid REFERENCES book_categories(id) ON DELETE SET NULL,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_category_id ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_is_published ON books(is_published);
CREATE INDEX IF NOT EXISTS idx_books_is_featured ON books(is_featured);
CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating DESC);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_title ON books USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_books_author ON books USING gin(to_tsvector('english', author));

-- Enable Row Level Security
ALTER TABLE book_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policies for book_categories
CREATE POLICY "Public read access for book categories" ON book_categories
  FOR SELECT USING (true);

CREATE POLICY "Admin write access for book categories" ON book_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
    )
  );

-- Create policies for books
CREATE POLICY "Public read access for published books" ON books
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin write access for books" ON books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
    )
  );

-- Insert default book categories
INSERT INTO book_categories (name, description, icon, sort_order) VALUES
  ('Logo Books', 'Books focused on logo design principles and techniques', 'Zap', 1),
  ('Brand Identity Books', 'Comprehensive guides to building and managing brand identities', 'Star', 2),
  ('Typography Books', 'Essential resources for understanding and mastering typography', 'Type', 3),
  ('Business Books', 'Strategic business and marketing books for designers', 'Briefcase', 4),
  ('Other Graphic Design Books', 'General graphic design principles and techniques', 'Palette', 5)
ON CONFLICT (name) DO NOTHING;