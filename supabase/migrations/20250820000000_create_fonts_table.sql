/*
  # Create fonts table for font management

  1. New Tables
    - `fonts`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `designer` (text)
      - `category` (text, not null)
      - `style` (text)
      - `tags` (jsonb)
      - `license` (text)
      - `formats` (jsonb)
      - `weights` (jsonb)
      - `featured` (boolean, default: false)
      - `is_public` (boolean, default: true)
      - `downloads` (integer, default: 0)
      - `likes` (integer, default: 0)
      - `rating` (numeric, default: 0)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on `fonts`
    - Public read policy, admin write policies
    - Useful indexes
*/

-- Create fonts table
CREATE TABLE IF NOT EXISTS fonts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  designer text,
  category text NOT NULL DEFAULT 'Other',
  style text,
  tags jsonb DEFAULT '[]'::jsonb,
  license text DEFAULT 'Personal Use Free',
  formats jsonb DEFAULT '[]'::jsonb,
  weights jsonb DEFAULT '[]'::jsonb,
  file_paths jsonb DEFAULT '[]'::jsonb,
  featured boolean DEFAULT false,
  is_public boolean DEFAULT true,
  downloads integer DEFAULT 0,
  likes integer DEFAULT 0,
  rating numeric DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fonts_category ON fonts(category);
CREATE INDEX IF NOT EXISTS idx_fonts_public ON fonts(is_public);
CREATE INDEX IF NOT EXISTS idx_fonts_created_at ON fonts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fonts_downloads ON fonts(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_fonts_likes ON fonts(likes DESC);
CREATE INDEX IF NOT EXISTS idx_fonts_tags ON fonts USING gin(tags);

-- RLS
ALTER TABLE fonts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public fonts"
  ON fonts
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can insert fonts"
  ON fonts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update fonts"
  ON fonts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete fonts"
  ON fonts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger to maintain updated_at
CREATE OR REPLACE FUNCTION update_fonts_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_fonts_updated_at
  BEFORE UPDATE ON fonts
  FOR EACH ROW EXECUTE FUNCTION update_fonts_updated_at();

