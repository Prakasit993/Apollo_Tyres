-- Add slip_url column to orders table
alter table public.orders 
add column if not exists slip_url text;

-- Create storage bucket for slips
insert into storage.buckets (id, name, public)
values ('slips', 'slips', true)
on conflict (id) do nothing;

-- Set up RLS for storage
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'slips' );

create policy "Authenticated Users can upload slips"
on storage.objects for insert
with check ( bucket_id = 'slips' and auth.role() = 'authenticated' );

-- Admins can view/delete slips
create policy "Admins can do everything on slips"
on storage.objects for all
using ( bucket_id = 'slips' and exists (
  select 1 from public.profiles where id = auth.uid() and role = 'admin'
) );

-- Add default settings for bank details if not exist
insert into public.site_settings (key, description, value)
values 
  ('bank_details', 'Bank Account Details (Bank Name, Acc No)', 'Bank: KBANK\nAcc: 123-4-56789-0\nName: Apollo Shop'),
  ('qr_code_url', 'URL of the QR Code image', '')
on conflict (key) do nothing;
