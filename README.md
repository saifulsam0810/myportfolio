# Sistem MyPortfolio

**Sistem Portfolio Digital Tugas, Tanggungjawab & Prosedur Kerja Jawatan**

A comprehensive digital portfolio system for managing job scopes, work procedures, checklists, forms, and regulation references — built per the Product Requirement Document (PRD) for a Malaysian government organization.

## Features

The system includes **7 core modules** + a dashboard + admin panel:

| # | Module | Description |
|---|--------|-------------|
| 1 | **Skop Tugas Jawatan** | Job position profiles with KRA breakdown, responsibilities, work relationships, authority, KPIs |
| 2 | **Carta Alir** | Interactive SVG flowcharts for work processes (clickable nodes, PNG export) |
| 3 | **Prosedur Kerja (SOP)** | Standard Operating Procedures with 7-section format + revision history |
| 4 | **Checklist Tugasan** | Daily/Weekly/Monthly task checklists with progress tracking + compliance reports |
| 5 | **Borang & Dokumen** | Form/template repository with category filters + download |
| 6 | **Rujukan Peraturan** | Regulation/circular/SOP reference library grouped by category |
| 7 | **Kod QR** | QR code generator with deep-linking to job profiles |

### Additional Features
- **Authentication**: Sign in / Sign out with role-based access (Admin, Penyelia, Pengguna, Awam/Public)
- **Glassmorphism UI**: Modern frosted-glass design with navy blue palette
- **Responsive**: Mobile-first design with collapsible sidebar
- **Dark mode**: Full light/dark theme support
- **QR deep-linking**: Scanning a QR code opens the linked profile directly

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui component library
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **State**: Zustand (client) + TanStack Query (server)
- **Charts**: Recharts
- **QR Code**: qrcode library
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/)
- A GitHub account (to clone this repo)

### Installation

```bash
# Clone the repository
git clone https://github.com/saifulsam0810/myportfolio.git
cd myportfolio

# Install dependencies
bun install
# or: npm install

# Set up the database connection
cp .env.example .env
# Edit .env with your Supabase connection string (see below)

# Create database tables in Supabase
bun run db:push

# Seed dummy data (4 jawatan, 3 flowcharts, 4 SOPs, 8 borang, 8 rujukan, 4 users)
bun run prisma/seed.ts

# Start the development server
bun run dev
```

The app will be available at `http://localhost:3000`.

### Supabase Database Setup

This project uses **Supabase (PostgreSQL)** as the database. To set it up:

#### Option A: Using Prisma (recommended)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → Database → Connection string**
3. Copy the **Direct connection** string (URI format)
4. URL-encode special characters in the password:
   - `#` → `%23`
   - `*` → `%2A`
   - `@` → `%40`
5. Set `DATABASE_URL` in your `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_ENCODED_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres?schema=public
   ```
6. Run `bun run db:push` to create all tables
7. Run `bun run prisma/seed.ts` to populate with dummy data

#### Option B: Using Supabase SQL Editor (manual)

1. Open the **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of [`supabase-schema.sql`](./supabase-schema.sql)
3. Click **Run** to create all tables and indexes
4. Then run `bun run prisma/seed.ts` locally to populate data

#### Connection Pooler (for serverless deployment)

If deploying to Vercel, Netlify, or other serverless platforms, use the **connection pooler** URL instead:

1. Go to **Project Settings → Database → Connection pooling**
2. Enable connection pooling if not already enabled
3. Copy the pooler connection string (port 6543, transaction mode)
4. Set `DATABASE_URL` with `?pgbouncer=true&connection_limit=1`:
   ```
   DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

### Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `faizal@agensi.gov.my` | `admin123` |
| Penyelia (Supervisor) | `aishah@agensi.gov.my` | `penyelia123` |
| Pengguna (User) | `hafiz@agensi.gov.my` | `pengguna123` |

> Without signing in, you browse as **Awam** (Public) with read-only access.

## Project Structure

```
├── prisma/
│   ├── schema.prisma    # Database models (7 modules + users)
│   └── seed.ts          # Dummy data seeder
├── src/
│   ├── app/
│   │   ├── api/         # REST API routes (jawatan, carta-alir, prosedur, etc.)
│   │   ├── globals.css  # Glassmorphism + navy blue theme
│   │   ├── layout.tsx   # Root layout with theme provider
│   │   └── page.tsx     # Main app entry (module router)
│   ├── components/
│   │   ├── modules/     # 9 module components (dashboard, jawatan, etc.)
│   │   ├── ui/          # shadcn/ui primitives
│   │   ├── app-shell.tsx     # Layout shell (header, sidebar, footer)
│   │   ├── sign-in-dialog.tsx
│   │   └── deep-link-handler.tsx
│   └── lib/
│       ├── db.ts        # Prisma client
│       ├── store.ts     # Zustand store (auth + UI state)
│       ├── hooks.ts     # React Query hooks
│       └── types.ts     # Shared TypeScript types
└── package.json
```

## Database Schema

The system uses 7 Prisma models:
- `Jawatan` — Job positions with KRA, responsibilities, KPIs
- `CartaAlir` — Flowcharts with nodes and edges (JSON)
- `ProsedurKerja` — SOPs with work steps and revision history
- `Checklist` + `ChecklistLog` — Task checklists + toggle logs
- `Borang` — Forms and documents
- `Rujukan` — Regulation references
- `Pengguna` — Users with roles and passwords

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server on port 3000 |
| `bun run build` | Production build |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push Prisma schema to SQLite |
| `bun run db:generate` | Regenerate Prisma client |
| `bun run prisma/seed.ts` | Seed dummy data |

## License

This project is developed for internal organizational use per the PRD specification.

---

**Developed with Z.AI (GLM 5.2)** — AI-assisted code generation platform.
