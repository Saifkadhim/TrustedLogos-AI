/*
  # Create brand guidelines system for PDF brand books

  1. New Tables
    - `brand_guideline_categories`
      - `id` (uuid, primary key)
      - `name` (text, not null, unique) - Category name (Tech, Fashion, Food & Beverage, etc.)
      - `description` (text, nullable) - Category description
      - `icon` (text, nullable) - Icon name for UI
      - `color` (text, nullable) - Category color for UI
      - `sort_order` (integer, default: 0) - Display order
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())

    - `brand_guidelines`
      - `id` (uuid, primary key)
      - `brand_name` (text, not null) - Brand name (e.g., "Nike", "Apple")
      - `title` (text, not null) - Full title of the guidelines
      - `description` (text, nullable) - Description of the guidelines
      - `pdf_url` (text, not null) - URL to the PDF file
      - `thumbnail_url` (text, nullable) - Thumbnail image URL
      - `category_id` (uuid, references brand_guideline_categories) - Category
      - `industry` (text, nullable) - Industry sector
      - `year_founded` (integer, nullable) - Year the brand was founded
      - `logo_story` (text, nullable) - Brief story about the logo
      - `is_public` (boolean, default: true) - Whether guidelines are publicly available
      - `is_featured` (boolean, default: false) - Featured brand guidelines
      - `views` (integer, default: 0) - View counter
      - `downloads` (integer, default: 0) - Download counter
      - `tags` (text[], default: '{}') - Array of tags (e.g., ["Public Guidelines", "PDF", "Colors Included"])
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

-- Create brand_guideline_categories table
CREATE TABLE IF NOT EXISTS brand_guideline_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  color text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create brand_guidelines table
CREATE TABLE IF NOT EXISTS brand_guidelines (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name text NOT NULL,
  title text NOT NULL,
  description text,
  pdf_url text NOT NULL,
  thumbnail_url text,
  category_id uuid REFERENCES brand_guideline_categories(id) ON DELETE SET NULL,
  industry text,
  year_founded integer,
  logo_story text,
  is_public boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  views integer DEFAULT 0,
  downloads integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_brand_guidelines_category_id ON brand_guidelines(category_id);
CREATE INDEX IF NOT EXISTS idx_brand_guidelines_is_public ON brand_guidelines(is_public);
CREATE INDEX IF NOT EXISTS idx_brand_guidelines_is_featured ON brand_guidelines(is_featured);
CREATE INDEX IF NOT EXISTS idx_brand_guidelines_brand_name ON brand_guidelines USING gin(to_tsvector('english', brand_name));
CREATE INDEX IF NOT EXISTS idx_brand_guidelines_industry ON brand_guidelines(industry);
CREATE INDEX IF NOT EXISTS idx_brand_guidelines_tags ON brand_guidelines USING gin(tags);

-- Enable Row Level Security
ALTER TABLE brand_guideline_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_guidelines ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read access for brand guideline categories" ON brand_guideline_categories;
DROP POLICY IF EXISTS "Admin write access for brand guideline categories" ON brand_guideline_categories;
DROP POLICY IF EXISTS "Public read access for public brand guidelines" ON brand_guidelines;
DROP POLICY IF EXISTS "Admin write access for brand guidelines" ON brand_guidelines;

-- Create policies for brand_guideline_categories
CREATE POLICY "Public read access for brand guideline categories" ON brand_guideline_categories
  FOR SELECT USING (true);

CREATE POLICY "Admin write access for brand guideline categories" ON brand_guideline_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
    )
  );

-- Create policies for brand_guidelines
CREATE POLICY "Public read access for public brand guidelines" ON brand_guidelines
  FOR SELECT USING (is_public = true);

CREATE POLICY "Admin write access for brand guidelines" ON brand_guidelines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
    )
  );

-- Insert default book categories
INSERT INTO brand_guideline_categories (name, description, icon, color, sort_order) VALUES
  ('Tech', 'Technology companies and digital brands', 'Smartphone', '#3B82F6', 1),
  ('Fashion', 'Fashion and lifestyle brands', 'Shirt', '#EC4899', 2),
  ('Food & Beverage', 'Food, drinks, and restaurant brands', 'Utensils', '#F59E0B', 3),
  ('Automotive', 'Car manufacturers and automotive brands', 'Car', '#EF4444', 4),
  ('Media & Entertainment', 'Media, film, and entertainment brands', 'Film', '#8B5CF6', 5),
  ('Corporates', 'Large corporate and financial brands', 'Building2', '#10B981', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert some sample brand guidelines
INSERT INTO brand_guidelines (brand_name, title, description, pdf_url, category_id, industry, year_founded, logo_story, is_featured, tags) VALUES
  ('Nike', 'Nike Brand Guidelines', 'Official Nike brand identity guidelines including logo usage, colors, and typography', '/brand-guidelines/nike.pdf', (SELECT id FROM brand_guideline_categories WHERE name = 'Fashion'), 'Sportswear', 1964, 'The Nike Swoosh was designed by Carolyn Davidson in 1971 for just $35', true, ARRAY['Public Guidelines', 'PDF', 'Colors Included', 'Typography']),
  ('Apple', 'Apple Brand Guidelines', 'Complete Apple brand identity system and design guidelines', '/brand-guidelines/apple.pdf', (SELECT id FROM brand_guideline_categories WHERE name = 'Tech'), 'Technology', 1976, 'The iconic Apple logo was designed by Rob Janoff in 1977', true, ARRAY['Public Guidelines', 'PDF', 'Colors Included', 'Typography', 'Iconography']),
  ('Coca-Cola', 'Coca-Cola Brand Guidelines', 'Coca-Cola brand standards and visual identity guidelines', '/brand-guidelines/coca-cola.pdf', (SELECT id FROM brand_guideline_categories WHERE name = 'Food & Beverage'), 'Beverages', 1886, 'The Coca-Cola script logo was created by Frank Mason Robinson in 1886', true, ARRAY['Public Guidelines', 'PDF', 'Colors Included', 'Typography']),
  ('Google', 'Google Brand Guidelines', 'Google brand identity and design system guidelines', '/brand-guidelines/google.pdf', (SELECT id FROM brand_guideline_categories WHERE name = 'Tech'), 'Technology', 1998, 'The Google logo has evolved through multiple redesigns, most recently in 2015', true, ARRAY['Public Guidelines', 'PDF', 'Colors Included', 'Typography'])
ON CONFLICT DO NOTHING; 