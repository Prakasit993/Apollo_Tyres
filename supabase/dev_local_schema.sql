-- =====================================================================
-- Consolidated LOCAL DEV schema for Apollo Tyres (Supabase local stack)
-- ---------------------------------------------------------------------
-- The repository's real schema is spread across many order-dependent SQL
-- files in supabase/ and supabase/migrations/ that rename base tables to
-- tyres_* and reference tables created outside migrations/. This single
-- idempotent file reconstructs the FINAL schema those files produce so a
-- local `supabase` stack can be provisioned reliably for development.
-- Apply with: psql "$DB_URL" -f supabase/dev_local_schema.sql
-- =====================================================================

create extension if not exists "uuid-ossp";

-- ------------------------- TABLES -----------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  address text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  is_complete boolean default false,
  district text,
  amphoe text,
  province text,
  zipcode text,
  updated_at timestamptz default timezone('utc'::text, now())
);

create table if not exists public.tyres_products (
  id uuid default uuid_generate_v4() primary key,
  brand text not null,
  model text not null,
  width integer not null,
  aspect_ratio integer not null,
  construction text not null default 'R',
  rim integer not null,
  price numeric not null,
  stock integer default 0,
  image_url text,
  featured boolean default false,
  promotional_price numeric,
  promo_min_quantity integer default 1,
  created_at timestamptz default timezone('utc'::text, now())
);

create table if not exists public.tyres_orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  status text default 'pending',
  total_price numeric not null,
  delivery_method text check (delivery_method in ('pickup', 'standard')),
  payment_method text check (payment_method in ('cash', 'transfer', 'qr')),
  shipping_address text,
  slip_url text,
  created_at timestamptz default timezone('utc'::text, now())
);

create table if not exists public.tyres_order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.tyres_orders(id) on delete cascade,
  product_id uuid references public.tyres_products(id) on delete set null,
  quantity integer not null,
  unit_price numeric not null,
  total_price numeric not null
);

create table if not exists public.tyres_cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.tyres_products(id) on delete cascade not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now()),
  unique (user_id, product_id)
);

create table if not exists public.tyres_reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  name text not null,
  car text,
  comment text,
  rating integer default 5,
  image_url text,
  is_active boolean default true,
  link_url text
);

create table if not exists public.tyres_site_settings (
  key text primary key,
  value text,
  description text,
  updated_at timestamptz default timezone('utc'::text, now())
);

-- ------------------------- RLS --------------------------------------
alter table public.profiles enable row level security;
alter table public.tyres_products enable row level security;
alter table public.tyres_orders enable row level security;
alter table public.tyres_order_items enable row level security;
alter table public.tyres_cart_items enable row level security;
alter table public.tyres_reviews enable row level security;
alter table public.tyres_site_settings enable row level security;

-- profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- products
drop policy if exists "Public products are viewable by everyone" on public.tyres_products;
create policy "Public products are viewable by everyone" on public.tyres_products for select using (true);
drop policy if exists "Admins can do everything on products" on public.tyres_products;
create policy "Admins can do everything on products" on public.tyres_products for all
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- orders
drop policy if exists "Users can view own orders" on public.tyres_orders;
create policy "Users can view own orders" on public.tyres_orders for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own orders" on public.tyres_orders;
create policy "Users can insert own orders" on public.tyres_orders for insert with check (auth.uid() = user_id);
drop policy if exists "Admins can view all orders" on public.tyres_orders;
create policy "Admins can view all orders" on public.tyres_orders for select
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
drop policy if exists "Admins can update orders" on public.tyres_orders;
create policy "Admins can update orders" on public.tyres_orders for update
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
drop policy if exists "Admins can delete orders" on public.tyres_orders;
create policy "Admins can delete orders" on public.tyres_orders for delete
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- order items
drop policy if exists "Users can view own order items" on public.tyres_order_items;
create policy "Users can view own order items" on public.tyres_order_items for select
  using (exists (select 1 from public.tyres_orders where tyres_orders.id = tyres_order_items.order_id and tyres_orders.user_id = auth.uid()));
drop policy if exists "Users can insert own order items" on public.tyres_order_items;
create policy "Users can insert own order items" on public.tyres_order_items for insert
  with check (exists (select 1 from public.tyres_orders where tyres_orders.id = tyres_order_items.order_id and tyres_orders.user_id = auth.uid()));
