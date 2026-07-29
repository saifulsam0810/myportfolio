'use client'

import * as React from 'react'
import {
  BookOpen,
  Scale,
  FileCheck,
  Gavel,
  Shield,
  ClipboardList,
  ExternalLink,
  Copy,
  Calendar,
  ChevronDown,
  Library,
  CircleCheck,
  CircleSlash,
} from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useRujukanList } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import {
  GlassCard,
  SectionHeader,
  StatusBadge,
  PageLoader,
  EmptyState,
} from '@/components/glass'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { Rujukan } from '@/lib/types'

// ============================================================
// Kategori configuration (color-coded, NO indigo/blue)
// ============================================================

interface KategoriConfig {
  name: string
  icon: React.ElementType
  /** icon/badge container bg + text color */
  tint: string
  /** chip active style (for filter chips + badges) */
  chipActive: string
}

const KATEGORI_CONFIG: KategoriConfig[] = [
  {
    name: 'Peraturan Am',
    icon: Scale,
    tint: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    chipActive:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
  },
  {
    name: 'Pekeliling Perkhidmatan',
    icon: FileCheck,
    tint: 'bg-teal-500/15 text-teal-700 dark:text-teal-300',
    chipActive:
      'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/40',
  },
  {
    name: 'PKPA',
    icon: Gavel,
    tint: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    chipActive:
      'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40',
  },
  {
    name: 'Arahan Perbendaharaan',
    icon: Shield,
    tint: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
    chipActive:
      'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/40',
  },
  {
    name: 'SOP Dalaman',
    icon: ClipboardList,
    tint: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
    chipActive:
      'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/40',
  },
  {
    name: 'Piagam Pelanggan',
    icon: BookOpen,
    tint: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
    chipActive:
      'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40',
  },
]

const KATEGORI_MAP: Record<string, KategoriConfig> = Object.fromEntries(
  KATEGORI_CONFIG.map((k) => [k.name, k]),
)

const FALLBACK_CONFIG: KategoriConfig = {
  name: 'Lain-lain',
  icon: BookOpen,
  tint: 'bg-slate-500/15 text-slate-700 dark:text-slate-300',
  chipActive:
    'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/40',
}

function getKategoriConfig(name: string): KategoriConfig {
  return KATEGORI_MAP[name] ?? { ...FALLBACK_CONFIG, name }
}

const STATUS_FILTERS = [
  {
    value: '',
    label: 'Semua',
    chipActive: 'bg-primary/15 text-primary border-primary/40',
  },
  {
    value: 'Aktif',
    label: 'Aktif',
    chipActive:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
  },
  {
    value: 'Digantikan',
    label: 'Digantikan',
    chipActive:
      'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40',
  },
  {
    value: 'Dimansuhkan',
    label: 'Dimansuhkan',
    chipActive:
      'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40',
  },
] as const

/** Format an ISO date string as `dd MMM yyyy` in Malaysian Malay. */
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ============================================================
// Filter chip
// ============================================================

function FilterChip({
  active,
  onClick,
  activeClass,
  children,
  ariaLabel,
}: {
  active: boolean
  onClick: () => void
  activeClass: string
  children: React.ReactNode
  ariaLabel?: string
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap',
        active
          ? activeClass
          : 'border-border/60 bg-card/40 text-muted-foreground hover:bg-card/70 hover:text-foreground hover:border-border',
      )}
    >
      {children}
    </button>
  )
}

// ============================================================
// Stat card
// ============================================================

