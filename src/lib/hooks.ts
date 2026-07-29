'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  Jawatan,
  CartaAlir,
  ProsedurKerja,
  Checklist,
  Borang,
  Rujukan,
  Pengguna,
  DashboardData,
} from '@/lib/types'

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// ===== Jawatan =====
export function useJawatanList(q?: string, opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['jawatan', q ?? ''],
    queryFn: () => fetcher<Jawatan[]>(`/api/jawatan${q ? `?q=${encodeURIComponent(q)}` : ''}`),
    enabled: opts?.enabled ?? true,
  })
}
export function useJawatan(id: string | null) {
  return useQuery({
    enabled: !!id,
    queryKey: ['jawatan', id],
    queryFn: () => fetcher<Jawatan>(`/api/jawatan/${id}`),
  })
}

// ===== Carta Alir =====
export function useCartaAlirList(q?: string, kategori?: string) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (kategori) params.set('kategori', kategori)
  const qs = params.toString()
  return useQuery({
    queryKey: ['carta-alir', q ?? '', kategori ?? ''],
    queryFn: () => fetcher<CartaAlir[]>(`/api/carta-alir${qs ? `?${qs}` : ''}`),
  })
}
export function useCartaAlir(id: string | null) {
  return useQuery({
    enabled: !!id,
    queryKey: ['carta-alir', id],
    queryFn: () => fetcher<CartaAlir>(`/api/carta-alir/${id}`),
  })
}

// ===== Prosedur =====
export function useProsedurList(q?: string, status?: string) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (status) params.set('status', status)
  const qs = params.toString()
  return useQuery({
    queryKey: ['prosedur', q ?? '', status ?? ''],
    queryFn: () => fetcher<ProsedurKerja[]>(`/api/prosedur${qs ? `?${qs}` : ''}`),
  })
}
export function useProsedur(id: string | null) {
  return useQuery({
    enabled: !!id,
    queryKey: ['prosedur', id],
    queryFn: () => fetcher<ProsedurKerja>(`/api/prosedur/${id}`),
  })
}

// ===== Checklist =====
export function useChecklistList(kekerapan?: string, unit?: string) {
  const params = new URLSearchParams()
  if (kekerapan) params.set('kekerapan', kekerapan)
  if (unit) params.set('unit', unit)
  const qs = params.toString()
  return useQuery({
    queryKey: ['checklist', kekerapan ?? '', unit ?? ''],
    queryFn: () => fetcher<Checklist[]>(`/api/checklist${qs ? `?${qs}` : ''}`),
  })
}

export function useToggleChecklistItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      itemId,
      status,
      catatan,
      pengguna,
    }: {
      id: string
      itemId: string
      status: string
      catatan?: string
      pengguna?: string
    }) => {
      const res = await fetch(`/api/checklist/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, status, catatan, pengguna }),
      })
      if (!res.ok) throw new Error('Gagal kemas kini status')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checklist'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// ===== Borang =====
export function useBorangList(q?: string, kategori?: string) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (kategori) params.set('kategori', kategori)
  const qs = params.toString()
  return useQuery({
    queryKey: ['borang', q ?? '', kategori ?? ''],
    queryFn: () => fetcher<Borang[]>(`/api/borang${qs ? `?${qs}` : ''}`),
  })
}

// ===== Rujukan =====
export function useRujukanList(q?: string, kategori?: string, status?: string) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (kategori) params.set('kategori', kategori)
  if (status) params.set('status', status)
  const qs = params.toString()
  return useQuery({
    queryKey: ['rujukan', q ?? '', kategori ?? '', status ?? ''],
    queryFn: () => fetcher<Rujukan[]>(`/api/rujukan${qs ? `?${qs}` : ''}`),
  })
}

// ===== Pengguna =====
export function usePengguna() {
  return useQuery({
    queryKey: ['pengguna'],
    queryFn: () => fetcher<Pengguna[]>('/api/pengguna'),
  })
}

// ===== Auth =====
export function useLogin() {
  return useMutation({
    mutationFn: async (creds: { email: string; kataLaluan: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({ error: 'Gagal log masuk' }))
        throw new Error(e.error || `HTTP ${res.status}`)
      }
      return res.json()
    },
  })
}

// ===== Dashboard =====
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetcher<DashboardData>('/api/dashboard'),
  })
}

// ===== QR Code =====
export function useQrCode(text: string | null) {
  return useQuery({
    enabled: !!text,
    queryKey: ['qrcode', text ?? ''],
    queryFn: async () => {
      const res = await fetch('/api/qrcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error('Gagal jana QR')
      const data = await res.json()
      return data as { dataUrl: string; text: string }
    },
  })
}
