'use client'

import * as React from 'react'
import {
  Workflow,
  Play,
  GitBranch,
  Flag,
  ArrowLeft,
  Download,
  Eye,
  MousePointerClick,
  FileText,
  Search,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartaAlirList, useCartaAlir } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { GlassCard, SectionHeader, PageLoader, EmptyState } from '@/components/glass'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { CartaAlir, FlowNode, FlowEdge } from '@/lib/types'

// ============================================================
// Category styling (teal/emerald + amber palette — NO indigo/blue)
// ============================================================
const KATEGORI_BADGE: Record<string, string> = {
  Pentadbiran: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
  Kewangan: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  'Sumber Manusia': 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  'Perkhidmatan Pelanggan':
    'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
  ICT: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30',
}
const KATEGORI_LIST = [
  'Pentadbiran',
  'Kewangan',
  'Sumber Manusia',
  'Perkhidmatan Pelanggan',
  'ICT',
]

function kategoriBadgeClass(k: string) {
  return (
    KATEGORI_BADGE[k] ||
    'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30'
  )
}

// ============================================================
// Layout algorithm (BFS — top-to-bottom, siblings side-by-side)
// ============================================================
interface LaidOutNode {
  node: FlowNode
  x: number // center x in SVG coordinates
  y: number // center y in SVG coordinates
  level: number
}

const NODE_W = 200
const NODE_H = 80
const NODE_SPACING_X = 250
const LEVEL_HEIGHT = 150
const PADDING = 60

function layoutFlow(carta: CartaAlir): {
  nodes: LaidOutNode[]
  width: number
  height: number
} {
  const nodes = carta.nod
  const edges = carta.sambungan
  if (nodes.length === 0) return { nodes: [], width: 0, height: 0 }

  // Build adjacency list + in-degree
  const adj = new Map<string, string[]>()
  const inDeg = new Map<string, number>()
  nodes.forEach((n) => {
    adj.set(n.id, [])
    inDeg.set(n.id, 0)
  })
  edges.forEach((e) => {
    if (adj.has(e.from) && adj.has(e.to)) {
      adj.get(e.from)!.push(e.to)
      inDeg.set(e.to, (inDeg.get(e.to) || 0) + 1)
    }
  })

  // Find root: prefer jenis==='mula', else in-degree 0, else first node
  let root = nodes.find((n) => n.jenis === 'mula')
  if (!root) root = nodes.find((n) => (inDeg.get(n.id) || 0) === 0)
  if (!root) root = nodes[0]

  // BFS — assign level = depth from root
  const levelOf = new Map<string, number>()
  const queue: string[] = [root.id]
  levelOf.set(root.id, 0)
  while (queue.length > 0) {
    const id = queue.shift()!
    const lvl = levelOf.get(id)!
    for (const child of adj.get(id) || []) {
      if (!levelOf.has(child)) {
        levelOf.set(child, lvl + 1)
        queue.push(child)
      }
    }
  }

  // Disconnected nodes → append as a tail level
  let maxLevel = 0
  levelOf.forEach((l) => (maxLevel = Math.max(maxLevel, l)))
  nodes.forEach((n) => {
    if (!levelOf.has(n.id)) {
      maxLevel += 1
      levelOf.set(n.id, maxLevel)
    }
  })

  // Group nodes by level
  const byLevel = new Map<number, FlowNode[]>()
  levelOf.forEach((lvl, id) => {
    if (!byLevel.has(lvl)) byLevel.set(lvl, [])
    const n = nodes.find((nn) => nn.id === id)
    if (n) byLevel.get(lvl)!.push(n)
  })

  // Max nodes per level → drives SVG width
  let maxLevelWidth = 1
  byLevel.forEach((arr) => {
    maxLevelWidth = Math.max(maxLevelWidth, arr.length)
  })

  const svgWidth = Math.max(
    maxLevelWidth * NODE_SPACING_X + PADDING * 2,
    NODE_W + PADDING * 2,
  )
  const svgHeight = (maxLevel + 1) * LEVEL_HEIGHT + PADDING * 2

  // Position each node (centered within its level row)
  const laidOut: LaidOutNode[] = []
  byLevel.forEach((arr, lvl) => {
    const n = arr.length
    const totalRowWidth = (n - 1) * NODE_SPACING_X + NODE_W
    const startX = (svgWidth - totalRowWidth) / 2
    arr.forEach((node, i) => {
      laidOut.push({
        node,
        x: startX + i * NODE_SPACING_X + NODE_W / 2,
        y: PADDING + lvl * LEVEL_HEIGHT + NODE_H / 2,
        level: lvl,
      })
    })
  })

  return { nodes: laidOut, width: svgWidth, height: svgHeight }
}

