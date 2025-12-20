-- 1. Ensure the column exists (Idempotent)
ALTER TABLE tyres_orders ADD COLUMN IF NOT EXISTS slip_url text;

-- 2. Grant permissions to be sure
GRANT ALL ON TABLE tyres_orders TO authenticated;
GRANT ALL ON TABLE tyres_orders TO service_role;

-- 3. CRITICAL: Reload the PostgREST Schema Cache
-- This tells the API "Hey, the structure changed, please refresh!"
NOTIFY pgrst, 'reload schema';
