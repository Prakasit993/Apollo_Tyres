-- Add link_url column to tyres_reviews
ALTER TABLE tyres_reviews
ADD COLUMN IF NOT EXISTS link_url text;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
