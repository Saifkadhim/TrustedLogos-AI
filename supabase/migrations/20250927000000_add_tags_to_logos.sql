/*
  # Add tags column to logos table
  
  1. Changes
    - Add `tags` column to `logos` table as a text array
    - Add index for better performance on tag queries
    - Set default to empty array
*/

-- Add tags column to logos table
ALTER TABLE logos ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add GIN index for better performance on tag array queries
CREATE INDEX IF NOT EXISTS idx_logos_tags ON logos USING GIN(tags);

-- Add comment to document the new field
COMMENT ON COLUMN logos.tags IS 'Array of tags for categorizing and searching logos'; 