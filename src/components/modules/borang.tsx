'use client'

import * as React from 'react'
import {
  FileText,
  FileSpreadsheet,
  FileType2,
  Download,
  QrCode,
  Calendar,
  HardDrive,
  Filter,
  Search,
  Archive,
  Layers,
  Star,
  Hash,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useBorangList } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { GlassCard, SectionHeader, PageLoader, EmptyState } from '@/components/glass'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Borang } from '@/lib/types'

// ============================================================
// Category styling (teal/emerald + amber palette — NO indigo/blue)
// ============================================================
const KATEGORI_BADGE: Record<string, string> = {
  'Sumber Manusia': 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  Kewangan: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  Pentadbiran: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
  'Pengurusan Aset': 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
  'Perkhidmatan Pelanggan':
    'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  ICT: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30',
}

const KATEGORI_LIST = [
  'Sumber Manusia',
  'Kewangan',
  'Pentadbiran',
  'Pengurusan Aset',
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
// Format → icon + tint
// NOTE: Word uses teal tint (NOT indigo/blue) to stay on-brand.
// ============================================================
type FormatKey = 'PDF' | 'Word' | 'Excel' | 'Lain'

interface FormatVisual {
  key: FormatKey
  Icon: React.ElementType
  tint: string
  badge: string
}

function resolveFormat(format: string): FormatVisual {
  const f = format?.toLowerCase()
  if (f === 'pdf') {
    return {
      key: 'PDF',
      Icon: FileText,
      tint: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
      badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    }
  }
  if (f === 'word' || f === 'doc' || f === 'docx') {
    return {
      key: 'Word',
      Icon: FileText,
      tint: 'bg-teal-500/15 text-teal-700 dark:text-teal-300',
      badge: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
    }
  }
  if (f === 'excel' || f === 'xls' || f === 'xlsx') {
    return {
      key: 'Excel',
      Icon: FileSpreadsheet,
      tint: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
      badge:
        'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    }
  }
  return {
    key: 'Lain',
    Icon: FileType2,
    tint: 'bg-slate-500/15 text-slate-700 dark:text-slate-300',
    badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
  }
}

const FORMAT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Semua Format' },
  { value: 'PDF', label: 'PDF' },
  { value: 'Word', label: 'Word' },
  { value: 'Excel', label: 'Excel' },
]

// ============================================================
// Date formatting (ms-MY, "dd MMM yyyy")
// ============================================================
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('ms-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

// ============================================================
// Filter chip
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

// ============================================================
// Small stat card
// ============================================================
function StatTile({
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
    <GlassCard className="p-4 flex items-center gap-3">
      <div className={cn('size-10 rounded-xl flex items-center justify-center shrink-0', tint)}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums leading-none">
          {value}
        </div>
        <div className="text-xs text-muted-foreground mt-1 truncate">{label}</div>
      </div>
    </GlassCard>
  )
}

// ============================================================
// Document card
// ============================================================
function BorangCard({ borang }: { borang: Borang }) {
  const setActiveModule = useAppStore((s) => s.setActiveModule)
  const isArchived = borang.status === 'Diarkib'
  const { Icon, tint, badge, key } = resolveFormat(borang.format)
  const isKerap = borang.kekerapan === 'Kerap'

  function handleDownload() {
    if (isArchived) return
    toast.success('Muat turun dimulakan', {
      description: `${borang.nama} (${borang.format})`,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="h-full"
    >
      <GlassCard
        className={cn(
          'p-5 h-full flex flex-col hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300',
          isArchived && 'opacity-80',
        )}
      >
        {/* Top row: file-type icon + kod + status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={cn(
              'size-12 rounded-xl flex items-center justify-center shrink-0',
              tint,
            )}
            aria-hidden
          >
            <Icon className="size-6" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground bg-muted/60 border border-border/60 rounded-md px-1.5 py-0.5">
              <Hash className="size-3" />
              {borang.kodBorang}
            </span>
            {isArchived && (
              <Badge className="bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30 rounded-full">
                <Archive className="size-3" />
                Diarkib
              </Badge>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground leading-snug line-clamp-2">
          {borang.nama}
        </h3>

        {/* Badges: kategori, format, kekerapan */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          <Badge
            variant="outline"
            className={cn('rounded-full border', kategoriBadgeClass(borang.kategori))}
          >
            {borang.kategori}
          </Badge>
          <Badge variant="outline" className={cn('rounded-full border', badge)}>
            {key}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              'rounded-full border',
              isKerap
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                : 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/25',
            )}
          >
            {isKerap && <Star className="size-3" />}
            {borang.kekerapan}
          </Badge>
        </div>

        {/* Description */}
        {borang.penerangan && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {borang.penerangan}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground mb-3">
            {borang.saizFail && (
              <span className="inline-flex items-center gap-1">
                <HardDrive className="size-3.5" />
                {borang.saizFail}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5" />
              Dikemas kini: {formatDate(borang.tarikhKemasKini)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Layers className="size-3.5" />
              v{borang.versi}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isArchived ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="flex-1 glass-subtle border-0 cursor-not-allowed"
                    >
                      <Download className="size-4" />
                      Muat Turun
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Dokumen telah diarkibkan</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button size="sm" onClick={handleDownload} className="flex-1">
                <Download className="size-4" />
                Muat Turun
              </Button>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="glass-subtle border-0"
                    aria-label="Lihat Kod QR"
                    onClick={() => setActiveModule('qr')}
                  >
                    <QrCode className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Lihat Kod QR</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ============================================================
// Main module
// ============================================================
export function BorangModule() {
  const searchQuery = useAppStore((s) => s.searchQuery)
  const [kategori, setKategori] = React.useState<string>('')
  const [format, setFormat] = React.useState<string>('all')

  const { data, isLoading, isFetching } = useBorangList(
    searchQuery,
    kategori || undefined,
  )

  // Apply format filter client-side (hook doesn't support format param)
  const filtered = React.useMemo(() => {
    if (!data) return []
    if (format === 'all') return data
    return data.filter((b) => resolveFormat(b.format).key === format)
  }, [data, format])

  // Counts per kategori (from raw server data, NOT format-filtered)
  const kategoriCounts = React.useMemo(() => {
    const map: Record<string, number> = {}
    data?.forEach((b) => {
      map[b.kategori] = (map[b.kategori] || 0) + 1
    })
    return map
  }, [data])

  // Stats
  const totalBorang = data?.length ?? 0
  const totalByKategori = kategori ? kategoriCounts[kategori] ?? 0 : totalBorang
  const kerapCount = React.useMemo(
    () => filtered.filter((b) => b.kekerapan === 'Kerap').length,
    [filtered],
  )

  const hasActiveFilters = !!(searchQuery || kategori || format !== 'all')

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Borang & Dokumen Sokongan"
        description="Repositori pusat borang, templat dan dokumen yang kerap digunakan dengan fungsi muat turun"
        icon={<FileText className="size-5" />}
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

      {/* Filter bar */}
      <GlassCard className="p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          {/* Kategori chips */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Filter className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Kategori
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
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
                  count={kategoriCounts[k] ?? 0}
                />
              ))}
            </div>
          </div>

          {/* Format filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <FileText className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Format
              </span>
            </div>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-full sm:w-[200px] glass-subtle border-border/60">
                <SelectValue placeholder="Semua Format" />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile
          label="Jumlah Borang"
          value={totalBorang}
          icon={FileText}
          tint="bg-teal-500/15 text-teal-700 dark:text-teal-300"
        />
        <StatTile
          label={kategori ? `Borang ${kategori}` : 'Borang Kategori Semasa'}
          value={totalByKategori}
          icon={Layers}
          tint="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
        />
        <StatTile
          label="Kerap Digunakan"
          value={kerapCount}
          icon={Star}
          tint="bg-amber-500/15 text-amber-700 dark:text-amber-300"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <GlassCard className="p-8">
          <PageLoader label="Memuatkan borang..." />
        </GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={<FileText className="size-6" />}
            title="Tiada borang dijumpai"
            description={
              hasActiveFilters
                ? 'Cuba ubah kata carian, kategori atau format yang dipilih.'
                : 'Belum ada borang didaftarkan dalam sistem.'
            }
            action={
              hasActiveFilters ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-subtle border-0"
                  onClick={() => {
                    setKategori('')
                    setFormat('all')
                  }}
                >
                  Set Semula Penapis
                </Button>
              ) : undefined
            }
          />
        </GlassCard>
      ) : (
        <>
          {isFetching && !isLoading && (
            <div className="text-xs text-muted-foreground animate-pulse">
              Mengemas kini…
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((b) => (
              <BorangCard key={b.id} borang={b} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