// ============================================================
// Node visual config
// ============================================================
type NodeShape = 'circle' | 'rect' | 'diamond'
interface NodeVisual {
  shape: NodeShape
  fill: string
  stroke: string
  text: string
  iconColor: string
}

function nodeVisual(jenis: FlowNode['jenis']): NodeVisual {
  switch (jenis) {
    case 'mula':
      return {
        shape: 'circle',
        fill: 'url(#g-mula)',
        stroke: '#059669',
        text: '#ffffff',
        iconColor: '#ffffff',
      }
    case 'tamat':
      return {
        shape: 'circle',
        fill: 'url(#g-tamat)',
        stroke: '#e11d48',
        text: '#ffffff',
        iconColor: '#ffffff',
      }
    case 'keputusan':
      return {
        shape: 'diamond',
        fill: 'url(#g-keputusan)',
        stroke: '#d97706',
        text: '#7c2d12',
        iconColor: '#b45309',
      }
    case 'proses':
    default:
      return {
        shape: 'rect',
        fill: 'url(#g-proses)',
        stroke: '#0d9488',
        text: '#0f5132',
        iconColor: '#0d9488',
      }
  }
}

const NODE_ICONS: Record<FlowNode['jenis'], React.ElementType> = {
  mula: Play,
  tamat: Flag,
  keputusan: GitBranch,
  proses: Workflow,
}

// ============================================================
// Inline SVG icons (16x16, relative to origin) for embedding in nodes
// ============================================================
function NodeIconSvg({
  jenis,
  color,
}: {
  jenis: FlowNode['jenis']
  color: string
}) {
  switch (jenis) {
    case 'mula':
      return <polygon points="3,2 13,8 3,14" fill={color} />
    case 'tamat':
      return (
        <g
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 14 L4 3" />
          <path d="M4 3 L13 5 L4 7 Z" fill={color} />
        </g>
      )
    case 'keputusan':
      return (
        <g
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="4" cy="13" r="2" fill={color} />
          <circle cx="12" cy="4" r="2" fill={color} />
          <circle cx="12" cy="12" r="2" fill={color} />
          <path d="M6 13 L10 13" />
          <path d="M4 11 C 4 6, 12 8, 12 6" />
        </g>
      )
    case 'proses':
    default:
      return (
        <g
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="1" y="2" width="6" height="5" rx="1" />
          <rect x="9" y="2" width="6" height="5" rx="1" />
          <rect x="5" y="10" width="6" height="5" rx="1" />
          <path d="M4 7 L4 9 L8 9 L8 10" />
          <path d="M12 7 L12 9 L8 9" />
        </g>
      )
  }
}

