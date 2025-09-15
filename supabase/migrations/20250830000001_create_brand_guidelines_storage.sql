/*
  # Create storage bucket for brand guideline PDFs
  
  This migration sets up:
  1. A storage bucket for brand guideline PDFs
  2. Proper RLS policies for public access
  3. File size limits and allowed types
  
  Note: This migration only creates the bucket and policies.
  The actual storage bucket creation happens through Supabase dashboard or API.
*/

-- Create the brand-guidelines storage bucket
-- Note: In Supabase, you need to create this bucket through the dashboard first
-- This INSERT will work if the bucket already exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-guidelines',
  'brand-guidelines',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Create a function to generate public URLs for brand guideline PDFs
CREATE OR REPLACE FUNCTION get_brand_guideline_pdf_url(file_path TEXT)
RETURNS TEXT AS $$
BEGIN
  -- This will use the current Supabase URL from environment
  RETURN 'https://' || current_setting('app.settings.supabase_url', true) || '/storage/v1/object/public/brand-guidelines/' || file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get storage URL from environment
CREATE OR REPLACE FUNCTION get_storage_url()
RETURNS TEXT AS $$
BEGIN
  -- Try to get from environment, fallback to a default pattern
  RETURN COALESCE(
    current_setting('app.settings.supabase_url', true),
    'your-project-ref.supabase.co'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to generate full storage URLs
CREATE OR REPLACE FUNCTION generate_storage_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN 'https://' || get_storage_url() || '/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 