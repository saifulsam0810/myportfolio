'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckSquare,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Users,
  BarChart3,
  FileBarChart,
  ClipboardCheck,
  StickyNote,
  ShieldAlert,
  Info,
  ListChecks,
} from 'lucide-react'
import { toast } from 'sonner'
import { useChecklistList, useToggleChecklistItem } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import type { Checklist, ChecklistItem, Role } from '@/lib/types'
import {
  GlassCard,
  SectionHeader,
  PageLoader,
  EmptyState,
} from '@/components/glass'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type Kekerapan = 'Harian' | 'Mingguan' | 'Bulanan'

const KEKERAPAN_LIST: Kekerapan[] = ['Harian', 'Mingguan', 'Bulanan']

const KEKERAPAN_TINT: Record<Kekerapan, string> = {
  Harian: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
  Mingguan:
    'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  Bulanan:
    'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30',
}

const KEKERAPAN_STROKE: Record<Kekerapan, string> = {
  Harian: '#0d9488',
  Mingguan: '#f59e0b',
  Bulanan: '#8b5cf6',
}

const KEKERAPAN_ICON: Record<Kekerapan, React.ElementType> = {
  Harian: Clock,
  Mingguan: Calendar,
  Bulanan: ListChecks,
}

function penggunaLabel(role: Role) {
  return `Pengguna: ${role}`
}

function computeStats(items: ChecklistItem[]) {
  const total = items.length
  const selesai = items.filter((i) => i.status === 'Selesai').length
  const percent = total === 0 ? 0 : Math.round((selesai / total) * 100)
  return { total, selesai, belum: total - selesai, percent }
}

function KekerapanBadge({ kekerapan }: { kekerapan: Kekerapan }) {
  const Icon = KEKERAPAN_ICON[kekerapan]
  return (
    <Badge variant="outline" className={cn('gap-1.5', KEKERAPAN_TINT[kekerapan])}>
      <Icon className="size-3" />
      {kekerapan}
    </Badge>
  )
}

function ProgressRing({
  percent,
  size = 56,
  stroke = 6,
  tint = '#0d9488',
}: {
  percent: number
  size?: number
  stroke?: number
  tint?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, percent))
  const offset = c - (clamped / 100) * c
  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/40"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tint}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold tabular-nums text-foreground">
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  )
}

function tierClass(pct: number) {
  if (pct >= 85)
    return {
      badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
      stroke: '#10b981',
      bar: '[&>[data-slot=progress-indicator]]:bg-emerald-500',
      text: 'text-emerald-600',
    }
  if (pct >= 50)
    return {
      badge: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
      stroke: '#f59e0b',
      bar: '[&>[data-slot=progress-indicator]]:bg-amber-500',
      text: 'text-amber-600',
    }
  return {
    badge: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
    stroke: '#f43f5e',
    bar: '[&>[data-slot=progress-indicator]]:bg-rose-500',
    text: 'text-rose-600',
  }
}

function ComplianceSummaryCard({ checklists }: { checklists: Checklist[] }) {
  const allItems = checklists.flatMap((c) => c.items)
  const stats = computeStats(allItems)
  const tier = tierClass(stats.percent)

  return (
    <GlassCard className="p-5 sm:p-6 overflow-hidden relative">
      <div className="absolute -right-10 -top-10 size-40 rounded-full bg-gradient-to-br from-primary/25 to-amber-400/15 blur-2xl" />
      <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-6 items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="size-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <BarChart3 className="size-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground leading-tight">
                Ringkasan Pematuhan
              </h3>
              <p className="text-xs text-muted-foreground">
                Semua checklist kekerapan ini
              </p>
            </div>
          </div>
          <div className="flex items-end gap-3 mt-3">
            <div className="text-4xl font-bold text-gradient tabular-nums">
              {stats.percent}%
            </div>
            <Badge variant="outline" className={cn('mb-1', tier.badge)}>
              Sasaran 85%
            </Badge>
          </div>
          <Progress
            value={stats.percent}
            className={cn('h-2.5 mt-3', tier.bar)}
          />
          <div className="mt-3 grid grid-cols-3 gap-2 max-w-md">
            <div className="glass-subtle rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-foreground tabular-nums">
                {stats.total}
              </div>
              <div className="text-[10px] text-muted-foreground">Jumlah</div>
            </div>
            <div className="glass-subtle rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-emerald-600 tabular-nums">
                {stats.selesai}
              </div>
              <div className="text-[10px] text-muted-foreground">Selesai</div>
            </div>
            <div className="glass-subtle rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-amber-600 tabular-nums">
                {stats.belum}
              </div>
              <div className="text-[10px] text-muted-foreground">Belum</div>
            </div>
          </div>
        </div>
        <ProgressRing
          percent={stats.percent}
          size={96}
          stroke={9}
          tint={tier.stroke}
        />
      </div>
    </GlassCard>
  )
}

