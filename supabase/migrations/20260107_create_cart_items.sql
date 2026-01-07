-- Create cart_items table for persistent cart storage
-- This allows logged-in users to sync their cart across devices

CREATE TABLE IF NOT EXISTS public.tyres_cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.tyres_products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  -- Ensure one cart item per product per user
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.tyres_cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own cart items
CREATE POLICY "Users can view own cart items" 
  ON public.tyres_cart_items
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" 
  ON public.tyres_cart_items
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" 
  ON public.tyres_cart_items
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" 
  ON public.tyres_cart_items
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tyres_cart_items_user_id ON public.tyres_cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_tyres_cart_items_product_id ON public.tyres_cart_items(product_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tyres_cart_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_tyres_cart_items_timestamp
  BEFORE UPDATE ON public.tyres_cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_tyres_cart_items_updated_at();
