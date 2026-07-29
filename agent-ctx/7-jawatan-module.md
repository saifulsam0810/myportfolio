# Task ID: 7 — Jawatan Module (subagent)

## Task
Build `Modul 1: Skop Tugas & Tanggungjawab Jawatan` — list + detail profile views
in `/home/z/my-project/src/components/modules/jawatan.tsx`.

## Work Log
- Read reference files: `dashboard.tsx`, `glass.tsx`, `hooks.ts`, `types.ts`, `store.ts`,
  `tabs.tsx`, `badge.tsx`, `button.tsx`, `separator.tsx`, `table.tsx`, `globals.css`,
  API routes `/api/jawatan` + `/api/jawatan/[id]`.
- Built `JawatanList` view: `SectionHeader` with `Briefcase` icon, responsive grid
  (1 / md:2 / lg:3) of `GlassCard`s. Each card: kodJawatan badge (teal), gradient
  avatar (deterministic hash → 6 teal/amber/emerald/orange/rose tints, NO indigo/blue),
  namaJawatan (line-clamp-2), amber gred badge, full org hierarchy (jabatan › bahagian › unit
  with chevrons), penyelia with User icon, objektifAm (line-clamp-2), "Lihat Profil"
  button with ArrowRight that animates on group-hover. Uses `framer-motion` for staggered
  fade-in-up entrance. Loading → `PageLoader`, no results → `EmptyState`, both inside
  `GlassCard`. Hook: `useJawatanList(searchQuery)` driven by Zustand `searchQuery`.
- Built `JawatanDetail` view: triggered when `selectedJawatanId` set.
  - "Kembali" back button (ArrowLeft) clears selection.
  - `glass-strong` header card with gradient blob, gradient avatar, kodJawatan + amber
    gred badges, namaJawatan, full OrgHierarchy, penyelia, and "Lihat Kod QR" outline
    button that calls `setActiveModule('qr')`.
  - "Objektif Am Jawatan (Job Purpose)" highlighted card (left-primary border + Target
    icon) placed OUTSIDE tabs so it's always visible.
  - `Tabs` with 4 tabs organized: **Profil** (Tanggungjawab Khusus list with
    CheckCircle2 icons + Hubungan Kerja two-column Dalaman/Luaran with Users/Globe
    icons and Separator), **Skop Tugas** (KRA count badge + grid of KRA cards each with
    numbered gradient badge, KRA title, and tugas bulleted list with emerald CheckCircle2),
    **Autoriti** (prominent amber Had Kuasa card with Scale icon + Melulus list of
    approval items as 2-col grid with ShieldCheck icons), **KPI** (desktop Table with
    numbered KPI + amber sasaran badges, mobile card fallback).
  - TabsList styled `glass-subtle` + `grid grid-cols-2 sm:flex` so it fits cleanly on
    mobile (2×2) and inline on desktop.
- Color palette strictly teal/emerald primary + amber/orange accents. Verified no
  indigo/blue usage. All UI text in Bahasa Malaysia.
- Lint: `bun run lint` → clean (no errors/warnings).

## Stage Summary
- File created: `src/components/modules/jawatan.tsx` (~530 lines, `'use client'`).
- Exports named `JawatanModule`. Two-view component (list ↔ detail) driven by
  `useAppStore.selectedJawatanId`, fully consuming `Jawatan` type fields:
  `skopTugas[]`, `tanggungjawab[]`, `hubunganKerja.{dalaman,luaran}`,
  `autoriti.{hadKuasa,melulus[]}`, `kpi[]`.
- Reuses existing hooks (`useJawatanList`, `useJawatan`), store actions, glass
  primitives, and shadcn Tabs/Badge/Button/Table/Separator — no new API routes, no
  changes to other files.
- Pattern-compliant with dashboard.tsx (glass styling, icon tints, motion, gradients).
