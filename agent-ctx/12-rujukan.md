# Task ID 12 — Rujukan Module (Modul 6)

## Agent
Subagent (Rujukan module)

## Task
Build Modul 6 — Rujukan Peraturan, Garis Panduan, SOP & Pekeliling at `/home/z/my-project/src/components/modules/rujukan.tsx`. Export `RujukanModule` (`'use client'`).

## Reference files read (prior agents' patterns)
- `/home/z/my-project/worklog.md` (worklog of tasks 1, 7, 8, 9, 11, 13)
- `/home/z/my-project/src/components/modules/dashboard.tsx` (StatCard pattern, glass usage, teal+amber palette)
- `/home/z/my-project/src/components/modules/prosedur.tsx` (filter chip pattern with `role="tab"`, formatDate ms-MY helper, Rujukan card sub-pattern used in prosedur detail view)
- `/home/z/my-project/src/components/glass.tsx` (GlassCard / SectionHeader / StatusBadge / PageLoader / EmptyState)
- `/home/z/my-project/src/lib/hooks.ts` (`useRujukanList(q, kategori, status)`)
- `/home/z/my-project/src/lib/types.ts` (`Rujukan`)
- `/home/z/my-project/src/lib/store.ts` (`useAppStore` → `searchQuery`)
- `/home/z/my-project/src/components/ui/collapsible.tsx`, `tooltip.tsx`, `badge.tsx`, `button.tsx`
- `/home/z/my-project/src/app/api/rujukan/route.ts` (GET supports `q`, `kategori`, `status` query params; ordered by `kodRujukan` asc)
- `/home/z/my-project/src/app/globals.css` (glass utility classes; primary = teal oklch, no indigo/blue)

## Implementation summary
- File created: `/home/z/my-project/src/components/modules/rujukan.tsx` (~480 lines, `'use client'`, named export `RujukanModule`).
- Layout: SectionHeader → 3 stat cards → filter bar (kategori chips + status chips + Set Semula) → search hint → grouped collapsible list.
- Grouping: `Map<kategori, Rujukan[]>` ordered by `KATEGORI_CONFIG` sequence; unknown kategori appended with slate fallback config.
- Each group rendered as a `Collapsible` GlassCard (default open). Header: kategori-tinted icon + name + count subtitle + colored count badge + rotating ChevronDown.
- Each `RujukanCard`: 3-section flex layout (left icon | middle content | right status + actions). Badges: kodRujukan mono primary, kategori chip (kategori-tinted), optional versi amber (`v{versi}`). Optional tarikhKuatKuasa with Calendar icon and "Kuat kuasa: dd MMM yyyy" text (omitted when null). Action buttons appear only when `pautanLuaran` is truthy: "Portal Rasmi" outline button (anchor, `target="_blank"`) and "Salin Pautan" icon button (navigator.clipboard.writeText + sonner toast).
- Filter chips use `role="tab"` + `aria-selected` + `aria-label`; icon-only copy button has `aria-label`; Collapsible trigger has dynamic `aria-label`; decorative icon containers use `aria-hidden`.
- Styling: glassmorphism via GlassCard/glass-subtle; teal/emerald primary + amber accent; per-kategori tints (emerald/teal/amber/orange/violet/rose — NO indigo or blue-500).
- Stats reflect current filtered list (total = `rujukan.length`, aktif = filter status==='Aktif', non-aktif = status==='Digantikan' || 'Dimansuhkan').

## Verification
- `bun run lint` — passed clean (no errors / no warnings).
- Dev server log inspected — only a pre-existing `@/components/theme-provider` import warning unrelated to this module; compile succeeds.
- No new deps, no API/store/types/glass changes — pure consumer of existing hooks and UI primitives.

## Wiring
```tsx
import { RujukanModule } from '@/components/modules/rujukan'
// then render <RujukanModule /> when activeModule === 'rujukan'
```
