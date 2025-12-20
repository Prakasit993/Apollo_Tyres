-- Allow users to insert their own profile
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Ensure update policy is broad enough (normally upsert needs update permission too)
-- Existing policy: "Users can update own profile" for update using (auth.uid() = id); matches.
