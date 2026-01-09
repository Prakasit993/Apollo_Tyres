-- Add promotional_price column to tyres_products table
-- This allows admins to set special pricing for products
-- NULL value means no promotion is active

ALTER TABLE public.tyres_products 
ADD COLUMN IF NOT EXISTS promotional_price numeric;

-- Add comment to explain the column
COMMENT ON COLUMN public.tyres_products.promotional_price IS 'Special promotional price. When set, this price will be used instead of the regular price. NULL means no promotion.';
