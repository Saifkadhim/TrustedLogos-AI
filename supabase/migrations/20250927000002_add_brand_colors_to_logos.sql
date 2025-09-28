/*
  # Add brand_colors to logos
  - text[] array of hex colors for each brand logo
  - default empty array
  - GIN index for overlap queries
*/

ALTER TABLE logos ADD COLUMN IF NOT EXISTS brand_colors text[] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_logos_brand_colors ON logos USING GIN(brand_colors);

COMMENT ON COLUMN logos.brand_colors IS 'Array of brand color hex values (e.g., #FF0000) for this logo'; 