/*
  # Add font folder fields for better font organization

  New fields:
    - `license_file_path` (text) - Path to license file in storage
    - `readme_file_path` (text) - Path to readme file in storage
    - `folder_structure` (jsonb) - JSON describing the folder organization
    - `has_folder` (boolean) - Whether this font has a complete folder structure
*/

-- Add new columns to fonts table
ALTER TABLE fonts 
ADD COLUMN IF NOT EXISTS license_file_path text,
ADD COLUMN IF NOT EXISTS readme_file_path text,
ADD COLUMN IF NOT EXISTS folder_structure jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS has_folder boolean DEFAULT false;

-- Add index for folder queries
CREATE INDEX IF NOT EXISTS idx_fonts_has_folder ON fonts(has_folder);

-- Update existing fonts to have has_folder = false
UPDATE fonts SET has_folder = false WHERE has_folder IS NULL; 