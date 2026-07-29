# Sistem MyPortfolio - Worklog

## Project Overview
Building **Sistem MyPortfolio** - a comprehensive digital portfolio system per PRD.
7 modules: Skop Tugas Jawatan, Carta Alir, Prosedur Kerja, Checklist, Borang, Rujukan Peraturan, Kod QR.
Stack: Next.js 16 + TypeScript + Tailwind + shadcn/ui + Prisma (SQLite dummy DB) + glassmorphism UI.

---
Task ID: 1
Agent: Main (Z.ai Code)
Task: Inspect project structure, install qrcode, plan architecture

Work Log:
- Read PRD_Sistem_MyPortfolio.docx (734 lines, Bahasa Malaysia) - 7 modules identified
- Inspected package.json: Next 16, React 19, Prisma 6, shadcn/ui, framer-motion, recharts, zustand, tanstack-query all present
- Inspected prisma/schema.prisma: only User + Post placeholder models
- Inspected src/app: standard layout.tsx, page.tsx, globals.css with default shadcn theme
- Confirmed dev server running on port 3000
- Installed qrcode + @types/qrcode for QR code generation
- Decided: single-page app at `/` with internal section navigation (per constraint only `/` visible)
- Decided: build custom SVG flowchart (no extra heavy deps), use qrcode lib for QR generation
- Color palette: emerald/teal primary + amber/gold accent (avoiding indigo/blue per rules), glassmorphism with backdrop-blur

Stage Summary:
- Architecture planned: Prisma schema (7 models) + REST API routes + single-page glassmorphism UI
- Ready to build schema, seed data, API, and frontend modules

---
Task ID: 9
Agent: Subagent (Prosedur Kerja module)
Task: Build Modul 3 — Prosedur Kerja (SOP) at src/components/modules/prosedur.tsx

Work Log:
- Read existing patterns: dashboard.tsx, glass.tsx (GlassCard/SectionHeader/StatusBadge/PageLoader/EmptyState), hooks.ts (useProsedurList/useProsedur/useBorangList/useRujukanList), types.ts (ProsedurKerja & friends), store.ts (selectedProsedurId/setSelectedProsedurId/searchQuery).
- Read API route /api/prosedur/route.ts to confirm JSON-array fields (tanggungjawab, langkahKerja, borangBerkaitan, rujukanPeraturan, sejarahSemakan) are parsed server-side.
- Created /home/z/my-project/agent-ctx/ directory and wrote work record 9-prosedur.md.
- Implemented ProsedurModule ('use client') with two views switched via selectedProsedurId:
  * List view: SectionHeader + ClipboardList icon; filter chips (All/Aktif/Dikemas Kini/Dimansuhkan) with local state, mapped to ms-MY labels and passing undefined for "All"; responsive 1/2-col card grid; each card shows kodProsedur (mono badge + Hash), tajuk (bold, line-clamp-2), tujuan (line-clamp-2), StatusBadge, versi amber badge, tarikhKuatKuasa (Calendar, dd MMM yyyy ms-MY), full-width "Lihat Prosedur" button → setSelectedProsedurId. Loading/error/empty states handled.
  * Detail view: sticky top bar (Back + Muat Turun PDF → sonner toast.info "Cetakan PDF akan tersedia tidak lama lagi"); glass-strong header (tajuk large, kodProsedur mono, StatusBadge, versi, tarikhKuatKuasa & tarikhSemakan with Calendar icons). Seven SOP sections as GlassCards via SectionCard helper:
      1. Tujuan (Target)
      2. Skop (ScanLine)
      3. Tanggungjawab — shadcn Table (Jawatan | Peranan) with User icons
      4. Langkah Kerja Terperinci — vertical numbered timeline with gradient teal number badges (ring-4 ring-background), bold tindakan, tanggungjawab teal badge (User), tempohMasa amber badge (Clock), connected by absolute gradient line; section header shows langkah count badge
      5. Borang Berkaitan — client-filtered from useBorangList(); FileText (violet tint per dashboard palette), kodBorang mono, format amber badge, nama, download icon button (toast.success)
      6. Rujukan Peraturan — client-filtered from useRujukanList(); BookOpen (pink tint per dashboard palette), kodRujukan mono, kategori teal badge, optional versi amber, tajuk, penerangan, ExternalLink button opens pautanLuaran in new tab
      7. Sejarah Semakan — vertical timeline of {versi, tarikh, perubahan} with History icons and amber tint
- Styling: strictly teal/emerald + amber; reused violet/pink tints only for borang/rujukan to match dashboard cross-module color coding (no indigo/blue). Glassmorphism via GlassCard/glass-strong/glass-subtle. Centralized formatDate() → toLocaleDateString('ms-MY', { day:'2-digit', month:'short', year:'numeric' }). Filter chips expose role=tablist/tab + aria-selected; icon buttons have aria-labels. Fully responsive.
- Verified: bun run lint — passed (no errors/warnings). No new deps. No API changes.

Stage Summary:
- Modul 3 (Prosedur Kerja / SOP) fully implemented and ready to be wired into the main app shell by importing { ProsedurModule } from '@/components/modules/prosedur'.
- Reusable building block: SectionCard helper (icon + title + optional action + children) can be lifted to glass.tsx if other modules need it.

---
Task ID: 7
Agent: subagent (Jawatan module)
Task: Build Skop Tugas Jawatan module with list + detail profile views

