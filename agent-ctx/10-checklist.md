# Task 10 — Checklist Module (Modul 4: Checklist Tugasan)

**Agent:** Subagent (Checklist module builder)
**File created:** `/home/z/my-project/src/components/modules/checklist.tsx`
**Export:** `ChecklistModule` ('use client')

## Reference patterns read
- `worklog.md` — full project history (tasks 1, 7, 8, 9, 13, etc.)
- `src/components/modules/dashboard.tsx` — StatCard, compliance card style, KPI tint colors, motion usage
- `src/components/glass.tsx` — GlassCard, SectionHeader, StatusBadge, PageLoader, EmptyState
- `src/lib/hooks.ts` — `useChecklistList(kekerapan, unit)` + `useToggleChecklistItem()` (mutation args: `{id, itemId, status, catatan?, pengguna?}`; auto-invalidates `['checklist']` and `['dashboard']`)
- `src/lib/types.ts` — `Checklist` (id, tajuk, kekerapan, unit, items[], tarikhMula, createdAt, updatedAt) + `ChecklistItem` (id, bil, tugasan, tanggungjawab, status: 'Selesai'|'Belum Selesai', catatan?) + `Role` ('Admin'|'Penyelia'|'Pengguna'|'Awam')
- `src/lib/store.ts` — `useAppStore` with `role` selector
- `src/app/api/checklist/route.ts` + `src/app/api/checklist/[id]/toggle/route.ts` — confirmed GET filters by kekerapan + unit; POST toggle updates item + writes ChecklistLog with pengguna field
- shadcn UI primitives: tabs, table, checkbox, tooltip, dialog, popover, input, progress, badge, button

## Module architecture

### Top-level `ChecklistModule`
- Reads `role` from `useAppStore`
- Local state: `kekerapan` (default 'Harian'), `reportOpen`, `recentlyDone: Set<string>`
- `useChecklistList(kekerapan)` for active tab data
- `handleToggledDone(itemId)` — adds to recentlyDone Set, removes after 1300ms via setTimeout
- Renders: SectionHeader + Awam banner (conditional) + Tabs + ComplianceReportDialog (Penyelia/Admin only)

### SectionHeader
- Icon: CheckSquare
- Title: "Checklist Tugasan"
- Description: "Tanda status penyelesaian tugasan rutin mengikut kekerapan bagi memastikan akauntabiliti."
- Action button (Penyelia/Admin only): "Laporan Pematuhan" with FileBarChart icon → opens dialog

### Awam banner
- Amber-tinted glass card with ShieldAlert icon
- Explains read-only access for Awam role

### Tabs (Harian / Mingguan / Bulanan)
- shadcn Tabs, value-driven via `kekerapan` state
- TabsList: glass-subtle bg, larger rounded triggers with per-kekerapan icon (Clock/Calendar/ListChecks)
- Per-tab content only mounted when active (`k === kekerapan`) to avoid duplicate fetches
- States: loading → PageLoader in GlassCard; error → EmptyState(Info); empty → EmptyState(CheckSquare); else → ComplianceSummaryCard + AnimatePresence-wrapped ChecklistCard list

### ComplianceSummaryCard
- Aggregates all items across checklists of that kekerapan via `flatMap(c => c.items)`
- Big % (text-gradient), tier-coded Badge "Sasaran 85%"
- Progress bar with tier-colored indicator (`[&>[data-slot=progress-indicator]]:bg-*`)
- 3-column Jumlah/Selesai/Belum stat tiles (glass-subtle)
- Large 96px ProgressRing on right with tier-coded stroke

### ChecklistCard (motion.div with layout + fade-up entrance + exit)
- Header: KekerapanBadge (teal/amber/violet per kekerapan, icon-prefixed) + unit badge (ClipboardCheck)
- tajuk bold, createdAt + selesai count meta line
- Right side: % figure + 56px ProgressRing (stroke color = kekerapan tint)

### ChecklistTable
- shadcn Table with columns: Bil / Tugasan / Tanggungjawab / Status / Catatan
- Tugasan cell: CheckCircle2 (done, emerald) or Circle (not done, muted) + strikethrough when selesai
- Tanggungjawab: primary-tinted Badge with Users icon
- Status: shadcn Checkbox with onCheckedChange handler
- Toggle handler: computes flipped status, calls `useToggleChecklistItem().mutate({id, itemId, status, pengguna: 'Pengguna: ${role}'})`
  - Success → `onToggledDone(itemId)` + sonner toast.success('Status dikemas kini', description) or toast.info for un-complete
  - Error → toast.error
  - Disabled while pending
- Awam: Checkbox disabled, wrapped in Tooltip("Akses awam: hanya baca"); CatatanCell becomes read-only italic

### Green flash animation
- `motion.tr` with `animate` keyframe array `['rgba(16,185,129,0.32)','rgba(16,185,129,0.08)','rgba(0,0,0,0)']` duration 1.2s easeOut
- Triggered when `recentlyDone.has(item.id)` is true
- Uses `motion.tr` directly (not TableRow) so framer-motion can animate background-color keyframes; manually applies border + hover classes

### CatatanCell
- Display button: StickyNote icon + truncated text ("Tambah catatan..." placeholder when empty)
- Opens Popover with Input + Simpan/Batal buttons
- Saves on Simpan click or Enter key
- Calls `toggle.mutate` with new catatan value, status unchanged, pengguna label
- sonner toast on success/error; no-op if value unchanged

### ComplianceReportDialog (Penyelia/Admin only)
- Dialog (sm:max-w-3xl, max-h-90vh flex-col)
- Header: FileBarChart icon + "Laporan Pematuhan Checklist" title
- Body: 4-tile summary (Jumlah Checklist / Jumlah Item / Item Selesai / Pematuhan %)
- Scrollable Table: # / Checklist (tajuk + unit) / Kekerapan / Item / Selesai / Pematuhan
- Pematuhan column: Progress bar with tier color (emerald ≥85%, amber 50–84%, rose <50%) + colored % label
- Sticky header row
- Fetches all 3 kekerapan lists via `useChecklistList('Harian'|'Mingguan'|'Bulanan')` in parallel
- Legend at bottom explaining the 3 tiers

## Helper functions / lookup maps
- `penggunaLabel(role)` → `"Pengguna: ${role}"`
- `computeStats(items)` → `{total, selesai, belum, percent}`
- `tierClass(pct)` → `{badge, stroke, bar, text}` for green/amber/rose tiers
- `KEKERAPAN_TINT` — badge bg/text/border classes per kekerapan (teal/amber/violet)
- `KEKERAPAN_STROKE` — ring stroke color per kekerapan
- `KEKERAPAN_ICON` — Clock/Calendar/ListChecks per kekerapan

## Styling compliance
- Glassmorphism via GlassCard / glass-subtle / glass-strong
- Teal/emerald + amber primary palette; violet reserved for Bulanan kekerapan tint (matches dashboard cross-module color coding — NO indigo/blue)
- All UI text in Bahasa Malaysia
- Fully responsive: tables wrapped in Table's overflow-x-auto container; header row switches from sm:flex-row to col on mobile; stat grids adapt 1→3 cols

## Verification
- `bun run lint` — passed clean (no errors/warnings)
- No new deps installed
- No API/store/types/glass changes — pure consumer of existing hooks + UI primitives
- Dev server log shows recent compiles succeeding (200 status)

## Stage Summary
Modul 4 (Checklist Tugasan Harian/Mingguan/Bulanan) fully implemented and ready to be wired into the main app shell by importing `{ ChecklistModule }` from `@/components/modules/checklist`.
