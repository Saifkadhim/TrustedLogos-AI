/*
  # Create logos table for logo management system

  1. New Tables
    - `logos`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Logo/Brand name
      - `type` (text, not null) - Logo type (Wordmarks, Lettermarks, etc.)
      - `industry` (text, not null) - Industry category
      - `primary_color` (text, not null) - Main logo color
      - `secondary_color` (text, nullable) - Secondary logo color
      - `shape` (text, not null) - Logo shape category
      - `information` (text, nullable) - Logo description/story
      - `designer_url` (text, nullable) - Designer/owner website URL
      - `image_path` (text, nullable) - Path to image in Supabase Storage
      - `image_name` (text, nullable) - Original filename
      - `file_size` (integer, nullable) - File size in bytes
      - `file_type` (text, nullable) - MIME type (image/png, image/svg+xml)
      - `is_public` (boolean, default: true) - Public visibility
      - `downloads` (integer, default: 0) - Download counter
      - `likes` (integer, default: 0) - Like counter
      - `created_by` (uuid, references profiles) - Admin who uploaded
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())

  2. Storage
    - Create 'logos' bucket for logo images
    - Set up storage policies for public read, admin write

  3. Security
    - Enable RLS on `logos` table
    - Add policies for public read, admin write
    - Add indexes for performance
*/

-- Create logos table
CREATE TABLE IF NOT EXISTS logos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  industry text NOT NULL,
  primary_color text NOT NULL DEFAULT '#000000',
  secondary_color text DEFAULT '#ffffff',
  shape text NOT NULL,
  information text,
  designer_url text,
  image_path text,
  image_name text,
  file_size integer,
  file_type text,
  is_public boolean DEFAULT true,
  downloads integer DEFAULT 0,
  likes integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_logos_industry ON logos(industry);
CREATE INDEX IF NOT EXISTS idx_logos_type ON logos(type);
CREATE INDEX IF NOT EXISTS idx_logos_public ON logos(is_public);
CREATE INDEX IF NOT EXISTS idx_logos_created_at ON logos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logos_downloads ON logos(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_logos_likes ON logos(likes DESC);

-- Enable RLS
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;

-- Create policies for logos table
CREATE POLICY "Anyone can view public logos"
  ON logos
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can insert logos"
  ON logos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update logos"
  ON logos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete logos"
  ON logos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_logos_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE OR REPLACE TRIGGER update_logos_updated_at
  BEFORE UPDATE ON logos
  FOR EACH ROW EXECUTE FUNCTION update_logos_updated_at();

-- Create storage bucket for logos (this needs to be done via Supabase dashboard or API)
-- We'll create the bucket policy here for reference
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can view logo images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Admins can upload logo images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update logo images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete logo images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );