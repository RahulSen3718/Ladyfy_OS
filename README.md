# Ladyfy OS (Leadyfy OS)

> **Enterprise-grade Agency Management & Operations SaaS Platform for UGC and Digital Content Agencies.**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_Storage-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 📌 Overview

**Ladyfy OS** is an all-in-one operations and workflow management operating system engineered specifically for high-velocity UGC (User-Generated Content), video production, and digital marketing agencies. It streamlines client orders, scriptwriting lifecycles, creator scheduling, multi-step video editing pipelines, timestamped client reviews, financial profit analytics, and team role-based access control (RBAC).

---

## ✨ Key Features & Modules

### 1. 📊 Executive & Operational Dashboard
- Real-time KPI cards: Total Revenue, Net Profit, Active Orders, Contracted vs Delivered Videos, and Pending Tasks.
- Live urgency tracking for bottlenecked production items.
- Activity audit feed tracking system-wide state changes.

### 2. 🎬 9-Step Linear Video Production Pipeline
Enforces strict linear stage progressions to prevent production errors:
$$\text{Script Approved} \rightarrow \text{Shoot Pending} \rightarrow \text{Raw Footage Received} \rightarrow \text{Video Editing} \rightarrow \text{Internal QA} \rightarrow \text{Client Review} \rightarrow \text{Revision} \rightarrow \text{Final Approved} \rightarrow \text{Delivered}$$
- Kanban board interface with drag-and-drop / status updates.
- Automatic urgency calculation based on due dates and client review cycles.

### 3. ✍️ 7-Step Script Lifecycle Engine
- End-to-end scriptwriting workflow from idea generation, drafting, internal review, client approval, to shoot-ready signoff.
- Direct association with client orders and assigned creators.

### 4. 📅 Creator Roster & Shoot Scheduler
- Comprehensive creator directory with niche categorization, video rates, and contact/payout details.
- **Double-Booking Guardrail**: Database-level compound unique constraints (`[creatorId, date, timeSlot]`) preventing scheduling conflicts.
- Pre-shoot and post-shoot verification checklists for shoot managers.

### 5. 🔒 Client Portal with Timestamped Video Reviewer
- Dedicated, isolated portal (`/portal`) for agency clients.
- Interactive video review player allowing clients and managers to pause and leave precise timestamp-tagged revision comments.
- One-click approval / revision request workflows.
- Multi-tenant client isolation ensuring clients never see agency margins or creator payouts.

### 6. 💰 Financial Engine & Profitability Math
- Automated calculations for gross revenue, creator payouts, and operational expenses.
- **Profitability Formula**:
  $$\text{Net Profit} = \text{Total Revenue Received} - \text{Agency Expenses} - \text{Creator Payouts}$$
- **Duplicate Payout Protection**: Strict constraints preventing duplicate creator compensation for the same video/shoot.

### 7. 👥 Role-Based Access Control (RBAC) & Team Management
- Granular permissions across roles:
  - **ADMIN / OWNER**: Full platform and financial access.
  - **OPERATIONS_MANAGER**: Manage workflows, team assignments, and client operations.
  - **SALES**: Manage clients, leads, and orders.
  - **SCRIPT_WRITER**: Create, edit, and submit scripts.
  - **SHOOT_MANAGER**: Manage creator schedules, equipment, and footage collection.
  - **EDITOR**: Access raw assets, upload cuts, and resolve revision feedback.
  - **CLIENT**: Access orders, review scripts, and approve videos in the portal.

