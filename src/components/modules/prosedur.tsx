'use client'

import * as React from 'react'
import {
  ClipboardList,
  ArrowLeft,
  Target,
  ScanLine,
  User,
  Clock,
  FileText,
  BookOpen,
  History,
  Calendar,
  Download,
  ExternalLink,
  Hash,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useProsedurList,
  useProsedur,
  useBorangList,
  useRujukanList,
} from '@/lib/hooks'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ProsedurKerja, Borang, Rujukan } from '@/lib/types'

const STATUS_FILTERS = ['All', 'Aktif', 'Dikemas Kini', 'Dimansuhkan'] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

const FILTER_LABEL: Record<StatusFilter, string> = {
  All: 'Semua',
  Aktif: 'Aktif',
  'Dikemas Kini': 'Dikemas Kini',
  Dimansuhkan: 'Dimansuhkan',
}

/** Format a date string as `dd MMM yyyy` in Malaysian Malay, e.g. "01 Jan 2024". */
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ============================================================
// List View
// ============================================================

function ProsedurCard({ p }: { p: ProsedurKerja }) {
  const setSelectedProsedurId = useAppStore((s) => s.setSelectedProsedurId)
  return (
    <GlassCard className="p-5 flex flex-col gap-3 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <Badge
          variant="outline"
          className="font-mono text-[11px] bg-primary/10 text-primary border-primary/30"
        >
          <Hash className="size-3" />
          {p.kodProsedur}
        </Badge>
        <StatusBadge status={p.status} />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-foreground leading-snug line-clamp-2">
          {p.tajuk}
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
          {p.tujuan || 'Tiada perihal tujuan.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
        >
          v{p.versi}
        </Badge>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Calendar className="size-3.5" />
          {formatDate(p.tarikhKuatKuasa)}
        </span>
      </div>

      <Button
        size="sm"
        className="mt-1 w-full rounded-full"
        onClick={() => setSelectedProsedurId(p.id)}
      >
        Lihat Prosedur <ArrowRight className="size-3.5" />
      </Button>
    </GlassCard>
  )
}

function ProsedurList() {
  const searchQuery = useAppStore((s) => s.searchQuery)
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('All')

  const { data, isLoading, isError } = useProsedurList(
    searchQuery,
    statusFilter === 'All' ? undefined : statusFilter,
  )

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Prosedur Kerja (SOP)"
        description="Langkah kerja terperinci mengikut format piawai bagi setiap proses"
        icon={<ClipboardList className="size-6" />}
      />

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Tapis mengikut status">
        {STATUS_FILTERS.map((s) => {
          const active = statusFilter === s
          return (
            <button
              key={s}
              role="tab"
              aria-selected={active}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                active
                  ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30'
                  : 'bg-card/40 border-border/60 text-muted-foreground hover:bg-card/70 hover:text-foreground'
              }`}
            >
              {FILTER_LABEL[s]}
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <GlassCard className="p-8">
          <PageLoader label="Memuatkan prosedur..." />
        </GlassCard>
      ) : isError ? (
        <GlassCard className="p-8">
          <EmptyState
            icon={<ClipboardList className="size-6" />}
            title="Gagal memuatkan data"
            description="Sila cuba lagi sebentar lagi."
          />
        </GlassCard>
      ) : !data || data.length === 0 ? (
        <GlassCard className="p-8">
          <EmptyState
            icon={<ClipboardList className="size-6" />}
            title="Tiada prosedur dijumpai"
            description="Cuba ubah kata carian atau penapis status."
          />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((p) => (
            <ProsedurCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Detail View — helpers
// ============================================================

function SectionCard({
  icon,
  title,
  children,
  action,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </GlassCard>
  )
}

// ============================================================
// Detail View
// ============================================================

function ProsedurDetail() {
  const selectedProsedurId = useAppStore((s) => s.selectedProsedurId)
  const setSelectedProsedurId = useAppStore((s) => s.setSelectedProsedurId)

  const { data: p, isLoading } = useProsedur(selectedProsedurId)

  // Fetch borang & rujukan lists (cached by React Query, shared across modules)
  const { data: allBorang, isLoading: borangLoading } = useBorangList()
  const { data: allRujukan, isLoading: rujukanLoading } = useRujukanList()

  if (isLoading || !p) {
    return (
      <GlassCard className="p-8">
        <PageLoader label="Memuatkan butiran prosedur..." />
      </GlassCard>
    )
  }

  const borangBerkaitan: Borang[] = (allBorang ?? []).filter((b) =>
    p.borangBerkaitan?.includes(b.id),
  )
  const rujukanPeraturan: Rujukan[] = (allRujukan ?? []).filter((r) =>
    p.rujukanPeraturan?.includes(r.id),
  )

  const handlePdf = () => {
    toast.info('Cetakan PDF akan tersedia tidak lama lagi', {
      description: `${p.kodProsedur} — ${p.tajuk} (v${p.versi})`,
    })
  }

  return (
    <div className="space-y-5">
      {/* Sticky top bar: back + PDF */}
      <div className="sticky top-4 z-30 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full glass-subtle border-0"
          onClick={() => setSelectedProsedurId(null)}
        >
          <ArrowLeft className="size-4" /> Kembali
        </Button>
        <Button
          size="sm"
          className="rounded-full shadow-lg shadow-primary/30"
          onClick={handlePdf}
        >
          <Download className="size-4" /> Muat Turun PDF
        </Button>
      </div>

      {/* Header card */}
      <GlassCard strong className="p-6 sm:p-8 overflow-hidden relative">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-gradient-to-br from-primary/25 to-amber-400/20 blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge
              variant="outline"
              className="font-mono text-xs bg-primary/10 text-primary border-primary/30"
            >
              <Hash className="size-3" />
              {p.kodProsedur}
            </Badge>
            <StatusBadge status={p.status} />
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
            >
              v{p.versi}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
            {p.tajuk}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-4 text-primary" />
              <span>Tarikh Kuat Kuasa:</span>{' '}
              <span className="font-medium text-foreground">
                {formatDate(p.tarikhKuatKuasa)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-4 text-amber-600" />
              <span>Semakan Terakhir:</span>{' '}
              <span className="font-medium text-foreground">
                {formatDate(p.tarikhSemakan)}
              </span>
            </span>
          </div>
        </div>
      </GlassCard>

      {/* 1. Tujuan */}
      <SectionCard icon={<Target className="size-4.5" />} title="Tujuan">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {p.tujuan || '—'}
        </p>
      </SectionCard>

      {/* 2. Skop */}
      <SectionCard icon={<ScanLine className="size-4.5" />} title="Skop">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {p.skop || '—'}
        </p>
      </SectionCard>

      {/* 3. Tanggungjawab */}
      <SectionCard icon={<User className="size-4.5" />} title="Tanggungjawab">
        {p.tanggungjawab && p.tanggungjawab.length > 0 ? (
          <div className="rounded-xl overflow-hidden border border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5 hover:bg-primary/5 border-border/50">
                  <TableHead className="w-2/5 text-foreground">Jawatan</TableHead>
                  <TableHead className="text-foreground">Peranan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {p.tanggungjawab.map((t, i) => (
                  <TableRow key={i} className="border-border/40">
                    <TableCell className="font-medium text-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <User className="size-3.5 text-primary" />
                        {t.jawatan}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {t.peranan}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tiada maklumat tanggungjawab direkodkan.
          </p>
        )}
      </SectionCard>

      {/* 4. Langkah Kerja Terperinci */}
      <SectionCard
        icon={<ClipboardList className="size-4.5" />}
        title="Langkah Kerja Terperinci"
        action={
          p.langkahKerja && p.langkahKerja.length > 0 ? (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30"
            >
              {p.langkahKerja.length} langkah
            </Badge>
          ) : undefined
        }
      >
        {p.langkahKerja && p.langkahKerja.length > 0 ? (
          <ol className="relative space-y-4">
            {/* vertical connector line */}
            <span
              aria-hidden
              className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/50 via-primary/25 to-transparent"
            />
            {p.langkahKerja.map((step) => (
              <li key={step.no} className="relative flex gap-4">
                <div
                  className="shrink-0 size-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold shadow-md shadow-primary/30 ring-4 ring-background"
                  aria-hidden
                >
                  {step.no}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold text-foreground leading-snug">
                      {step.tindakan}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/30 text-[11px]"
                      >
                        <User className="size-3" />
                        {step.tanggungjawab}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[11px]"
                      >
                        <Clock className="size-3" />
                        {step.tempohMasa}
                      </Badge>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tiada langkah kerja direkodkan.
          </p>
        )}
      </SectionCard>

      {/* 5. Borang Berkaitan */}
      <SectionCard icon={<FileText className="size-4.5" />} title="Borang Berkaitan">
        {borangLoading ? (
          <p className="text-sm text-muted-foreground">Memuatkan borang berkaitan...</p>
        ) : borangBerkaitan.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {borangBerkaitan.map((b) => (
              <div
                key={b.id}
                className="flex items-start gap-3 rounded-xl bg-card/40 border border-border/50 p-3.5 hover:bg-card/70 transition-colors"
              >
                <div className="size-10 rounded-lg bg-violet-500/15 text-violet-700 dark:text-violet-300 flex items-center justify-center shrink-0">
                  <FileText className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30"
                    >
                      {b.kodBorang}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]"
                    >
                      {b.format}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                    {b.nama}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 shrink-0 text-primary"
                  aria-label={`Muat turun ${b.kodBorang}`}
                  onClick={() =>
                    toast.success(`Memuat turun ${b.kodBorang}`, {
                      description: b.nama,
                    })
                  }
                >
                  <Download className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Tiada borang berkaitan.</p>
        )}
      </SectionCard>

      {/* 6. Rujukan Peraturan */}
      <SectionCard
        icon={<BookOpen className="size-4.5" />}
        title="Rujukan Peraturan"
      >
        {rujukanLoading ? (
          <p className="text-sm text-muted-foreground">Memuatkan rujukan peraturan...</p>
        ) : rujukanPeraturan.length > 0 ? (
          <div className="space-y-2.5">
            {rujukanPeraturan.map((r) => (
              <div
                key={r.id}
                className="flex items-start gap-3 rounded-xl bg-card/40 border border-border/50 p-3.5 hover:bg-card/70 transition-colors"
              >
                <div className="size-10 rounded-lg bg-pink-500/15 text-pink-700 dark:text-pink-300 flex items-center justify-center shrink-0">
                  <BookOpen className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/30"
                    >
                      {r.kodRujukan}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/30 text-[10px]"
                    >
                      {r.kategori}
                    </Badge>
                    {r.versi && (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]"
                      >
                        v{r.versi}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug">
                    {r.tajuk}
                  </p>
                  {r.penerangan && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {r.penerangan}
                    </p>
                  )}
                </div>
                {r.pautanLuaran && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 shrink-0 text-primary"
                    aria-label="Buka pautan luaran"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open(r.pautanLuaran!, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    <ExternalLink className="size-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tiada rujukan peraturan berkaitan.
          </p>
        )}
      </SectionCard>

      {/* 7. Sejarah Semakan */}
      <SectionCard icon={<History className="size-4.5" />} title="Sejarah Semakan">
        {p.sejarahSemakan && p.sejarahSemakan.length > 0 ? (
          <ol className="relative space-y-3">
            <span
              aria-hidden
              className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-amber-500/50 via-amber-500/25 to-transparent"
            />
            {p.sejarahSemakan.map((s, i) => (
              <li key={i} className="relative flex gap-3">
                <div
                  className="shrink-0 size-6 mt-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center ring-4 ring-background"
                  aria-hidden
                >
                  <History className="size-3" />
                </div>
                <div className="flex-1 min-w-0 rounded-xl bg-card/40 border border-border/40 p-3">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[11px]"
                    >
                      v{s.versi}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      {formatDate(s.tarikh)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {s.perubahan}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tiada sejarah semakan direkodkan.
          </p>
        )}
      </SectionCard>
    </div>
  )
}

// ============================================================
// Public export
// ============================================================

export function ProsedurModule() {
  const selectedProsedurId = useAppStore((s) => s.selectedProsedurId)
  return selectedProsedurId ? <ProsedurDetail /> : <ProsedurList />
}
