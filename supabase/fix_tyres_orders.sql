-- Ensure slip_url column exists in tyres_orders
ALTER TABLE tyres_orders ADD COLUMN IF NOT EXISTS slip_url text;

-- Ensure RLS policies are correct (if they were named generically they might be confusing)
-- Drop old policies on the NEW table name if they exist (Postgres carries them over)
DROP POLICY IF EXISTS "Users can view own orders" ON tyres_orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON tyres_orders;

-- Re-create policies referencing the new table name explicitly
CREATE POLICY "Users can view own orders" ON tyres_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON tyres_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Verify order_items policies as well
DROP POLICY IF EXISTS "Users can view own order items" ON tyres_order_items;

CREATE POLICY "Users can view own order items" ON tyres_order_items
  FOR SELECT USING (
    EXISTS ( SELECT 1 FROM tyres_orders WHERE tyres_orders.id = tyres_order_items.order_id AND tyres_orders.user_id = auth.uid() )
  );

-- Grant permissions (just in case)
GRANT ALL ON tyres_orders TO authenticated;
GRANT ALL ON tyres_order_items TO authenticated;
GRANT ALL ON tyres_products TO authenticated;
GRANT ALL ON tyres_products TO anon;
