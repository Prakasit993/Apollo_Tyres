🚗 Tyre E-commerce Platform (Apollo Tyres)

End-to-End E-commerce Web Application for Automotive Tyre Sales
Built with Next.js + Supabase, featuring a complete storefront and admin back-office system.

🔗 Live Demo: https://tyre.mybabymeal.com

📌 Project Overview

This project is a full-stack E-commerce platform for selling automotive tyres, designed and developed to demonstrate real-world business logic, system thinking, and end-to-end ownership.

The system covers both:

Customer-facing storefront (product browsing, cart, checkout)

Admin back-office dashboard (product, stock, promotion, and order management)

The focus of this project is usability, business flow correctness, and production-ready architecture, rather than UI-only implementation.

🧩 Core Features
🛍️ Storefront (User)

Product catalog with tyre specifications (brand, model, size)

SEO-friendly product URLs (slug-based)

Add to cart with quantity control

Promotion logic (e.g. special price for tyre sets)

Checkout flow with order summary

User account & order history

Google OAuth login via Supabase Auth

🛠️ Admin Dashboard

Secure admin login (role-based access)

Product management (CRUD)

Stock & price management

Promotion configuration

Order lifecycle management:

Pending → Paid → Shipped → Completed

Cancelled (fallback flow)

Sales overview dashboard

Manual status updates with validation

🔐 Authentication & Authorization

Supabase Auth (Email / Google OAuth)

Role-based access control (User / Admin)

Admin routes protected at API and UI level

Designed to support:

Login rate limiting (planned)

Audit logging for admin actions (planned)

🏗️ System Architecture (High Level)
User / Admin
     |
     v
Next.js Frontend
(Storefront & Admin Dashboard)
     |
     v
Supabase Backend
- Auth (Google OAuth)
- PostgreSQL Database
- Role-based Access Control
     |
     v
Automation Layer (Planned)
- n8n workflows
- LINE OA admin notifications

🧠 Tech Stack
Frontend

Next.js

React

TypeScript

HTML5 / CSS3

Backend / Data

Supabase

PostgreSQL

Auth (Google OAuth)

Row Level Security (RLS)

Others

REST API / JSON

SEO-friendly routing

Deployment-ready structure

Automation (planned): n8n

Notification (planned): LINE OA

📊 Business Logic Highlights

Clear order lifecycle with controlled state transitions

Promotion logic separated from base pricing

Stock consistency across order status changes

Admin-only data mutation with role verification

Designed for future scalability and automation

🚧 Current Limitations & Roadmap

This project is intentionally paused to review gaps and improve quality.

In Progress / Planned

SEO enhancements (OG tags, sitemap, canonical URLs)

Security hardening:

Login rate limiting

Brute-force protection

Admin audit logs

Automation workflows:

Order notifications via LINE OA

Stock alerts

Daily admin reports (n8n)

🎯 Project Goals

Demonstrate end-to-end ownership of a real E-commerce system

Show understanding of business logic, not just UI

Practice production-ready architecture and roadmap planning

Serve as a foundation for future automation-focused projects

👤 Author

Prakasit Kangthin
Web Developer – E-commerce Platform
🔗 GitHub: https://github.com/Prakasit993

This project was designed, developed, and maintained by a single developer, using AI tools as development assistants while maintaining full responsibility for system design, logic, and outcomes.

✅ Recommended GitHub Setup

⭐ Pin this repository

🔓 Keep this repo Public

🔒 Keep experimental / incomplete repos Private

📌 Add this repo to GitHub Featured section