# Leadyfy OS — Production Deployment & Architecture Guide

## 1. Overview
**Leadyfy OS** is an internal Agency Management & Operations SaaS engineered for UGC and Digital Marketing Agencies. This document outlines deployment steps, database migrations, environment variables, security guardrails, and backup policies.

---

## 2. Mandatory Environment Variables

Create `.env` (or configure in Vercel / Supabase Project Settings):

```env
# PostgreSQL Database URLs (Supabase / Neon / AWS RDS)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public&pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"

# Supabase Auth Keys
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE_ROLE_KEY]"

# App Host
NEXT_PUBLIC_APP_URL="https://app.leadyfy.io"

# Storage Provider Interface
STORAGE_PROVIDER="SUPABASE_STORAGE" # Options: GOOGLE_DRIVE, SUPABASE_STORAGE, S3
GOOGLE_DRIVE_CLIENT_ID=""
GOOGLE_DRIVE_CLIENT_SECRET=""
GOOGLE_DRIVE_REFRESH_TOKEN=""
```

---

## 3. Database Migration & Initialization

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```
2. **Apply Database Migrations (PostgreSQL):**
   ```bash
   npx prisma migrate deploy
   ```
3. **Seed Production Baseline Data:**
   ```bash
   npm run prisma:seed
   ```

---

## 4. Production Deployment to Vercel

1. Push code repository to GitHub / GitLab.
2. In Vercel, Import the repository.
3. Set Framework to **Next.js**.
4. Configure Build Command:
   ```bash
   prisma generate && next build
   ```
5. Add all Environment Variables listed in Section 2.
6. Deploy.

---

## 5. Security & RBAC Enforcement

* **Multi-Tenant Client Isolation:** Client queries must strictly enforce `WHERE clientId = currentSession.clientId`. Clients have zero access to creator compensation, employee salaries, or agency profit margins.
* **Double-Booking Guardrail:** Compound unique index on `[creatorId, date, timeSlot]` in table `creator_availabilities` permanently prevents double-booking.
* **Duplicate Payout Protection:** Unique constraints on creator payouts ensure no creator is reimbursed twice for the same shoot or video.

---

## 6. Database Backup & Disaster Recovery Policy

* **Automated Daily Backups:** Enabled via Supabase Point-in-Time Recovery (PITR) or PostgreSQL `pg_dump` daily cron.
* **Manual Snapshot Command:**
  ```bash
  pg_dump -U postgres -h [HOST] -d leadyfy_os > backup_$(date +%Y%m%d).sql
  ```
