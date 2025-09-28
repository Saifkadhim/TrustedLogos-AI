/*
  # Allow image thumbnails in brand-guidelines bucket

  This migration updates the storage bucket to permit common image types
  for thumbnail uploads while keeping PDF support.
*/

-- Ensure the bucket is public and accepts both PDFs and common images
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 52428800, -- 50MB
  allowed_mime_types = ARRAY['application/pdf','image/png','image/jpeg','image/webp']
WHERE id = 'brand-guidelines'; 