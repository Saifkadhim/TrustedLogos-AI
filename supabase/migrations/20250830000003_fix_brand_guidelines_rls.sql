/*
  # Fix RLS policies for brand guidelines
  
  This migration fixes the RLS policies to properly check for admin privileges
  using the profiles table with role field.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for brand guideline categories" ON brand_guideline_categories;
DROP POLICY IF EXISTS "Admin write access for brand guideline categories" ON brand_guideline_categories;
DROP POLICY IF EXISTS "Public read access for public brand guidelines" ON brand_guidelines;
DROP POLICY IF EXISTS "Admin write access for brand guidelines" ON brand_guidelines;

-- Create proper policies for brand_guideline_categories
CREATE POLICY "Public read access for brand guideline categories" ON brand_guideline_categories
  FOR SELECT USING (true);

CREATE POLICY "Admin write access for brand guideline categories" ON brand_guideline_categories
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create proper policies for brand_guidelines
CREATE POLICY "Public read access for public brand guidelines" ON brand_guidelines
  FOR SELECT USING (is_public = true);

CREATE POLICY "Admin write access for brand guidelines" ON brand_guidelines
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create a function to check if current user has admin privileges
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated; 