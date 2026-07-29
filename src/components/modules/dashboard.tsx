'use client'

import * as React from 'react'
import {
  Briefcase,
  Workflow,
  ClipboardList,
  CheckSquare,
  FileText,
  BookOpen,
  TrendingUp,
  Clock,
  ArrowUpRight,
  CircleCheck,
  CircleAlert,
  Activity,
  QrCode as QrCodeIcon,
} from 'lucide-react'
import { useDashboard } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { GlassCard, PageLoader } from '@/components/glass'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts'
import type { ModuleKey } from '@/lib/types'

const KPI_COLORS = ['#0d9488', '#f59e0b', '#10b981', '#f97316', '#8b5cf6', '#ec4899']

function StatCard({
  label,
  value,
  icon: Icon,
  tint,
  moduleKey,
}: {
  label: string
  value: number
  icon: React.ElementType
  tint: string
  moduleKey: ModuleKey
}) {
  const setActiveModule = useAppStore((s) => s.setActiveModule)
  return (
    <button
      onClick={() => setActiveModule(moduleKey)}
      className="group text-left"
      aria-label={`Buka ${label}`}
    >
      <GlassCard className="p-4 sm:p-5 h-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-start justify-between gap-2">
          <div className={`size-11 rounded-xl flex items-center justify-center ${tint}`}>
            <Icon className="size-5" />
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
        </div>
        <div className="mt-3">
          <div className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {value}
          </div>
          <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
        </div>
      </GlassCard>
    </button>
  )
}

