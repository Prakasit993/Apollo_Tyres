-- Add promo_min_quantity column to tyres_products table
-- This sets the minimum quantity required to get the promotional price
-- Default 1 means no minimum requirement (get promo price immediately)

ALTER TABLE public.tyres_products 
ADD COLUMN IF NOT EXISTS promo_min_quantity integer DEFAULT 1;

-- Add comment to explain the column
COMMENT ON COLUMN public.tyres_products.promo_min_quantity IS 'Minimum quantity required to get promotional_price. Default 1 means promotional price applies to any quantity. Set to 4 means customer must buy at least 4 items to get the promotional price.';

-- Update existing promotional prices to have default minimum of 1
UPDATE public.tyres_products 
SET promo_min_quantity = 1 
WHERE promotional_price IS NOT NULL AND promo_min_quantity IS NULL;