drop policy if exists "Admins can delete order items" on public.tyres_order_items;
create policy "Admins can delete order items" on public.tyres_order_items for delete
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- cart items
drop policy if exists "Users can view own cart items" on public.tyres_cart_items;
create policy "Users can view own cart items" on public.tyres_cart_items for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own cart items" on public.tyres_cart_items;
create policy "Users can insert own cart items" on public.tyres_cart_items for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own cart items" on public.tyres_cart_items;
create policy "Users can update own cart items" on public.tyres_cart_items for update using (auth.uid() = user_id);
drop policy if exists "Users can delete own cart items" on public.tyres_cart_items;
create policy "Users can delete own cart items" on public.tyres_cart_items for delete using (auth.uid() = user_id);

-- reviews
drop policy if exists "Public can view reviews" on public.tyres_reviews;
create policy "Public can view reviews" on public.tyres_reviews for select using (is_active = true);
drop policy if exists "Admins can manage reviews" on public.tyres_reviews;
create policy "Admins can manage reviews" on public.tyres_reviews for all
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- site settings
drop policy if exists "Public settings are viewable by everyone" on public.tyres_site_settings;
create policy "Public settings are viewable by everyone" on public.tyres_site_settings for select using (true);
drop policy if exists "Admins can manage settings" on public.tyres_site_settings;
create policy "Admins can manage settings" on public.tyres_site_settings for all
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- ------------------------- GRANTS -----------------------------------
grant select on public.tyres_products, public.tyres_reviews, public.tyres_site_settings to anon;
grant all on public.profiles, public.tyres_products, public.tyres_orders,
  public.tyres_order_items, public.tyres_cart_items, public.tyres_reviews,
  public.tyres_site_settings to authenticated, service_role;

-- ------------------------- AUTH TRIGGER ------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'customer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();

-- ------------------------- STORAGE ----------------------------------
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('slips', 'slips', true) on conflict (id) do nothing;

drop policy if exists "Public read products/slips" on storage.objects;
create policy "Public read products/slips" on storage.objects for select using (bucket_id in ('products', 'slips'));
drop policy if exists "Authenticated upload products/slips" on storage.objects;
create policy "Authenticated upload products/slips" on storage.objects for insert
  with check (bucket_id in ('products', 'slips') and auth.role() = 'authenticated');

-- ------------------------- SEED DATA --------------------------------
insert into public.tyres_products (brand, model, width, aspect_ratio, construction, rim, price, stock, image_url, featured) values
('Apollo', 'Amazer XP', 195, 65, 'R', 15, 1800, 20, '/placeholder-tire.png', true),
('Apollo', 'Alnac 4G', 205, 55, 'R', 16, 2200, 16, '/placeholder-tire.png', false),
('Bridgestone', 'Ecopia EP300', 185, 60, 'R', 15, 2500, 12, '/placeholder-tire.png', false),
('Michelin', 'Primacy 4', 215, 55, 'R', 17, 4500, 8, '/placeholder-tire.png', true),
('Maxxis', 'i-PRO', 195, 50, 'R', 16, 1900, 24, '/placeholder-tire.png', false),
('Yokohama', 'Advan dB', 225, 45, 'R', 18, 5200, 4, '/placeholder-tire.png', false),
('Apollo', 'Aspire 4G', 225, 50, 'R', 17, 2800, 10, '/placeholder-tire.png', false),
('Dunlop', 'Enasave', 185, 65, 'R', 14, 1600, 8, '/placeholder-tire.png', false),
('Goodyear', 'Assurance', 205, 60, 'R', 16, 2900, 15, '/placeholder-tire.png', false),
('Hankook', 'Kinergy', 195, 55, 'R', 15, 2100, 20, '/placeholder-tire.png', false),
('Continental', 'UltraContact', 215, 50, 'R', 17, 3800, 6, '/placeholder-tire.png', false),
('Dayton', 'DT30', 205, 55, 'R', 16, 1850, 12, '/placeholder-tire.png', false)
on conflict do nothing;

insert into public.tyres_site_settings (key, description, value) values
  ('checkout_remarks', 'Remarks displayed on the checkout page', '<ul><li>มารับของได้ที่ กทม รามอินทรา โซนสวนสยาม</li></ul>'),
  ('hero_image_url', 'Homepage hero background image', 'images/shop-gallery/111.jpg'),
  ('bank_details', 'Bank Account Details', 'Bank: KBANK\nAcc: 123-4-56789-0\nName: Apollo Shop'),
  ('qr_code_url', 'URL of the QR Code image', '')
on conflict (key) do nothing;

insert into public.tyres_reviews (name, car, comment, rating, is_active) values
  ('สมชาย', 'Honda City', 'ยางคุณภาพดีมาก บริการรวดเร็ว', 5, true),
  ('Alex', 'Toyota Yaris', 'Great grip and fast delivery!', 5, true)
on conflict do nothing;