export function DashboardModule() {
  const { data, isLoading } = useDashboard()
  const setActiveModule = useAppStore((s) => s.setActiveModule)

  if (isLoading || !data) {
    return (
      <GlassCard className="p-8">
        <PageLoader label="Memuatkan papan pemuka..." />
      </GlassCard>
    )
  }

  const compliance = data.compliance
  const checklistChartData = data.checklistProgress.slice(0, 6).map((c) => ({
    name: c.tajuk.length > 18 ? c.tajuk.slice(0, 18) + '…' : c.tajuk,
    selesai: c.selesai,
    belum: c.total - c.selesai,
  }))

  const prosedurPie = data.prosedurByStatus.map((s) => ({
    name: s.status,
    value: s.count,
  }))

  return (
    <div className="space-y-6">
      {/* Hero */}
      <GlassCard strong className="p-6 sm:p-8 overflow-hidden relative">
        <div className="absolute -right-12 -top-12 size-48 rounded-full bg-gradient-to-br from-primary/30 to-amber-400/20 blur-2xl" />
        <div className="relative">
          <Badge className="bg-primary/15 text-primary border-primary/30 mb-3">
            <Activity className="size-3 mr-1" /> Sistem Aktif
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Selamat Datang ke <span className="text-gradient">MyPortfolio</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Platform digital berpusat untuk pengurusan skop tugas, prosedur kerja, checklist,
            borang dan rujukan peraturan jawatan organisasi.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Button onClick={() => setActiveModule('jawatan')} className="rounded-full">
              <Briefcase className="size-4 mr-1.5" /> Terokai Jawatan
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveModule('checklist')}
              className="rounded-full glass-subtle border-0"
            >
              <CheckSquare className="size-4 mr-1.5" /> Lihat Checklist
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Jawatan" value={data.counts.jawatan} icon={Briefcase} tint="bg-teal-500/15 text-teal-700" moduleKey="jawatan" />
        <StatCard label="Carta Alir" value={data.counts.cartaAlir} icon={Workflow} tint="bg-amber-500/15 text-amber-700" moduleKey="carta-alir" />
        <StatCard label="Prosedur" value={data.counts.prosedur} icon={ClipboardList} tint="bg-emerald-500/15 text-emerald-700" moduleKey="prosedur" />
        <StatCard label="Checklist" value={data.counts.checklist} icon={CheckSquare} tint="bg-orange-500/15 text-orange-700" moduleKey="checklist" />
        <StatCard label="Borang" value={data.counts.borang} icon={FileText} tint="bg-violet-500/15 text-violet-700" moduleKey="borang" />
        <StatCard label="Rujukan" value={data.counts.rujukan} icon={BookOpen} tint="bg-pink-500/15 text-pink-700" moduleKey="rujukan" />
      </div>

      {/* Compliance + charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <TrendingUp className="size-4.5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground leading-tight">Pematuhan Checklist</h3>
                <p className="text-xs text-muted-foreground">Keseluruhan sistem</p>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-4xl font-bold text-gradient tabular-nums">{compliance.percent}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                {compliance.selesaiItems}/{compliance.totalItems} item selesai
              </div>
            </div>
            <Badge variant="outline" className={compliance.percent >= 85 ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' : 'bg-amber-500/10 text-amber-700 border-amber-500/30'}>
              Sasaran 85%
            </Badge>
          </div>
          <Progress value={compliance.percent} className="h-2.5 mt-3" />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="glass-subtle rounded-lg p-2">
              <div className="text-lg font-bold text-foreground tabular-nums">{compliance.totalItems}</div>
              <div className="text-[10px] text-muted-foreground">Jumlah</div>
            </div>
            <div className="glass-subtle rounded-lg p-2">
              <div className="text-lg font-bold text-emerald-600 tabular-nums">{compliance.selesaiItems}</div>
              <div className="text-[10px] text-muted-foreground">Selesai</div>
            </div>
            <div className="glass-subtle rounded-lg p-2">
              <div className="text-lg font-bold text-amber-600 tabular-nums">{compliance.totalItems - compliance.selesaiItems}</div>
              <div className="text-[10px] text-muted-foreground">Belum</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">Status Checklist Terkini</h3>
              <p className="text-xs text-muted-foreground">6 checklist teratas mengikut kemajuan</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary"
              onClick={() => setActiveModule('checklist')}
            >
              Lihat semua <ArrowUpRight className="size-3.5 ml-1" />
            </Button>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={checklistChartData} margin={{ top: 6, right: 6, left: -18, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,148,136,0.12)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: 'currentColor' }}
                  className="text-muted-foreground"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} className="text-muted-foreground" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(13,148,136,0.2)',
                    borderRadius: 12,
                    fontSize: 12,
                    backdropFilter: 'blur(8px)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="selesai" name="Selesai" stackId="a" fill="#0d9488" radius={[0, 0, 0, 0]} />
                <Bar dataKey="belum" name="Belum Selesai" stackId="a" fill="#fcd34d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Prosedur status + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <h3 className="font-semibold text-foreground mb-1">Status Prosedur Kerja</h3>
          <p className="text-xs text-muted-foreground mb-3">Mengikut status semasa</p>
          {prosedurPie.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Tiada data</p>
          ) : (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prosedurPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {prosedurPie.map((_, i) => (
                      <Cell key={i} fill={KPI_COLORS[i % KPI_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(13,148,136,0.2)',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">Aktiviti Checklist Terkini</h3>
              <p className="text-xs text-muted-foreground">20 log tandaan terbaru</p>
            </div>
            <Clock className="size-4 text-muted-foreground" />
          </div>
          <ScrollArea className="h-[260px] pr-3">
            {data.recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">Tiada aktiviti terkini</p>
            ) : (
              <ul className="space-y-2">
                {data.recentLogs.map((log) => (
                  <li
                    key={log.id}
                    className="flex items-center gap-3 rounded-xl bg-card/40 border border-border/40 p-2.5 hover:bg-card/70 transition-colors"
                  >
                    <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${log.status === 'Selesai' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'}`}>
                      {log.status === 'Selesai' ? <CircleCheck className="size-4" /> : <CircleAlert className="size-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {log.pengguna}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        Item {log.itemId} • {log.status}
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(log.tarikh).toLocaleString('ms-MY', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </GlassCard>
      </div>

      {/* Quick links */}
      <GlassCard className="p-5">
        <h3 className="font-semibold text-foreground mb-3">Akses Pantas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Cari Jawatan', icon: Briefcase, m: 'jawatan' as ModuleKey, tint: 'from-blue-600/20 to-blue-800/10 text-blue-800' },
            { label: 'Proses Kerja', icon: Workflow, m: 'carta-alir' as ModuleKey, tint: 'from-amber-500/20 to-amber-600/10 text-amber-700' },
            { label: 'Muat Turun Borang', icon: FileText, m: 'borang' as ModuleKey, tint: 'from-violet-500/20 to-violet-600/10 text-violet-700' },
            { label: 'Jana Kod QR', icon: QrCodeIcon, m: 'qr' as ModuleKey, tint: 'from-pink-500/20 to-pink-600/10 text-pink-700' },
          ].map((q) => (
            <button
              key={q.label}
              onClick={() => setActiveModule(q.m)}
              className={`bg-gradient-to-br ${q.tint} rounded-xl p-4 text-left hover:scale-[1.02] transition-transform`}
            >
              <q.icon className="size-5 mb-2" />
              <div className="text-sm font-semibold">{q.label}</div>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
