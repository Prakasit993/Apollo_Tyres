-- Allow Admins to delete orders
create policy "Admins can delete orders"
  on public.orders
  for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Allow Admins to delete order items (just in case cascade needs it or for manual cleanup)
create policy "Admins can delete order items"
  on public.order_items
  for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