Work Log:
- Read reference patterns from dashboard.tsx, glass.tsx, hooks.ts, types.ts, store.ts, and shadcn UI components (tabs, badge, button, separator, table) to ensure style/contract consistency.
- Built JawatanList view: SectionHeader (Briefcase icon) + responsive 1/2/3-col grid of GlassCards. Each card shows kodJawatan badge, deterministic gradient avatar (teal/amber/emerald/orange/rose tints — NO indigo/blue), namaJawatan, amber gred badge, org hierarchy with chevrons, penyelia (User icon), objektifAm (line-clamp-2), and "Lihat Profil" button with animated ArrowRight. framer-motion staggered entrance. PageLoader + EmptyState handled.
- Built JawatanDetail view: back button, glass-strong header card with gradient avatar + "Lihat Kod QR" button (setActiveModule('qr')), highlighted Objektif Am Jawatan card with Target icon (left-primary border, outside tabs), then shadcn Tabs ("Profil", "Skop Tugas", "Autoriti", "KPI"). Profil tab: Tanggungjawab Khusus + Hubungan Kerja (Dalaman/Luaran with Users/Globe icons). Skop Tugas tab: KRA cards with numbered badges + check-circle tugas bullets. Autoriti tab: prominent amber Had Kuasa card (Scale icon) + Melulus 2-col grid (ShieldCheck icons). KPI tab: desktop Table + mobile card fallback with amber sasaran badges.
- TabsList overridden to glass-subtle with grid-cols-2 on mobile (2x2) and flex on desktop for clean responsive fit.
- Ran `bun run lint` — clean (no errors/warnings). Verified all UI text in Bahasa Malaysia and teal/amber palette throughout.

Stage Summary:
- Created /home/z/my-project/src/components/modules/jawatan.tsx (~530 lines, 'use client', named export JawatanModule).
- Two-view component (list ↔ detail) controlled by Zustand selectedJawatanId; consumes full Jawatan type (skopTugas, tanggungjawab, hubunganKerja, autoriti, kpi) via existing useJawatanList/useJawatan hooks.
- No new API routes, no edits to other files. Pattern-aligned with dashboard.tsx (glass, tints, gradients, motion).

---
Task ID: 8
Agent: Carta Alir Module Builder
Task: Build Modul 2 — Carta Alir Ringkas Proses Kerja (interactive flowchart)

Work Log:
- Read worklog.md, dashboard.tsx, glass.tsx, hooks.ts, types.ts, store.ts, UI primitives, API routes for carta-alir
- Created `/home/z/my-project/src/components/modules/carta-alir.tsx` exporting `CartaAlirModule` ('use client')
- Followed established module pattern: GlassCard, SectionHeader, PageLoader, EmptyState; teal/emerald + amber palette (no indigo/blue); sonner toasts; framer-motion

List View:
- `useCartaAlirList(searchQuery, kategori)` driven by store.searchQuery + local `kategori` state
- SectionHeader: Workflow icon, title "Carta Alir Proses Kerja", description per spec
- Filter chips: Semua + 5 kategori (Pentadbiran, Kewangan, Sumber Manusia, Perkhidmatan Pelanggan, ICT) with live counts per kategori
- Responsive grid (1/2/3 cols). Each card: kategori badge (colored), kodCarta (mono), tajuk (bold, line-clamp-2), penerangan (line-clamp-2), mini badges for node count + decision count, "Lihat Carta Alir" button → `setSelectedCartaId(id)`
- Search hint chip in header showing current query
- EmptyState for no-results

Viewer View (selectedCartaId set):
- `useCartaAlir(selectedCartaId)`, Back button to clear selection
- Header card: kodCarta badge (mono), kategori badge (colored), tajuk, penerangan, "Muat Turun PNG" button with Tooltip

Flowchart layout algorithm:
- BFS from root (jenis==='mula' preferred, else in-degree 0, else first node)
- Assigns `level` (depth) to each node; nodes at same level rendered side-by-side
- Disconnected nodes appended as tail level
- Position: each level centered horizontally within SVG width; y = level * LEVEL_HEIGHT
- Constants: NODE_W=200, NODE_H=80, NODE_SPACING_X=250, LEVEL_HEIGHT=150, PADDING=60
- SVG width = maxLevelWidth * spacing + 2*padding; height = (maxLevel+1) * levelHeight + 2*padding

SVG rendering (single self-contained <svg> for clean PNG export):
- Defs: 4 linearGradients (g-mula emerald, g-tamat rose, g-keputusan amber, g-proses teal-glass), arrow marker, soft drop-shadow filter
- Nodes by jenis:
  - `mula` → ellipse (rounded-full vibe), emerald gradient, Play icon, white text
  - `proses` → rounded rect (rx=14), teal/white glass gradient, Workflow icon, dark teal text
  - `keputusan` → diamond polygon, amber gradient, GitBranch icon, brown text
  - `tamat` → ellipse, rose gradient, Flag icon, white text
- Multi-line labels supported (split on `\n`, max 3 lines, vertically centered)
- Inline SVG icons (16x16) drawn natively — no foreignObject, so PNG export is reliable
- Edges: smooth cubic Bezier curves; vertical (parent→child) or horizontal (sibling); arrowhead marker; edge labels in glass pill at midpoint
- Nodes clickable (cursor pointer, role=button, Enter/Space keyboard support) → opens Dialog with penerangan + NodeKindBadge
- If `prosedurId` present → "Lihat Prosedur Penuh" button calls `setSelectedProsedurId` + `setActiveModule('prosedur')`
- Framer-motion `motion.g` entrance: opacity 0→1 + scale 0.85→1 with stagger (transformBox: fill-box, transformOrigin: center)
- Horizontally scrollable wrapper (`overflow-x-auto`) with inner div sized to SVG width — mobile-friendly for wide diagrams

