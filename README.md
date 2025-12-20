Step 0: กำหนด MVP ให้แคบก่อน (กันงานบาน)

MVP1 (แนะนำ):

Login: Google ก่อน (LINE LIFF ค่อยต่อเป็น MVP2)

Home: filter + list สินค้า (mock หรือ Supabase ก็ได้)

Product detail + เลือกจำนวน + กติกาชุด 4 เส้น

Cart + Checkout

สร้าง Order ลง Supabase

ยิง Webhook ไป n8n เพื่อแจ้ง admin

Admin กดยืนยัน “รับโอน/ยกเลิก” (ผ่าน n8n) แล้วอัปเดตสถานะออเดอร์

เหตุผล: LINE LIFF + ผูกบัญชีให้เนียน “ยากที่สุด” เอาไว้ทีหลังได้ แต่ระบบขายเดินได้ก่อน

Step 1: ตั้งโปรเจกต์เว็บ + โครงหน้า (1 วัน)

ทำให้ “เห็นหน้าเว็บเหมือนตัวอย่าง” ก่อน

สร้าง Next.js + Tailwind + shadcn/ui

ทำ routes เปล่า ๆ: / /login /onboarding/shipping /products/[slug] /cart /checkout /account

จบ Step นี้เมื่อ: เปิดเว็บแล้วมี Home layout + filter sidebar + product cards (mock data ก็ได้)

Step 2: ตั้ง Supabase (Auth + DB) (ครึ่งวัน–1 วัน)
2.1 Auth

เปิด Google Provider ใน Supabase Auth

ตั้ง redirect URLs (dev/prod)

2.2 DB Schema (อย่างน้อย)

profiles

shipping_profiles

products, variants, stock

orders, order_items, payments

2.3 RLS (สำคัญมาก)

ลูกค้า: อ่าน products/variants/stock ได้

ลูกค้า: เขียน orders/order_items ได้เฉพาะ user_id = auth.uid()

การ “ยืนยันรับโอน/ตัดสต๊อก” ให้ทำผ่าน n8n + service role (ไม่ให้ client ทำเอง)

จบ Step นี้เมื่อ: สมัคร/ล็อกอิน Google แล้วเห็น user ใน Supabase และตารางพร้อมใช้งาน

Step 3: ทำ Login + Redirect ตามโปรไฟล์ที่อยู่ (1 วัน)

Flow:

user login (Google)

หลัง login เข้า middleware/guard เช็ค shipping_profiles.is_complete

ถ้าไม่มี → ไป /onboarding/shipping

ถ้ามี → กลับ /

จบ Step นี้เมื่อ:

ล็อกอินครั้งแรกเด้งไปกรอกที่อยู่

กรอกเสร็จแล้วกลับ home

ล็อกอินครั้งต่อไปเด้งเข้า home ทันที

Step 4: Product + Search filter ให้ใช้งานจริง (1–2 วัน)

เริ่มง่าย:

ดึง variants มาแสดงเป็นการ์ด

filter ด้วย:

tire brand

width/aspect/construct/rim

price min/max

รองรับ input “195/65R15” แล้ว parse

จบ Step นี้เมื่อ: ค้นหาแล้ว list เปลี่ยนตาม filter ได้จริง

Step 5: Cart + Pricing ชุด 4 เส้น (1 วัน)

ทำ cart state (localStorage หรือ DB ก็ได้ เริ่ม local ก่อน)

pricing rule:

sets = floor(qty/4)

remainder = qty%4

total = setsset4_price + remainderunit_price

แสดง breakdown ใน cart ชัด ๆ

จบ Step นี้เมื่อ: ใส่ 4 เส้น/5 เส้น แล้วราคาถูกคิดถูกต้อง

Step 6: Checkout → Create Order ใน Supabase (1 วัน)

ลูกค้ากดสั่งซื้อ

สร้าง orders + order_items

ตั้งสถานะ:

เงินสดรับเอง → awaiting_pickup

โอน/QR → pending_payment + pending_verify

แล้วไปหน้า success

จบ Step นี้เมื่อ: มี order จริงใน Supabase และหน้า order history เห็นรายการ

Step 7: เชื่อม n8n (แจ้ง admin + ปุ่มยืนยัน/ยกเลิก) (1–2 วัน)
7.1 เว็บยิง webhook ไป n8n ตอน order.created

payload แบบมาตรฐาน (ที่ผมให้ไปก่อนหน้า) ใช้ได้เลย

7.2 n8n ส่งเข้า LINE admin

ส่งข้อความสรุปออเดอร์

แนบปุ่ม:

“ยืนยันรับโอน”

“ยกเลิก / ไม่ได้รับเงิน”
(ปุ่มยิงกลับ webhook ของ n8n)

7.3 เมื่อ admin กด confirm

n8n update payment_status=paid

ตัดสต๊อก (stock.qty_on_hand - qty)

update order_status=preparing

แจ้ง staff + แจ้งลูกค้า (email/LINE)

จบ Step นี้เมื่อ: ออเดอร์เข้า → admin กดยืนยัน → สต๊อกลด → สถานะเปลี่ยน

Step 8 (ค่อยทำทีหลัง): LINE LIFF Login (MVP2)

หลัง MVP1 วิ่งแล้ว ค่อยเพิ่ม LIFF:

Login ด้วย LIFF → ได้ line_user_id

ผูกเข้ากับ profiles (และถ้าจะให้เป็น “บัญชีเดียวกับ Google” ค่อยทำ account linking เพิ่ม)