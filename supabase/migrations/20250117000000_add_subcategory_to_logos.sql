/*
  # Add subcategory column to logos table

  1. Changes
    - Add `subcategory` column to `logos` table
    - Make it nullable text field
    - Add index for performance
*/

-- Add subcategory column to logos table
ALTER TABLE logos ADD COLUMN IF NOT EXISTS subcategory text;

-- Add index for better performance on subcategory queries
CREATE INDEX IF NOT EXISTS idx_logos_subcategory ON logos(subcategory);

-- Add comment to document the new field
COMMENT ON COLUMN logos.subcategory IS 'Optional subcategory within the industry (e.g., "Restaurants" under "Food & Drinks")';