PNG export:
- Serializes the live SVG via XMLSerializer → blob → Image → 2x scaled canvas → PNG blob → download as `carta-alir-{kodCarta}.png`
- White background fill, success/error toasts via sonner

Legend:
- 4-col responsive grid explaining Mula/Proses/Keputusan/Tamat with mini gradient shape previews (diamond rotated) + icons + descriptions

Lint: passes `bun run lint` clean (resolved `react-hooks/static-components` by replacing `iconFor()` function calls with static `NODE_ICONS` lookup map).

Stage Summary:
- Modul 2 (Carta Alir) complete: list + interactive SVG flowchart viewer with BFS layout, clickable nodes, dialog with prosedur deep-link, framer-motion animations, legend, and PNG export.
- File: `/home/z/my-project/src/components/modules/carta-alir.tsx` (~830 lines, single export `CartaAlirModule`).
- No API/store/types changes — pure consumer of existing hooks.

---
Task ID: 13
Agent: Subagent (QR Code module)
Task: Build Modul 7 — Kod QR Portfolio at src/components/modules/qr-code.tsx

Work Log:
- Read worklog.md + reference patterns: dashboard.tsx (GlassCard/SectionHeader/StatusBadge/PageLoader/EmptyState usage, teal+amber palette, motion staggered entrance), glass.tsx, hooks.ts (useJawatanList/useBorangList/useQrCode — React-Query-cached POST /api/qrcode), types.ts (Jawatan, Borang), store.ts, ui/select.tsx (SelectItem supports multiple spans via ItemText), ui/tabs.tsx, ui/button.tsx, ui/input.tsx, ui/badge.tsx, app/api/qrcode/route.ts (returns { dataUrl, text } with teal-700 dark on white, errorCorrectionLevel H, width 320, margin 2).
- Created /home/z/my-project/src/components/modules/qr-code.tsx (~430 lines, 'use client', named export `QrCodeModule`).
- SectionHeader: QrCode icon, title "Kod QR Portfolio", description per spec.
- Two-panel layout (grid-cols-1 lg:grid-cols-2):

  LEFT PANEL — Penjana Kod QR (GlassCard strong):
  - Source selector via shadcn Tabs (grid-cols-3, h-auto): "Jawatan" (Briefcase), "Borang" (FileText), "URL Tersuai" (Link2). Default "jawatan".
  - Jawatan tab: Select listing all jawatan (useJawatanList), each SelectItem shows kodJawatan (mono primary) + namaJawatan. Auto-selects first item once list loads. Below Select: amber Gred badge, teal Unit badge (Building2), emerald Bahagian badge.
  - Borang tab: Select listing all borang (useBorangList), each SelectItem shows kodBorang + nama. Auto-selects first item. Below: amber format badge + teal kategori badge.
  - URL Tersuai tab: Input for any URL/text + helper text.
  - "Pautan Dipilih" read-only code box (mono, small, truncate) with Link2 icon + copy icon button (navigator.clipboard.writeText, sonner toast.success/error).
  - White 280px rounded QR card (bg-white p-4 ring-1 shadow-lg shadow-primary/10): shows spinner while qrBusy, motion.img (initial opacity/scale) when qrReady, AlertCircle + error text when qrError, placeholder QrCode icon + hint when no selectedText. `selectedText` derived via useMemo — for jawatan: `${origin}/jawatan/${kodJawatan}`; borang: `${origin}/borang/${kodBorang}`; custom: trimmed input. origin = `typeof window !== 'undefined' ? window.location.origin : ''`.
  - useQrCode(selectedText) — passes null when empty so hook stays disabled (no N+1 fetches).

  RIGHT PANEL — Pratonton & Muat Turun (GlassCard strong, flex flex-col):
  - Printable preview card (w-[300px] bg-white rounded-2xl shadow-xl ring-1 p-5 text-center): brand strip (teal-700 logo square with QrCode + "MyPortfolio" uppercase tracking), centered 200px QR image (or muted QrCode placeholder), title (jawatan.namaJawatan | borang.nama | "Pautan Tersuai"), subtitle (kodJawatan/kodBorang/origin in mono teal-700), dashed top-border footer "Imbas untuk capaian pantas • MyPortfolio".
  - Motion entrance (opacity+y) keyed by `${source}-${previewMeta.code}` so it re-animates on source change.
  - mt-auto grid grid-cols-1 sm:grid-cols-2:
    * "Muat Turun PNG" (primary, rounded-full): creates detached <a> element with href=dataUrl, download=`qr-${code||'custom'}.png`, click, remove. sonner toast.success.
    * "Cetak" (outline glass-subtle border-0, rounded-full): opens new window, writes a fully-styled HTML doc (matching label layout with brand strip, 240px QR, title, subtitle, dashed footer, @media print rule), inline onload setTimeout → window.print(). sonner toast.info "Bersedia untuk cetakan". Catches pop-up blocker with toast.error. HTML content escaped via escapeHtml() helper to prevent injection.
  - Both buttons disabled when !qrReady.

