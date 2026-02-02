# 🚗 Apollo Tyres - E-commerce Platform

> ระบบขายยางรถยนต์ออนไลน์แบบครบวงจร พัฒนาด้วย Next.js + Supabase

[![Live Demo](https://img.shields.io/badge/🔗_Live_Demo-tyre.mybabymeal.com-blue?style=for-the-badge)](https://tyre.mybabymeal.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com/)

---

## 📸 Screenshots

| หน้าแรก (Storefront) | ระบบหลังบ้าน (Admin) |
|:---:|:---:|
| ![Storefront](https://via.placeholder.com/400x250?text=Storefront) | ![Admin](https://via.placeholder.com/400x250?text=Admin+Dashboard) |

---

## ✨ Features

### 🛒 Customer Features
- **Product Catalog** - แสดงรายการยางรถยนต์พร้อมรายละเอียดครบถ้วน
- **Smart Filter** - กรองตามยี่ห้อ, ขนาด (Width/Aspect/Rim)
- **Shopping Cart** - ระบบตะกร้าสินค้า (Guest + Logged-in sync)
- **Promotions** - ระบบโปรโมชัน (เช่น ซื้อ 4 เส้นราคาพิเศษ)
- **Order Tracking** - ติดตามสถานะคำสั่งซื้อ
- **SEO-friendly URLs** - URL แบบ slug-based

### 🛠️ Admin Dashboard
- **Product Management** - CRUD สินค้า, จัดการสต็อก/ราคา
- **Order Management** - จัดการคำสั่งซื้อ (Pending → Paid → Shipped → Completed)
- **Customer Reviews** - จัดการรีวิวลูกค้า
- **Finance Dashboard** - ภาพรวมรายได้และสถิติ
- **Role-based Access** - แยกสิทธิ์ User/Admin

### 🔐 Security
- **Supabase Auth** - Google OAuth + Email/Password
- **Row Level Security (RLS)** - ควบคุมการเข้าถึงข้อมูลระดับ Database
- **Middleware Protection** - ป้องกัน routes ที่ต้อง authentication
- **Rate Limiting** - ป้องกัน brute-force attacks

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client                                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │  Storefront │    │    Cart     │    │   Checkout  │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Admin Dashboard                         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 (App Router)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │Server Actions│  │  Middleware  │  │  API Routes  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Supabase                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Auth       │  │  PostgreSQL  │  │   Storage    │       │
│  │ (OAuth/JWT)  │  │    (RLS)     │  │   (Slips)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧰 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Next.js Server Actions, Supabase Edge Functions |
| **Database** | PostgreSQL (Supabase), Row Level Security |
| **Auth** | Supabase Auth (Google OAuth, Email/Password) |
| **State** | Zustand (Cart), React Server Components |
| **UI Components** | Radix UI, Lucide Icons, Recharts |
| **Validation** | Zod |
| **Email** | Nodemailer (Gmail) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/Prakasit993/Apollo_Tyres.git
cd Apollo_Tyres

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GMAIL_USER=your_gmail
GMAIL_APP_PASSWORD=your_app_password
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (pages)/           # Public pages
│   ├── admin/             # Admin dashboard
│   ├── checkout/          # Checkout flow
│   └── actions/           # Server actions
├── components/
│   ├── ui/                # Reusable UI components
│   ├── shop/              # Shop-specific components
│   ├── home/              # Homepage components
│   └── layout/            # Layout components
├── lib/
│   ├── supabase-*.ts      # Supabase clients
│   ├── cart-store.ts      # Zustand cart store
│   └── utils.ts           # Utility functions
└── middleware.ts          # Auth middleware
```

---

## 📊 Business Logic Highlights

- **Order Lifecycle**: Pending → Paid → Shipped → Completed / Cancelled
- **Stock Management**: Real-time stock deduction on order
- **Promotion System**: Bundle pricing (e.g., 4 tires = special price)
- **Cart Sync**: Guest cart persists in localStorage, syncs to DB on login
- **Email Notifications**: Order confirmation emails via Nodemailer

---

## 🔮 Roadmap

- [ ] SEO improvements (Sitemap, OG tags)
- [ ] LINE OA notifications via n8n
- [ ] Low stock alerts
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (TH/EN)

---

## 👤 Developer

**Prakasit Kangthin (ประกาศิต กางถิ่น)**

[![GitHub](https://img.shields.io/badge/GitHub-Prakasit993-black?style=flat-square&logo=github)](https://github.com/Prakasit993)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-prakasit993-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/prakasit993)

> 💡 โปรเจกต์นี้พัฒนาเพียงคนเดียว โดยใช้ AI เป็นเครื่องมือช่วยเพิ่มประสิทธิภาพ  
> แต่รับผิดชอบการออกแบบ logic, security และผลลัพธ์ของระบบทั้งหมด

---

## 📄 License

This project is for portfolio/demonstration purposes.

---

<p align="center">
  Made with ❤️ in Thailand
</p>