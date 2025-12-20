-- Rename tables
ALTER TABLE products RENAME TO tyres_products;
ALTER TABLE orders RENAME TO tyres_orders;
ALTER TABLE order_items RENAME TO tyres_order_items;
ALTER TABLE site_settings RENAME TO tyres_site_settings;

-- Update RLS names for consistency (Optional but recommended)
-- Postgres renames the table reference in the policy, but the policy name itself remains "Old Name"
-- You might want to rename them manually if strict naming is required.