### 8. 🎫 Support Tickets & Auditing
- In-portal client query ticketing system with priority queues and status tracking.
- System-wide activity logs auditing all critical actions.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Actions) |
| **Frontend UI** | [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **ORM & Database** | [Prisma ORM](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/) (Neon / Supabase) |
| **Authentication** | [Supabase Auth](https://supabase.com/auth) (`@supabase/ssr`, `@supabase/supabase-js`) |
| **Storage Abstraction** | Supabase Storage / AWS S3 / Google Drive integration interface |
| **Validation** | [Zod](https://zod.dev/) type-safe schemas |

---

## 📂 Project Structure

```text
├── prisma/
│   ├── schema.prisma          # 18-model relational database schema
│   └── seed.ts                # Database seed script for development & demo
├── src/
│   ├── actions/               # Next.js Server Actions (Auth, Orders, Videos, etc.)
│   ├── app/
│   │   ├── (dashboard)/       # Internal agency dashboard routes
│   │   │   ├── clients/       # Client management & detail views
│   │   │   ├── creators/      # Creator roster & availability
│   │   │   ├── dashboard/     # Executive analytics dashboard
│   │   │   ├── financials/    # Revenue, expenses & payout reports
│   │   │   ├── orders/        # Order management
│   │   │   ├── production/    # 9-step video production pipeline
│   │   │   ├── scripts/       # Script management
│   │   │   ├── shoots/        # Shoot scheduling
│   │   │   ├── tasks/         # Internal task manager
│   │   │   ├── team/          # Team & employee management
│   │   │   └── tickets/       # Support ticketing
│   │   ├── (portal)/          # Client-facing portal routes
│   │   │   └── portal/        # Deliverable approval & review player
│   │   ├── login/             # Authentication login page
│   │   ├── signup/            # Account registration page
│   │   ├── layout.tsx         # Root application layout
│   │   └── page.tsx           # Landing / routing redirect
│   ├── components/            # Reusable UI & business domain components
│   │   ├── clients/           # Client tables & creation modals
│   │   ├── orders/            # Order creation & quota components
│   │   ├── portal/            # Timestamp review player & header
│   │   ├── production/        # Pipeline Kanban board
│   │   ├── shared/            # Header, Sidebar, StatsCard
│   │   └── ui/                # Radix UI + Tailwind design system primitives
│   ├── lib/                   # Database client, auth helpers, storage adapters, utils
│   ├── services/              # Business logic & data access services
│   ├── types/                 # RBAC and domain TypeScript definitions
│   ├── validators/            # Zod validation schemas
│   └── middleware.ts          # Auth & RBAC routing protection middleware
├── .env.example               # Template environment configuration
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.18.0` or higher (Node 20+ recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **PostgreSQL Database**: Neon, Supabase, AWS RDS, or local PostgreSQL instance.

### 1. Clone the Repository
```bash
git clone https://github.com/RahulSen3718/Ladyfy_OS.git
cd Ladyfy_OS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```

Fill in the environment variables:
```env
# PostgreSQL Connection Strings
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/ladyfy_os?schema=public&pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/ladyfy_os?schema=public"

# Supabase Authentication Keys
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SERVICE_ROLE_KEY]"

# App Host
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Storage Configuration (Optional)
STORAGE_PROVIDER="SUPABASE_STORAGE"
```

### 4. Setup Database & Seed Data
```bash
# Generate Prisma Client
npx prisma generate

# Push database schema or run migrations
npx prisma db push

# Seed sample data (admin user, creators, orders, videos)
npm run prisma:seed
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server. |
| `npm run build` | Generates Prisma client and builds production Next.js bundle. |
| `npm run start` | Runs the compiled production build. |
| `npm run lint` | Runs Next.js ESLint checks. |
| `npm run prisma:generate` | Regenerates Prisma TypeScript client. |
| `npm run prisma:migrate` | Runs database migrations. |
| `npm run prisma:push` | Syncs Prisma schema directly with the database. |
| `npm run prisma:seed` | Seeds database with initial roles, clients, and mock data. |

---

## 🛡️ Security & Invariants

- **Multi-Tenant Isolation**: Client queries strictly scoped to session `clientId`. No client can inspect internal agency financials, creator costs, or other client data.
- **Double-Booking Prevention**: Database-level unique constraint ensures creators cannot be assigned overlapping shoot schedules.
- **Compensation Integrity**: Unique relational constraints prevent duplicate payouts on video deliveries.
- **Zero Secrets in Repository**: Sensitive credentials remain isolated in environment variables.

---

## 📄 License

This project is proprietary and maintained for **Ladyfy OS / Leadyfy OS**. All rights reserved.

---

## 👨‍💻 Maintainer

Created & Maintained by **[Rahul Sen](https://github.com/RahulSen3718)**.
