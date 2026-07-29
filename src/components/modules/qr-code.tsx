'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Link2,
  Briefcase,
  FileText,
  ExternalLink,
  Check,
  Hash,
  Building2,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { GlassCard, SectionHeader, PageLoader, EmptyState } from '@/components/glass'
import { useJawatanList, useBorangList, useQrCode } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

type Source = 'jawatan' | 'borang' | 'custom'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function QrCodeModule() {
  const [source, setSource] = React.useState<Source>('jawatan')
  const [jawatanId, setJawatanId] = React.useState<string>('')
  const [borangId, setBorangId] = React.useState<string>('')
  const [customUrl, setCustomUrl] = React.useState<string>('')

  const jawatanList = useJawatanList()
  const borangList = useBorangList()

  // Pre-select a jawatan when arriving from a profile's "Lihat Kod QR" button
  const qrPresetKod = useAppStore((s) => s.qrPresetKod)
  const setQrPresetKod = useAppStore((s) => s.setQrPresetKod)
  const presetApplied = React.useRef(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const selectedJawatan = jawatanList.data?.find((j) => j.id === jawatanId)
  const selectedBorang = borangList.data?.find((b) => b.id === borangId)

  // Pre-select jawatan from preset code (when navigated from profile detail)
  React.useEffect(() => {
    if (presetApplied.current) return
    if (qrPresetKod && jawatanList.data && jawatanList.data.length > 0) {
      const found = jawatanList.data.find((j) => j.kodJawatan === qrPresetKod)
      if (found) {
        setSource('jawatan')
        setJawatanId(found.id)
        presetApplied.current = true
        setQrPresetKod(null) // consume
      }
    }
  }, [qrPresetKod, jawatanList.data, setQrPresetKod])

  // Auto-select first item when list loads for the active source (only if no preset)
  React.useEffect(() => {
    if (source === 'jawatan' && !jawatanId && !qrPresetKod && jawatanList.data && jawatanList.data.length > 0) {
      setJawatanId(jawatanList.data[0].id)
    }
  }, [source, jawatanId, jawatanList.data, qrPresetKod])

  React.useEffect(() => {
    if (source === 'borang' && !borangId && borangList.data && borangList.data.length > 0) {
      setBorangId(borangList.data[0].id)
    }
  }, [source, borangId, borangList.data])

  // Derive the text/URL to encode into the QR (deep-link format so scanning opens the profile)
  const selectedText = React.useMemo<string | null>(() => {
    if (source === 'jawatan' && selectedJawatan) {
      return `${origin}/?jawatan=${encodeURIComponent(selectedJawatan.kodJawatan)}`
    }
    if (source === 'borang' && selectedBorang) {
      return `${origin}/?borang=${encodeURIComponent(selectedBorang.kodBorang)}`
    }
    if (source === 'custom' && customUrl.trim()) {
      return customUrl.trim()
    }
    return null
  }, [source, selectedJawatan, selectedBorang, customUrl, origin])

  const qr = useQrCode(selectedText)

  // Title / subtitle / filename code for the preview card
  const previewMeta = React.useMemo(() => {
    if (source === 'jawatan' && selectedJawatan) {
      return {
        title: selectedJawatan.namaJawatan,
        subtitle: selectedJawatan.kodJawatan,
        code: selectedJawatan.kodJawatan,
      }
    }
    if (source === 'borang' && selectedBorang) {
      return {
        title: selectedBorang.nama,
        subtitle: selectedBorang.kodBorang,
        code: selectedBorang.kodBorang,
      }
    }
    return {
      title: 'Pautan Tersuai',
      subtitle: origin || 'URL Tersuai',
      code: 'custom',
    }
  }, [source, selectedJawatan, selectedBorang, origin])

  const handleCopy = async () => {
    if (!selectedText) return
    try {
      await navigator.clipboard.writeText(selectedText)
      toast.success('Pautan disalin ke papan keratan')
    } catch {
      toast.error('Gagal menyalin pautan')
    }
  }

  const handleDownloadPng = () => {
    if (!qr.data?.dataUrl) {
      toast.error('Kod QR belum tersedia untuk dimuat turun')
      return
    }
    const a = document.createElement('a')
    a.href = qr.data.dataUrl
    a.download = `qr-${previewMeta.code || 'custom'}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('Kod QR dimuat turun sebagai PNG')
  }

  const handlePrint = () => {
    if (!qr.data?.dataUrl) {
      toast.error('Kod QR belum tersedia untuk dicetak')
      return
    }
    const w = window.open('', '_blank', 'width=600,height=800')
    if (!w) {
      toast.error('Sila benarkan tetingkap pop-up untuk cetakan')
      return
    }
    const titleHtml = escapeHtml(previewMeta.title)
    const subtitleHtml = escapeHtml(previewMeta.subtitle)
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8" />
      <title>Cetak Kod QR - ${titleHtml}</title>
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 32px; font-family: -apple-system, system-ui, 'Segoe UI', sans-serif;
          display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
        .card { width: 320px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center;
          box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
        .brand { display: inline-flex; align-items: center; gap: 6px; margin-bottom: 12px; }
        .brand .logo { width: 20px; height: 20px; border-radius: 6px; background: #0f766e;
          display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 700; }
        .brand .name { font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #0f766e; text-transform: uppercase; }
        img { width: 240px; height: 240px; display: block; margin: 0 auto; }
        h2 { margin: 16px 0 4px; font-size: 16px; color: #0f766e; line-height: 1.3; }
        .sub { margin: 0; font-size: 12px; color: #475569; font-family: ui-monospace, SFMono-Regular, monospace; word-break: break-all; }
        .foot { margin-top: 16px; padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 10px; color: #94a3b8; }
        @media print { body { padding: 0; } .card { box-shadow: none; border: 1px dashed #cbd5e1; } }
      </style></head>
      <body>
        <div class="card">
          <div class="brand"><span class="logo">M</span><span class="name">MyPortfolio</span></div>
          <img src="${qr.data.dataUrl}" alt="Kod QR" />
          <h2>${titleHtml}</h2>
          <p class="sub">${subtitleHtml}</p>
          <p class="foot">Imbas untuk capaian pantas &bull; MyPortfolio</p>
        </div>
        <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 200); };</script>
      </body></html>`)
    w.document.close()
    w.focus()
    toast.info('Bersedia untuk cetakan')
  }

  // Clicking a jawatan card scrolls to top & selects it in the generator
  const selectJawatanForGeneration = (id: string) => {
    setSource('jawatan')
    setJawatanId(id)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    toast.success('Jawatan dipilih untuk penjanaan QR')
  }

  const qrBusy = !!selectedText && (qr.isLoading || (qr.isFetching && !qr.data))
  const qrReady = !!qr.data?.dataUrl
  const qrError = !!selectedText && qr.isError

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<QrCode className="size-6" />}
        title="Kod QR Portfolio"
        description="Jana dan muat turun Kod QR unik bagi setiap portfolio jawatan untuk capaian pantas di ruang kerja"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* ============ LEFT PANEL — GENERATOR ============ */}
        <GlassCard strong className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <Sparkles className="size-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground leading-tight">Penjana Kod QR</h3>
              <p className="text-xs text-muted-foreground">Pilih sumber pautan untuk dikodkan ke QR</p>
            </div>
          </div>

          {/* Source selector */}
          <Tabs value={source} onValueChange={(v) => setSource(v as Source)}>
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="jawatan" className="gap-1.5 py-1.5">
                <Briefcase className="size-3.5" /> Jawatan
              </TabsTrigger>
              <TabsTrigger value="borang" className="gap-1.5 py-1.5">
                <FileText className="size-3.5" /> Borang
              </TabsTrigger>
              <TabsTrigger value="custom" className="gap-1.5 py-1.5">
                <Link2 className="size-3.5" /> URL Tersuai
              </TabsTrigger>
            </TabsList>

            {/* Jawatan source */}
            <TabsContent value="jawatan" className="mt-4">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Pilih Jawatan
              </label>
              {jawatanList.isLoading ? (
                <div className="h-9 rounded-md bg-muted/40 animate-pulse" />
              ) : jawatanList.isError ? (
                <p className="text-sm text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="size-4" /> Gagal memuatkan senarai jawatan
                </p>
              ) : (
                <Select value={jawatanId} onValueChange={setJawatanId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih jawatan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jawatanList.data?.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        <span className="font-mono text-xs text-primary">{j.kodJawatan}</span>
                        <span className="truncate">{j.namaJawatan}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {selectedJawatan && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/30">
                    Gred {selectedJawatan.gred}
                  </Badge>
                  <Badge variant="outline" className="bg-teal-500/10 text-teal-700 border-teal-500/30">
                    <Building2 className="size-3" /> {selectedJawatan.unit}
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
                    {selectedJawatan.bahagian}
                  </Badge>
                </div>
              )}
            </TabsContent>

            {/* Borang source */}
            <TabsContent value="borang" className="mt-4">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Pilih Borang
              </label>
              {borangList.isLoading ? (
                <div className="h-9 rounded-md bg-muted/40 animate-pulse" />
              ) : borangList.isError ? (
                <p className="text-sm text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="size-4" /> Gagal memuatkan senarai borang
                </p>
              ) : (
                <Select value={borangId} onValueChange={setBorangId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih borang..." />
                  </SelectTrigger>
                  <SelectContent>
                    {borangList.data?.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        <span className="font-mono text-xs text-primary">{b.kodBorang}</span>
                        <span className="truncate">{b.nama}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {selectedBorang && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/30">
                    {selectedBorang.format}
                  </Badge>
                  <Badge variant="outline" className="bg-teal-500/10 text-teal-700 border-teal-500/30">
                    {selectedBorang.kategori}
                  </Badge>
                </div>
              )}
            </TabsContent>

            {/* Custom URL source */}
            <TabsContent value="custom" className="mt-4">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                URL atau Teks Tersuai
              </label>
              <Input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com atau teks apa sahaja"
                aria-label="URL atau teks tersuai"
              />
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Masukkan sebarang pautan atau teks untuk dikodkan ke Kod QR
              </p>
            </TabsContent>
          </Tabs>

          {/* Read-only URL display + copy */}
          <div className="mt-5">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Pautan Dipilih
            </label>
            <div className="flex items-center gap-2 rounded-lg bg-muted/40 border border-border/60 px-3 py-2">
              <Link2 className="size-3.5 text-muted-foreground shrink-0" />
              <code className="flex-1 min-w-0 text-xs font-mono text-foreground truncate" aria-live="polite">
                {selectedText || <span className="text-muted-foreground">— Tiada pautan —</span>}
              </code>
              <Button
                size="icon"
                variant="ghost"
                className="size-7 shrink-0 hover:bg-primary/10 hover:text-primary"
                onClick={handleCopy}
                disabled={!selectedText}
                aria-label="Salin pautan"
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* QR display — white rounded card */}
          <div className="mt-6 flex justify-center">
            <div className="size-[280px] rounded-2xl bg-white p-4 shadow-lg shadow-primary/10 ring-1 ring-border/40 flex items-center justify-center">
              {qrError ? (
                <div className="flex flex-col items-center gap-2 text-rose-600 px-4 text-center">
                  <AlertCircle className="size-10 opacity-70" />
                  <span className="text-xs">Gagal menjana Kod QR. Cuba lagi.</span>
                </div>
              ) : qrBusy ? (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <div className="size-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
                  <span className="text-xs">Menjana Kod QR...</span>
                </div>
              ) : qrReady ? (
                <motion.img
                  key={selectedText ?? 'qr'}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={qr.data!.dataUrl}
                  alt={`Kod QR untuk ${previewMeta.title}`}
                  className="size-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <QrCode className="size-12 opacity-40" />
                  <span className="text-xs text-center px-4">
                    Pilih sumber untuk jana Kod QR
                  </span>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* ============ RIGHT PANEL — PREVIEW & DOWNLOAD ============ */}
        <GlassCard strong className="p-5 sm:p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-9 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center">
              <ExternalLink className="size-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground leading-tight">Pratonton & Muat Turun</h3>
              <p className="text-xs text-muted-foreground">Simulasi label cetakan Kod QR</p>
            </div>
          </div>

          {/* Printable preview card */}
          <div className="flex justify-center py-2">
            <motion.div
              key={`${source}-${previewMeta.code}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-[300px] bg-white rounded-2xl shadow-xl shadow-primary/10 ring-1 ring-border/40 p-5 text-center"
            >
              {/* Brand strip */}
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <div className="size-5 rounded-md bg-teal-700 flex items-center justify-center">
                  <QrCode className="size-3 text-white" />
                </div>
                <span className="text-[11px] font-bold tracking-wider text-teal-700 uppercase">
                  MyPortfolio
                </span>
              </div>

              {/* QR */}
              <div className="mx-auto size-[200px] bg-white flex items-center justify-center rounded-lg ring-1 ring-border/30 overflow-hidden">
                {qrReady ? (
                  <img
                    src={qr.data!.dataUrl}
                    alt={`Kod QR untuk ${previewMeta.title}`}
                    className="size-full object-contain"
                  />
                ) : (
                  <QrCode className="size-12 text-muted-foreground/40" />
                )}
              </div>

              {/* Title */}
              <h4 className="mt-3 text-sm font-bold text-foreground line-clamp-2 leading-snug">
                {previewMeta.title}
              </h4>

              {/* Subtitle */}
              <p className="mt-0.5 text-[11px] font-mono text-teal-700 break-all">
                {previewMeta.subtitle}
              </p>

              {/* Footer */}
              <div className="mt-3 pt-2.5 border-t border-dashed border-border/60">
                <p className="text-[10px] text-muted-foreground">
                  Imbas untuk capaian pantas • MyPortfolio
                </p>
              </div>
            </motion.div>
          </div>

          {/* Download / Print buttons */}
          <div className="mt-auto pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={handleDownloadPng}
              disabled={!qrReady}
              className="rounded-full"
            >
              <Download className="size-4" /> Muat Turun PNG
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              disabled={!qrReady}
              className="rounded-full glass-subtle border-0"
            >
              <Printer className="size-4" /> Cetak
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* ============ CARTA ORGANISASI QR ============ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="size-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
            <Briefcase className="size-4.5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground leading-tight">Carta Organisasi QR</h3>
            <p className="text-xs text-muted-foreground">
              Pilih jawatan untuk menjana Kod QR pantas di penjana
            </p>
          </div>
          {jawatanList.data && jawatanList.data.length > 0 && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {jawatanList.data.length} jawatan
            </Badge>
          )}
        </div>

        {jawatanList.isLoading ? (
          <GlassCard className="p-8">
            <PageLoader label="Memuatkan senarai jawatan..." />
          </GlassCard>
        ) : jawatanList.isError ? (
          <GlassCard className="p-6">
            <EmptyState
              icon={<AlertCircle className="size-7" />}
              title="Gagal memuatkan senarai jawatan"
              description="Sila muat semula halaman atau cuba lagi nanti"
            />
          </GlassCard>
        ) : !jawatanList.data || jawatanList.data.length === 0 ? (
          <GlassCard className="p-6">
            <EmptyState
              icon={<Briefcase className="size-7" />}
              title="Tiada jawatan tersedia"
              description="Tambah jawatan terlebih dahulu untuk menjana Kod QR"
            />
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {jawatanList.data.map((j, idx) => {
              const isActive = source === 'jawatan' && jawatanId === j.id
              return (
                <motion.div
                  key={j.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.4) }}
                >
                  <GlassCard
                    className={`p-4 h-full flex flex-col gap-3 transition-all ${
                      isActive
                        ? 'ring-2 ring-primary/60 shadow-lg shadow-primary/10'
                        : 'hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="size-9 rounded-lg bg-teal-500/15 text-teal-700 flex items-center justify-center shrink-0">
                        <Briefcase className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Hash className="size-3 text-muted-foreground" />
                          <span className="font-mono text-[11px] text-primary font-semibold">
                            {j.kodJawatan}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                          {j.namaJawatan}
                        </h4>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-700 border-amber-500/30 text-[10px]"
                      >
                        Gred {j.gred}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-teal-500/10 text-teal-700 border-teal-500/30 text-[10px]"
                      >
                        <Building2 className="size-2.5" /> {j.unit}
                      </Badge>
                    </div>

                    <Button
                      size="sm"
                      variant={isActive ? 'default' : 'outline'}
                      onClick={() => selectJawatanForGeneration(j.id)}
                      className="mt-auto rounded-full w-full"
                      aria-label={`Jana Kod QR untuk ${j.namaJawatan}`}
                    >
                      {isActive ? (
                        <>
                          <Check className="size-3.5" /> Dipilih
                        </>
                      ) : (
                        <>
                          <QrCode className="size-3.5" /> Jana & Muat Turun QR
                        </>
                      )}
                    </Button>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
