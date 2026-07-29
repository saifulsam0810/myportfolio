// Generates a complete Supabase SQL file (schema + data) from the same seed data
// Run: bun run prisma/generate-sql.ts > supabase-setup.sql

import { writeFileSync } from 'fs'

const J = (v: unknown) => JSON.stringify(v)
// Escape single quotes for PostgreSQL string literals
const E = (s: string | null) => (s === null ? 'NULL' : `'${s.replace(/'/g, "''")}'`)

// Fixed IDs for relational integrity
const JW = ['jw1', 'jw2', 'jw3', 'jw4']
const BR = ['br1', 'br2', 'br3', 'br4', 'br5', 'br6', 'br7', 'br8']
const RJ = ['rj1', 'rj2', 'rj3', 'rj4', 'rj5', 'rj6', 'rj7', 'rj8']

const lines: string[] = []

lines.push(`-- ============================================================`)
lines.push(`-- Sistem MyPortfolio - Complete Supabase Setup (Schema + Data)`)
lines.push(`-- Run this in Supabase SQL Editor → New Query → Run`)
lines.push(`-- ============================================================`)
lines.push(``)
lines.push(`-- Clean up existing data (safe to re-run)`)
lines.push(`DROP TABLE IF EXISTS "checklist_log" CASCADE;`)
lines.push(`DROP TABLE IF EXISTS "checklist" CASCADE;`)
lines.push(`DROP TABLE IF EXISTS "borang" CASCADE;`)
lines.push(`DROP TABLE IF EXISTS "rujukan" CASCADE;`)
lines.push(`DROP TABLE IF EXISTS "prosedur_kerja" CASCADE;`)
lines.push(`DROP TABLE IF EXISTS "carta_alir" CASCADE;`)
lines.push(`DROP TABLE IF EXISTS "jawatan" CASCADE;`)
lines.push(`DROP TABLE IF EXISTS "pengguna" CASCADE;`)
lines.push(``)

// ============ SCHEMA ============
lines.push(`-- ============================================================`)
lines.push(`-- 1. SCHEMA (Tables + Indexes)`)
lines.push(`-- ============================================================`)
lines.push(``)
lines.push(`CREATE TABLE "jawatan" (`)
lines.push(`    "id" TEXT NOT NULL,`)
lines.push(`    "kodJawatan" TEXT NOT NULL,`)
lines.push(`    "namaJawatan" TEXT NOT NULL,`)
lines.push(`    "gred" TEXT NOT NULL,`)
lines.push(`    "jabatan" TEXT NOT NULL,`)
lines.push(`    "bahagian" TEXT NOT NULL,`)
lines.push(`    "unit" TEXT NOT NULL,`)
lines.push(`    "penyelia" TEXT NOT NULL,`)
lines.push(`    "objektifAm" TEXT NOT NULL,`)
lines.push(`    "skopTugas" TEXT NOT NULL,`)
lines.push(`    "tanggungjawab" TEXT NOT NULL,`)
lines.push(`    "hubunganKerja" TEXT NOT NULL,`)
lines.push(`    "autoriti" TEXT NOT NULL,`)
lines.push(`    "kpi" TEXT NOT NULL,`)
lines.push(`    "qrCodeUrl" TEXT,`)
lines.push(`    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,`)
lines.push(`    "updatedAt" TIMESTAMP(3) NOT NULL,`)
lines.push(`    CONSTRAINT "jawatan_pkey" PRIMARY KEY ("id")`)
lines.push(`);`)
lines.push(``)
lines.push(`CREATE TABLE "carta_alir" (`)
lines.push(`    "id" TEXT NOT NULL,`)
lines.push(`    "kodCarta" TEXT NOT NULL,`)
lines.push(`    "tajuk" TEXT NOT NULL,`)
lines.push(`    "kategori" TEXT NOT NULL,`)
lines.push(`    "jawatanId" TEXT,`)
lines.push(`    "penerangan" TEXT NOT NULL,`)
lines.push(`    "nod" TEXT NOT NULL,`)
lines.push(`    "sambungan" TEXT NOT NULL,`)
lines.push(`    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,`)
lines.push(`    "updatedAt" TIMESTAMP(3) NOT NULL,`)
lines.push(`    CONSTRAINT "carta_alir_pkey" PRIMARY KEY ("id")`)
lines.push(`);`)
lines.push(``)
lines.push(`CREATE TABLE "prosedur_kerja" (`)
lines.push(`    "id" TEXT NOT NULL,`)
lines.push(`    "kodProsedur" TEXT NOT NULL,`)
lines.push(`    "tajuk" TEXT NOT NULL,`)
lines.push(`    "tujuan" TEXT NOT NULL,`)
lines.push(`    "skop" TEXT NOT NULL,`)
lines.push(`    "tanggungjawab" TEXT NOT NULL,`)
lines.push(`    "langkahKerja" TEXT NOT NULL,`)
lines.push(`    "borangBerkaitan" TEXT NOT NULL,`)
lines.push(`    "rujukanPeraturan" TEXT NOT NULL,`)
lines.push(`    "tarikhKuatKuasa" TIMESTAMP(3) NOT NULL,`)
lines.push(`    "tarikhSemakan" TIMESTAMP(3) NOT NULL,`)
lines.push(`    "versi" TEXT NOT NULL,`)
lines.push(`    "status" TEXT NOT NULL DEFAULT 'Aktif',`)
lines.push(`    "sejarahSemakan" TEXT NOT NULL DEFAULT '[]',`)
lines.push(`    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,`)
lines.push(`    "updatedAt" TIMESTAMP(3) NOT NULL,`)
lines.push(`    CONSTRAINT "prosedur_kerja_pkey" PRIMARY KEY ("id")`)
lines.push(`);`)
lines.push(``)
lines.push(`CREATE TABLE "checklist" (`)
lines.push(`    "id" TEXT NOT NULL,`)
lines.push(`    "tajuk" TEXT NOT NULL,`)
lines.push(`    "kekerapan" TEXT NOT NULL,`)
lines.push(`    "jawatanId" TEXT,`)
lines.push(`    "unit" TEXT NOT NULL,`)
lines.push(`    "items" TEXT NOT NULL,`)
lines.push(`    "tarikhMula" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,`)
lines.push(`    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,`)
lines.push(`    "updatedAt" TIMESTAMP(3) NOT NULL,`)
lines.push(`    CONSTRAINT "checklist_pkey" PRIMARY KEY ("id")`)
lines.push(`);`)
lines.push(``)
lines.push(`CREATE TABLE "checklist_log" (`)
lines.push(`    "id" TEXT NOT NULL,`)
lines.push(`    "checklistId" TEXT NOT NULL,`)
lines.push(`    "itemId" TEXT NOT NULL,`)
lines.push(`    "pengguna" TEXT NOT NULL,`)
lines.push(`    "status" TEXT NOT NULL,`)
lines.push(`    "catatan" TEXT,`)
lines.push(`    "tarikh" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,`)
lines.push(`    CONSTRAINT "checklist_log_pkey" PRIMARY KEY ("id")`)
lines.push(`);`)
lines.push(``)
lines.push(`CREATE TABLE "borang" (`)
lines.push(`    "id" TEXT NOT NULL,`)
lines.push(`    "kodBorang" TEXT NOT NULL,`)
lines.push(`    "nama" TEXT NOT NULL,`)
lines.push(`    "kategori" TEXT NOT NULL,`)
lines.push(`    "format" TEXT NOT NULL,`)
lines.push(`    "kekerapan" TEXT NOT NULL,`)
lines.push(`    "penerangan" TEXT NOT NULL,`)
lines.push(`    "failUrl" TEXT NOT NULL,`)
lines.push(`    "saizFail" TEXT,`)
lines.push(`    "versi" TEXT NOT NULL DEFAULT '1.0',`)
lines.push(`    "status" TEXT NOT NULL DEFAULT 'Aktif',`)
lines.push(`    "tarikhKemasKini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,`)
lines.push(`    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,`)
lines.push(`    "updatedAt" TIMESTAMP(3) NOT NULL,`)
lines.push(`    CONSTRAINT "borang_pkey" PRIMARY KEY ("id")`)
lines.push(`);`)
lines.push(``)
lines.push(`CREATE TABLE "rujukan" (`)
lines.push(`    "id" TEXT NOT NULL,`)
lines.push(`    "kodRujukan" TEXT NOT NULL,`)
lines.push(`    "tajuk" TEXT NOT NULL,`)
lines.push(`    "kategori" TEXT NOT NULL,`)
lines.push(`    "penerangan" TEXT NOT NULL,`)
lines.push(`    "pautanLuaran" TEXT,`)
lines.push(`    "status" TEXT NOT NULL DEFAULT 'Aktif',`)
lines.push(`    "versi" TEXT,`)
lines.push(`    "tarikhKuatKuasa" TIMESTAMP(3),`)
lines.push(`    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,`)
lines.push(`    "updatedAt" TIMESTAMP(3) NOT NULL,`)
lines.push(`    CONSTRAINT "rujukan_pkey" PRIMARY KEY ("id")`)
lines.push(`);`)
lines.push(``)
lines.push(`CREATE TABLE "pengguna" (`)
lines.push(`    "id" TEXT NOT NULL,`)
lines.push(`    "nama" TEXT NOT NULL,`)
lines.push(`    "emel" TEXT NOT NULL,`)
lines.push(`    "kataLaluan" TEXT NOT NULL DEFAULT 'password123',`)
lines.push(`    "peranan" TEXT NOT NULL,`)
lines.push(`    "jawatanId" TEXT,`)
lines.push(`    "unit" TEXT,`)
lines.push(`    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,`)
lines.push(`    "updatedAt" TIMESTAMP(3) NOT NULL,`)
lines.push(`    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")`)
lines.push(`);`)
lines.push(``)
lines.push(`CREATE UNIQUE INDEX "jawatan_kodJawatan_key" ON "jawatan"("kodJawatan");`)
lines.push(`CREATE UNIQUE INDEX "carta_alir_kodCarta_key" ON "carta_alir"("kodCarta");`)
lines.push(`CREATE UNIQUE INDEX "prosedur_kerja_kodProsedur_key" ON "prosedur_kerja"("kodProsedur");`)
lines.push(`CREATE UNIQUE INDEX "borang_kodBorang_key" ON "borang"("kodBorang");`)
lines.push(`CREATE UNIQUE INDEX "rujukan_kodRujukan_key" ON "rujukan"("kodRujukan");`)
lines.push(`CREATE UNIQUE INDEX "pengguna_emel_key" ON "pengguna"("emel");`)
lines.push(``)

