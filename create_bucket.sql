-- Create the 'products' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Allow public access to images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- Allow authenticated users to upload images
create policy "Authenticated Insert"
  on storage.objects for insert
  with check ( bucket_id = 'products' and auth.role() = 'authenticated' );

-- Allow authenticated users to update/delete (optional, for admin)
create policy "Authenticated Update"
  on storage.objects for update
  using ( bucket_id = 'products' and auth.role() = 'authenticated' );

create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'products' and auth.role() = 'authenticated' );
