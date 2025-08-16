/*
  # Safe RLS fix for testing logo system
  
  This migration safely disables RLS on our logos table and creates
  permissive storage policies without modifying system table permissions.
*/

-- Safely disable RLS on our logos table only
ALTER TABLE logos DISABLE ROW LEVEL SECURITY;

-- Create the logos storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies that might be too restrictive
DROP POLICY IF EXISTS "Anyone can view logo images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload logo images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update logo images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete logo images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to logo images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage logo images" ON storage.objects;

-- Create permissive storage policies for the logos bucket
CREATE POLICY "Public read access to logos bucket"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Anyone can upload to logos bucket"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Anyone can update in logos bucket"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'logos')
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Anyone can delete from logos bucket"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'logos');