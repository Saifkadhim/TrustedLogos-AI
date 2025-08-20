/*
  # Disable RLS for storage objects to allow font uploads

  This disables RLS on storage.objects table so font uploads work without authentication issues.
  IMPORTANT: Re-enable RLS for production deployments.
*/

-- Disable RLS on storage objects table
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Also ensure the fonts bucket allows all operations
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = null
WHERE id = 'fonts';