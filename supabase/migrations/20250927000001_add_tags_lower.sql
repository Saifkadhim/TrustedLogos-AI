/*
  # Case-insensitive tags support
  - Add tags_lower text[] generated/maintained via trigger from tags
  - Backfill existing rows
  - Add GIN index for fast case-insensitive overlap
*/

-- Column to store lowercased tags
ALTER TABLE logos ADD COLUMN IF NOT EXISTS tags_lower text[] DEFAULT '{}';

-- Function to maintain tags_lower from tags
CREATE OR REPLACE FUNCTION logos_sync_tags_lower()
RETURNS trigger AS $$
BEGIN
  NEW.tags_lower := ARRAY(SELECT lower(x) FROM unnest(COALESCE(NEW.tags, '{}')) AS x);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger before insert/update
DROP TRIGGER IF EXISTS trg_logos_tags_lower ON logos;
CREATE TRIGGER trg_logos_tags_lower
BEFORE INSERT OR UPDATE OF tags ON logos
FOR EACH ROW EXECUTE FUNCTION logos_sync_tags_lower();

-- Backfill existing rows once
UPDATE logos SET tags_lower = ARRAY(SELECT lower(x) FROM unnest(COALESCE(tags, '{}')) AS x) WHERE TRUE;

-- Index for array overlap
CREATE INDEX IF NOT EXISTS idx_logos_tags_lower ON logos USING GIN(tags_lower); 