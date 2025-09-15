/*
  # Cleanup script for brand guidelines tables
  
  This migration can be run to clean up existing brand guidelines data
  if you need to start fresh or if there are conflicts.
  
  WARNING: This will delete all existing brand guidelines data!
  Only run this if you want to start over.
*/

-- Drop existing policies first
DROP POLICY IF EXISTS "Public read access for brand guideline categories" ON brand_guideline_categories;
DROP POLICY IF EXISTS "Admin write access for brand guideline categories" ON brand_guideline_categories;
DROP POLICY IF EXISTS "Public read access for public brand guidelines" ON brand_guidelines;
DROP POLICY IF EXISTS "Admin write access for brand guidelines" ON brand_guidelines;

-- Drop tables (this will also drop all indexes and data)
DROP TABLE IF EXISTS brand_guidelines CASCADE;
DROP TABLE IF EXISTS brand_guideline_categories CASCADE;

-- Note: After running this cleanup, you'll need to run the main migration again
-- to recreate the tables and data 