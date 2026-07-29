# Task 8 — Carta Alir Module Builder

## Deliverable
`/home/z/my-project/src/components/modules/carta-alir.tsx` — exports `CartaAlirModule` ('use client').

## What was built
- **List view**: `useCartaAlirList(searchQuery, kategori)` with filter chips (5 kategori + Semua, live counts), responsive glass card grid (1/2/3 cols). Each card shows kategori badge, kodCarta (mono), tajuk, penerangan (2-line clamp), node + decision count mini-badges, and "Lihat Carta Alir" button → `setSelectedCartaId`.
- **Viewer view**: `useCartaAlir(selectedCartaId)` with Back button, header (kodCarta + kategori badges, tajuk, penerangan, PNG download button with Tooltip), interactive SVG flowchart, legend.
- **Layout algorithm**: BFS from root (jenis==='mula' preferred), assigns level=depth, nodes at same level side-by-side and centered horizontally. Constants: NODE_W=200, NODE_H=80, NODE_SPACING_X=250, LEVEL_HEIGHT=150, PADDING=60.
- **SVG flowchart** (single self-contained `<svg>` for clean PNG export):
  - 4 gradients (emerald mula, rose tamat, amber keputusan, teal-glass proses) + arrow marker + drop-shadow filter
  - Shapes: ellipse (mula/tamat), rounded rect (proses), diamond polygon (keputusan)
  - Multi-line labels (split `\n`, max 3 lines)
  - Native inline SVG icons (Play/Flag/GitBranch/Workflow) — no foreignObject
  - Edges: smooth cubic Bezier, arrowhead, edge labels in glass pill at midpoint
  - Clickable nodes (cursor pointer, role=button, keyboard Enter/Space) → Dialog with penerangan + NodeKindBadge
  - If `prosedurId` → "Lihat Prosedur Penuh" button → `setSelectedProsedurId` + `setActiveModule('prosedur')`
  - Framer-motion `motion.g` entrance: opacity + scale with stagger (`transformBox: fill-box`)
  - `overflow-x-auto` wrapper for mobile horizontal scroll
- **PNG export**: serialize SVG → blob → Image → 2x canvas → PNG download as `carta-alir-{kodCarta}.png` with sonner toasts.
- **Legend**: 4-col grid with gradient shape previews (diamond rotated 45°) + icons + descriptions.

## Patterns followed
- GlassCard / SectionHeader / PageLoader / EmptyState from `@/components/glass`
- store hooks: `searchQuery`, `selectedCartaId`, `setSelectedCartaId`, `setActiveModule`, `setSelectedProsedurId`
- Teal/emerald + amber palette only (NO indigo/blue)
- Sonner toasts, shadcn Button/Badge/Dialog/Tooltip
- Malaysian Malay UI text throughout

## Lint
`bun run lint` passes clean. Resolved `react-hooks/static-components` errors by replacing `iconFor()` function-call pattern with a static `NODE_ICONS` lookup map (Record<jenis, React.ElementType>).

## No changes to
API routes, store, types, hooks, or any other module.