// ============ DATA ============
lines.push(`-- ============================================================`)
lines.push(`-- 2. DUMMY DATA`)
lines.push(`-- ============================================================`)
lines.push(``)
lines.push(`-- Timestamps`)
lines.push(`-- All records use a fixed timestamp for consistency`)
lines.push(``)

// ---- JAWATAN ----
lines.push(`-- ---- Jawatan (4 positions) ----`)
const jawatanData = [
  {
    id: JW[0], kodJawatan: 'JT001', namaJawatan: 'Pegawai Tadbir', gred: 'N41',
    jabatan: 'Jabatan Pentadbiran', bahagian: 'Bahagian Pengurusan', unit: 'Unit Pentadbiran',
    penyelia: 'Siti Aishah binti Hassan (Ketua Unit Pentadbiran)',
    objektifAm: 'Memastikan kelancaran operasi pentadbiran am jabatan termasuk pengurusan surat-menyurat, fail rekod, mesyuarat, aset dan perkhidmatan pelanggan mengikut piawaian yang ditetapkan.',
    skopTugas: [
      { kra: 'Pengurusan Pentadbiran Am', tugas: ['Menguruskan surat-menyurat masuk/keluar', 'Menyenggara fail rekod dan inventori pejabat', 'Menguruskan daftar surat masuk/keluar'] },
      { kra: 'Pengurusan Mesyuarat', tugas: ['Menyediakan minit mesyuarat', 'Menyediakan agenda mesyuarat', 'Susulan tindakan (action tracking)'] },
      { kra: 'Pengurusan Aset & Stor', tugas: ['Merekod aset alih jabatan', 'Menyelenggara inventori aset', 'Melapor status aset mengikut TPA'] },
      { kra: 'Perkhidmatan Pelanggan', tugas: ['Mengendali aduan pelanggan', 'Mengendali pertanyaan dalaman/luaran', 'Mematuhi Piagam Pelanggan'] },
    ],
    tanggungjawab: ['Pengurusan aset pejabat dan inventori', 'Pengurusan fail rasmi dan rekod', 'Urusan surat-menyurat rasmi jabatan', 'Penyediaan minit dan dokumentasi mesyuarat'],
    hubunganKerja: { dalaman: ['Ketua Unit Pentadbiran', 'Pegawai Kewangan', 'Unit ICT', 'Semua kakitangan jabatan'], luaran: ['Pembekal dan vendor', 'Pelanggan awam', 'Jabatan kerajaan lain'] },
    autoriti: { hadKuasa: 'Pelulus tuntutan sehingga RM5,000', melulus: ['Permohonan alat tulis pejabat', 'Tuntutan perjalanan kecil'] },
    kpi: [{ kpi: 'Masa tindak balas surat rasmi', sasaran: '< 3 hari bekerja' }, { kpi: 'Ketepatan rekod fail', sasaran: '100%' }, { kpi: 'Kepatuhan checklist harian', sasaran: '> 85%' }],
  },
  {
    id: JW[1], kodJawatan: 'JT002', namaJawatan: 'Pegawai Kewangan', gred: 'N44',
    jabatan: 'Jabatan Kewangan', bahagian: 'Bahagian Akaun', unit: 'Unit Akaun',
    penyelia: 'Tn. Hj. Razak bin Osman (Ketua Penolong Pengarah Kewangan)',
    objektifAm: 'Memastikan pengurusan kewangan, perakaunan dan pembayaran jabatan dilaksanakan mengikut Arahan Perbendaharaan dan tatacara kewangan kerajaan yang berkuat kuasa.',
    skopTugas: [
      { kra: 'Pengurusan Pembayaran', tugas: ['Memproses tuntutan pembayaran', 'Menyemak voucher bayaran', 'Mengeluarkan arahan bayaran'] },
      { kra: 'Pengurusan Akaun', tugas: ['Menyediakan penyata akaun bulanan', 'Penutupan akaun akhir tahun', 'Audit dalaman akaun'] },
      { kra: 'Tuntutan & Elaun', tugas: ['Memproses tuntutan perjalanan', 'Memproses elaun kakitangan', 'Semakan dokumen sokongan'] },
    ],
    tanggungjawab: ['Pengurusan akaun perbelanjaan bulanan', 'Penyediaan laporan kewangan', 'Semakan dan pengesahan tuntutan'],
    hubunganKerja: { dalaman: ['Ketua Penolong Pengarah Kewangan', 'Pegawai Tadbir', 'Jabatan Audit'], luaran: ['Arahan Perbendaharaan Malaysia', 'Bank Negara', 'Jabatan Audit Negara'] },
    autoriti: { hadKuasa: 'Pelulus bayaran sehingga RM50,000', melulus: ['Tuntutan perbelanjaan operasi', 'Bayaran pembekal'] },
    kpi: [{ kpi: 'Masa pemprosesan bayaran', sasaran: '< 5 hari bekerja' }, { kpi: 'Ketepatan penyata akaun', sasaran: '100%' }],
  },
  {
    id: JW[2], kodJawatan: 'JT003', namaJawatan: 'Setiausaha Pejabat', gred: 'N27',
    jabatan: 'Jabatan Pentadbiran', bahagian: 'Bahagian Pengurusan', unit: 'Unit Sokongan',
    penyelia: 'Siti Aishah binti Hassan (Ketua Unit Pentadbiran)',
    objektifAm: 'Menyediakan sokongan pentadbiran dan setiausaha kepada pejabat ketua jabatan bagi memastikan kelancaran urusan harian dan mesyuarat.',
    skopTugas: [
      { kra: 'Sokongan Pentadbiran', tugas: ['Mengurus jadual ketua jabatan', 'Menerima dan mengagihkan panggilan', 'Menyusun dokumen rasmi'] },
      { kra: 'Setiausaha Mesyuarat', tugas: ['Menyediakan notis mesyuarat', 'Mencatat minit mesyuarat', 'Susulan tindakan mesyuarat'] },
      { kra: 'Pengurusan Fail', tugas: ['Menyenggara fail sulit', 'Mengemas kini fail meja', 'Pengarkiban dokumen'] },
    ],
    tanggungjawab: ['Pengurusan jadual dan temujanji ketua jabatan', 'Penyediaan minit mesyuarat', 'Pengurusan fail sulit dan rasmi'],
    hubunganKerja: { dalaman: ['Ketua Jabatan', 'Pegawai Tadbir', 'Semua unit'], luaran: ['Setiausaha jabatan lain', 'Pegawai kerajaan lain'] },
    autoriti: { hadKuasa: 'Akses dokumen sulit tahap tertentu', melulus: [] },
    kpi: [{ kpi: 'Ketepatan masa mesyuarat', sasaran: '> 95%' }, { kpi: 'Masa siap minit mesyuarat', sasaran: '< 3 hari bekerja' }],
  },
  {
    id: JW[3], kodJawatan: 'JT004', namaJawatan: 'Pegawai Aset', gred: 'N36',
    jabatan: 'Jabatan Pentadbiran', bahagian: 'Bahagian Pengurusan', unit: 'Unit Aset',
    penyelia: 'Siti Aishah binti Hassan (Ketua Unit Pentadbiran)',
    objektifAm: 'Mengurus dan menyelenggara aset alih kerajaan jabatan mengikut Tatacara Pengurusan Aset Alih Kerajaan (TPA) bagi memastikan rekod dan inventori aset sentiasa kemas kini dan boleh dijejaki.',
    skopTugas: [
      { kra: 'Pendaftaran Aset', tugas: ['Mendaftar aset baharu', 'Mengeluarkan tag aset', 'Mengemas kini daftar aset'] },
      { kra: 'Pemindahan & Pelupusan', tugas: ['Memproses pemindahan aset', 'Penilaian pelupusan', 'Serah terima aset'] },
      { kra: 'Audit & Inventori', tugas: ['Pemeriksaan fizikal tahunan', 'Laporan inventori', 'Semakan rekod aset'] },
    ],
    tanggungjawab: ['Pengurusan aset alih jabatan', 'Pengurusan stor pejabat', 'Pemeliharaan inventori'],
    hubunganKerja: { dalaman: ['Ketua Unit Pentadbiran', 'Pegawai Kewangan', 'Semua pegawai'], luaran: ['Jabatan Kastam', 'Pembekal aset', 'Syarikat pelupusan'] },
    autoriti: { hadKuasa: 'Pelulus pengeluaran aset di bawah RM10,000', melulus: ['Permintaan alat tulis', 'Pengeluaran aset stor'] },
    kpi: [{ kpi: 'Ketepatan rekod inventori', sasaran: '> 98%' }, { kpi: 'Masa pemeriksaan fizikal', sasaran: 'Tahunan 100%' }],
  },
]

