-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Linked to Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  address text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  is_complete boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- PRODUCTS
create table public.products (
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
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ORDERS
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  status text default 'pending', -- pending, paid, shipped, cancelled
  total_price numeric not null,
  delivery_method text check (delivery_method in ('pickup', 'standard')),
  payment_method text check (payment_method in ('cash', 'transfer', 'qr')),
  shipping_address text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ORDER ITEMS
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null,
  unit_price numeric not null,
  total_price numeric not null
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public read access for products
create policy "Public products are viewable by everyone" on public.products
  for select using (true);

-- User profile access
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Order access
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can insert own orders" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Users can view own order items" on public.order_items
  for select using (
    exists ( select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
  );
