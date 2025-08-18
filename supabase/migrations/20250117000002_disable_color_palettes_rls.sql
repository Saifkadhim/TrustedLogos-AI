/*
  # Temporarily disable RLS for color_palettes testing

  This migration temporarily disables RLS policies on the color_palettes table
  so you can test the color palette management system without authentication issues.
  
  IMPORTANT: Re-enable RLS before going to production!
*/

-- Temporarily disable RLS on color_palettes table
ALTER TABLE color_palettes DISABLE ROW LEVEL SECURITY;