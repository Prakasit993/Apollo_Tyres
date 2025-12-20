-- 1. Check and Fix Foreign Key Constraint on tyres_order_items
-- We want to allow product deletion even if it's in an order (maybe set product_id to null or keep it but just verify the constraint allows it)
-- Actually, strict integrity usually prevents this. Let's switch to ON DELETE SET NULL so the order history is kept but the link is broken, OR users usually prefer "Soft Delete" (is_active = false) but here we are doing hard delete.
-- Let's try to change the constraint to ON DELETE SET NULL for product_id

ALTER TABLE tyres_order_items
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey; -- Try old name just in case

ALTER TABLE tyres_order_items
DROP CONSTRAINT IF EXISTS tyres_order_items_product_id_fkey;

ALTER TABLE tyres_order_items
ADD CONSTRAINT tyres_order_items_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES tyres_products(id)
ON DELETE SET NULL;

-- 2. Ensure Admin has permission to delete in RLS
DROP POLICY IF EXISTS "Enable delete for users based on email" ON tyres_products;
DROP POLICY IF EXISTS "Enable delete for admins" ON tyres_products;

CREATE POLICY "Enable delete for admins"
ON tyres_products
FOR DELETE
USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
