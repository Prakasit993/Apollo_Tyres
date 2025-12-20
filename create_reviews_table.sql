-- Create reviews table
create table tyres_reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  car text,
  comment text,
  rating integer default 5,
  image_url text,
  is_active boolean default true
);

-- RLS Policies
alter table tyres_reviews enable row level security;

-- Public can view active reviews
create policy "Public can view reviews"
  on tyres_reviews for select
  using ( is_active = true );

-- Admins can do everything
create policy "Admins can insert reviews"
  on tyres_reviews for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update reviews"
  on tyres_reviews for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete reviews"
  on tyres_reviews for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Admin can view all reviews (even inactive)
create policy "Admins can view all reviews"
  on tyres_reviews for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Grant permissions
grant all on tyres_reviews to authenticated;
grant select on tyres_reviews to anon;
grant all on tyres_reviews to service_role;

-- Reload schema
notify pgrst, 'reload schema';