for (const j of jawatanData) {
  lines.push(`INSERT INTO "jawatan" ("id","kodJawatan","namaJawatan","gred","jabatan","bahagian","unit","penyelia","objektifAm","skopTugas","tanggungjawab","hubunganKerja","autoriti","kpi","qrCodeUrl","createdAt","updatedAt") VALUES (`)
  lines.push(`  ${E(j.id)}, ${E(j.kodJawatan)}, ${E(j.namaJawatan)}, ${E(j.gred)}, ${E(j.jabatan)}, ${E(j.bahagian)}, ${E(j.unit)}, ${E(j.penyelia)}, ${E(j.objektifAm)},`)
  lines.push(`  ${E(J(j.skopTugas))}, ${E(J(j.tanggungjawab))}, ${E(J(j.hubunganKerja))}, ${E(J(j.autoriti))}, ${E(J(j.kpi))}, ${E(`/jawatan/${j.kodJawatan}`)},`)
  lines.push(`  NOW(), NOW())`)
  lines.push(`  ON CONFLICT ("kodJawatan") DO NOTHING;`)
}
lines.push(``)

// ---- PENGGUNA ----
lines.push(`-- ---- Pengguna (4 users) ----`)
const penggunaData = [
  { id: 'pg1', nama: 'Ahmad Faizal bin Rahman', emel: 'faizal@agensi.gov.my', kataLaluan: 'admin123', peranan: 'Admin', jawatanId: null, unit: 'Unit ICT' },
  { id: 'pg2', nama: 'Siti Aishah binti Hassan', emel: 'aishah@agensi.gov.my', kataLaluan: 'penyelia123', peranan: 'Penyelia', jawatanId: JW[0], unit: 'Unit Pentadbiran' },
  { id: 'pg3', nama: 'Mohd Hafiz bin Ibrahim', emel: 'hafiz@agensi.gov.my', kataLaluan: 'pengguna123', peranan: 'Pengguna', jawatanId: JW[0], unit: 'Unit Pentadbiran' },
  { id: 'pg4', nama: 'Nurul Ain binti Yusof', emel: 'nurul@agensi.gov.my', kataLaluan: 'pengguna123', peranan: 'Pengguna', jawatanId: JW[1], unit: 'Unit Kewangan' },
]
for (const u of penggunaData) {
  lines.push(`INSERT INTO "pengguna" ("id","nama","emel","kataLaluan","peranan","jawatanId","unit","createdAt","updatedAt") VALUES (`)
  lines.push(`  ${E(u.id)}, ${E(u.nama)}, ${E(u.emel)}, ${E(u.kataLaluan)}, ${E(u.peranan)}, ${E(u.jawatanId)}, ${E(u.unit)}, NOW(), NOW())`)
  lines.push(`  ON CONFLICT ("emel") DO NOTHING;`)
}
lines.push(``)