// ============================================================
// List View
// ============================================================
function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
        active
          ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30'
          : 'bg-card/50 border-border/60 text-muted-foreground hover:text-foreground hover:bg-card',
      )}
    >
      {label}
      {typeof count === 'number' && (
        <span
          className={cn(
            'ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 text-[10px] tabular-nums',
            active ? 'bg-primary-foreground/25' : 'bg-muted',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function CartaCard({
  carta,
  onPick,
}: {
  carta: CartaAlir
  onPick: (id: string) => void
}) {
  const nodeCount = carta.nod?.length ?? 0
  const decisionCount =
    carta.nod?.filter((n) => n.jenis === 'keputusan').length ?? 0
  return (
    <GlassCard className="p-5 h-full flex flex-col hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <Badge
          variant="outline"
          className={cn('rounded-full border', kategoriBadgeClass(carta.kategori))}
        >
          {carta.kategori}
        </Badge>
        <span className="font-mono text-[11px] text-muted-foreground">
          {carta.kodCarta}
        </span>
      </div>
      <h3 className="font-semibold text-foreground leading-snug line-clamp-2">
        {carta.tajuk}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
        {carta.penerangan}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-semibold">
          <Workflow className="size-3" /> {nodeCount} langkah
        </span>
        {decisionCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-[11px] font-semibold">
            <GitBranch className="size-3" /> {decisionCount} keputusan
          </span>
        )}
      </div>
      <div className="mt-auto pt-4">
        <Button
          onClick={() => onPick(carta.id)}
          className="w-full rounded-full"
          size="sm"
        >
          <Eye className="size-4" /> Lihat Carta Alir
        </Button>
      </div>
    </GlassCard>
  )
}

function CartaList({ onPick }: { onPick: (id: string) => void }) {
  const searchQuery = useAppStore((s) => s.searchQuery)
  const [kategori, setKategori] = React.useState<string>('')

  const { data, isLoading, isFetching } = useCartaAlirList(
    searchQuery,
    kategori || undefined,
  )

  const counts = React.useMemo(() => {
    const map: Record<string, number> = {}
    data?.forEach((c) => {
      map[c.kategori] = (map[c.kategori] || 0) + 1
    })
    return map
  }, [data])

  return (
    <div>
      <SectionHeader
        title="Carta Alir Proses Kerja"
        description="Paparan visual carta alir bagi setiap proses kerja utama jawatan/unit"
        icon={<Workflow className="size-5" />}
        action={
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground glass-subtle rounded-full px-3 py-1.5">
            <Search className="size-3.5" />
            {searchQuery ? (
              <span>
                Carian: <span className="font-mono text-foreground">“{searchQuery}”</span>
              </span>
            ) : (
              <span>Guna kotak carian untuk menapis</span>
            )}
          </div>
        }
      />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        <FilterChip
          active={!kategori}
          onClick={() => setKategori('')}
          label="Semua"
          count={data?.length}
        />
        {KATEGORI_LIST.map((k) => (
          <FilterChip
            key={k}
            active={kategori === k}
            onClick={() => setKategori(k)}
            label={k}
            count={counts[k] ?? 0}
          />
        ))}
      </div>

      {isLoading ? (
        <GlassCard className="p-8">
          <PageLoader label="Memuatkan carta alir..." />
        </GlassCard>
      ) : !data || data.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={<Workflow className="size-6" />}
            title="Tiada carta alir dijumpai"
            description={
              searchQuery || kategori
                ? 'Cuba ubah kata carian atau pilih kategori lain.'
                : 'Belum ada carta alir didaftarkan dalam sistem.'
            }
          />
        </GlassCard>
      ) : (
        <>
          {isFetching && !isLoading && (
            <div className="text-xs text-muted-foreground mb-3 animate-pulse">
              Mengemas kini…
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.map((c) => (
              <CartaCard key={c.id} carta={c} onPick={onPick} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================
// SVG Flowchart components
// ============================================================
function EdgeView({
  edge,
  nodes,
}: {
  edge: FlowEdge
  nodes: LaidOutNode[]
}) {
  const from = nodes.find((n) => n.node.id === edge.from)
  const to = nodes.find((n) => n.node.id === edge.to)
  if (!from || !to) return null

  const sameLevel = from.level === to.level

  if (sameLevel) {
    // Horizontal connection: right side of source → left side of target
    const leftFirst = from.x <= to.x
    const sx = leftFirst ? from.x + NODE_W / 2 : from.x - NODE_W / 2
    const sy = from.y
    const tx = leftFirst ? to.x - NODE_W / 2 : to.x + NODE_W / 2
    const ty = to.y
    const midX = (sx + tx) / 2
    const path = `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`
    return (
      <g>
        <path
          d={path}
          fill="none"
          stroke="#0d9488"
          strokeOpacity="0.55"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        {edge.label && <EdgeLabel x={midX} y={sy} text={edge.label} />}
      </g>
    )
  }

  // Vertical connection: bottom of source → top of target
  const sx = from.x
  const sy = from.y + NODE_H / 2
  const tx = to.x
  const ty = to.y - NODE_H / 2
  const midY = (sy + ty) / 2
  const path = `M ${sx} ${sy} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="#0d9488"
        strokeOpacity="0.55"
        strokeWidth="2"
        markerEnd="url(#arrow)"
      />
      {edge.label && <EdgeLabel x={(sx + tx) / 2} y={midY} text={edge.label} />}
    </g>
  )
}

function EdgeLabel({ x, y, text }: { x: number; y: number; text: string }) {
  const w = Math.max(text.length * 7 + 16, 40)
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 10}
        width={w}
        height={20}
        rx={10}
        fill="rgba(255,255,255,0.94)"
        stroke="rgba(13,148,136,0.35)"
        strokeWidth="1"
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="#0f766e"
      >
        {text}
      </text>
    </g>
  )
}

function NodeView({
  laid,
  index,
  onClick,
}: {
  laid: LaidOutNode
  index: number
  onClick: () => void
}) {
  const v = nodeVisual(laid.node.jenis)
  const lines = laid.node.label.split('\n').slice(0, 3)
  const isDecision = laid.node.jenis === 'keputusan'

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: Math.min(index * 0.05, 0.6),
        duration: 0.35,
        ease: 'easeOut',
      }}
      style={{
        cursor: 'pointer',
        transformBox: 'fill-box' as const,
        transformOrigin: 'center',
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Shape */}
      {v.shape === 'circle' && (
        <ellipse
          cx={laid.x}
          cy={laid.y}
          rx={NODE_W / 2}
          ry={NODE_H / 2}
          fill={v.fill}
          stroke={v.stroke}
          strokeWidth="2"
          filter="url(#soft-shadow)"
        />
      )}
      {v.shape === 'rect' && (
        <rect
          x={laid.x - NODE_W / 2}
          y={laid.y - NODE_H / 2}
          width={NODE_W}
          height={NODE_H}
          rx={14}
          fill={v.fill}
          stroke={v.stroke}
          strokeWidth="2"
          filter="url(#soft-shadow)"
        />
      )}
      {v.shape === 'diamond' && (
        <polygon
          points={`${laid.x},${laid.y - NODE_H / 2 - 8} ${laid.x + NODE_W / 2 + 8},${laid.y} ${laid.x},${laid.y + NODE_H / 2 + 8} ${laid.x - NODE_W / 2 - 8},${laid.y}`}
          fill={v.fill}
          stroke={v.stroke}
          strokeWidth="2"
          filter="url(#soft-shadow)"
        />
      )}

      {/* Icon (top of node) */}
      <g transform={`translate(${laid.x - 8}, ${laid.y - NODE_H / 2 + 6})`}>
        <NodeIconSvg jenis={laid.node.jenis} color={v.iconColor} />
      </g>

      {/* Label (multi-line) */}
      {lines.map((line, i) => (
        <text
          key={i}
          x={laid.x}
          y={laid.y + 8 + (i - (lines.length - 1) / 2) * 16}
          textAnchor="middle"
          fontSize={isDecision ? 12 : 13}
          fontWeight={isDecision ? 700 : 600}
          fill={v.text}
        >
          {line}
        </text>
      ))}
    </motion.g>
  )
}

// ============================================================
// Legend
// ============================================================
function LegendItem({
  jenis,
  label,
  desc,
}: {
  jenis: FlowNode['jenis']
  label: string
  desc: string
}) {
  const Icon = NODE_ICONS[jenis]
  const tintBg =
    jenis === 'mula'
      ? 'from-emerald-400 to-emerald-600 text-white'
      : jenis === 'tamat'
        ? 'from-rose-400 to-rose-600 text-white'
        : jenis === 'keputusan'
          ? 'from-amber-200 to-amber-400 text-amber-800'
          : 'from-teal-50 to-teal-200 text-teal-700'
  const shapeCls =
    jenis === 'keputusan'
      ? 'rotate-45 rounded-md'
      : jenis === 'mula' || jenis === 'tamat'
        ? 'rounded-full'
        : 'rounded-lg'
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'size-10 flex items-center justify-center bg-gradient-to-br shrink-0',
          tintBg,
          shapeCls,
        )}
      >
        <Icon className="size-4 -rotate-0" style={{ transform: jenis === 'keputusan' ? 'rotate(-45deg)' : undefined }} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  )
}

// ============================================================
// Node kind badge (for dialog header)
// ============================================================
function NodeKindBadge({ jenis }: { jenis: FlowNode['jenis'] }) {
  const Icon = NODE_ICONS[jenis]
  const cls =
    jenis === 'mula'
      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
      : jenis === 'tamat'
        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
        : jenis === 'keputusan'
          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
          : 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30'
  const label =
    jenis === 'mula'
      ? 'Permulaan'
      : jenis === 'tamat'
        ? 'Tamat'
        : jenis === 'keputusan'
          ? 'Keputusan'
          : 'Proses'
  return (
    <Badge variant="outline" className={cn('rounded-full border', cls)}>
      <Icon className="size-3" /> {label}
    </Badge>
  )
}

// ============================================================
// Viewer View
// ============================================================
function CartaViewer({
  cartaId,
  onBack,
}: {
  cartaId: string
  onBack: () => void
}) {
  const { data: carta, isLoading } = useCartaAlir(cartaId)
  const setActiveModule = useAppStore((s) => s.setActiveModule)
  const setSelectedProsedurId = useAppStore((s) => s.setSelectedProsedurId)
  const [selectedNode, setSelectedNode] = React.useState<FlowNode | null>(null)
  const svgRef = React.useRef<SVGSVGElement | null>(null)

  const layout = React.useMemo(
    () =>
      carta
        ? layoutFlow(carta)
        : { nodes: [] as LaidOutNode[], width: 0, height: 0 },
    [carta],
  )

  const handleDownloadPng = React.useCallback(() => {
    if (!svgRef.current || !carta) return
    try {
      const xml = new XMLSerializer().serializeToString(svgRef.current)
      const svgBlob = new Blob([xml], {
        type: 'image/svg+xml;charset=utf-8',
      })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()
      img.onload = () => {
        const scale = 2
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(layout.width * scale, 1)
        canvas.height = Math.max(layout.height * scale, 1)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(url)
          toast.error('Gagal menjana PNG: pelayar tidak menyokong canvas')
          return
        }
        ctx.scale(scale, scale)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, layout.width, layout.height)
        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(url)
        canvas.toBlob((blob) => {
          if (!blob) {
            toast.error('Gagal menjana PNG')
            return
          }
          const dlUrl = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = dlUrl
          a.download = `carta-alir-${carta.kodCarta}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(dlUrl)
          toast.success('Carta alir dimuat turun sebagai PNG')
        }, 'image/png')
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        toast.error('Gagal memproses SVG untuk eksport')
      }
      img.src = url
    } catch {
      toast.error('Gagal menjana PNG')
    }
  }, [carta, layout.width, layout.height])

  if (isLoading || !carta) {
    return (
      <GlassCard className="p-8">
        <PageLoader label="Memuatkan carta alir..." />
      </GlassCard>
    )
  }

  const hasDiagram = layout.nodes.length > 0

  return (
    <div>
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-3 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali ke senarai
      </Button>

      {/* Header */}
      <GlassCard strong className="p-5 sm:p-6 mb-5 overflow-hidden relative">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-gradient-to-br from-amber-400/20 to-teal-500/10 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className="font-mono bg-card/60 backdrop-blur"
              >
                {carta.kodCarta}
              </Badge>
              <Badge
                variant="outline"
                className={cn('rounded-full border', kategoriBadgeClass(carta.kategori))}
              >
                {carta.kategori}
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {carta.tajuk}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
              {carta.penerangan}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDownloadPng}
                    variant="outline"
                    size="sm"
                    className="rounded-full glass-subtle border-0"
                    disabled={!hasDiagram}
                  >
                    <Download className="size-4" /> Muat Turun PNG
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {hasDiagram
                    ? 'Eksport carta alir sebagai imej PNG'
                    : 'Tiada nod untuk dieksport'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </GlassCard>

      {/* Diagram */}
      <GlassCard className="p-3 sm:p-5 mb-5">
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <MousePointerClick className="size-3.5 text-primary" />
          Klik mana-mana nod untuk melihat butiran lanjut.
        </div>

        {!hasDiagram ? (
          <EmptyState
            icon={<Workflow className="size-6" />}
            title="Carta alir ini masih kosong"
            description="Tiada nod didefinisikan untuk carta alir ini."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <div
              className="mx-auto"
              style={{ width: layout.width, minWidth: layout.width }}
            >
              <svg
                ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                width={layout.width}
                height={layout.height}
                viewBox={`0 0 ${layout.width} ${layout.height}`}
                className="block mx-auto"
                style={{ maxWidth: 'none' }}
                role="img"
                aria-label={`Carta alir: ${carta.tajuk}`}
              >
                <defs>
                  <linearGradient id="g-mula" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="g-tamat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>
                  <linearGradient id="g-keputusan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                  <linearGradient id="g-proses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
                    <stop offset="100%" stopColor="#ccfbf1" stopOpacity="0.9" />
                  </linearGradient>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" opacity="0.75" />
                  </marker>
                  <filter
                    id="soft-shadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="3"
                      stdDeviation="4"
                      floodColor="#0d9488"
                      floodOpacity="0.18"
                    />
                  </filter>
                </defs>

                {/* Edges first (so they sit behind nodes) */}
                {carta.sambungan.map((edge, i) => (
                  <EdgeView key={`e-${i}`} edge={edge} nodes={layout.nodes} />
                ))}

                {/* Nodes */}
                {layout.nodes.map((laid, i) => (
                  <NodeView
                    key={laid.node.id}
                    laid={laid}
                    index={i}
                    onClick={() => setSelectedNode(laid.node)}
                  />
                ))}
              </svg>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Legend */}
      {hasDiagram && (
        <GlassCard className="p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Workflow className="size-4 text-primary" /> Petunjuk Nod
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <LegendItem jenis="mula" label="Mula" desc="Titik permulaan proses" />
            <LegendItem jenis="proses" label="Proses" desc="Langkah kerja biasa" />
            <LegendItem jenis="keputusan" label="Keputusan" desc="Cabang logik pilihan" />
            <LegendItem jenis="tamat" label="Tamat" desc="Titik akhir proses" />
          </div>
        </GlassCard>
      )}

      {/* Node detail dialog */}
      <Dialog
        open={!!selectedNode}
        onOpenChange={(o) => !o && setSelectedNode(null)}
      >
        <DialogContent className="sm:max-w-md">
          {selectedNode && (
            <>
              <DialogHeader>
                <NodeKindBadge jenis={selectedNode.jenis} />
                <DialogTitle className="mt-2">
                  {selectedNode.label.replace(/\n/g, ' ')}
                </DialogTitle>
                <DialogDescription className="text-foreground/80 leading-relaxed pt-1">
                  {selectedNode.penerangan || 'Tiada penerangan untuk nod ini.'}
                </DialogDescription>
              </DialogHeader>
              {selectedNode.prosedurId && (
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setSelectedProsedurId(selectedNode.prosedurId!)
                      setActiveModule('prosedur')
                      setSelectedNode(null)
                    }}
                    className="rounded-full"
                  >
                    <FileText className="size-4" /> Lihat Prosedur Penuh
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================================
// Main exported module
// ============================================================
export function CartaAlirModule() {
  const selectedCartaId = useAppStore((s) => s.selectedCartaId)
  const setSelectedCartaId = useAppStore((s) => s.setSelectedCartaId)

  if (selectedCartaId) {
    return (
      <CartaViewer
        cartaId={selectedCartaId}
        onBack={() => setSelectedCartaId(null)}
      />
    )
  }
  return <CartaList onPick={(id) => setSelectedCartaId(id)} />
}
