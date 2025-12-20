-- Create 'slips' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('slips', 'slips', true)
on conflict (id) do nothing;

-- RLS Policies for 'slips' bucket

-- Drop existing policies first to avoid "already exists" error
drop policy if exists "Public Access Slips" on storage.objects;
drop policy if exists "Authenticated Insert Slips" on storage.objects;
drop policy if exists "Authenticated Update Slips" on storage.objects;

-- 1. Allow public read access to slips
create policy "Public Access Slips"
  on storage.objects for select
  using ( bucket_id = 'slips' );

-- 2. Allow authenticated users to upload slips
create policy "Authenticated Insert Slips"
  on storage.objects for insert
  with check ( bucket_id = 'slips' and auth.role() = 'authenticated' );

-- 3. Allow users to update their own slips
create policy "Authenticated Update Slips"
  on storage.objects for update
  using ( bucket_id = 'slips' and auth.role() = 'authenticated' );

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