// ---- CARTA ALIR ----
lines.push(`-- ---- Carta Alir (3 flowcharts) ----`)
const cartaData = [
  {
    id: 'ca1', kodCarta: 'CA001', tajuk: 'Proses Pengurusan Surat Masuk', kategori: 'Pentadbiran', jawatanId: JW[0],
    penerangan: 'Carta alir ringkas proses penerimaan, pendaftaran dan pengagihan surat rasmi masuk di jabatan.',
    nod: [
      { id: 'n1', label: 'MULA\nSurat diterima di kaunter', jenis: 'mula', penerangan: 'Surat/dokumen diterima di kaunter URUS SETIA.' },
      { id: 'n2', label: 'Rekod dalam Buku Daftar Surat Masuk / e-Surat', jenis: 'proses', penerangan: 'Surat direkod dalam Buku Daftar Surat Masuk atau Sistem e-Surat.' },
      { id: 'n3', label: 'Serah kepada Ketua Jabatan', jenis: 'proses', penerangan: 'Surat diserahkan kepada Ketua Jabatan untuk arahan/minit.' },
      { id: 'n4', label: 'Arahan minit?', jenis: 'keputusan', penerangan: 'Ketua Jabatan beri arahan minit kepada unit berkaitan.' },
      { id: 'n5', label: 'Agih kepada Pegawai/Unit', jenis: 'proses', penerangan: 'Surat diagihkan kepada Pegawai/Unit berkaitan mengikut minit arahan.' },
      { id: 'n6', label: 'Pegawai bertindak (3 hari bekerja)', jenis: 'proses', penerangan: 'Pegawai bertindak mengikut tempoh masa yang ditetapkan.' },
      { id: 'n7', label: 'Rekod tindakan & difailkan', jenis: 'proses', penerangan: 'Tindakan/maklum balas direkodkan dan difailkan.' },
      { id: 'n8', label: 'TAMAT\nStatus dikemas kini', jenis: 'tamat', penerangan: 'Status tindakan dikemas kini dalam sistem.' },
    ],
    sambungan: [
      { from: 'n1', to: 'n2' }, { from: 'n2', to: 'n3' }, { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5', label: 'Ya' }, { from: 'n5', to: 'n6' },
      { from: 'n6', to: 'n7' }, { from: 'n7', to: 'n8' },
    ],
  },
  {
    id: 'ca2', kodCarta: 'CA002', tajuk: 'Proses Permohonan Cuti Rehat', kategori: 'Sumber Manusia', jawatanId: JW[0],
    penerangan: 'Carta alir proses permohonan cuti rehat kakitangan jabatan.',
    nod: [
      { id: 'n1', label: 'MULA\nPegawai isi borang cuti', jenis: 'mula', penerangan: 'Pegawai mengisi permohonan cuti sekurang-kurangnya 3 hari bekerja sebelum tarikh cuti.' },
      { id: 'n2', label: 'Hantar kepada Penyelia', jenis: 'proses', penerangan: 'Sistem/borang dihantar kepada Penyelia untuk kelulusan.' },
      { id: 'n3', label: 'Semakan baki cuti & keperluan operasi', jenis: 'keputusan', penerangan: 'Penyelia menyemak baki cuti dan keperluan operasi.' },
      { id: 'n4', label: 'Lulus', jenis: 'proses', penerangan: 'Permohonan diluluskan.' },
      { id: 'n5', label: 'Tolak', jenis: 'proses', penerangan: 'Permohonan ditolak dengan alasan.' },
      { id: 'n6', label: 'Rekod cuti dikemas kini', jenis: 'proses', penerangan: 'Rekod cuti dikemas kini dalam sistem pengurusan cuti/HRMIS.' },
      { id: 'n7', label: 'TAMAT\nMaklum balas kepada pemohon', jenis: 'tamat', penerangan: 'Status kelulusan dimaklumkan kepada pemohon.' },
    ],
    sambungan: [
      { from: 'n1', to: 'n2' }, { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4', label: 'Lulus' }, { from: 'n3', to: 'n5', label: 'Tolak' },
      { from: 'n4', to: 'n6' }, { from: 'n6', to: 'n7' }, { from: 'n5', to: 'n7' },
    ],
  },
  {
    id: 'ca3', kodCarta: 'CA003', tajuk: 'Proses Tuntutan Perbelanjaan', kategori: 'Kewangan', jawatanId: JW[1],
    penerangan: 'Carta alir proses tuntutan perbelanjaan dan elaun kakitangan.',
    nod: [
      { id: 'n1', label: 'MULA\nPegawai hantar tuntutan', jenis: 'mula', penerangan: 'Pegawai menghantar borang tuntutan dengan dokumen sokongan.' },
      { id: 'n2', label: 'Semakan dokumen', jenis: 'proses', penerangan: 'Pegawai Kewangan menyemak dokumen sokongan.' },
      { id: 'n3', label: 'Dokumen lengkap?', jenis: 'keputusan', penerangan: 'Semakan sama ada dokumen lengkap.' },
      { id: 'n4', label: 'Pulangkan untuk semakan semula', jenis: 'proses', penerangan: 'Dokumen tidak lengkap dikembalikan.' },
      { id: 'n5', label: 'Pengesahan & pengiraan', jenis: 'proses', penerangan: 'Pegawai Kewangan mengira dan mengesahkan jumlah.' },
      { id: 'n6', label: 'Kelulusan Ketua Kewangan', jenis: 'proses', penerangan: 'Tuntutan diluluskan oleh Ketua Kewangan.' },
      { id: 'n7', label: 'TAMAT\nBayaran diproses', jenis: 'tamat', penerangan: 'Arahan bayaran dikeluarkan.' },
    ],
    sambungan: [
      { from: 'n1', to: 'n2' }, { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4', label: 'Tidak' }, { from: 'n3', to: 'n5', label: 'Ya' },
      { from: 'n4', to: 'n1' }, { from: 'n5', to: 'n6' }, { from: 'n6', to: 'n7' },
    ],
  },
]
for (const c of cartaData) {
  lines.push(`INSERT INTO "carta_alir" ("id","kodCarta","tajuk","kategori","jawatanId","penerangan","nod","sambungan","createdAt","updatedAt") VALUES (`)
  lines.push(`  ${E(c.id)}, ${E(c.kodCarta)}, ${E(c.tajuk)}, ${E(c.kategori)}, ${E(c.jawatanId)}, ${E(c.penerangan)},`)
  lines.push(`  ${E(J(c.nod))}, ${E(J(c.sambungan))}, NOW(), NOW())`)
  lines.push(`  ON CONFLICT ("kodCarta") DO NOTHING;`)
}
lines.push(``)

// ---- PROSEDUR KERJA ----
lines.push(`-- ---- Prosedur Kerja (4 SOPs) ----`)
const prosedurData = [
  {
    id: 'pk1', kodProsedur: 'MPK/UP/001', tajuk: 'Prosedur Pengurusan Surat Masuk',
    tujuan: 'Memastikan setiap surat rasmi masuk direkod, diagih dan ditindak dengan tepat dan dalam tempoh masa yang ditetapkan.',
    skop: 'Unit Pentadbiran dan semua pegawai yang menerima minit arahan surat.',
    tanggungjawab: [
      { jawatan: 'Pegawai Tadbir', peranan: 'Mendaftar dan mengagih surat' },
      { jawatan: 'Ketua Jabatan', peranan: 'Berikan minit arahan' },
      { jawatan: 'Pegawai Bertindak', peranan: 'Melaksana tindakan surat' },
    ],
    langkahKerja: [
      { no: 1, tindakan: 'Surat diterima di kaunter URUS SETIA', tanggungjawab: 'Pegawai Tadbir', tempohMasa: 'Sama hari' },
      { no: 2, tindakan: 'Surat direkod dalam Buku Daftar Surat Masuk / e-Surat', tanggungjawab: 'Pegawai Tadbir', tempohMasa: 'Sama hari' },
      { no: 3, tindakan: 'Surat diserahkan kepada Ketua Jabatan untuk arahan/minit', tanggungjawab: 'Pegawai Tadbir', tempohMasa: '1 hari bekerja' },
      { no: 4, tindakan: 'Surat diagihkan kepada Pegawai/Unit berkaitan', tanggungjawab: 'Ketua Jabatan', tempohMasa: '1 hari bekerja' },
      { no: 5, tindakan: 'Pegawai bertindak mengikut tempoh yang ditetapkan', tanggungjawab: 'Pegawai Bertindak', tempohMasa: '3 hari bekerja' },
      { no: 6, tindakan: 'Tindakan/maklum balas direkod dan difailkan', tanggungjawab: 'Pegawai Bertindak', tempohMasa: '1 hari bekerja selepas tindakan' },
      { no: 7, tindakan: 'Status tindakan dikemas kini dalam sistem', tanggungjawab: 'Pegawai Tadbir', tempohMasa: 'Sama hari' },
    ],
    borangBerkaitan: [], rujukanPeraturan: [],
    tarikhKuatKuasa: '2024-01-01', tarikhSemakan: '2026-01-01', versi: '2.0', status: 'Aktif',
    sejarahSemakan: [
      { versi: '1.0', tarikh: '2022-01-01', perubahan: 'Pindaan awal prosedur' },
      { versi: '2.0', tarikh: '2024-01-01', perubahan: 'Penambahan langkah e-Surat dan tempoh masa standard' },
    ],
  },
  {
    id: 'pk2', kodProsedur: 'MPK/UP/002', tajuk: 'Prosedur Permohonan Cuti Rehat',
    tujuan: 'Memastikan permohonan cuti rehat diproses secara telus dan terkini mengikut pekeliling perkhidmatan.',
    skop: 'Semua kakitangan jabatan.',
    tanggungjawab: [
      { jawatan: 'Pegawai', peranan: 'Memohon cuti' },
      { jawatan: 'Penyelia', peranan: 'Meluluskan/menolak permohonan' },
      { jawatan: 'Pegawai HR', peranan: 'Kemas kini rekod cuti' },
    ],
    langkahKerja: [
      { no: 1, tindakan: 'Pegawai mengisi permohonan cuti sekurang-kurangnya 3 hari bekerja sebelum tarikh cuti', tanggungjawab: 'Pegawai', tempohMasa: '3 hari bekerja sebelum cuti' },
      { no: 2, tindakan: 'Sistem/borang dihantar kepada Penyelia', tanggungjawab: 'Sistem', tempohMasa: 'Auto' },
      { no: 3, tindakan: 'Penyelia semak baki cuti & keperluan operasi', tanggungjawab: 'Penyelia', tempohMasa: '1 hari bekerja' },
      { no: 4, tindakan: 'Status kelulusan dimaklumkan kepada pemohon', tanggungjawab: 'Sistem', tempohMasa: 'Auto selepas keputusan' },
      { no: 5, tindakan: 'Rekod cuti dikemas kini dalam HRMIS', tanggungjawab: 'Pegawai HR', tempohMasa: '1 hari bekerja' },
    ],
    borangBerkaitan: [BR[0]], rujukanPeraturan: [RJ[1]],
    tarikhKuatKuasa: '2023-06-01', tarikhSemakan: '2026-06-01', versi: '1.5', status: 'Aktif',
    sejarahSemakan: [
      { versi: '1.0', tarikh: '2020-01-01', perubahan: 'Versi awal prosedur cuti' },
      { versi: '1.5', tarikh: '2023-06-01', perubahan: 'Penambahbaikan tempoh dan notifikasi sistem' },
    ],
  },
  {
    id: 'pk3', kodProsedur: 'MPK/UK/003', tajuk: 'Prosedur Tuntutan Perbelanjaan & Elaun',
    tujuan: 'Memastikan tuntutan perbelanjaan dan elaun diproses mengikut Arahan Perbendaharaan dan dokumen sokongan yang lengkap.',
    skop: 'Semua kakitangan yang membuat tuntutan perbelanjaan.',
    tanggungjawab: [
      { jawatan: 'Pegawai', peranan: 'Menghantar tuntutan' },
      { jawatan: 'Pegawai Kewangan', peranan: 'Semak dan sahkan' },
      { jawatan: 'Ketua Kewangan', peranan: 'Lulus bayaran' },
    ],
    langkahKerja: [
      { no: 1, tindakan: 'Pegawai mengisi borang tuntutan dan lampirkan dokumen sokongan', tanggungjawab: 'Pegawai', tempohMasa: 'Selepas urusan' },
      { no: 2, tindakan: 'Pegawai Kewangan menyemak dokumen', tanggungjawab: 'Pegawai Kewangan', tempohMasa: '2 hari bekerja' },
      { no: 3, tindakan: 'Pengesahan dan pengiraan jumlah', tanggungjawab: 'Pegawai Kewangan', tempohMasa: '1 hari bekerja' },
      { no: 4, tindakan: 'Kelulusan Ketua Kewangan', tanggungjawab: 'Ketua Kewangan', tempohMasa: '2 hari bekerja' },
      { no: 5, tindakan: 'Arahan bayaran dikeluarkan', tanggungjawab: 'Pegawai Kewangan', tempohMasa: '2 hari bekerja' },
    ],
    borangBerkaitan: [BR[1]], rujukanPeraturan: [RJ[3]],
    tarikhKuatKuasa: '2024-03-01', tarikhSemakan: '2026-03-01', versi: '3.0', status: 'Dikemas Kini',
    sejarahSemakan: [
      { versi: '1.0', tarikh: '2019-01-01', perubahan: 'Versi awal' },
      { versi: '2.0', tarikh: '2021-06-01', perubahan: 'Penambahan dokumen sokongan wajib' },
      { versi: '3.0', tarikh: '2024-03-01', perubahan: 'Selaraskan dengan Arahan Perbendaharaan terkini' },
    ],
  },
  {
    id: 'pk4', kodProsedur: 'MPK/UA/004', tajuk: 'Prosedur Pemindahan & Pelupusan Aset Alih',
    tujuan: 'Memastikan pemindahan dan pelupusan aset alih kerajaan dilakukan mengikut Tatacara Pengurusan Aset Alih (TPA).',
    skop: 'Unit Aset dan pegawai yang terlibat dengan pemindahan/pelupusan aset.',
    tanggungjawab: [
      { jawatan: 'Pegawai Aset', peranan: 'Proses pemindahan/pelupusan' },
      { jawatan: 'Ketua Unit', peranan: 'Sahkan' },
      { jawatan: 'Lembaga Pemeriksa', peranan: 'Penilaian pelupusan' },
    ],
    langkahKerja: [
      { no: 1, tindakan: 'Pegawai Aset terima permohonan pemindahan/pelupusan', tanggungjawab: 'Pegawai Aset', tempohMasa: 'Sama hari' },
      { no: 2, tindakan: 'Pemeriksaan fizikal aset', tanggungjawab: 'Pegawai Aset', tempohMasa: '3 hari bekerja' },
      { no: 3, tindakan: 'Lembaga Pemeriksa nilai dan sahkan', tanggungjawab: 'Lembaga Pemeriksa', tempohMasa: '7 hari bekerja' },
      { no: 4, tindakan: 'Kemas kini rekod daftar aset', tanggungjawab: 'Pegawai Aset', tempohMasa: '2 hari bekerja' },
      { no: 5, tindakan: 'Serah terima / pelupusan dilaksana', tanggungjawab: 'Pegawai Aset', tempohMasa: 'Mengikut jadual' },
    ],
    borangBerkaitan: [BR[3]], rujukanPeraturan: [RJ[4]],
    tarikhKuatKuasa: '2023-01-01', tarikhSemakan: '2026-01-01', versi: '2.1', status: 'Aktif',
    sejarahSemakan: [
      { versi: '1.0', tarikh: '2018-01-01', perubahan: 'Versi awal' },
      { versi: '2.0', tarikh: '2021-01-01', perubahan: 'Penambahbaikan lembaga pemeriksa' },
      { versi: '2.1', tarikh: '2023-01-01', perubahan: 'Selaraskan dengan Pindaan TPA 2022' },
    ],
  },
]
for (const p of prosedurData) {
  lines.push(`INSERT INTO "prosedur_kerja" ("id","kodProsedur","tajuk","tujuan","skop","tanggungjawab","langkahKerja","borangBerkaitan","rujukanPeraturan","tarikhKuatKuasa","tarikhSemakan","versi","status","sejarahSemakan","createdAt","updatedAt") VALUES (`)
  lines.push(`  ${E(p.id)}, ${E(p.kodProsedur)}, ${E(p.tajuk)}, ${E(p.tujuan)}, ${E(p.skop)},`)
  lines.push(`  ${E(J(p.tanggungjawab))}, ${E(J(p.langkahKerja))}, ${E(J(p.borangBerkaitan))}, ${E(J(p.rujukanPeraturan))},`)
  lines.push(`  ${E(p.tarikhKuatKuasa)}, ${E(p.tarikhSemakan)}, ${E(p.versi)}, ${E(p.status)}, ${E(J(p.sejarahSemakan))}, NOW(), NOW())`)
  lines.push(`  ON CONFLICT ("kodProsedur") DO NOTHING;`)
}
lines.push(``)

// ---- CHECKLIST ----
lines.push(`-- ---- Checklist (4 checklists) ----`)
const checklistData = [
  {
    id: 'ck1', tajuk: 'Checklist Tugasan Harian - Unit Pentadbiran', kekerapan: 'Harian', jawatanId: JW[0], unit: 'Unit Pentadbiran',
    items: [
      { id: 'h1', bil: 1, tugasan: 'Semak dan balas e-mel rasmi jabatan', tanggungjawab: 'Semua Pegawai', status: 'Belum Selesai', catatan: '' },
      { id: 'h2', bil: 2, tugasan: 'Kemas kini daftar surat masuk/keluar', tanggungjawab: 'Pegawai Tadbir', status: 'Belum Selesai', catatan: '' },
      { id: 'h3', bil: 3, tugasan: 'Semak jadual/agenda mesyuarat hari ini', tanggungjawab: 'Setiausaha/PA', status: 'Selesai', catatan: 'Mesyuarat 10:00 pagi' },
      { id: 'h4', bil: 4, tugasan: 'Kemas kini status tugasan dalam MyPortfolio', tanggungjawab: 'Semua Pegawai', status: 'Belum Selesai', catatan: '' },
    ],
  },
  {
    id: 'ck2', tajuk: 'Checklist Tugasan Harian - Unit Kewangan', kekerapan: 'Harian', jawatanId: JW[1], unit: 'Unit Kewangan',
    items: [
      { id: 'h1', bil: 1, tugasan: 'Semak e-mel tuntutan baru', tanggungjawab: 'Pegawai Kewangan', status: 'Selesai', catatan: '' },
      { id: 'h2', bil: 2, tugasan: 'Proses voucher bayaran hari ini', tanggungjawab: 'Pegawai Kewangan', status: 'Belum Selesai', catatan: '' },
      { id: 'h3', bil: 3, tugasan: 'Kemas kini penyata akaun harian', tanggungjawab: 'Pegawai Kewangan', status: 'Belum Selesai', catatan: '' },
    ],
  },
  {
    id: 'ck3', tajuk: 'Checklist Tugasan Mingguan - Unit Pentadbiran', kekerapan: 'Mingguan', jawatanId: JW[0], unit: 'Unit Pentadbiran',
    items: [
      { id: 'm1', bil: 1, tugasan: 'Mesyuarat penyelarasan mingguan unit/bahagian', tanggungjawab: 'Ketua Unit', status: 'Belum Selesai', catatan: 'Setiap Isnin' },
      { id: 'm2', bil: 2, tugasan: 'Kemas kini laporan prestasi mingguan', tanggungjawab: 'Semua Pegawai', status: 'Belum Selesai', catatan: '' },
      { id: 'm3', bil: 3, tugasan: 'Semakan stok/inventori pejabat', tanggungjawab: 'Pegawai Aset', status: 'Selesai', catatan: 'Selesai Khamis' },
    ],
  },
  {
    id: 'ck4', tajuk: 'Checklist Tugasan Bulanan - Jabatan', kekerapan: 'Bulanan', jawatanId: null, unit: 'Jabatan Pentadbiran',
    items: [
      { id: 'b1', bil: 1, tugasan: 'Penyediaan laporan prestasi bulanan jabatan', tanggungjawab: 'Ketua Jabatan', status: 'Belum Selesai', catatan: '' },
      { id: 'b2', bil: 2, tugasan: 'Tuntutan perjalanan & elaun bulanan', tanggungjawab: 'Semua Pegawai', status: 'Belum Selesai', catatan: '' },
      { id: 'b3', bil: 3, tugasan: 'Penyelarasan & pengesahan kehadiran/cuti', tanggungjawab: 'Pegawai HR', status: 'Selesai', catatan: '' },
      { id: 'b4', bil: 4, tugasan: 'Semakan dan penutupan akaun perbelanjaan bulanan', tanggungjawab: 'Pegawai Kewangan', status: 'Belum Selesai', catatan: '' },
    ],
  },
]
for (const c of checklistData) {
  lines.push(`INSERT INTO "checklist" ("id","tajuk","kekerapan","jawatanId","unit","items","tarikhMula","createdAt","updatedAt") VALUES (`)
  lines.push(`  ${E(c.id)}, ${E(c.tajuk)}, ${E(c.kekerapan)}, ${E(c.jawatanId)}, ${E(c.unit)}, ${E(J(c.items))}, NOW(), NOW(), NOW())`)
  lines.push(`  ON CONFLICT ("id") DO NOTHING;`)
}
lines.push(``)

// ---- BORANG ----
lines.push(`-- ---- Borang (8 forms) ----`)
const borangData = [
  { id: BR[0], kodBorang: 'B001', nama: 'Borang Permohonan Cuti Rehat', kategori: 'Sumber Manusia', format: 'PDF', kekerapan: 'Kerap', penerangan: 'Borang rasmi permohonan cuti rehat kakitangan.', failUrl: '/forms/borang-cuti.pdf', saizFail: '120 KB' },
  { id: BR[1], kodBorang: 'B002', nama: 'Borang Tuntutan Perjalanan & Elaun', kategori: 'Kewangan', format: 'Excel', kekerapan: 'Bulanan', penerangan: 'Borang tuntutan elaun perjalanan rasmi.', failUrl: '/forms/borang-tuntutan.xlsx', saizFail: '85 KB' },
  { id: BR[2], kodBorang: 'B003', nama: 'Templat Minit Mesyuarat', kategori: 'Pentadbiran', format: 'Word', kekerapan: 'Mingguan', penerangan: 'Templat standard minit mesyuarat jabatan.', failUrl: '/forms/templat-minit.docx', saizFail: '45 KB' },
  { id: BR[3], kodBorang: 'B004', nama: 'Borang Serah Terima Aset', kategori: 'Pengurusan Aset', format: 'PDF', kekerapan: 'Situasional', penerangan: 'Borang serah terima aset alih jabatan.', failUrl: '/forms/borang-serah-terima.pdf', saizFail: '95 KB' },
  { id: BR[4], kodBorang: 'B005', nama: 'Borang Aduan/Maklum Balas Pelanggan', kategori: 'Perkhidmatan Pelanggan', format: 'PDF', kekerapan: 'Kerap', penerangan: 'Borang aduan dan maklum balas pelanggan.', failUrl: '/forms/borang-aduan.pdf', saizFail: '110 KB' },
  { id: BR[5], kodBorang: 'B006', nama: 'Senarai Semak Fail Meja Jawatan', kategori: 'Pentadbiran', format: 'Excel', kekerapan: 'Bulanan', penerangan: 'Senarai semak penyediaan fail meja jawatan.', failUrl: '/forms/senarai-semak-fail-meja.xlsx', saizFail: '60 KB' },
  { id: BR[6], kodBorang: 'B007', nama: 'Templat Kertas Kerja/Kertas Cadangan', kategori: 'Pentadbiran', format: 'Word', kekerapan: 'Situasional', penerangan: 'Templat kertas kerja dan kertas cadangan projek.', failUrl: '/forms/templat-kertas-kerja.docx', saizFail: '55 KB' },
  { id: BR[7], kodBorang: 'B008', nama: 'Borang Permohonan Capaian Sistem ICT', kategori: 'ICT', format: 'PDF', kekerapan: 'Situasional', penerangan: 'Borang permohonan capaian sistem ICT jabatan.', failUrl: '/forms/borang-capaian-ict.pdf', saizFail: '90 KB' },
]
for (const b of borangData) {
  lines.push(`INSERT INTO "borang" ("id","kodBorang","nama","kategori","format","kekerapan","penerangan","failUrl","saizFail","versi","status","tarikhKemasKini","createdAt","updatedAt") VALUES (`)
  lines.push(`  ${E(b.id)}, ${E(b.kodBorang)}, ${E(b.nama)}, ${E(b.kategori)}, ${E(b.format)}, ${E(b.kekerapan)}, ${E(b.penerangan)},`)
  lines.push(`  ${E(b.failUrl)}, ${E(b.saizFail)}, '1.0', 'Aktif', NOW(), NOW(), NOW())`)
  lines.push(`  ON CONFLICT ("kodBorang") DO NOTHING;`)
}
lines.push(``)

// ---- RUJUKAN ----
lines.push(`-- ---- Rujukan (8 references) ----`)
const rujukanData = [
  { id: RJ[0], kodRujukan: 'R001', tajuk: 'Peraturan-Peraturan Pegawai Awam (Kelakuan dan Tatatertib) 1993', kategori: 'Peraturan Am', penerangan: 'Peraturan berkaitan kelakuan dan tatatertib pegawai awam.', pautanLuaran: 'https://www.jpa.gov.my', status: 'Aktif', versi: 'Pindaan 2022', tarikhKuatKuasa: '1993-01-01' },
  { id: RJ[1], kodRujukan: 'R002', tajuk: 'Pekeliling Perkhidmatan - Cuti Rehat', kategori: 'Pekeliling Perkhidmatan', penerangan: 'Pekeliling berkaitan pengurusan cuti rehat pegawai.', pautanLuaran: 'https://www.jpa.gov.my/pekeliling', status: 'Aktif', versi: '2024', tarikhKuatKuasa: '2024-01-15' },
  { id: RJ[2], kodRujukan: 'R003', tajuk: 'Pekeliling Kemajuan Pentadbiran Awam (PKPA) - Kualiti Perkhidmatan', kategori: 'PKPA', penerangan: 'PKPA berkaitan kualiti dan sistem penyampaian perkhidmatan awam.', pautanLuaran: 'https://www.mampu.gov.my', status: 'Aktif', versi: '2023', tarikhKuatKuasa: '2023-06-01' },
  { id: RJ[3], kodRujukan: 'R004', tajuk: 'Arahan Perbendaharaan - Tatacara Pengurusan Kewangan', kategori: 'Arahan Perbendaharaan', penerangan: 'Tatacara pengurusan kewangan kerajaan.', pautanLuaran: 'https://www.treasury.gov.my', status: 'Aktif', versi: 'Pindaan 2024', tarikhKuatKuasa: '2024-01-01' },
  { id: RJ[4], kodRujukan: 'R005', tajuk: 'Tatacara Pengurusan Aset Alih Kerajaan (TPA)', kategori: 'Arahan Perbendaharaan', penerangan: 'Tatacara pengurusan aset alih kerajaan.', pautanLuaran: 'https://www.treasury.gov.my/tpa', status: 'Aktif', versi: 'Pindaan 2022', tarikhKuatKuasa: '2022-03-01' },
  { id: RJ[5], kodRujukan: 'R006', tajuk: 'SOP Pengurusan Surat Rasmi Jabatan', kategori: 'SOP Dalaman', penerangan: 'SOP dalaman pengurusan surat rasmi jabatan.', pautanLuaran: null, status: 'Aktif', versi: '1.0', tarikhKuatKuasa: '2024-01-01' },
  { id: RJ[6], kodRujukan: 'R007', tajuk: 'Piagam Pelanggan Jabatan', kategori: 'Piagam Pelanggan', penerangan: 'Piagam pelanggan rasmi jabatan.', pautanLuaran: null, status: 'Aktif', versi: '2024', tarikhKuatKuasa: '2024-02-01' },
  { id: RJ[7], kodRujukan: 'R008', tajuk: 'Pekeliling Perkhidmatan - Elaun & Kemudahan', kategori: 'Pekeliling Perkhidmatan', penerangan: 'Pekeliling berkaitan elaun dan kemudahan pegawai.', pautanLuaran: 'https://www.jpa.gov.my/pekeliling', status: 'Digantikan', versi: '2019', tarikhKuatKuasa: '2019-01-01' },
]
for (const r of rujukanData) {
  lines.push(`INSERT INTO "rujukan" ("id","kodRujukan","tajuk","kategori","penerangan","pautanLuaran","status","versi","tarikhKuatKuasa","createdAt","updatedAt") VALUES (`)
  lines.push(`  ${E(r.id)}, ${E(r.kodRujukan)}, ${E(r.tajuk)}, ${E(r.kategori)}, ${E(r.penerangan)},`)
  lines.push(`  ${E(r.pautanLuaran)}, ${E(r.status)}, ${E(r.versi)}, ${E(r.tarikhKuatKuasa)}, NOW(), NOW())`)
  lines.push(`  ON CONFLICT ("kodRujukan") DO NOTHING;`)
}
lines.push(``)

// ---- DONE ----
lines.push(`-- ============================================================`)
lines.push(`-- Setup complete!`)
lines.push(`-- ============================================================`)
lines.push(`-- Summary:`)
lines.push(`--   8 tables created (jawatan, carta_alir, prosedur_kerja, checklist, checklist_log, borang, rujukan, pengguna)`)
lines.push(`--   6 unique indexes created`)
lines.push(`--   4 jawatan, 3 carta alir, 4 prosedur, 4 checklist, 8 borang, 8 rujukan, 4 pengguna`)
lines.push(`--   `)
lines.push(`--   Demo login credentials:`)
lines.push(`--     Admin   : faizal@agensi.gov.my / admin123`)
lines.push(`--     Penyelia : aishah@agensi.gov.my / penyelia123`)
lines.push(`--     Pengguna : hafiz@agensi.gov.my / pengguna123`)
lines.push(`--     Pengguna : nurul@agensi.gov.my / pengguna123`)
lines.push(`-- ============================================================`)

const sql = lines.join('\n')
writeFileSync('/home/z/my-project/supabase-setup.sql', sql)
console.log(`✅ Generated supabase-setup.sql (${lines.length} lines, ${sql.length} chars)`)
console.log(`   Tables: 8 | Indexes: 6`)
console.log(`   Data: 4 jawatan, 3 carta alir, 4 prosedur, 4 checklist, 8 borang, 8 rujukan, 4 pengguna`)
