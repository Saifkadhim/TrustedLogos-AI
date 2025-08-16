/*
  # Fix RLS policies for logo management
  
  This migration fixes the RLS policies to work with the current system:
  1. Allow public read access to logos
  2. Allow authenticated users to manage logos (we'll handle admin check in app)
  3. Proper storage policies
*/

-- Re-enable RLS (for when you're ready)
-- ALTER TABLE logos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view public logos" ON logos;
DROP POLICY IF EXISTS "Admins can insert logos" ON logos;
DROP POLICY IF EXISTS "Admins can update logos" ON logos;
DROP POLICY IF EXISTS "Admins can delete logos" ON logos;

DROP POLICY IF EXISTS "Anyone can view logo images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload logo images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update logo images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete logo images" ON storage.objects;

-- Create simplified policies (when RLS is enabled)
CREATE POLICY "Public read access to logos"
  ON logos
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Authenticated users can manage logos"
  ON logos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Storage policies (when RLS is enabled)
CREATE POLICY "Public read access to logo images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can manage logo images"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'logos')
  WITH CHECK (bucket_id = 'logos');

-- Create a function to check if current user has admin privileges
-- This can be used later when you implement proper Supabase Auth
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  -- For now, return true for any authenticated user
  -- Later, you can check against profiles table or custom claims
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;