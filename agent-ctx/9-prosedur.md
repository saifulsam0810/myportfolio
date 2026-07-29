# Task ID 9 — Prosedur Kerja Module (SOP)

**Agent:** Subagent (Z.ai Code)
**Module:** Modul 3 — Prosedur Kerja (SOP)
**File created:** `src/components/modules/prosedur.tsx`

## Summary
Implemented the Prosedur Kerja (SOP) module as a single `'use client'` component (`ProsedurModule`) that switches between a List view and a Detail view based on `useAppStore.selectedProsedurId`.

## Implementation Details

### List View
- Uses `useProsedurList(searchQuery, statusFilter)` from `@/lib/hooks`.
- `SectionHeader` with title `Prosedur Kerja (SOP)`, Bahasa Malaysia description, `ClipboardList` icon.
- Filter chips (local `useState`): All / Aktif / Dikemas Kini / Dimansuhkan — mapped to `Semua / Aktif / Dikemas Kini / Dimansuhkan`. Passing `undefined` for `All` so the API returns every record.
- Responsive 1-col (mobile) / 2-col (md+) card grid.
- Each card: `kodProsedur` (mono badge with `Hash` icon), bold truncated `tajuk`, 2-line truncated `tujuan`, `StatusBadge` from `glass.tsx`, `versi` amber badge, `tarikhKuatKuasa` formatted `dd MMM yyyy` (ms-MY) with `Calendar` icon, and a full-width "Lihat Prosedur" button that calls `setSelectedProsedurId(p.id)`.
- Loading (`PageLoader`), error, and empty (`EmptyState`) states handled.

### Detail View
- Uses `useProsedur(selectedProsedurId)`, plus `useBorangList()` and `useRujukanList()` (cached by React Query) to resolve the `borangBerkaitan` and `rujukanPeraturan` ID arrays.
- **Sticky top bar** (`sticky top-4 z-30`): Back button (left) + "Muat Turun PDF" button (right). PDF button triggers `toast.info('Cetakan PDF akan tersedia tidak lama lagi', ...)`.
- **Header card** (`glass-strong`): `tajuk` (large), `kodProsedur` mono badge, `StatusBadge`, `versi` amber badge, both `tarikhKuatKuasa` and `tarikhSemakan` formatted with `Calendar` icons (teal + amber).
- Seven standard SOP sections (PRD 4.1) as distinct `GlassCard`s via the `SectionCard` helper:
  1. **Tujuan** — `Target` icon, `tujuan` text.
  2. **Skop** — `ScanLine` icon, `skop` text.
  3. **Tanggungjawab** — shadcn `Table` (Jawatan | Peranan) with `User` icons. Falls back to plain message when empty.
  4. **Langkah Kerja Terperinci** — vertical numbered timeline. Each step: circular gradient number badge (teal, `ring-4 ring-background`), bold `tindakan`, `tanggungjawab` (teal badge with `User`), `tempohMasa` (amber badge with `Clock`). Connected by an absolutely-positioned vertical gradient line behind the badges. Section header shows a `N langkah` count badge.
  5. **Borang Berkaitan** — client-filtered from `useBorangList()`. Each entry: `FileText` icon (violet tint matching dashboard palette), `kodBorang` mono badge, `format` amber badge, `nama`, and a download icon button that fires a success toast. Shows `Memuatkan...` while the borang list loads, and `Tiada borang berkaitan.` when empty.
  6. **Rujukan Peraturan** — client-filtered from `useRujukanList()`. Each entry: `BookOpen` icon (pink tint matching dashboard palette), `kodRujukan` mono badge, `kategori` teal badge, optional `versi` amber badge, `tajuk`, `penerangan` (2-line clamp), and an external-link icon button that opens `pautanLuaran` in a new tab (`noopener,noreferrer`) when present.
  7. **Sejarah Semakan** — vertical timeline of `{versi, tarikh, perubahan}`. Each entry: small `History` badge (amber), `versi` amber badge, `tarikh` formatted, `perubahan` text in a nested glass card.

### Styling & A11y
- Strictly teal/emerald + amber palette (primary, accent). Violet (borang) and pink (rujukan) tints reused from the dashboard module for cross-module visual consistency — no indigo/blue.
- Glassmorphism via `GlassCard` / `glass-strong` / `glass-subtle`.
- Date formatting centralized in `formatDate()` using `toLocaleDateString('ms-MY', { day:'2-digit', month:'short', year:'numeric' })`.
- Filter chips expose `role="tablist"` / `role="tab"` / `aria-selected`.
- Icon buttons have descriptive `aria-label`s.
- Responsive: grids collapse from 2-col to 1-col on mobile; sticky bar wraps gracefully.
- All user-visible text is in Bahasa Malaysia.

## Patterns Reused
- `GlassCard`, `SectionHeader`, `StatusBadge`, `PageLoader`, `EmptyState` from `@/components/glass`.
- Hooks `useProsedurList`, `useProsedur`, `useBorangList`, `useRujukanList` from `@/lib/hooks`.
- Store actions `selectedProsedurId` / `setSelectedProsedurId` and `searchQuery` from `@/lib/store`.
- shadcn `Table`, `Badge`, `Button` from `@/components/ui/*`.
- `toast` from `sonner` (already wired into layout via `@/components/ui/sonner`).

## Verification
- `bun run lint` — passed, no errors or warnings.
- No new dependencies installed.
- No API routes modified (consumes existing `/api/prosedur`, `/api/borang`, `/api/rujukan`).
