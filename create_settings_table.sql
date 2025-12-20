-- Create a table for site-wide settings
create table public.site_settings (
  key text primary key,
  value text,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.site_settings enable row level security;

-- Policies
create policy "Public settings are viewable by everyone" on public.site_settings
  for select using (true);

create policy "Admins can update settings" on public.site_settings
  for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can insert settings" on public.site_settings
  for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Seed initial value for 'remarks' (The text currently hardcoded)
insert into public.site_settings (key, description, value)
values (
  'checkout_remarks',
  'Remarks displayed on the checkout page',
  '<ul>
    <li>
        <div><span class="font-bold">มารับของได้ที่:</span> กทม รามอินทรา โซนสวนสยาม ครับ</div>
        <div class="mt-2"><a href="https://maps.app.goo.gl/u8xZxi6XjyWpgm54A" target="_blank" class="inline-flex items-center gap-1.5 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-red-700 shadow-md transition-all no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>เปิดดูแผนที่ร้าน</a></div>
    </li>
    <li><span class="font-bold text-red-600">ราคานี้สำหรับ เงินสด และ เงินโอน เท่านั้น!!</span></li>
    <li><span class="font-bold text-green-600">แถมฟรี!!</span> จุ๊บลมยาง คุณภาพดีที่สุด</li>
    <li><span class="font-bold">ราคาแต่ยางไม่รวมติดตั้ง</span><br /><span class="text-gray-500 text-xs">(มีร้านติดตั้ง ใส่ ถ่วง ใกล้ๆ ผม ห่างกันแค่ 700 เมตร แนะนำให้ครับ)</span></li>
    <li><span class="font-bold">ค่าติดตั้ง เริ่มต้น 4 เส้น 500.-</span><br /><span class="text-gray-500 text-xs">(ใส่ ถอด ถ่วง 4 ล้อ ครับ)</span></li>
    <li><span class="font-bold">ราคาไม่รวมจัดส่ง</span> (มีบริการจัดส่งได้ทั่วไทย)<br />
        <ul class="list-none pl-2 mt-1 space-y-1 text-xs text-gray-600">
            <li>- <span class="font-semibold">กทม : ปริมณฑล</span> ส่งโดย Taxi กด มิสเตอร์ตามจริงครับ</li>
            <li>- <span class="font-semibold">ต่างจังหวัด</span> : ค่าขนส่งขึ้นอยู่กับแต่ละจังหวัดและขนาดยาง</li>
        </ul>
    </li>
</ul>'
) on conflict (key) do nothing;
