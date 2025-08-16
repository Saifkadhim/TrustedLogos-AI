/*
  # Temporarily disable RLS for testing logo system
  
  This migration temporarily disables RLS policies on the logos table
  so you can test the logo management system without authentication issues.
  
  IMPORTANT: Re-enable RLS before going to production!
*/

-- Temporarily disable RLS on logos table
ALTER TABLE logos DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on storage objects for logo uploads
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;