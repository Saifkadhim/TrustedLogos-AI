/*
  # Create color_palettes table for color palette management

  1. New Tables
    - `color_palettes`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Palette name
      - `description` (text, nullable) - Palette description
      - `colors` (jsonb, not null) - Array of color hex codes
      - `category` (text, not null) - Category (Nature, Business, Creative, etc.)
      - `tags` (jsonb, nullable) - Array of tags for searching
      - `is_public` (boolean, default: true) - Public visibility
      - `downloads` (integer, default: 0) - Download counter
      - `likes` (integer, default: 0) - Like counter
      - `created_by` (uuid, references profiles) - Admin who created
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on `color_palettes` table
    - Add policies for public read, admin write
    - Add indexes for performance
*/

-- Create color_palettes table
CREATE TABLE IF NOT EXISTS color_palettes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  category text NOT NULL DEFAULT 'Other',
  tags jsonb DEFAULT '[]'::jsonb,
  is_public boolean DEFAULT true,
  downloads integer DEFAULT 0,
  likes integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_color_palettes_category ON color_palettes(category);
CREATE INDEX IF NOT EXISTS idx_color_palettes_public ON color_palettes(is_public);
CREATE INDEX IF NOT EXISTS idx_color_palettes_created_at ON color_palettes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_color_palettes_downloads ON color_palettes(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_color_palettes_likes ON color_palettes(likes DESC);
CREATE INDEX IF NOT EXISTS idx_color_palettes_tags ON color_palettes USING gin(tags);

-- Enable RLS
ALTER TABLE color_palettes ENABLE ROW LEVEL SECURITY;

-- Create policies for color_palettes table
CREATE POLICY "Anyone can view public color palettes"
  ON color_palettes
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can insert color palettes"
  ON color_palettes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update color palettes"
  ON color_palettes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete color palettes"
  ON color_palettes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_color_palettes_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE OR REPLACE TRIGGER update_color_palettes_updated_at
  BEFORE UPDATE ON color_palettes
  FOR EACH ROW EXECUTE FUNCTION update_color_palettes_updated_at();

-- Insert some sample color palettes
INSERT INTO color_palettes (name, description, colors, category, tags, is_public) VALUES
('Ocean Breeze', 'Cool blues and teals inspired by ocean waves', 
 '["#0077be", "#00a8cc", "#40e0d0", "#87ceeb", "#b0e0e6"]'::jsonb, 
 'Nature', '["blue", "ocean", "cool", "calming"]'::jsonb, true),

('Sunset Vibes', 'Warm oranges and pinks of a beautiful sunset', 
 '["#ff6b35", "#f7931e", "#ffb347", "#ff69b4", "#ff1493"]'::jsonb, 
 'Nature', '["orange", "pink", "warm", "sunset"]'::jsonb, true),

('Corporate Professional', 'Professional colors for business applications', 
 '["#2c3e50", "#34495e", "#7f8c8d", "#95a5a6", "#bdc3c7"]'::jsonb, 
 'Business', '["professional", "corporate", "neutral", "business"]'::jsonb, true),

('Forest Green', 'Natural greens inspired by forest landscapes', 
 '["#228b22", "#32cd32", "#90ee90", "#98fb98", "#f0fff0"]'::jsonb, 
 'Nature', '["green", "forest", "natural", "organic"]'::jsonb, true),

('Tech Innovation', 'Modern tech colors for digital applications', 
 '["#007acc", "#00d4ff", "#6c5ce7", "#a29bfe", "#fd79a8"]'::jsonb, 
 'Technology', '["tech", "digital", "modern", "innovation"]'::jsonb, true);