// Shared TypeScript types for Sistem MyPortfolio

export type Role = 'Admin' | 'Penyelia' | 'Pengguna' | 'Awam'

export type ModuleKey =
  | 'dashboard'
  | 'jawatan'
  | 'carta-alir'
  | 'prosedur'
  | 'checklist'
  | 'borang'
  | 'rujukan'
  | 'qr'
  | 'admin'

export interface SkopTugasItem {
  kra: string
  tugas: string[]
}

export interface KPIItem {
  kpi: string
  sasaran: string
}

export interface HubunganKerja {
  dalaman: string[]
  luaran: string[]
}

export interface Autoriti {
  hadKuasa: string
  melulus: string[]
}

export interface Jawatan {
  id: string
  kodJawatan: string
  namaJawatan: string
  gred: string
  jabatan: string
  bahagian: string
  unit: string
  penyelia: string
  objektifAm: string
  skopTugas: SkopTugasItem[]
  tanggungjawab: string[]
  hubunganKerja: HubunganKerja
  autoriti: Autoriti
  kpi: KPIItem[]
  qrCodeUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface FlowNode {
  id: string
  label: string
  jenis: 'mula' | 'proses' | 'keputusan' | 'tamat'
  penerangan: string
  prosedurId?: string
}

export interface FlowEdge {
  from: string
  to: string
  label?: string
}

export interface CartaAlir {
  id: string
  kodCarta: string
  tajuk: string
  kategori: string
  jawatanId: string | null
  penerangan: string
  nod: FlowNode[]
  sambungan: FlowEdge[]
  createdAt: string
  updatedAt: string
}

export interface LangkahKerja {
  no: number
  tindakan: string
  tanggungjawab: string
  tempohMasa: string
}

export interface ProsedurTanggungjawab {
  jawatan: string
  peranan: string
}

export interface SejarahSemakan {
  versi: string
  tarikh: string
  perubahan: string
}

export interface ProsedurKerja {
  id: string
  kodProsedur: string
  tajuk: string
  tujuan: string
  skop: string
  tanggungjawab: ProsedurTanggungjawab[]
  langkahKerja: LangkahKerja[]
  borangBerkaitan: string[]
  rujukanPeraturan: string[]
  tarikhKuatKuasa: string
  tarikhSemakan: string
  versi: string
  status: string
  sejarahSemakan: SejarahSemakan[]
  createdAt: string
  updatedAt: string
}

export interface ChecklistItem {
  id: string
  bil: number
  tugasan: string
  tanggungjawab: string
  status: 'Selesai' | 'Belum Selesai'
  catatan?: string
}

export interface Checklist {
  id: string
  tajuk: string
  kekerapan: 'Harian' | 'Mingguan' | 'Bulanan'
  jawatanId: string | null
  unit: string
  items: ChecklistItem[]
  tarikhMula: string
  createdAt: string
  updatedAt: string
}

export interface Borang {
  id: string
  kodBorang: string
  nama: string
  kategori: string
  format: string
  kekerapan: string
  penerangan: string
  failUrl: string
  saizFail: string | null
  versi: string
  status: string
  tarikhKemasKini: string
  createdAt: string
  updatedAt: string
}

export interface Rujukan {
  id: string
  kodRujukan: string
  tajuk: string
  kategori: string
  penerangan: string
  pautanLuaran: string | null
  status: string
  versi: string | null
  tarikhKuatKuasa: string | null
  createdAt: string
  updatedAt: string
}

export interface Pengguna {
  id: string
  nama: string
  emel: string
  peranan: Role
  jawatanId: string | null
  unit: string | null
  createdAt: string
  updatedAt: string
}

export interface DashboardData {
  counts: {
    jawatan: number
    cartaAlir: number
    prosedur: number
    checklist: number
    borang: number
    rujukan: number
  }
  checklistProgress: Array<{
    id: string
    tajuk: string
    kekerapan: string
    unit: string
    total: number
    selesai: number
    percent: number
  }>
  compliance: {
    totalItems: number
    selesaiItems: number
    percent: number
  }
  prosedurByStatus: Array<{ status: string; count: number }>
  borangByKategori: Array<{ kategori: string; count: number }>
  rujukanByKategori: Array<{ kategori: string; count: number }>
  recentLogs: Array<{
    id: string
    checklistId: string
    itemId: string
    pengguna: string
    status: string
    catatan: string | null
    tarikh: string
  }>
}
