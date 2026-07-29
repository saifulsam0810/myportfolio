# Task ID: 11 — Borang Module

**Agent**: Subagent (Borang / Templat / Dokumen Sokongan)
**File**: `/home/z/my-project/src/components/modules/borang.tsx`
**Export**: `BorangModule` ('use client')

## Context Reviewed
- `/home/z/my-project/worklog.md` (full history)
- `/home/z/my-project/src/components/modules/dashboard.tsx` (pattern reference: StatCard, GlassCard usage, color tints)
- `/home/z/my-project/src/components/modules/carta-alir.tsx` (FilterChip pattern, KATEGORI_BADGE map, SectionHeader+search action chip)
- `/home/z/my-project/src/components/glass.tsx` (GlassCard / SectionHeader / PageLoader / EmptyState / StatusBadge)
- `/home/z/my-project/src/lib/hooks.ts` (`useBorangList(q, kategori)`)
- `/home/z/my-project/src/lib/types.ts` (`Borang`)
- `/home/z/my-project/src/lib/store.ts` (`useAppStore`: `searchQuery`, `setActiveModule`)
- `/home/z/my-project/src/app/api/borang/route.ts` (confirms hook supports q + kategori only; format filtered client-side)
- `/home/z/my-project/prisma/seed.ts` (B001-B008, kategori values: Sumber Manusia / Kewangan / Pentadbiran / Pengurusan Aset / Perkhidmatan Pelanggan / ICT; format values: PDF / Word / Excel; kekerapan values: Kerap / Bulanan / Mingguan / Situasional; status: Aktif / Diarkib)

## Implementation

### Layout (single-view)
1. **SectionHeader**: FileText icon, title "Borang & Dokumen Sokongan", description per spec. Action chip shows current searchQuery (or hint to use search box).
2. **Filter bar** (GlassCard, `p-4 sm:p-5`):
   - Kategori section: Filter + "KATEGORI" label, then chips "Semua" + 6 kategori with live counts derived from server data (NOT format-filtered — so counts reflect true kategori distribution).
   - Format section: Select (shadcn) with options `Semua Format / PDF / Word / Excel`. Format applied client-side via `useMemo` since hook doesn't accept format param.
3. **Stats row** (3 responsive tiles): Jumlah Borang (teal), Borang Kategori Semasa (emerald; label switches to "Borang {kategori}" when filter active), Kerap Digunakan (amber; counts kekerapan==='Kerap' from format-filtered list).
4. **Grid** of BorangCard (1 / 2 / 3 cols responsive via `md:grid-cols-2 xl:grid-cols-3`).
5. **EmptyState**: shows "Tiada borang dijumpai" + "Set Semula Penapis" button when filters are active.

### BorangCard detail
- **Top row**: large format icon (size-12 rounded-xl, size-6 icon) tinted by format; right column shows kodBorang in mono badge (with Hash icon) + Diarkib badge (Archive icon) if status==='Diarkib'.
- **Title**: bold, `line-clamp-2`.
- **Badge row**: kategori (colored per KATEGORI_BADGE map), format (key from `resolveFormat`), kekerapan (amber + Star icon when 'Kerap', else slate).
- **Description**: `line-clamp-2`.
- **Footer**: saizFail (HardDrive icon), tarikhKemasKini (`Dikemas kini: dd MMM yyyy` via `toLocaleDateString('ms-MY')`), versi (Layers icon, `v{versi}`).
- **Actions**: "Muat Turun" Button (primary, flex-1, Download icon) → `toast.success('Muat turun dimulakan', { description: '${nama} (${format})' })`. Adjacent icon button "Lihat Kod QR" (QrCode icon, outline) → `setActiveModule('qr')`.
- **Archived handling**: when `status==='Diarkib'`, the Muat Turun button becomes `disabled` with Tooltip "Dokumen telah diarkibkan". Card opacity reduced to 0.80.

### Format tint decisions (per spec — NO indigo/blue)
- PDF → `bg-rose-500/15 text-rose-700` (red tint, FileText icon)
- Word → `bg-teal-500/15 text-teal-700` (teal tint per spec preference — FileText icon; NOT sky/blue)
- Excel → `bg-emerald-500/15 text-emerald-700` (green, FileSpreadsheet icon)
- Lain (fallback) → slate

### Helpers
- `resolveFormat(format)` → returns `{ key, Icon, tint, badge }` so both card icon and badge use one source of truth; accepts case-insensitive PDF/Word/Excel + alias extensions (doc/docx/xls/xlsx).
- `formatDate(str)` → ms-MY `dd MMM yyyy`, with `'—'` fallback for null/invalid.
- `FilterChip` re-implemented locally (matches carta-alir pattern, since glass.tsx doesn't export one).
- `StatTile` small component for stats row.

### Accessibility & UX
- Filter chips: `aria-pressed={active}`, button role natively.
- Icon-only QR button: `aria-label="Lihat Kod QR"`.
- Disabled archived download wrapped in TooltipProvider + Tooltip describing why.
- framer-motion staggered entrance per card (`opacity 0→1, y 12→0, 0.35s ease-out`).
- All text in Bahasa Malaysia; date format `dd MMM yyyy` ms-MY.

## Lint
- `bun run lint` — passed clean (no errors, no warnings).
- Dev log: pre-existing unrelated `@/components/theme-provider` Module-Not-Found error in `layout.tsx` (NOT caused by this task). Latest compiles succeed.

## No changes to
- API routes, hooks, types, store, glass.tsx, or other modules. Pure consumer of existing `useBorangList` + `useAppStore`.