function StatCard({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string
  value: number
  icon: React.ElementType
  tint: string
}) {
  return (
    <GlassCard className="p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'size-11 rounded-xl flex items-center justify-center shrink-0',
            tint,
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums leading-tight">
            {value}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground truncate">
            {label}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

// ============================================================
// Rujukan card
// ============================================================

function RujukanCard({ r, index }: { r: Rujukan; index: number }) {
  const cfg = getKategoriConfig(r.kategori)
  const Icon = cfg.icon

  const handleCopy = async () => {
    if (!r.pautanLuaran) return
    try {
      await navigator.clipboard.writeText(r.pautanLuaran)
      toast.success('Pautan disalin ke papan keratan', {
        description: r.pautanLuaran,
      })
    } catch {
      toast.error('Gagal menyalin pautan', {
        description: 'Pelayar anda mungkin menyekat akses papan keratan.',
      })
    }
  }

  const tarikh = formatDate(r.tarikhKuatKuasa)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
    >
      <GlassCard className="p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Left: large category-tinted icon */}
          <div
            className={cn(
              'size-12 sm:size-14 rounded-xl flex items-center justify-center shrink-0',
              cfg.tint,
            )}
            aria-hidden
          >
            <Icon className="size-6 sm:size-7" />
          </div>

          {/* Middle: content */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className="font-mono text-[11px] bg-primary/10 text-primary border-primary/30"
              >
                {r.kodRujukan}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-[11px]', cfg.chipActive)}
              >
                {r.kategori}
              </Badge>
              {r.versi && (
                <Badge
                  variant="outline"
                  className="text-[11px] bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                >
                  v{r.versi}
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-foreground leading-snug line-clamp-2">
              {r.tajuk}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {r.penerangan}
            </p>
            {tarikh && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                <Calendar className="size-3.5 shrink-0" />
                <span>
                  Kuat kuasa:{' '}
                  <span className="font-medium text-foreground/80">
                    {tarikh}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Right: status + actions */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:shrink-0">
            <StatusBadge status={r.status} />
            {r.pautanLuaran && (
              <div className="flex sm:flex-col gap-2 ml-auto sm:ml-0">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="glass-subtle border-0 rounded-full h-8 text-xs"
                >
                  <a
                    href={r.pautanLuaran}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Buka portal rasmi untuk ${r.kodRujukan}`}
                  >
                    <ExternalLink className="size-3.5 mr-1.5" />
                    Portal Rasmi
                  </a>
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopy}
                      className="glass-subtle border-0 rounded-full h-8 w-8"
                      aria-label="Salin pautan"
                    >
                      <Copy className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Salin pautan</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ============================================================
// Rujukan group (collapsible section per kategori)
// ============================================================

function RujukanGroup({
  kategori,
  items,
  defaultOpen,
}: {
  kategori: string
  items: Rujukan[]
  defaultOpen: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const cfg = getKategoriConfig(kategori)
  const Icon = cfg.icon

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <GlassCard className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <button
            className="w-full flex items-center gap-3 p-4 sm:p-5 hover:bg-card/40 transition-colors text-left group"
            aria-label={`${open ? 'Tutup' : 'Buka'} kategori ${kategori}`}
          >
            <div
              className={cn(
                'size-10 rounded-xl flex items-center justify-center shrink-0',
                cfg.tint,
              )}
              aria-hidden
            >
              <Icon className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground leading-tight truncate">
                {kategori}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {items.length}{' '}
                {items.length === 1 ? 'rujukan' : 'rujukan'} tersenarai
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn('text-[11px] tabular-nums', cfg.chipActive)}
            >
              {items.length}
            </Badge>
            <ChevronDown
              className={cn(
                'size-4 text-muted-foreground transition-transform duration-200 shrink-0',
                open && 'rotate-180',
              )}
              aria-hidden
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
            <div className="h-px bg-border/40" />
            {items.map((r, i) => (
              <RujukanCard key={r.id} r={r} index={i} />
            ))}
          </div>
        </CollapsibleContent>
      </GlassCard>
    </Collapsible>
  )
}

// ============================================================
// Main module
// ============================================================

export function RujukanModule() {
  const searchQuery = useAppStore((s) => s.searchQuery)
  const [kategori, setKategori] = React.useState<string>('')
  const [status, setStatus] = React.useState<string>('')

  const { data, isLoading, isError, error } = useRujukanList(
    searchQuery,
    kategori || undefined,
    status || undefined,
  )

  const rujukan = data ?? []

  // Group rujukan by kategori, preserving KATEGORI_CONFIG order
  const grouped = React.useMemo(() => {
    const map = new Map<string, Rujukan[]>()
    for (const r of rujukan) {
      const arr = map.get(r.kategori) ?? []
      arr.push(r)
      map.set(r.kategori, arr)
    }
    const ordered: Array<{ kategori: string; items: Rujukan[] }> = []
    for (const k of KATEGORI_CONFIG) {
      const items = map.get(k.name)
      if (items && items.length > 0) {
        ordered.push({ kategori: k.name, items })
      }
    }
    // append any unknown kategori at the end
    for (const [k, items] of map.entries()) {
      if (!KATEGORI_MAP[k] && items.length > 0) {
        ordered.push({ kategori: k, items })
      }
    }
    return ordered
  }, [rujukan])

  const aktifCount = rujukan.filter((r) => r.status === 'Aktif').length
  const nonAktifCount = rujukan.filter(
    (r) => r.status === 'Digantikan' || r.status === 'Dimansuhkan',
  ).length

  const hasFilters = !!(searchQuery || kategori || status)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Rujukan Peraturan & Pekeliling"
        description="Repositori rujukan rasmi peraturan perkhidmatan, garis panduan, SOP dan pekeliling"
        icon={<BookOpen className="size-5" />}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Jumlah Rujukan"
          value={rujukan.length}
          icon={Library}
          tint="bg-primary/15 text-primary"
        />
        <StatCard
          label="Aktif"
          value={aktifCount}
          icon={CircleCheck}
          tint="bg-emerald-500/15 text-emerald-700"
        />
        <StatCard
          label="Digantikan & Dimansuhkan"
          value={nonAktifCount}
          icon={CircleSlash}
          tint="bg-rose-500/15 text-rose-700"
        />
      </div>

      {/* Filter bar */}
      <GlassCard className="p-4 sm:p-5 space-y-4">
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Kategori
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Tapis mengikut kategori"
          >
            <FilterChip
              active={kategori === ''}
              onClick={() => setKategori('')}
              activeClass="bg-primary/15 text-primary border-primary/40"
              ariaLabel="Tunjukkan semua kategori"
            >
              Semua
            </FilterChip>
            {KATEGORI_CONFIG.map((k) => (
              <FilterChip
                key={k.name}
                active={kategori === k.name}
                onClick={() => setKategori(k.name)}
                activeClass={k.chipActive}
                ariaLabel={`Tapis ${k.name}`}
              >
                <k.icon className="size-3.5" />
                {k.name}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Status
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Tapis mengikut status"
          >
            {STATUS_FILTERS.map((s) => (
              <FilterChip
                key={s.value || 'semua'}
                active={status === s.value}
                onClick={() => setStatus(s.value)}
                activeClass={s.chipActive}
                ariaLabel={`Tapis status ${s.label}`}
              >
                {s.label}
              </FilterChip>
            ))}
          </div>
        </div>

        {hasFilters && (
          <div className="flex items-center justify-end pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setKategori('')
                setStatus('')
              }}
            >
              Set semula penapis
            </Button>
          </div>
        )}
      </GlassCard>

      {/* Search hint */}
      {searchQuery && (
        <div className="text-xs text-muted-foreground">
          Menunjukkan hasil carian untuk:{' '}
          <span className="font-medium text-foreground">
            &ldquo;{searchQuery}&rdquo;
          </span>
        </div>
      )}

      {/* Loading / error / empty / grouped list */}
      {isLoading ? (
        <GlassCard className="p-8">
          <PageLoader label="Memuatkan rujukan..." />
        </GlassCard>
      ) : isError ? (
        <GlassCard className="p-8">
          <EmptyState
            icon={<BookOpen className="size-7" />}
            title="Gagal memuatkan data"
            description={
              error instanceof Error
                ? error.message
                : 'Sila cuba lagi sebentar lagi.'
            }
          />
        </GlassCard>
      ) : rujukan.length === 0 ? (
        <GlassCard className="p-8">
          <EmptyState
            icon={<BookOpen className="size-7" />}
            title="Tiada rujukan dijumpai"
            description={
              hasFilters
                ? 'Cuba laraskan penapis atau kata kunci carian anda.'
                : 'Belum ada rujukan yang ditambahkan ke repositori.'
            }
          />
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {grouped.map((g) => (
            <RujukanGroup
              key={g.kategori}
              kategori={g.kategori}
              items={g.items}
              defaultOpen
            />
          ))}
        </div>
      )}
    </div>
  )
}
