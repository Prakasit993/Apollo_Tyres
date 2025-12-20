-- Add detailed address columns to profiles
alter table public.profiles
add column if not exists district text,
add column if not exists amphoe text,
add column if not exists province text,
add column if not exists zipcode text;
