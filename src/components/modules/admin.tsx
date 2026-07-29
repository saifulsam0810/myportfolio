'use client'

import * as React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import {
  Settings,
  Plus,
  Pencil,
  Trash2,
  FileText,
  BookOpen,
  Briefcase,
  ClipboardList,
  Workflow,
  CheckSquare,
  ShieldAlert,
  Database,
  RefreshCw,
} from 'lucide-react'
import { GlassCard, SectionHeader, PageLoader, EmptyState, StatusBadge } from '@/components/glass'
import { useBorangList, useRujukanList, useJawatanList, useProsedurList, useCartaAlirList, useChecklistList } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import type { Borang, Rujukan } from '@/lib/types'

// ===== Borang CRUD =====
const KATEGORI_BORANG = ['Sumber Manusia', 'Kewangan', 'Pentadbiran', 'Pengurusan Aset', 'Perkhidmatan Pelanggan', 'ICT']
const FORMAT_BORANG = ['PDF', 'Word', 'Excel', 'Fillable']
const KEEKERAPAN_BORANG = ['Kerap', 'Bulanan', 'Mingguan', 'Situasional']

function BorangFormDialog({
  borang,
  children,
}: {
  borang?: Borang
  children: React.ReactNode
}) {
  const qc = useQueryClient()
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    kodBorang: borang?.kodBorang ?? '',
    nama: borang?.nama ?? '',
    kategori: borang?.kategori ?? 'Pentadbiran',
    format: borang?.format ?? 'PDF',
    kekerapan: borang?.kekerapan ?? 'Situasional',
    penerangan: borang?.penerangan ?? '',
    failUrl: borang?.failUrl ?? '#',
    saizFail: borang?.saizFail ?? '',
    versi: borang?.versi ?? '1.0',
    status: borang?.status ?? 'Aktif',
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const url = borang ? `/api/borang/${borang.id}` : '/api/borang'
      const method = borang ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, saizFail: form.saizFail || null }),
      })
      if (!res.ok) throw new Error('Gagal simpan')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['borang'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(borang ? 'Borang dikemas kini' : 'Borang baharu dicipta')
      setOpen(false)
    },
    onError: () => toast.error('Gagal menyimpan borang'),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="glass-strong border-0 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{borang ? 'Edit Borang' : 'Tambah Borang Baharu'}</DialogTitle>
          <DialogDescription>
            Isi maklumat borang/dokumen sokongan. Medan bertanda * adalah wajib.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="kodBorang">Kod Borang *</Label>
            <Input id="kodBorang" value={form.kodBorang} onChange={(e) => setForm({ ...form, kodBorang: e.target.value })} placeholder="B001" disabled={!!borang} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nama">Nama Borang *</Label>
            <Input id="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Borang Permohonan..." />
          </div>
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Select value={form.kategori} onValueChange={(v) => setForm({ ...form, kategori: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{KATEGORI_BORANG.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Format</Label>
            <Select value={form.format} onValueChange={(v) => setForm({ ...form, format: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{FORMAT_BORANG.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Kekerapan</Label>
            <Select value={form.kekerapan} onValueChange={(v) => setForm({ ...form, kekerapan: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{KEEKERAPAN_BORANG.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Versi</Label>
            <Input value={form.versi} onChange={(e) => setForm({ ...form, versi: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Saiz Fail</Label>
            <Input value={form.saizFail} onChange={(e) => setForm({ ...form, saizFail: e.target.value })} placeholder="120 KB" />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Diarkib">Diarkib</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="penerangan">Penerangan</Label>
            <Textarea id="penerangan" value={form.penerangan} onChange={(e) => setForm({ ...form, penerangan: e.target.value })} rows={3} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="failUrl">URL Fail</Label>
            <Input id="failUrl" value={form.failUrl} onChange={(e) => setForm({ ...form, failUrl: e.target.value })} placeholder="/forms/..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !form.kodBorang || !form.nama}
          >
            {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteConfirmDialog({
  onConfirm,
  title,
  description,
  children,
}: {
  onConfirm: () => void
  title: string
  description: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="glass-strong border-0">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Padam
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function BorangTable() {
  const { data, isLoading } = useBorangList()
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/borang/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal padam')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['borang'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Borang dipadam')
    },
    onError: () => toast.error('Gagal memadam borang'),
  })

  if (isLoading) return <PageLoader label="Memuatkan borang..." />
  if (!data || data.length === 0)
    return <EmptyState icon={<FileText className="size-6" />} title="Tiada borang" description="Tambah borang baharu untuk mula." />

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <ScrollArea className="max-h-[60vh]">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 sticky top-0">
            <tr>
              <th className="text-left p-3 font-semibold">Kod</th>
              <th className="text-left p-3 font-semibold">Nama</th>
              <th className="text-left p-3 font-semibold hidden sm:table-cell">Kategori</th>
              <th className="text-left p-3 font-semibold hidden md:table-cell">Format</th>
              <th className="text-left p-3 font-semibold hidden lg:table-cell">Versi</th>
              <th className="text-left p-3 font-semibold">Status</th>
              <th className="text-right p-3 font-semibold">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((b) => (
              <tr key={b.id} className="border-t border-border/40 hover:bg-muted/30 transition-colors">
                <td className="p-3"><span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{b.kodBorang}</span></td>
                <td className="p-3 font-medium">{b.nama}</td>
                <td className="p-3 hidden sm:table-cell text-muted-foreground">{b.kategori}</td>
                <td className="p-3 hidden md:table-cell"><Badge variant="outline">{b.format}</Badge></td>
                <td className="p-3 hidden lg:table-cell text-muted-foreground">{b.versi}</td>
                <td className="p-3"><StatusBadge status={b.status} /></td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1">
                    <BorangFormDialog borang={b}>
                      <Button variant="ghost" size="icon" className="size-8" aria-label="Edit">
                        <Pencil className="size-3.5" />
                      </Button>
                    </BorangFormDialog>
                    <DeleteConfirmDialog
                      onConfirm={() => deleteMutation.mutate(b.id)}
                      title="Padam Borang?"
                      description={`Borang "${b.nama}" akan dipadam secara kekal. Tindakan ini tidak boleh diundur.`}
                    >
                      <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label="Padam">
                        <Trash2 className="size-3.5" />
                      </Button>
                    </DeleteConfirmDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  )
}

// ===== Rujukan CRUD =====
const KATEGORI_RUJUKAN = ['Peraturan Am', 'Pekeliling Perkhidmatan', 'PKPA', 'Arahan Perbendaharaan', 'SOP Dalaman', 'Piagam Pelanggan']
const STATUS_RUJUKAN = ['Aktif', 'Digantikan', 'Dimansuhkan']

function RujukanFormDialog({
  rujukan,
  children,
}: {
  rujukan?: Rujukan
  children: React.ReactNode
}) {
  const qc = useQueryClient()
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    kodRujukan: rujukan?.kodRujukan ?? '',
    tajuk: rujukan?.tajuk ?? '',
    kategori: rujukan?.kategori ?? 'Peraturan Am',
    penerangan: rujukan?.penerangan ?? '',
    pautanLuaran: rujukan?.pautanLuaran ?? '',
    status: rujukan?.status ?? 'Aktif',
    versi: rujukan?.versi ?? '',
    tarikhKuatKuasa: rujukan?.tarikhKuatKuasa ? new Date(rujukan.tarikhKuatKuasa).toISOString().split('T')[0] : '',
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const url = rujukan ? `/api/rujukan/${rujukan.id}` : '/api/rujukan'
      const method = rujukan ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          pautanLuaran: form.pautanLuaran || null,
          versi: form.versi || null,
          tarikhKuatKuasa: form.tarikhKuatKuasa || null,
        }),
      })
      if (!res.ok) throw new Error('Gagal simpan')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rujukan'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(rujukan ? 'Rujukan dikemas kini' : 'Rujukan baharu dicipta')
      setOpen(false)
    },
    onError: () => toast.error('Gagal menyimpan rujukan'),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="glass-strong border-0 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rujukan ? 'Edit Rujukan' : 'Tambah Rujukan Baharu'}</DialogTitle>
          <DialogDescription>
            Isi maklumat rujukan peraturan/pekeliling/SOP. Medan bertanda * adalah wajib.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="kodRujukan">Kod Rujukan *</Label>
            <Input id="kodRujukan" value={form.kodRujukan} onChange={(e) => setForm({ ...form, kodRujukan: e.target.value })} placeholder="R001" disabled={!!rujukan} />
          </div>
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Select value={form.kategori} onValueChange={(v) => setForm({ ...form, kategori: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{KATEGORI_RUJUKAN.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="tajuk">Tajuk *</Label>
            <Input id="tajuk" value={form.tajuk} onChange={(e) => setForm({ ...form, tajuk: e.target.value })} placeholder="Peraturan-Peraturan..." />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="penerangan">Penerangan</Label>
            <Textarea id="penerangan" value={form.penerangan} onChange={(e) => setForm({ ...form, penerangan: e.target.value })} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUS_RUJUKAN.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="versi">Versi</Label>
            <Input id="versi" value={form.versi} onChange={(e) => setForm({ ...form, versi: e.target.value })} placeholder="2024" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tarikh">Tarikh Kuat Kuasa</Label>
            <Input id="tarikh" type="date" value={form.tarikhKuatKuasa} onChange={(e) => setForm({ ...form, tarikhKuatKuasa: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="pautan">Pautan Luaran (Portal Rasmi)</Label>
            <Input id="pautan" value={form.pautanLuaran} onChange={(e) => setForm({ ...form, pautanLuaran: e.target.value })} placeholder="https://..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !form.kodRujukan || !form.tajuk}
          >
            {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RujukanTable() {
  const { data, isLoading } = useRujukanList()
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/rujukan/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal padam')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rujukan'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Rujukan dipadam')
    },
    onError: () => toast.error('Gagal memadam rujukan'),
  })

  if (isLoading) return <PageLoader label="Memuatkan rujukan..." />
  if (!data || data.length === 0)
    return <EmptyState icon={<BookOpen className="size-6" />} title="Tiada rujukan" description="Tambah rujukan baharu untuk mula." />

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <ScrollArea className="max-h-[60vh]">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 sticky top-0">
            <tr>
              <th className="text-left p-3 font-semibold">Kod</th>
              <th className="text-left p-3 font-semibold">Tajuk</th>
              <th className="text-left p-3 font-semibold hidden sm:table-cell">Kategori</th>
              <th className="text-left p-3 font-semibold hidden lg:table-cell">Versi</th>
              <th className="text-left p-3 font-semibold">Status</th>
              <th className="text-right p-3 font-semibold">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id} className="border-t border-border/40 hover:bg-muted/30 transition-colors">
                <td className="p-3"><span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{r.kodRujukan}</span></td>
                <td className="p-3 font-medium max-w-xs truncate">{r.tajuk}</td>
                <td className="p-3 hidden sm:table-cell text-muted-foreground">{r.kategori}</td>
                <td className="p-3 hidden lg:table-cell text-muted-foreground">{r.versi ?? '-'}</td>
                <td className="p-3"><StatusBadge status={r.status} /></td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1">
                    <RujukanFormDialog rujukan={r}>
                      <Button variant="ghost" size="icon" className="size-8" aria-label="Edit">
                        <Pencil className="size-3.5" />
                      </Button>
                    </RujukanFormDialog>
                    <DeleteConfirmDialog
                      onConfirm={() => deleteMutation.mutate(r.id)}
                      title="Padam Rujukan?"
                      description={`Rujukan "${r.tajuk}" akan dipadam. Tindakan ini tidak boleh diundur.`}
                    >
                      <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label="Padam">
                        <Trash2 className="size-3.5" />
                      </Button>
                    </DeleteConfirmDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  )
}

// ===== Read-only overview of other entities =====
function EntityOverview() {
  const { data: jawatan } = useJawatanList()
  const { data: prosedur } = useProsedurList()
  const { data: carta } = useCartaAlirList()
  const { data: checklist } = useChecklistList()

  const items = [
    { label: 'Jawatan', icon: Briefcase, count: jawatan?.length ?? 0, tint: 'bg-teal-500/15 text-teal-700' },
    { label: 'Carta Alir', icon: Workflow, count: carta?.length ?? 0, tint: 'bg-amber-500/15 text-amber-700' },
    { label: 'Prosedur Kerja', icon: ClipboardList, count: prosedur?.length ?? 0, tint: 'bg-emerald-500/15 text-emerald-700' },
    { label: 'Checklist', icon: CheckSquare, count: checklist?.length ?? 0, tint: 'bg-orange-500/15 text-orange-700' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((it) => (
        <GlassCard key={it.label} className="p-4 flex items-center gap-3">
          <div className={`size-10 rounded-lg flex items-center justify-center ${it.tint}`}>
            <it.icon className="size-5" />
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{it.count}</div>
            <div className="text-xs text-muted-foreground">{it.label}</div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

export function AdminModule() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Panel Pentadbir"
        description="Pengurusan kandungan sistem — tambah, kemas kini dan padam borang serta rujukan peraturan."
        icon={<Settings className="size-5" />}
        action={
          <Badge variant="outline" className="bg-rose-500/10 text-rose-700 border-rose-500/30">
            <ShieldAlert className="size-3 mr-1" /> Akses Admin
          </Badge>
        }
      />

      <GlassCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
            <Database className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold">Status Pangkalan Data</h3>
            <p className="text-xs text-muted-foreground">Pangkalan data dummy (SQLite) — Fasa PoC</p>
          </div>
        </div>
        <EntityOverview />
      </GlassCard>

      <Tabs defaultValue="borang">
        <TabsList className="glass-subtle border-0 p-1">
          <TabsTrigger value="borang" className="gap-1.5">
            <FileText className="size-4" /> Borang
          </TabsTrigger>
          <TabsTrigger value="rujukan" className="gap-1.5">
            <BookOpen className="size-4" /> Rujukan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="borang" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Repositori Borang</h3>
              <p className="text-xs text-muted-foreground">Urus semua borang dan dokumen sokongan</p>
            </div>
            <BorangFormDialog>
              <Button>
                <Plus className="size-4 mr-1.5" /> Tambah Borang
              </Button>
            </BorangFormDialog>
          </div>
          <BorangTable />
        </TabsContent>

        <TabsContent value="rujukan" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Rujukan Peraturan</h3>
              <p className="text-xs text-muted-foreground">Urus semua rujukan peraturan, pekeliling dan SOP</p>
            </div>
            <RujukanFormDialog>
              <Button>
                <Plus className="size-4 mr-1.5" /> Tambah Rujukan
              </Button>
            </RujukanFormDialog>
          </div>
          <RujukanTable />
        </TabsContent>
      </Tabs>

      <GlassCard className="p-4">
        <div className="flex items-start gap-3 text-xs text-muted-foreground">
          <RefreshCw className="size-4 text-primary shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-foreground">Nota:</span> Panel ini membenarkan CRUD
            ke atas modul Borang dan Rujukan bagi demonstrasi. Modul lain (Jawatan, Carta Alir,
            Prosedur, Checklist) menyokong CRUD penuh melalui API dan boleh dikembangkan pada fasa
            seterusnya. Semua perubahan disimpan dalam pangkalan data dummy SQLite.
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