- BELOW PANELS — Carta Organisasi QR section:
  - Header with Briefcase icon tint box, title + description, and amber count badge showing total jawatan.
  - Loading → GlassCard + PageLoader. Error/empty → EmptyState with AlertCircle/Briefcase icon.
  - Grid (1/2/3/4 cols responsive). Each jawatan card: motion staggered entrance (delay = min(idx*0.04, 0.4)), GlassCard p-4 flex flex-col gap-3, hover lift + shadow; active card gets ring-2 ring-primary/60 + shadow-lg shadow-primary/10. Inner: Briefcase avatar (teal tint), kodJawatan with Hash icon (mono primary), namaJawatan (line-clamp-2), amber Gred badge + teal Unit badge, full-width button.
  - Button: "Jana & Muat Turun QR" (QrCode icon, outline) or "Dipilih" (Check icon, default) when active. onClick → setSource('jawatan') + setJawatanId(id) + window.scrollTo({top:0, behavior:'smooth'}) + toast.success. This is the "select & generate" pattern — avoids N parallel useQrCode fetches in the grid map.

- Styling: strictly teal/emerald + amber (NO indigo/blue). White cards for QR display on top of glass-strong panels. QR uses teal-700 (#0f766e) dark on white per existing API. Lucide icons: QrCode, Download, Printer, Copy, Link2, Briefcase, FileText, ExternalLink, Check, Hash, Building2, Sparkles, AlertCircle.
- Accessibility: all icon buttons have aria-labels; TabsList grid; live region on Pautan Dipilih code; motion entrance only (no spinning/looping that would impede reading); copy/print disabled when no QR ready.
- Verified `bun run lint` — passed clean (no errors/warnings). No new deps. No API/store/types changes. Pure consumer of existing hooks (useJawatanList, useBorangList, useQrCode) and existing UI primitives.

Stage Summary:
- Modul 7 (Kod QR Portfolio) fully implemented and ready to be wired into the main app shell by importing { QrCodeModule } from '@/components/modules/qr-code'.
- File: /home/z/my-project/src/components/modules/qr-code.tsx (~430 lines, single 'use client' named export).
- Single React-Query-cached useQrCode call for the active selection only — no N-fetches in the jawatan grid (uses select-and-generate pattern with smooth scroll-to-top).
- PNG download + print (new-window, styled label) fully functional with sonner toasts.

---
Task ID: 11
Agent: Subagent (Borang module)
Task: Build Modul 5 — Borang & Dokumen Sokongan at src/components/modules/borang.tsx

Work Log:
- Read worklog.md + dashboard.tsx + carta-alir.tsx (FilterChip/KATEGORI_BADGE pattern) + glass.tsx + hooks.ts + types.ts + store.ts + /api/borang/route.ts + seed.ts (B001-B008 sample data) to confirm kategori/format/kekerapan/status value sets.
- Created /home/z/my-project/src/components/modules/borang.tsx exporting `BorangModule` ('use client') — single-view repository layout.
- Created /home/z/my-project/agent-ctx/11-borang.md work record.
- Layout: SectionHeader (FileText icon, "Borang & Dokumen Sokongan", description per spec) → Filter bar GlassCard (kategori chips Semua + 6 kategori with live counts derived from server data; format Select Semua/PDF/Word/Excel applied client-side) → 3 stat tiles (Jumlah Borang teal, Borang Kategori Semasa emerald, Kerap Digunakan amber — counts kekerapan==='Kerap') → responsive 1/2/3-col card grid → EmptyState with Set Semula Penapis action.
- BorangCard: large format icon (size-12) tinted by format — PDF=rose, Word=teal (NOT sky/blue per spec preference), Excel=emerald; kodBorang mono badge with Hash icon; Diarkib badge if status==='Diarkib'; nama bold line-clamp-2; badges for kategori (KATEGORI_BADGE map per carta-alir palette), format (key), kekerapan (amber + Star when 'Kerap'); penerangan line-clamp-2; footer with saizFail (HardDrive), tarikhKemasKini (Calendar, "Dikemas kini: dd MMM yyyy" ms-MY), versi (Layers, v{versi}); "Muat Turun" primary button → toast.success('Muat turun dimulakan', { description: '${nama} (${format})' }); "Lihat Kod QR" icon button → setActiveModule('qr'). Archived cards: download disabled with Tooltip "Dokumen telah diarkibkan", card opacity 0.80.
- Helpers: resolveFormat(format) returns {key, Icon, tint, badge} — single source of truth for icon + badge; accepts case-insensitive PDF/Word/Excel + doc/docx/xls/xlsx aliases. formatDate() → ms-MY dd MMM yyyy with '—' fallback. FilterChip + StatTile local components matching carta-alir pattern.
- Accessibility: aria-pressed on chips, aria-label on icon-only QR button, TooltipProvider on archived/disabled download explaining "Dokumen telah diarkibkan". framer-motion staggered card entrance (opacity 0→1, y 12→0).
- Styling: glassmorphism via GlassCard/glass-subtle; teal/emerald primary + amber accent; NO indigo/blue-500 (Word uses teal tint per spec). All text Bahasa Malaysia.
- Lint: `bun run lint` — passed clean (no errors/warnings). No API/store/types/glass changes — pure consumer of useBorangList + useAppStore.

Stage Summary:
- Modul 5 (Borang & Dokumen Sokongan) fully implemented and ready to be wired into the main app shell by importing { BorangModule } from '@/components/modules/borang'.
- Single file: /home/z/my-project/src/components/modules/borang.tsx (~430 lines, 'use client', named export BorangModule).

---
Task ID: 12
Agent: Subagent (Rujukan module)
Task: Build Modul 6 — Rujukan Peraturan, Garis Panduan, SOP & Pekeliling at src/components/modules/rujukan.tsx

Work Log:
- Read worklog.md + dashboard.tsx + glass.tsx (GlassCard/SectionHeader/StatusBadge/PageLoader/EmptyState) + hooks.ts (useRujukanList(q, kategori, status)) + types.ts (Rujukan) + store.ts (searchQuery) + collapsible.tsx + tooltip.tsx + /api/rujukan/route.ts (supports q + kategori + status query params, ordered by kodRujukan asc) to confirm contract.
- Created /home/z/my-project/src/components/modules/rujukan.tsx (~480 lines, 'use client', named export `RujukanModule`).
- Created /home/z/my-project/agent-ctx/12-rujukan.md work record.
- SectionHeader: BookOpen icon, title "Rujukan Peraturan & Pekeliling", description per spec.
- Stat cards (3-col grid): Jumlah Rujukan (Library, primary tint), Aktif (CircleCheck, emerald), Digantikan & Dimansuhkan (CircleSlash, rose). Counts derived from current filtered rujukan list — so stats reflect applied filters.
- Filter bar (GlassCard, two chip rows + Set Semula Penapis ghost button when any filter active):
  * Kategori chips: Semua (primary) + 6 kategori with their respective tint + icon — Peraturan Am (Scale, emerald), Pekeliling Perkhidmatan (FileCheck, teal), PKPA (Gavel, amber), Arahan Perbendaharaan (Shield, orange), SOP Dalaman (ClipboardList, violet), Piagam Pelanggan (BookOpen, rose). Local state `kategori` (empty string = Semua).
  * Status chips: Semua (primary) / Aktif (emerald) / Digantikan (amber) / Dimansuhkan (rose). Local state `status` (empty = Semua).
- useRujukanList(searchQuery, kategori||undefined, status||undefined) — passes undefined when filter is "Semua" so the API omits that param.
- Grouped display via shadcn Collapsible: rujukan grouped by kategori using a Map, then ordered by KATEGORI_CONFIG sequence (any unknown kategori appended at the end with a neutral slate fallback). Each group is a Collapsible GlassCard with header (kategori-tinted icon + name + "{n} rujukan tersenarai" subtitle + count badge + ChevronDown that rotates 180° when open). Default all expanded (defaultOpen=true per spec).
- RujukanCard (inside each group): framer-motion entrance (opacity 0→1, y 8→0, staggered by min(idx*0.03, 0.3)); 3-section flex-col → sm:flex-row layout:
  * Left: size-12/sm:size-14 rounded icon container with kategori-colored tint (icon = Scale/FileCheck/Gavel/Shield/ClipboardList/BookOpen per kategori).
  * Middle: badges row (kodRujukan mono primary + kategori colored chip badge + optional versi amber badge with `v{versi}`), tajuk bold line-clamp-2, penerangan line-clamp-2, optional tarikhKuatKuasa with Calendar icon and "Kuat kuasa: dd MMM yyyy" text (omitted when null per spec).
  * Right: StatusBadge (Aktif emerald / Digantikan rose-amber / Dimansuhkan rose) + action buttons. "Portal Rasmi" outline button (ExternalLink icon, opens pautanLuaran in new tab via anchor + target="_blank" rel="noopener noreferrer") and "Salin Pautan" icon button (Copy icon, calls navigator.clipboard.writeText(r.pautanLuaran), sonner toast.success with the copied URL as description; toast.error on failure). Both buttons are wrapped in Tooltip and only rendered when r.pautanLuaran is truthy.
- Empty/loading/error states handled: PageLoader while isLoading; EmptyState (BookOpen icon) with contextual copy when rujukan.length === 0 (different message depending on whether filters are applied).
- Helpers: KATEGORI_CONFIG + KATEGORI_MAP + getKategoriConfig(name) with slate fallback for unknown kategori; formatDate() → toLocaleDateString('ms-MY', { day:'2-digit', month:'short', year:'numeric' }) returning empty string when null (so the "Kuat kuasa:" row is omitted entirely per spec).
- Styling: strictly glassmorphism via GlassCard/glass-subtle; teal/emerald primary + amber accent + per-kategori tints (emerald/teal/amber/orange/violet/rose — NO indigo or blue-500 per spec). All UI text in Bahasa Malaysia.
- Accessibility: filter chips use role="tab" + aria-selected + aria-label; collapsible trigger has aria-label that toggles "Tutup/Buka kategori ..."; icon-only copy button has aria-label="Salin pautan"; "Portal Rasmi" anchor has descriptive aria-label; decorative icon containers use aria-hidden. Responsive: stat grid 1/3 cols, card layout stacks on mobile.
- Verified `bun run lint` — passed clean (no errors/warnings). No new deps. No API/store/types/glass changes — pure consumer of existing useRujukanList + useAppStore.searchQuery + existing UI primitives (Collapsible, Tooltip, Badge, Button).

Stage Summary:
- Modul 6 (Rujukan Peraturan & Pekeliling) fully implemented and ready to be wired into the main app shell by importing { RujukanModule } from '@/components/modules/rujukan'.
- Single file: /home/z/my-project/src/components/modules/rujukan.tsx (~480 lines, 'use client', named export RujukanModule).
- Grouped collapsible display with kategori color-coding, copy-to-clipboard with sonner toast, external link opening, and dual filter (kategori + status) wired to global searchQuery from Zustand store.

---
Task ID: 10
Agent: Subagent (Checklist module)
Task: Build Modul 4 — Checklist Tugasan Harian/Mingguan/Bulanan at src/components/modules/checklist.tsx

Work Log:
- Read reference patterns: worklog.md, dashboard.tsx (StatCard/Progress/compliance card style), glass.tsx (GlassCard/SectionHeader/StatusBadge/PageLoader/EmptyState), hooks.ts (useChecklistList(kekerapan, unit) + useToggleChecklistItem signature {id, itemId, status, catatan?, pengguna?}), types.ts (Checklist + ChecklistItem with status 'Selesai'|'Belum Selesai'), store.ts (useAppStore.role), UI primitives (tabs/table/checkbox/tooltip/dialog/popover/input/progress/badge/button).
- Read API routes /api/checklist/route.ts (GET supports kekerapan + unit filters, returns items parsed as JSON array) and /api/checklist/[id]/toggle/route.ts (POST updates item status + catatan, writes ChecklistLog with pengguna field). Confirmed toggle hook auto-invalidates both ['checklist'] and ['dashboard'] query keys.
- Created /home/z/my-project/agent-ctx/10-checklist.md work record.
- Implemented ChecklistModule ('use client', single named export) with:
  * SectionHeader: CheckSquare icon, title "Checklist Tugasan", description "Tanda status penyelesaian tugasan rutin mengikut kekerapan bagi memastikan akauntabiliti."
  * Optional SectionHeader action button "Laporan Pematuhan" (FileBarChart icon) visible only when role === 'Penyelia' || 'Admin' — opens ComplianceReportDialog.
  * Awam-role banner: amber glass card with ShieldAlert icon explaining read-only access.
  * shadcn Tabs (Harian / Mingguan / Bulanan) with default Harian, value-driven via local kekerapan state passed to useChecklistList(kekerapan). TabsList uses glass-subtle bg with larger rounded triggers, each kekerapan tab carries its own icon (Clock/Calendar/ListChecks).
  * Per-tab content (only mounted when active to avoid double-fetch): loading → PageLoader in GlassCard; error → EmptyState(Info); empty → EmptyState(CheckSquare); else → ComplianceSummaryCard + AnimatePresence-wrapped ChecklistCard list.
  * ComplianceSummaryCard: aggregates all items across checklists of that kekerapan (flatMap items → computeStats), big % (text-gradient), tier-coded Badge "Sasaran 85%" + Progress bar (tier bar color via [&>[data-slot=progress-indicator]]:bg-* selector), 3-column Jumlah/Selesai/Belum stat tiles (glass-subtle), and a large 96px ProgressRing on the right with tier-coded stroke. Matches dashboard compliance card style.
  * ChecklistCard (motion.div, layout + fade-up entrance + exit): header row with KekerapanBadge (teal/amber/violet tints per kekerapan, icon-prefixed), unit badge (ClipboardCheck), tajuk bold, createdAt + selesai count meta line; right side has % figure + 56px ProgressRing (stroke color = kekerapan tint).
  * ChecklistTable: shadcn Table with columns Bil / Tugasan / Tanggungjawab / Status / Catatan. Tugasan cell shows CheckCircle2 (done, emerald) or Circle (not done, muted) + strikethrough when selesai. Tanggungjawab rendered as primary-tinted Badge with Users icon.
  * Interactive Checkbox: shadcn Checkbox with onCheckedChange handler. On toggle, computes flipped status, calls useToggleChecklistItem().mutate({id, itemId, status, pengguna: 'Pengguna: ${role}'}). Success → sonner toast.success('Status dikemas kini', description '... — Selesai') or toast.info for un-complete; also calls onToggledDone(itemId) to trigger green flash. Error → toast.error. Disabled while pending.
  * Awam read-only: when role === 'Awam', checkbox is disabled and wrapped in Tooltip ("Akses awam: hanya baca"). CatatanCell also becomes read-only italic display.
  * Green flash animation: motion.tr with animate keyframe array ['rgba(16,185,129,0.32)','rgba(16,185,129,0.08)','rgba(0,0,0,0)'] duration 1.2s easeOut — triggered when itemId is in the parent recentlyDone Set. Parent adds the id on successful "Selesai" toggle and removes it after 1300ms via setTimeout. Uses motion.tr (custom) instead of TableRow so framer-motion can animate background-color keyframes — manually applies the same border + hover classes as TableRow.
  * CatatanCell: display-only button (StickyNote icon + truncated text, "Tambah catatan..." placeholder when empty) that opens a Popover with an Input + Simpan/Batal buttons. Saves on blur-via-button or Enter key; calls toggle.mutate with new catatan value, status unchanged, pengguna label. sonner toast on success/error. No-op if value unchanged.
  * ComplianceReportDialog (Penyelia/Admin only): Dialog (sm:max-w-3xl, max-h-90vh flex-col). Header with FileBarChart icon + "Laporan Pematuhan Checklist" title. Body: 4-tile summary (Jumlah Checklist / Jumlah Item / Item Selesai / Pematuhan %) + scrollable Table with columns # / Checklist (tajuk + unit) / Kekerapan / Item / Selesai / Pematuhan. Pematuhan column shows Progress bar with tier color (emerald ≥85%, amber 50–84%, rose <50%) + colored % label. Header row sticky. Fetches all 3 kekerapan lists via useChecklistList in parallel. Legend at bottom explaining the 3 tiers.
  * Helper functions: penggunaLabel(role) → "Pengguna: ${role}"; computeStats(items) → {total, selesai, belum, percent}; tierClass(pct) → {badge, stroke, bar, text} for green/amber/rose tiers; KekerapanBadge, ProgressRing (animated SVG circle via framer-motion), KekerapanTint/Stroke/Icon lookup maps.
- Styling: strictly glassmorphism via GlassCard/glass-subtle/glass-strong; teal/emerald + amber primary palette, with violet reserved for Bulanan kekerapan tint (matches dashboard cross-module color coding — no indigo/blue). All UI text in Bahasa Malaysia. Fully responsive: tables wrapped in Table component's overflow-x-auto container; header row switches from sm:flex-row to col on mobile; stat grids adapt 1→3 cols.
- Verified `bun run lint` — passed clean (no errors/warnings). No new deps. No API/store/types/glass changes — pure consumer of existing useChecklistList + useToggleChecklistItem + useAppStore.role + existing UI primitives.

Stage Summary:
- Modul 4 (Checklist Tugasan Harian/Mingguan/Bulanan) fully implemented and ready to be wired into the main app shell by importing { ChecklistModule } from '@/components/modules/checklist'.
- Single file: /home/z/my-project/src/components/modules/checklist.tsx (~660 lines, 'use client', named export ChecklistModule).
- Features: 3-tab kekerapan switcher, per-tab aggregate compliance summary card with progress ring, interactive checklist tables with toggleable items, green flash row animation on completion, inline catatan editing via popover, read-only Awam mode with tooltips, Penyelia/Admin compliance report dialog with tier color-coded summary table.

---
Task ID: FINAL
Agent: Main (Z.ai Code)
Task: Wire all modules into main page, browser verification, fix bugs

Work Log:
- Built src/app/page.tsx wiring all 9 modules (Dashboard, Jawatan, Carta Alir, Prosedur, Checklist, Borang, Rujukan, QR, Admin) via Zustand activeModule state with role-based admin guard.
- Built src/components/modules/admin.tsx with full CRUD (create/edit/delete) for Borang and Rujukan via Dialog forms + AlertDialog confirm, plus read-only EntityOverview of other entities.
- Built src/components/app-shell.tsx: glassmorphism header (sticky), collapsible sidebar (desktop) + Sheet (mobile), sticky footer, animated gradient background blobs, role switcher, theme toggle, global search.
- Updated globals.css with glassmorphism utilities (.glass, .glass-strong, .glass-subtle, .text-gradient, .bg-gradient-hero), teal/emerald + amber palette (NO indigo/blue), custom scrollbar, blob animations.
- Updated layout.tsx with proper BM metadata + ThemeProvider + Sonner toaster.
- Created src/lib/types.ts (all shared types), src/lib/store.ts (Zustand), src/lib/hooks.ts (React Query hooks for all modules), src/lib/api.ts (JSON parse helpers), src/components/providers.tsx (QueryClient), src/components/glass.tsx (GlassCard/SectionHeader/StatusBadge/PageLoader/EmptyState), src/components/theme-provider.tsx.
- Browser verification via agent-browser:
  * Dashboard: renders hero, 6 stat cards, compliance (29%→43% after toggle), bar chart, pie chart, activity log, quick links ✓
  * Jawatan: list of 4 cards + detail view with tabs (Profil/Skop Tugas/Autoriti/KPI), KRA cards, hubungan kerja ✓
  * Carta Alir: list + interactive SVG flowchart (8 nodes, edges, clickable nodes, legend, PNG export) ✓
  * Prosedur: list with status filters + detail with 7 SOP sections (tujuan, skop, tanggungjawab table, langkah timeline, borang, rujukan, sejarah) ✓
  * Checklist: tabs (Harian/Mingguan/Bulanan), compliance summary, interactive toggle (persisted to DB), Penyelia compliance report dialog ✓
  * Borang: 9 docs (8 seed + 1 CRUD-created), category/format filters, download buttons ✓
  * Rujukan: grouped by category, collapsible, status filters, external links ✓
  * QR Code: generator (jawatan/borang/custom), live QR image via API, preview label, PNG download, print, org chart grid ✓
  * Admin: DB status overview + Borang/Rujukan CRUD tables with create/edit/delete dialogs ✓
  * Role switcher: Awam → checkboxes disabled + admin nav hidden + read-only banner ✓
  * Mobile (390x844): hamburger menu opens Sheet, stacked layout, sticky footer pushed to bottom ✓
  * Desktop (1440x900): sidebar + content layout, footer sticky ✓
- Fixed 2 bugs found during verification:
  1. admin.tsx: used DialogTrigger inside AlertDialog → changed to AlertDialogTrigger
  2. admin.tsx: passed icon={Settings} (component) to SectionHeader (expects ReactNode) → changed to icon={<Settings />}
  3. qr-code.tsx: Select uncontrolled→controlled warning → initialized state with '' instead of undefined
- Lint: clean (0 errors). Dev log: only successful 200 API responses (13 historical ⨯ are stale theme-provider errors from before file creation).

Stage Summary:
- All 7 PRD modules + Dashboard + Admin panel fully functional with real dummy DB (Prisma/SQLite)
- Glassmorphism UI with teal/emerald + amber palette, animated gradient background
- Role-based access control (Admin/Penyelia/Pengguna/Awam) working
- CRUD operations persist to database (verified B009 created via Admin shows in Borang list)
- Responsive (mobile hamburger + desktop sidebar), sticky footer, accessibility (ARIA labels, keyboard nav)
- QR codes generated server-side via qrcode lib, flowcharts rendered as custom SVG
- All 24 functional requirements (FR-01 to FR-24) from PRD addressed

---
Task ID: AUTH-QR-COLOR
Agent: Main (Z.ai Code)
Task: Add sign in/out module, link QR with individual profiles, change color to navy blue + black text

Work Log:
- Auth module:
  * Added `kataLaluan` field to Pengguna model in prisma/schema.prisma + re-seeded with demo passwords (admin123, penyelia123, pengguna123)
  * Created POST /api/auth/login route — validates email+password against DB, returns safe user (strips password)
  * Updated GET /api/pengguna to use `select` and exclude kataLaluan from responses
  * Added `AuthUser` type alias in lib/types.ts
  * Rewrote lib/store.ts with auth state: `currentUser`, `isAuthenticated`, `role` (derived from currentUser.peranan or 'Awam'), `loginUser`, `logoutUser`, `hydrateAuth` (reads localStorage on mount)
  * Added `qrPresetKod` state for QR pre-selection from profile
  * Added `useLogin` mutation in lib/hooks.ts
  * Added `enabled` option to `useJawatanList` for conditional fetching
  * Built src/components/sign-in-dialog.tsx — email+password form with show/hide password, 3 demo quick-login buttons (Admin/Penyelia/Pengguna), toast feedback, persists user to localStorage
  * Updated src/components/app-shell.tsx — replaced RoleSwitcher with AuthMenu (shows "Awam" badge + "Log Masuk" button when logged out; shows avatar + name + role + "Log Keluar" dropdown when logged in), added auth hydration on mount
  * Default role is now 'Awam' (not authenticated) — users must sign in to access admin/checklist-edit features

- QR ↔ Profile linking:
  * Created src/components/deep-link-handler.tsx — reads URL search params (?jawatan=KOD, ?borang=KOD, ?prosedur=KOD, ?carta=KOD, ?module=qr) and auto-navigates to the relevant module. For ?jawatan, resolves kod→id via conditional jawatan list fetch.
  * Updated src/app/page.tsx — wraps DeepLinkHandler in <Suspense> (required for useSearchParams in Next 16)
  * Updated src/components/modules/qr-code.tsx — QR URLs now use deep-link format `/?jawatan=KOD` (was `/jawatan/KOD`) so scanning opens the profile directly. Added qrPresetKod consumption: when navigating from a jawatan profile's "Lihat Kod QR" button, pre-selects that jawatan in the generator.
  * Updated src/components/modules/jawatan.tsx — "Lihat Kod QR" button now sets qrPresetKod before switching to QR module
  * Updated QR API default color from teal-700 (#0f766e) to navy-800 (#1e3a8a)

- Color scheme → navy blue + black text:
  * Rewrote src/app/globals.css with navy palette: --primary oklch(0.34 0.11 264) (navy), --foreground oklch(0.06 0.02 260) (near-black, reads as black), --background light navy tint, --accent gold (oklch(0.78 0.13 80)) for contrast
  * Updated chart colors to navy/blue/gold variants
  * Updated glassmorphism shadow tints from teal to navy rgba(30,58,138,...)
  * Updated bg-gradient-hero to navy/gold radial gradients
  * Updated scrollbar, flow-arrow colors to navy
  * Updated app-shell animated background blobs from teal/emerald to blue-700/blue-500 + amber
  * Updated BrandHeader gradient from emerald-600 to blue-900
  * Updated dashboard quick-link tint from teal to blue-800

- Verification (via curl — browser OOMs in 4GB/no-swap env when turbopack+chrome run together):
  * ✓ Page SSR renders "Awam" badge + "Log Masuk" button (auth UI present)
  * ✓ Login API: Admin (faizal/admin123), Penyelia (aishah/penyelia123), Pengguna (hafiz/pengguna123) all return 200 with correct user
  * ✓ Wrong password returns 401 "Emel atau kata laluan tidak sah"
  * ✓ Password excluded from /api/pengguna response (4 users, no kataLaluan field)
  * ✓ Deep-link page /?jawatan=JT002 renders HTTP 200
  * ✓ QR API generates navy QR (4158-char base64 PNG) for deep-link URL
  * ✓ All 8 module APIs return 200
  * ✓ Lint clean (0 errors)
  * Note: Browser (agent-browser/chrome ~600MB) + turbopack dev server (~1.5GB) exceeds 4GB RAM with no swap, causing OOM kill when both run. Code verified via SSR curl + API tests.

Stage Summary:
- Sign in/out fully implemented: login dialog with demo accounts, auth state persisted to localStorage, role derived from logged-in user, logout clears session
- QR codes now encode deep-link URLs (/?jawatan=KOD) so scanning opens the specific profile; "Lihat Kod QR" in profile pre-selects it in the QR generator
- Color scheme changed to navy blue primary + black text + gold accent throughout (globals.css, app-shell, dashboard, QR API)
- 4 demo accounts: Admin/Penyelia/Pengguna with passwords; default state is Awam (public/read-only)
