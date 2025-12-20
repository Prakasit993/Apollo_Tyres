-- Add INSERT policy for order_items
-- This allows users to insert items into an order if they own that order

create policy "Users can insert own order items" on public.order_items
  for insert with check (
    exists ( 
      select 1 from public.orders 
      where orders.id = order_items.order_id 
      and orders.user_id = auth.uid() 
    )
  );
