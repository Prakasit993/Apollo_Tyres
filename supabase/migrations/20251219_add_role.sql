-- Add role column to profiles if it doesn't exist
alter table public.profiles 
add column if not exists role text not null default 'customer' check (role in ('customer', 'admin'));

-- Update Policies to allow Admin to do everything
create policy "Admins can do everything"
  on public.products
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can view all orders"
  on public.orders
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update orders"
  on public.orders
  for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