function CatatanCell({
  item,
  checklistId,
  role,
  disabled,
}: {
  item: ChecklistItem
  checklistId: string
  role: Role
  disabled: boolean
}) {
  const toggle = useToggleChecklistItem()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(item.catatan ?? '')

  React.useEffect(() => {
    setValue(item.catatan ?? '')
  }, [item.catatan])

  const save = () => {
    setOpen(false)
    if ((item.catatan ?? '') === value) return
    toggle.mutate(
      {
        id: checklistId,
        itemId: item.id,
        status: item.status,
        catatan: value,
        pengguna: penggunaLabel(role),
      },
      {
        onSuccess: () => toast.success('Catatan disimpan'),
        onError: () => toast.error('Gagal simpan catatan'),
      }
    )
  }

  if (disabled) {
    return (
      <span className="text-xs text-muted-foreground italic line-clamp-1">
        {item.catatan || '—'}
      </span>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="text-xs text-left text-muted-foreground hover:text-foreground flex items-center gap-1.5 max-w-[180px]"
          aria-label="Edit catatan"
        >
          <StickyNote className="size-3 shrink-0" />
          <span
            className={cn(
              'truncate',
              !item.catatan && 'italic opacity-60'
            )}
          >
            {item.catatan || 'Tambah catatan...'}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">
            Catatan
          </label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Tulis catatan..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
            }}
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setValue(item.catatan ?? '')
                setOpen(false)
              }}
            >
              Batal
            </Button>
            <Button size="sm" onClick={save} disabled={toggle.isPending}>
              Simpan
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ChecklistTable({
  checklist,
  role,
  recentlyDone,
  onToggledDone,
}: {
  checklist: Checklist
  role: Role
  recentlyDone: Set<string>
  onToggledDone: (itemId: string) => void
}) {
  const toggle = useToggleChecklistItem()
  const isReadOnly = role === 'Awam'

  const handleToggle = (item: ChecklistItem) => {
    if (isReadOnly) return
    const next: 'Selesai' | 'Belum Selesai' =
      item.status === 'Selesai' ? 'Belum Selesai' : 'Selesai'
    toggle.mutate(
      {
        id: checklist.id,
        itemId: item.id,
        status: next,
        pengguna: penggunaLabel(role),
      },
      {
        onSuccess: () => {
          if (next === 'Selesai') {
            onToggledDone(item.id)
            toast.success('Status dikemas kini', {
              description: `${item.tugasan} — Selesai`,
            })
          } else {
            toast.info('Status dikemas kini', {
              description: `${item.tugasan} — Belum Selesai`,
            })
          }
        },
        onError: () => toast.error('Gagal kemas kini status'),
      }
    )
  }

  if (checklist.items.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Tiada item dalam checklist ini.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/50 hover:bg-transparent">
          <TableHead className="w-12 text-center">Bil</TableHead>
          <TableHead>Tugasan</TableHead>
          <TableHead className="w-40">Tanggungjawab</TableHead>
          <TableHead className="w-20 text-center">Status</TableHead>
          <TableHead className="w-48">Catatan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {checklist.items.map((item) => {
          const done = item.status === 'Selesai'
          const flash = recentlyDone.has(item.id)
          return (
            <motion.tr
              key={item.id}
              animate={
                flash
                  ? {
                      backgroundColor: [
                        'rgba(16,185,129,0.32)',
                        'rgba(16,185,129,0.08)',
                        'rgba(16,185,129,0.0)',
                      ],
                    }
                  : { backgroundColor: 'rgba(0,0,0,0)' }
              }
              transition={
                flash
                  ? { duration: 1.2, ease: 'easeOut' }
                  : { duration: 0.2 }
              }
              className={cn(
                'border-b border-border/40 hover:bg-muted/40 transition-colors',
                done && 'bg-emerald-500/[0.05]'
              )}
            >
              <TableCell className="text-center text-muted-foreground tabular-nums">
                {item.bil}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                <div
                  className={cn(
                    'flex items-start gap-2',
                    done && 'text-muted-foreground line-through decoration-emerald-500/60'
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground/60 mt-0.5 shrink-0" />
                  )}
                  <span className="min-w-0">{item.tugasan}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20 gap-1"
                >
                  <Users className="size-3" />
                  {item.tanggungjawab}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  {isReadOnly ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Checkbox
                            checked={done}
                            disabled
                            aria-label="Hanya baca"
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Akses awam: hanya baca
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Checkbox
                      checked={done}
                      onCheckedChange={() => handleToggle(item)}
                      disabled={toggle.isPending}
                      aria-label={`Tanda ${item.tugasan}`}
                      className={cn(
                        done &&
                          'data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600'
                      )}
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <CatatanCell
                  item={item}
                  checklistId={checklist.id}
                  role={role}
                  disabled={isReadOnly}
                />
              </TableCell>
            </motion.tr>
          )
        })}
      </TableBody>
    </Table>
  )
}

function ChecklistCard({
  checklist,
  role,
  recentlyDone,
  onToggledDone,
}: {
  checklist: Checklist
  role: Role
  recentlyDone: Set<string>
  onToggledDone: (itemId: string) => void
}) {
  const stats = computeStats(checklist.items)
  const stroke = KEKERAPAN_STROKE[checklist.kekerapan]
  const created = new Date(checklist.createdAt).toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <KekerapanBadge kekerapan={checklist.kekerapan} />
              <Badge
                variant="outline"
                className="bg-muted/50 text-foreground border-border/60 gap-1"
              >
                <ClipboardCheck className="size-3" />
                {checklist.unit || 'Tanpa Unit'}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-foreground leading-snug">
              {checklist.tajuk}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3" />
                Dicipta {created}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="size-3" />
                {stats.selesai}/{stats.total} selesai
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-start">
            <div className="text-right">
              <div className="text-sm font-bold text-foreground tabular-nums">
                {stats.percent}%
              </div>
              <div className="text-[10px] text-muted-foreground">
                {stats.selesai} / {stats.total} item
              </div>
            </div>
            <ProgressRing
              percent={stats.percent}
              size={56}
              stroke={6}
              tint={stroke}
            />
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border border-border/40 bg-card/30">
          <ChecklistTable
            checklist={checklist}
            role={role}
            recentlyDone={recentlyDone}
            onToggledDone={onToggledDone}
          />
        </div>
      </GlassCard>
    </motion.div>
  )
}

function ComplianceReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const harian = useChecklistList('Harian')
  const mingguan = useChecklistList('Mingguan')
  const bulanan = useChecklistList('Bulanan')

  const rows = React.useMemo(() => {
    const combine: Array<{
      checklist: Checklist
      stats: ReturnType<typeof computeStats>
    }> = []
    for (const list of [harian.data, mingguan.data, bulanan.data]) {
      if (list) {
        for (const c of list) {
          combine.push({ checklist: c, stats: computeStats(c.items) })
        }
      }
    }
    return combine.sort((a, b) =>
      a.checklist.tajuk.localeCompare(b.checklist.tajuk)
    )
  }, [harian.data, mingguan.data, bulanan.data])

  const overall = React.useMemo(() => {
    const allItems = rows.flatMap((r) => r.checklist.items)
    return computeStats(allItems)
  }, [rows])

  const loading =
    harian.isLoading || mingguan.isLoading || bulanan.isLoading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileBarChart className="size-5 text-primary" />
            Laporan Pematuhan Checklist
          </DialogTitle>
          <DialogDescription>
            Ringkasan kemajuan semua checklist dengan pengekodan warna mengikut
            tahap pematuhan.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-subtle rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Jumlah Checklist</div>
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {rows.length}
            </div>
          </div>
          <div className="glass-subtle rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Jumlah Item</div>
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {overall.total}
            </div>
          </div>
          <div className="glass-subtle rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Item Selesai</div>
            <div className="text-2xl font-bold text-emerald-600 tabular-nums">
              {overall.selesai}
            </div>
          </div>
          <div className="glass-subtle rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Pematuhan</div>
            <div className="text-2xl font-bold text-gradient tabular-nums">
              {overall.percent}%
            </div>
          </div>
        </div>

        <div className="overflow-auto rounded-xl border border-border/50 flex-1 min-h-0">
          {loading ? (
            <div className="p-6">
              <PageLoader label="Memuatkan laporan..." />
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-background/95 backdrop-blur z-10">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Checklist</TableHead>
                  <TableHead className="w-28">Kekerapan</TableHead>
                  <TableHead className="w-20 text-center">Item</TableHead>
                  <TableHead className="w-20 text-center">Selesai</TableHead>
                  <TableHead className="w-36">Pematuhan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-8"
                    >
                      Tiada data checklist
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row, i) => {
                    const pct = row.stats.percent
                    const tier = tierClass(pct)
                    return (
                      <TableRow
                        key={row.checklist.id}
                        className="border-border/40"
                      >
                        <TableCell className="text-muted-foreground tabular-nums">
                          {i + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground line-clamp-1">
                            {row.checklist.tajuk}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {row.checklist.unit || 'Tanpa Unit'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <KekerapanBadge kekerapan={row.checklist.kekerapan} />
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                          {row.stats.total}
                        </TableCell>
                        <TableCell className="text-center tabular-nums font-semibold">
                          {row.stats.selesai}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={pct}
                              className={cn('h-2', tier.bar)}
                            />
                            <span
                              className={cn(
                                'text-xs font-bold tabular-nums w-10 text-right',
                                tier.text
                              )}
                            >
                              {pct}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500" /> Pematuhan
            tinggi (≥85%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-500" /> Sederhana
            (50–84%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500" /> Rendah
            (&lt;50%)
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ChecklistModule() {
  const role = useAppStore((s) => s.role)
  const [kekerapan, setKekerapan] = React.useState<Kekerapan>('Harian')
  const { data, isLoading, isError } = useChecklistList(kekerapan)
  const [reportOpen, setReportOpen] = React.useState(false)
  const [recentlyDone, setRecentlyDone] = React.useState<Set<string>>(
    () => new Set()
  )

  const handleToggledDone = React.useCallback((itemId: string) => {
    setRecentlyDone((prev) => {
      const next = new Set(prev)
      next.add(itemId)
      return next
    })
    window.setTimeout(() => {
      setRecentlyDone((prev) => {
        if (!prev.has(itemId)) return prev
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }, 1300)
  }, [])

  const canViewReport = role === 'Penyelia' || role === 'Admin'

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Checklist Tugasan"
        description="Tanda status penyelesaian tugasan rutin mengikut kekerapan bagi memastikan akauntabiliti."
        icon={<CheckSquare className="size-5" />}
        action={
          canViewReport ? (
            <Button
              onClick={() => setReportOpen(true)}
              variant="outline"
              className="glass-subtle border-0 rounded-full"
            >
              <FileBarChart className="size-4 mr-1.5" />
              Laporan Pematuhan
            </Button>
          ) : null
        }
      />

      {role === 'Awam' && (
        <GlassCard className="p-4 border-amber-500/30 bg-amber-500/[0.06]">
          <div className="flex items-start gap-3">
            <ShieldAlert className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-foreground">
                Akses Awam (Hanya Baca)
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Anda boleh melihat status checklist tetapi tidak boleh menanda
                item. Log masuk sebagai Pengguna, Penyelia atau Admin untuk
                mengemas kini.
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      <Tabs
        value={kekerapan}
        onValueChange={(v) => setKekerapan(v as Kekerapan)}
      >
        <TabsList className="bg-muted/60 p-1 h-auto">
          {KEKERAPAN_LIST.map((k) => {
            const Icon = KEKERAPAN_ICON[k]
            return (
              <TabsTrigger
                key={k}
                value={k}
                className="gap-1.5 px-4 py-1.5 rounded-md"
              >
                <Icon className="size-3.5" />
                {k}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {KEKERAPAN_LIST.map((k) => (
          <TabsContent key={k} value={k} className="space-y-4 mt-4">
            {k === kekerapan &&
              (isLoading ? (
                <GlassCard className="p-8">
                  <PageLoader label="Memuatkan checklist..." />
                </GlassCard>
              ) : isError ? (
                <GlassCard className="p-8">
                  <EmptyState
                    icon={<Info className="size-6" />}
                    title="Gagal memuatkan data"
                    description="Sila cuba lagi sebentar lagi."
                  />
                </GlassCard>
              ) : !data || data.length === 0 ? (
                <GlassCard className="p-8">
                  <EmptyState
                    icon={<CheckSquare className="size-6" />}
                    title={`Tiada checklist ${k.toLowerCase()}`}
                    description={`Belum ada checklist ${k.toLowerCase()} didaftarkan dalam sistem.`}
                  />
                </GlassCard>
              ) : (
                <>
                  <ComplianceSummaryCard checklists={data} />
                  <AnimatePresence mode="popLayout">
                    {data.map((c) => (
                      <ChecklistCard
                        key={c.id}
                        checklist={c}
                        role={role}
                        recentlyDone={recentlyDone}
                        onToggledDone={handleToggledDone}
                      />
                    ))}
                  </AnimatePresence>
                </>
              ))}
          </TabsContent>
        ))}
      </Tabs>

      {canViewReport && (
        <ComplianceReportDialog open={reportOpen} onOpenChange={setReportOpen} />
      )}
    </div>
  )
}
