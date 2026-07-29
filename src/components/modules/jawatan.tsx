'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  ArrowLeft,
  ArrowRight,
  User,
  Globe,
  ShieldCheck,
  Target,
  TrendingUp,
  ChevronRight,
  Building2,
  Layers,
  CheckCircle2,
  QrCode as QrCodeIcon,
  Users,
  Scale,
  ClipboardList,
} from 'lucide-react'
import { useJawatanList, useJawatan } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import {
  GlassCard,
  SectionHeader,
  PageLoader,
  EmptyState,
} from '@/components/glass'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import type { Jawatan as JawatanType } from '@/lib/types'

// Deterministic gradient avatar tint per jawatan (no indigo/blue)
const AVATAR_TINTS = [
  'from-teal-500/30 to-emerald-500/20 text-teal-700',
  'from-amber-500/30 to-orange-500/20 text-amber-700',
  'from-emerald-500/30 to-teal-500/20 text-emerald-700',
  'from-rose-500/25 to-amber-500/15 text-rose-700',
  'from-orange-500/30 to-amber-500/20 text-orange-700',
  'from-teal-600/25 to-emerald-500/15 text-teal-700',
]

function getAvatarTint(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_TINTS[h % AVATAR_TINTS.length]
}

function OrgHierarchy({
  jawatan,
  className,
}: {
  jawatan: JawatanType
  className?: string
}) {
  return (
    <div className={`flex items-center gap-1.5 text-sm flex-wrap ${className ?? ''}`}>
      <Building2 className="size-4 shrink-0 text-primary/70" />
      <span className="font-medium text-foreground">{jawatan.jabatan}</span>
      <ChevronRight className="size-3.5 shrink-0 opacity-50" />
      <span className="text-muted-foreground">{jawatan.bahagian}</span>
      <ChevronRight className="size-3.5 shrink-0 opacity-50" />
      <span className="text-muted-foreground">{jawatan.unit}</span>
    </div>
  )
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="size-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

// ===================== LIST VIEW =====================
function JawatanList() {
  const searchQuery = useAppStore((s) => s.searchQuery)
  const setSelectedJawatanId = useAppStore((s) => s.setSelectedJawatanId)
  const { data, isLoading } = useJawatanList(searchQuery)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Skop Tugas & Tanggungjawab Jawatan"
        description="Profil portfolio digital setiap jawatan mengikut struktur organisasi"
        icon={<Briefcase className="size-5" />}
        action={
          data ? (
            <Badge variant="outline" className="glass-subtle border-0 px-3 py-1.5">
              {data.length} jawatan
            </Badge>
          ) : null
        }
      />

      {isLoading || !data ? (
        <GlassCard className="p-8">
          <PageLoader label="Memuatkan senarai jawatan..." />
        </GlassCard>
      ) : data.length === 0 ? (
        <GlassCard className="p-8">
          <EmptyState
            icon={<Briefcase className="size-6" />}
            title="Tiada jawatan dijumpai"
            description={
              searchQuery
                ? `Tiada hasil carian untuk "${searchQuery}". Cuba kata kunci lain.`
                : 'Belum ada jawatan didaftarkan dalam sistem.'
            }
          />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((j, idx) => {
            const tint = getAvatarTint(j.kodJawatan)
            return (
              <motion.div
                key={j.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
              >
                <GlassCard className="p-5 h-full flex flex-col hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
                  {/* Top row: kod + avatar */}
                  <div className="flex items-start justify-between gap-2">
                    <Badge className="bg-primary/15 text-primary border-primary/30">
                      {j.kodJawatan}
                    </Badge>
                    <div
                      className={`size-10 rounded-xl bg-gradient-to-br ${tint} flex items-center justify-center`}
                    >
                      <Briefcase className="size-5" />
                    </div>
                  </div>

                  {/* Nama + gred */}
                  <h3 className="mt-3 text-lg font-bold text-foreground leading-tight line-clamp-2">
                    {j.namaJawatan}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-700 border-amber-500/30"
                    >
                      Gred {j.gred}
                    </Badge>
                  </div>

                  {/* Hierarchy */}
                  <OrgHierarchy
                    jawatan={j}
                    className="mt-3 text-xs text-muted-foreground"
                  />

                  {/* Penyelia */}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="size-3.5 shrink-0 text-primary/70" />
                    <span>
                      Penyelia:{' '}
                      <span className="font-medium text-foreground/80">{j.penyelia}</span>
                    </span>
                  </div>

                  {/* Objektif */}
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2 flex-1">
                    {j.objektifAm}
                  </p>

                  {/* Action */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 justify-start text-primary hover:text-primary hover:bg-primary/10 px-1"
                    onClick={() => setSelectedJawatanId(j.id)}
                    aria-label={`Lihat profil ${j.namaJawatan}`}
                  >
                    Lihat Profil
                    <ArrowRight className="size-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ===================== DETAIL VIEW =====================
function JawatanDetail({ jawatan }: { jawatan: JawatanType }) {
  const setSelectedJawatanId = useAppStore((s) => s.setSelectedJawatanId)
  const setActiveModule = useAppStore((s) => s.setActiveModule)
  const tint = getAvatarTint(jawatan.kodJawatan)

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground -ml-2"
        onClick={() => setSelectedJawatanId(null)}
      >
        <ArrowLeft className="size-4" /> Kembali
      </Button>

      {/* Header card */}
      <GlassCard strong className="p-6 sm:p-7 overflow-hidden relative">
        <div className="absolute -right-16 -top-16 size-52 rounded-full bg-gradient-to-br from-primary/25 to-amber-400/15 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className={`size-16 rounded-2xl bg-gradient-to-br ${tint} flex items-center justify-center shrink-0 shadow-lg`}
            >
              <Briefcase className="size-8" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <Badge className="bg-primary/15 text-primary border-primary/30">
                  {jawatan.kodJawatan}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-700 border-amber-500/30"
                >
                  Gred {jawatan.gred}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {jawatan.namaJawatan}
              </h1>
              <div className="mt-3">
                <OrgHierarchy jawatan={jawatan} />
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="size-4 shrink-0 text-primary/70" />
                <span>
                  Penyelia:{' '}
                  <span className="font-medium text-foreground">{jawatan.penyelia}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Button
              variant="outline"
              className="glass-subtle border-0 rounded-full"
              onClick={() => setActiveModule('qr')}
            >
              <QrCodeIcon className="size-4" /> Lihat Kod QR
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Objektif Am (highlighted, outside tabs) */}
      <GlassCard className="p-5 sm:p-6 border-l-4 border-l-primary">
        <div className="flex items-start gap-4">
          <div className="size-11 rounded-xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
            <Target className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary/80">
              Objektif Am Jawatan
            </div>
            <div className="text-[11px] text-muted-foreground mb-2">Job Purpose</div>
            <p className="text-foreground leading-relaxed">{jawatan.objektifAm}</p>
          </div>
        </div>
      </GlassCard>

      {/* Tabs for detail sections */}
      <Tabs defaultValue="profil" className="w-full">
        <TabsList className="glass-subtle border-0 h-auto p-1.5 w-full grid grid-cols-2 sm:flex sm:w-auto">
          <TabsTrigger value="profil" className="rounded-md">
            <ClipboardList className="size-4" /> Profil
          </TabsTrigger>
          <TabsTrigger value="skop" className="rounded-md">
            <Layers className="size-4" /> Skop Tugas
          </TabsTrigger>
          <TabsTrigger value="autoriti" className="rounded-md">
            <ShieldCheck className="size-4" /> Autoriti
          </TabsTrigger>
          <TabsTrigger value="kpi" className="rounded-md">
            <TrendingUp className="size-4" /> KPI
          </TabsTrigger>
        </TabsList>

        {/* Profil Tab */}
        <TabsContent value="profil" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Tanggungjawab Khusus */}
            <GlassCard className="p-5">
              <SectionTitle
                icon={ClipboardList}
                title="Tanggungjawab Khusus"
                subtitle="Tanggungjawab utama jawatan"
              />
              {jawatan.tanggungjawab.length === 0 ? (
                <p className="text-sm text-muted-foreground py-3">
                  Tiada data tanggungjawab direkodkan.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {jawatan.tanggungjawab.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/90 leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              )}
            </GlassCard>

            {/* Hubungan Kerja */}
            <GlassCard className="p-5">
              <SectionTitle
                icon={Users}
                title="Hubungan Kerja"
                subtitle="Interaksi dalaman & luaran"
              />
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-7 rounded-lg bg-teal-500/15 text-teal-700 flex items-center justify-center">
                      <Users className="size-4" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Dalaman</span>
                  </div>
                  {jawatan.hubunganKerja.dalaman.length === 0 ? (
                    <p className="text-xs text-muted-foreground pl-9">
                      Tiada hubungan dalaman direkodkan.
                    </p>
                  ) : (
                    <ul className="space-y-1.5 pl-9">
                      {jawatan.hubunganKerja.dalaman.map((d, i) => (
                        <li
                          key={i}
                          className="text-sm text-foreground/90 flex items-start gap-2"
                        >
                          <span className="size-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-7 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center">
                      <Globe className="size-4" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Luaran</span>
                  </div>
                  {jawatan.hubunganKerja.luaran.length === 0 ? (
                    <p className="text-xs text-muted-foreground pl-9">
                      Tiada hubungan luaran direkodkan.
                    </p>
                  ) : (
                    <ul className="space-y-1.5 pl-9">
                      {jawatan.hubunganKerja.luaran.map((l, i) => (
                        <li
                          key={i}
                          className="text-sm text-foreground/90 flex items-start gap-2"
                        >
                          <span className="size-1.5 rounded-full bg-amber-500/70 mt-1.5 shrink-0" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Skop Tugas Tab */}
        <TabsContent value="skop" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="size-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Skop Tugas Utama (KRA)
              </h3>
              <Badge
                variant="outline"
                className="ml-auto bg-primary/10 text-primary border-primary/30"
              >
                {jawatan.skopTugas.length} KRA
              </Badge>
            </div>
            {jawatan.skopTugas.length === 0 ? (
              <GlassCard className="p-6">
                <EmptyState
                  icon={<Layers className="size-6" />}
                  title="Tiada skop tugas"
                  description="Skop tugas utama (KRA) belum didaftarkan untuk jawatan ini."
                />
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {jawatan.skopTugas.map((kra, idx) => (
                  <GlassCard key={idx} className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-primary/20">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">
                          KRA {idx + 1}
                        </div>
                        <h4 className="font-semibold text-foreground leading-tight">
                          {kra.kra}
                        </h4>
                      </div>
                    </div>
                    {kra.tugas.length > 0 && (
                      <ul className="space-y-2 ml-1">
                        {kra.tugas.map((t, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground/90 leading-relaxed">
                              {t}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Autoriti Tab */}
        <TabsContent value="autoriti" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Had Kuasa - prominent */}
            <GlassCard strong className="p-6 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-11 rounded-xl bg-gradient-to-br from-amber-500/90 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Scale className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Had Kuasa
                  </div>
                  <h3 className="font-semibold text-foreground leading-tight">
                    Had & Limit Kuasa
                  </h3>
                </div>
              </div>
              <p className="text-foreground leading-relaxed text-sm">
                {jawatan.autoriti.hadKuasa || 'Tiada had kuasa direkodkan.'}
              </p>
            </GlassCard>

            {/* Melulus */}
            <GlassCard className="p-6 lg:col-span-2">
              <SectionTitle
                icon={ShieldCheck}
                title="Melulus / Kuasa Kelulusan"
                subtitle="Perkara yang boleh diluluskan oleh jawatan ini"
              />
              {jawatan.autoriti.melulus.length === 0 ? (
                <EmptyState
                  icon={<ShieldCheck className="size-5" />}
                  title="Tiada kuasa kelulusan"
                  description="Jawatan ini tiada rekod kuasa melulus."
                />
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {jawatan.autoriti.melulus.map((m, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl bg-card/40 border border-border/40 p-3"
                    >
                      <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/90 leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
              )}
            </GlassCard>
          </div>
        </TabsContent>

        {/* KPI Tab */}
        <TabsContent value="kpi" className="mt-4">
          <GlassCard className="p-5 sm:p-6">
            <SectionTitle
              icon={TrendingUp}
              title="Petunjuk Prestasi Utama (KPI)"
              subtitle="Sasaran prestasi yang perlu dicapai"
            />
            {jawatan.kpi.length === 0 ? (
              <EmptyState
                icon={<TrendingUp className="size-6" />}
                title="Tiada KPI"
                description="Petunjuk prestasi belum ditetapkan untuk jawatan ini."
              />
            ) : (
              <>
                {/* Desktop: table */}
                <div className="hidden sm:block rounded-xl overflow-hidden border border-border/40">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent bg-primary/5">
                        <TableHead className="w-14 text-center text-xs uppercase tracking-wider">
                          #
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wider">
                          Petunjuk Prestasi (KPI)
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wider">
                          Sasaran
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jawatan.kpi.map((k, i) => (
                        <TableRow key={i} className="border-border/40">
                          <TableCell className="text-center">
                            <span className="inline-flex size-6 items-center justify-center rounded-lg bg-primary/15 text-primary text-xs font-bold">
                              {i + 1}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium text-foreground">{k.kpi}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-700 border-amber-500/30"
                            >
                              {k.sasaran}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile: cards */}
                <div className="sm:hidden space-y-3">
                  {jawatan.kpi.map((k, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-card/40 border border-border/40 p-3.5"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <div className="font-medium text-foreground text-sm leading-snug pt-0.5">
                          {k.kpi}
                        </div>
                      </div>
                      <div className="pl-10">
                        <Badge
                          variant="outline"
                          className="bg-amber-500/10 text-amber-700 border-amber-500/30"
                        >
                          Sasaran: {k.sasaran}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ===================== MAIN EXPORT =====================
export function JawatanModule() {
  const selectedJawatanId = useAppStore((s) => s.selectedJawatanId)
  const { data, isLoading } = useJawatan(selectedJawatanId)

  if (selectedJawatanId) {
    if (isLoading || !data) {
      return (
        <GlassCard className="p-8">
          <PageLoader label="Memuatkan profil jawatan..." />
        </GlassCard>
      )
    }
    return <JawatanDetail jawatan={data} />
  }

  return <JawatanList />
}
