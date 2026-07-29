// Sistem MyPortfolio - Seed Script
// Populates dummy database with realistic Malaysian government portfolio data per PRD

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Explicitly load .env so DATABASE_URL is available when running this script directly
config()

const db = new PrismaClient()

const J = (v: unknown) => JSON.stringify(v)

async function main() {
  console.log('🌱 Seeding Sistem MyPortfolio dummy database...')

  // Clean
  await db.checklistLog.deleteMany()
  await db.checklist.deleteMany()
  await db.borang.deleteMany()
  await db.rujukan.deleteMany()
  await db.prosedurKerja.deleteMany()
  await db.cartaAlir.deleteMany()
  await db.jawatan.deleteMany()
  await db.pengguna.deleteMany()

  // ============ PENGGUNA (Users) ============
  const users = [
    { nama: 'Ahmad Faizal bin Rahman', emel: 'faizal@agensi.gov.my', kataLaluan: 'admin123', peranan: 'Admin', unit: 'Unit ICT' },
    { nama: 'Siti Aishah binti Hassan', emel: 'aishah@agensi.gov.my', kataLaluan: 'penyelia123', peranan: 'Penyelia', unit: 'Unit Pentadbiran' },
    { nama: 'Mohd Hafiz bin Ibrahim', emel: 'hafiz@agensi.gov.my', kataLaluan: 'pengguna123', peranan: 'Pengguna', unit: 'Unit Pentadbiran' },
    { nama: 'Nurul Ain binti Yusof', emel: 'nurul@agensi.gov.my', kataLaluan: 'pengguna123', peranan: 'Pengguna', unit: 'Unit Kewangan' },
  ]
  for (const u of users) {
    await db.pengguna.create({ data: u })
  }

  // ============ JAWATAN (Positions) ============
  const jawatanList = [
    {
      kodJawatan: 'JT001',
      namaJawatan: 'Pegawai Tadbir',
      gred: 'N41',
      jabatan: 'Jabatan Pentadbiran',
      bahagian: 'Bahagian Pengurusan',
      unit: 'Unit Pentadbiran',
      penyelia: 'Siti Aishah binti Hassan (Ketua Unit Pentadbiran)',
      objektifAm: 'Memastikan kelancaran operasi pentadbiran am jabatan termasuk pengurusan surat-menyurat, fail rekod, mesyuarat, aset dan perkhidmatan pelanggan mengikut piawaian yang ditetapkan.',
      skopTugas: J([
        { kra: 'Pengurusan Pentadbiran Am', tugas: ['Menguruskan surat-menyurat masuk/keluar', 'Menyenggara fail rekod dan inventori pejabat', 'Menguruskan daftar surat masuk/keluar'] },
        { kra: 'Pengurusan Mesyuarat', tugas: ['Menyediakan minit mesyuarat', 'Menyediakan agenda mesyuarat', 'Susulan tindakan (action tracking)'] },
        { kra: 'Pengurusan Aset & Stor', tugas: ['Merekod aset alih jabatan', 'Menyelenggara inventori aset', 'Melapor status aset mengikut TPA'] },
        { kra: 'Perkhidmatan Pelanggan', tugas: ['Mengendali aduan pelanggan', 'Mengendali pertanyaan dalaman/luaran', 'Mematuhi Piagam Pelanggan'] },
      ]),
      tanggungjawab: J([
        'Pengurusan aset pejabat dan inventori',
        'Pengurusan fail rasmi dan rekod',
        'Urusan surat-menyurat rasmi jabatan',
        'Penyediaan minit dan dokumentasi mesyuarat',
      ]),
      hubunganKerja: J({
        dalaman: ['Ketua Unit Pentadbiran', 'Pegawai Kewangan', 'Unit ICT', 'Semua kakitangan jabatan'],
        luaran: ['Pembekal dan vendor', 'Pelanggan awam', 'Jabatan kerajaan lain'],
      }),
      autoriti: J({
        hadKuasa: 'Pelulus tuntutan sehingga RM5,000',
        melulus: ['Permohonan alat tulis pejabat', 'Tuntutan perjalanan kecil'],
      }),
      kpi: J([
        { kpi: 'Masa tindak balas surat rasmi', sasaran: '< 3 hari bekerja' },
        { kpi: 'Ketepatan rekod fail', sasaran: '100%' },
        { kpi: 'Kepatuhan checklist harian', sasaran: '> 85%' },
      ]),
      qrCodeUrl: '/jawatan/JT001',
    },
    {
      kodJawatan: 'JT002',
      namaJawatan: 'Pegawai Kewangan',
      gred: 'N44',
      jabatan: 'Jabatan Kewangan',
      bahagian: 'Bahagian Akaun',
      unit: 'Unit Akaun',
      penyelia: 'Tn. Hj. Razak bin Osman (Ketua Penolong Pengarah Kewangan)',
      objektifAm: 'Memastikan pengurusan kewangan, perakaunan dan pembayaran jabatan dilaksanakan mengikut Arahan Perbendaharaan dan tatacara kewangan kerajaan yang berkuat kuasa.',
      skopTugas: J([
        { kra: 'Pengurusan Pembayaran', tugas: ['Memproses tuntutan pembayaran', 'Menyemak voucher bayaran', 'Mengeluarkan arahan bayaran'] },
        { kra: 'Pengurusan Akaun', tugas: ['Menyediakan penyata akaun bulanan', 'Penutupan akaun akhir tahun', 'Audit dalaman akaun'] },
        { kra: 'Tuntutan & Elaun', tugas: ['Memproses tuntutan perjalanan', 'Memproses elaun kakitangan', 'Semakan dokumen sokongan'] },
      ]),
      tanggungjawab: J([
        'Pengurusan akaun perbelanjaan bulanan',
        'Penyediaan laporan kewangan',
        'Semakan dan pengesahan tuntutan',
      ]),
      hubunganKerja: J({
        dalaman: ['Ketua Penolong Pengarah Kewangan', 'Pegawai Tadbir', 'Jabatan Audit'],
        luaran: ['Arahan Perbendaharaan Malaysia', 'Bank Negara', 'Jabatan Audit Negara'],
      }),
      autoriti: J({
        hadKuasa: 'Pelulus bayaran sehingga RM50,000',
        melulus: ['Tuntutan perbelanjaan operasi', 'Bayaran pembekal'],
      }),
      kpi: J([
        { kpi: 'Masa pemprosesan bayaran', sasaran: '< 5 hari bekerja' },
        { kpi: 'Ketepatan penyata akaun', sasaran: '100%' },
      ]),
      qrCodeUrl: '/jawatan/JT002',
    },
    {
      kodJawatan: 'JT003',
      namaJawatan: 'Setiausaha Pejabat',
      gred: 'N27',
      jabatan: 'Jabatan Pentadbiran',
      bahagian: 'Bahagian Pengurusan',
      unit: 'Unit Sokongan',
      penyelia: 'Siti Aishah binti Hassan (Ketua Unit Pentadbiran)',
      objektifAm: 'Menyediakan sokongan pentadbiran dan setiausaha kepada pejabat ketua jabatan bagi memastikan kelancaran urusan harian dan mesyuarat.',
      skopTugas: J([
        { kra: 'Sokongan Pentadbiran', tugas: ['Mengurus jadual ketua jabatan', 'Menerima dan mengagihkan panggilan', 'Menyusun dokumen rasmi'] },
        { kra: 'Setiausaha Mesyuarat', tugas: ['Menyediakan notis mesyuarat', 'Mencatat minit mesyuarat', 'Susulan tindakan mesyuarat'] },
        { kra: 'Pengurusan Fail', tugas: ['Menyenggara fail sulit', 'Mengemas kini fail meja', 'Pengarkiban dokumen'] },
      ]),
      tanggungjawab: J([
        'Pengurusan jadual dan temujanji ketua jabatan',
        'Penyediaan minit mesyuarat',
        'Pengurusan fail sulit dan rasmi',
      ]),
      hubunganKerja: J({
        dalaman: ['Ketua Jabatan', 'Pegawai Tadbir', 'Semua unit'],
        luaran: ['Setiausaha jabatan lain', 'Pegawai kerajaan lain'],
      }),
      autoriti: J({
        hadKuasa: 'Akses dokumen sulit tahap tertentu',
        melulus: [],
      }),
      kpi: J([
        { kpi: 'Ketepatan masa mesyuarat', sasaran: '> 95%' },
        { kpi: 'Masa siap minit mesyuarat', sasaran: '< 3 hari bekerja' },
      ]),
      qrCodeUrl: '/jawatan/JT003',
    },
    {
      kodJawatan: 'JT004',
      namaJawatan: 'Pegawai Aset',
      gred: 'N36',
      jabatan: 'Jabatan Pentadbiran',
      bahagian: 'Bahagian Pengurusan',
      unit: 'Unit Aset',
      penyelia: 'Siti Aishah binti Hassan (Ketua Unit Pentadbiran)',
      objektifAm: 'Mengurus dan menyelenggara aset alih kerajaan jabatan mengikut Tatacara Pengurusan Aset Alih Kerajaan (TPA) bagi memastikan rekod dan inventori aset sentiasa kemas kini dan boleh dijejaki.',
      skopTugas: J([
        { kra: 'Pendaftaran Aset', tugas: ['Mendaftar aset baharu', 'Mengeluarkan tag aset', 'Mengemas kini daftar aset'] },
        { kra: 'Pemindahan & Pelupusan', tugas: ['Memproses pemindahan aset', 'Penilaian pelupusan', 'Serah terima aset'] },
        { kra: 'Audit & Inventori', tugas: ['Pemeriksaan fizikal tahunan', 'Laporan inventori', 'Semakan rekod aset'] },
      ]),
      tanggungjawab: J([
        'Pengurusan aset alih jabatan',
        'Pengurusan stor pejabat',
        'Pemeliharaan inventori',
      ]),
      hubunganKerja: J({
        dalaman: ['Ketua Unit Pentadbiran', 'Pegawai Kewangan', 'Semua pegawai'],
        luaran: ['Jabatan Kastam', 'Pembekal aset', 'Syarikat pelupusan'],
      }),
      autoriti: J({
        hadKuasa: 'Pelulus pengeluaran aset di bawah RM10,000',
        melulus: ['Permintaan alat tulis', 'Pengeluaran aset stor'],
      }),
      kpi: J([
        { kpi: 'Ketepatan rekod inventori', sasaran: '> 98%' },
        { kpi: 'Masa pemeriksaan fizikal', sasaran: 'Tahunan 100%' },
      ]),
      qrCodeUrl: '/jawatan/JT004',
    },
  ]
  for (const j of jawatanList) {
    await db.jawatan.create({ data: j })
  }

  // ============ CARTA ALIR (Flowcharts) ============
  const cartaAlirList = [
    {
      kodCarta: 'CA001',
      tajuk: 'Proses Pengurusan Surat Masuk',
      kategori: 'Pentadbiran',
      jawatanId: (await db.jawatan.findUnique({ where: { kodJawatan: 'JT001' } }))!.id,
      penerangan: 'Carta alir ringkas proses penerimaan, pendaftaran dan pengagihan surat rasmi masuk di jabatan.',
      nod: J([
        { id: 'n1', label: 'MULA\nSurat diterima di kaunter', jenis: 'mula', penerangan: 'Surat/dokumen diterima di kaunter URUS SETIA.' },
        { id: 'n2', label: 'Rekod dalam Buku Daftar Surat Masuk / e-Surat', jenis: 'proses', penerangan: 'Surat direkod dalam Buku Daftar Surat Masuk atau Sistem e-Surat.' },
        { id: 'n3', label: 'Serah kepada Ketua Jabatan', jenis: 'proses', penerangan: 'Surat diserahkan kepada Ketua Jabatan untuk arahan/minit.' },
        { id: 'n4', label: 'Arahan minit?', jenis: 'keputusan', penerangan: 'Ketua Jabatan beri arahan minit kepada unit berkaitan.' },
        { id: 'n5', label: 'Agih kepada Pegawai/Unit', jenis: 'proses', penerangan: 'Surat diagihkan kepada Pegawai/Unit berkaitan mengikut minit arahan.' },
        { id: 'n6', label: 'Pegawai bertindak (3 hari bekerja)', jenis: 'proses', penerangan: 'Pegawai bertindak mengikut tempoh masa yang ditetapkan.' },
        { id: 'n7', label: 'Rekod tindakan & difailkan', jenis: 'proses', penerangan: 'Tindakan/maklum balas direkodkan dan difailkan.' },
        { id: 'n8', label: 'TAMAT\nStatus dikemas kini', jenis: 'tamat', penerangan: 'Status tindakan dikemas kini dalam sistem.' },
      ]),
      sambungan: J([
        { from: 'n1', to: 'n2' },
        { from: 'n2', to: 'n3' },
        { from: 'n3', to: 'n4' },
        { from: 'n4', to: 'n5', label: 'Ya' },
        { from: 'n5', to: 'n6' },
        { from: 'n6', to: 'n7' },
        { from: 'n7', to: 'n8' },
      ]),
    },
    {
      kodCarta: 'CA002',
      tajuk: 'Proses Permohonan Cuti Rehat',
      kategori: 'Sumber Manusia',
      jawatanId: (await db.jawatan.findUnique({ where: { kodJawatan: 'JT001' } }))!.id,
      penerangan: 'Carta alir proses permohonan cuti rehat kakitangan jabatan.',
      nod: J([
        { id: 'n1', label: 'MULA\nPegawai isi borang cuti', jenis: 'mula', penerangan: 'Pegawai mengisi permohonan cuti sekurang-kurangnya 3 hari bekerja sebelum tarikh cuti.' },
        { id: 'n2', label: 'Hantar kepada Penyelia', jenis: 'proses', penerangan: 'Sistem/borang dihantar kepada Penyelia untuk kelulusan.' },
        { id: 'n3', label: 'Semakan baki cuti & keperluan operasi', jenis: 'keputusan', penerangan: 'Penyelia menyemak baki cuti dan keperluan operasi.' },
        { id: 'n4', label: 'Lulus', jenis: 'proses', penerangan: 'Permohonan diluluskan.' },
        { id: 'n5', label: 'Tolak', jenis: 'proses', penerangan: 'Permohonan ditolak dengan alasan.' },
        { id: 'n6', label: 'Rekod cuti dikemas kini', jenis: 'proses', penerangan: 'Rekod cuti dikemas kini dalam sistem pengurusan cuti/HRMIS.' },
        { id: 'n7', label: 'TAMAT\nMaklum balas kepada pemohon', jenis: 'tamat', penerangan: 'Status kelulusan dimaklumkan kepada pemohon.' },
      ]),
      sambungan: J([
        { from: 'n1', to: 'n2' },
        { from: 'n2', to: 'n3' },
        { from: 'n3', to: 'n4', label: 'Lulus' },
        { from: 'n3', to: 'n5', label: 'Tolak' },
        { from: 'n4', to: 'n6' },
        { from: 'n6', to: 'n7' },
        { from: 'n5', to: 'n7' },
      ]),
    },
    {
      kodCarta: 'CA003',
      tajuk: 'Proses Tuntutan Perbelanjaan',
      kategori: 'Kewangan',
      jawatanId: (await db.jawatan.findUnique({ where: { kodJawatan: 'JT002' } }))!.id,
      penerangan: 'Carta alir proses tuntutan perbelanjaan dan elaun kakitangan.',
      nod: J([
        { id: 'n1', label: 'MULA\nPegawai hantar tuntutan', jenis: 'mula', penerangan: 'Pegawai menghantar borang tuntutan dengan dokumen sokongan.' },
        { id: 'n2', label: 'Semakan dokumen', jenis: 'proses', penerangan: 'Pegawai Kewangan menyemak dokumen sokongan.' },
        { id: 'n3', label: 'Dokumen lengkap?', jenis: 'keputusan', penerangan: 'Semakan sama ada dokumen lengkap.' },
        { id: 'n4', label: 'Pulangkan untuk semakan semula', jenis: 'proses', penerangan: 'Dokumen tidak lengkap dikembalikan.' },
        { id: 'n5', label: 'Pengesahan & pengiraan', jenis: 'proses', penerangan: 'Pegawai Kewangan mengira dan mengesahkan jumlah.' },
        { id: 'n6', label: 'Kelulusan Ketua Kewangan', jenis: 'proses', penerangan: 'Tuntutan diluluskan oleh Ketua Kewangan.' },
        { id: 'n7', label: 'TAMAT\nBayaran diproses', jenis: 'tamat', penerangan: 'Arahan bayaran dikeluarkan.' },
      ]),
      sambungan: J([
        { from: 'n1', to: 'n2' },
        { from: 'n2', to: 'n3' },
        { from: 'n3', to: 'n4', label: 'Tidak' },
        { from: 'n3', to: 'n5', label: 'Ya' },
        { from: 'n4', to: 'n1' },
        { from: 'n5', to: 'n6' },
        { from: 'n6', to: 'n7' },
      ]),
    },
  ]
  for (const c of cartaAlirList) {
    await db.cartaAlir.create({ data: c })
  }

  // ============ PROSEDUR KERJA (SOPs) ============
  const prosedurList = [
    {
      kodProsedur: 'MPK/UP/001',
      tajuk: 'Prosedur Pengurusan Surat Masuk',
      tujuan: 'Memastikan setiap surat rasmi masuk direkod, diagih dan ditindak dengan tepat dan dalam tempoh masa yang ditetapkan.',
      skop: 'Unit Pentadbiran dan semua pegawai yang menerima minit arahan surat.',
      tanggungjawab: J([
        { jawatan: 'Pegawai Tadbir', peranan: 'Mendaftar dan mengagih surat' },
        { jawatan: 'Ketua Jabatan', peranan: 'Berikan minit arahan' },
        { jawatan: 'Pegawai Bertindak', peranan: 'Melaksana tindakan surat' },
      ]),
      langkahKerja: J([
        { no: 1, tindakan: 'Surat diterima di kaunter URUS SETIA', tanggungjawab: 'Pegawai Tadbir', tempohMasa: 'Sama hari' },
        { no: 2, tindakan: 'Surat direkod dalam Buku Daftar Surat Masuk / e-Surat', tanggungjawab: 'Pegawai Tadbir', tempohMasa: 'Sama hari' },
        { no: 3, tindakan: 'Surat diserahkan kepada Ketua Jabatan untuk arahan/minit', tanggungjawab: 'Pegawai Tadbir', tempohMasa: '1 hari bekerja' },
        { no: 4, tindakan: 'Surat diagihkan kepada Pegawai/Unit berkaitan', tanggungjawab: 'Ketua Jabatan', tempohMasa: '1 hari bekerja' },
        { no: 5, tindakan: 'Pegawai bertindak mengikut tempoh yang ditetapkan', tanggungjawab: 'Pegawai Bertindak', tempohMasa: '3 hari bekerja' },
        { no: 6, tindakan: 'Tindakan/maklum balas direkod dan difailkan', tanggungjawab: 'Pegawai Bertindak', tempohMasa: '1 hari bekerja selepas tindakan' },
        { no: 7, tindakan: 'Status tindakan dikemas kini dalam sistem', tanggungjawab: 'Pegawai Tadbir', tempohMasa: 'Sama hari' },
      ]),
      borangBerkaitan: J([]),
      rujukanPeraturan: J([]),
      tarikhKuatKuasa: new Date('2024-01-01'),
      tarikhSemakan: new Date('2026-01-01'),
      versi: '2.0',
      status: 'Aktif',
      sejarahSemakan: J([
        { versi: '1.0', tarikh: '2022-01-01', perubahan: 'Pindaan awal prosedur' },
        { versi: '2.0', tarikh: '2024-01-01', perubahan: 'Penambahan langkah e-Surat dan tempoh masa standard' },
      ]),
    },
    {
      kodProsedur: 'MPK/UP/002',
      tajuk: 'Prosedur Permohonan Cuti Rehat',
      tujuan: 'Memastikan permohonan cuti rehat diproses secara telus dan terkini mengikut pekeliling perkhidmatan.',
      skop: 'Semua kakitangan jabatan.',
      tanggungjawab: J([
        { jawatan: 'Pegawai', peranan: 'Memohon cuti' },
        { jawatan: 'Penyelia', peranan: 'Meluluskan/menolak permohonan' },
        { jawatan: 'Pegawai HR', peranan: 'Kemas kini rekod cuti' },
      ]),
      langkahKerja: J([
        { no: 1, tindakan: 'Pegawai mengisi permohonan cuti sekurang-kurangnya 3 hari bekerja sebelum tarikh cuti', tanggungjawab: 'Pegawai', tempohMasa: '3 hari bekerja sebelum cuti' },
        { no: 2, tindakan: 'Sistem/borang dihantar kepada Penyelia', tanggungjawab: 'Sistem', tempohMasa: 'Auto' },
        { no: 3, tindakan: 'Penyelia semak baki cuti & keperluan operasi', tanggungjawab: 'Penyelia', tempohMasa: '1 hari bekerja' },
        { no: 4, tindakan: 'Status kelulusan dimaklumkan kepada pemohon', tanggungjawab: 'Sistem', tempohMasa: 'Auto selepas keputusan' },
        { no: 5, tindakan: 'Rekod cuti dikemas kini dalam HRMIS', tanggungjawab: 'Pegawai HR', tempohMasa: '1 hari bekerja' },
      ]),
      borangBerkaitan: J([]),
      rujukanPeraturan: J([]),
      tarikhKuatKuasa: new Date('2023-06-01'),
      tarikhSemakan: new Date('2026-06-01'),
      versi: '1.5',
      status: 'Aktif',
      sejarahSemakan: J([
        { versi: '1.0', tarikh: '2020-01-01', perubahan: 'Versi awal prosedur cuti' },
        { versi: '1.5', tarikh: '2023-06-01', perubahan: 'Penambahbaikan tempoh dan notifikasi sistem' },
      ]),
    },
    {
      kodProsedur: 'MPK/UK/003',
      tajuk: 'Prosedur Tuntutan Perbelanjaan & Elaun',
      tujuan: 'Memastikan tuntutan perbelanjaan dan elaun diproses mengikut Arahan Perbendaharaan dan dokumen sokongan yang lengkap.',
      skop: 'Semua kakitangan yang membuat tuntutan perbelanjaan.',
      tanggungjawab: J([
        { jawatan: 'Pegawai', peranan: 'Menghantar tuntutan' },
        { jawatan: 'Pegawai Kewangan', peranan: 'Semak dan sahkan' },
        { jawatan: 'Ketua Kewangan', peranan: 'Lulus bayaran' },
      ]),
      langkahKerja: J([
        { no: 1, tindakan: 'Pegawai mengisi borang tuntutan dan lampirkan dokumen sokongan', tanggungjawab: 'Pegawai', tempohMasa: 'Selepas urusan' },
        { no: 2, tindakan: 'Pegawai Kewangan menyemak dokumen', tanggungjawab: 'Pegawai Kewangan', tempohMasa: '2 hari bekerja' },
        { no: 3, tindakan: 'Pengesahan dan pengiraan jumlah', tanggungjawab: 'Pegawai Kewangan', tempohMasa: '1 hari bekerja' },
        { no: 4, tindakan: 'Kelulusan Ketua Kewangan', tanggungjawab: 'Ketua Kewangan', tempohMasa: '2 hari bekerja' },
        { no: 5, tindakan: 'Arahan bayaran dikeluarkan', tanggungjawab: 'Pegawai Kewangan', tempohMasa: '2 hari bekerja' },
      ]),
      borangBerkaitan: J([]),
      rujukanPeraturan: J([]),
      tarikhKuatKuasa: new Date('2024-03-01'),
      tarikhSemakan: new Date('2026-03-01'),
      versi: '3.0',
      status: 'Dikemas Kini',
      sejarahSemakan: J([
        { versi: '1.0', tarikh: '2019-01-01', perubahan: 'Versi awal' },
        { versi: '2.0', tarikh: '2021-06-01', perubahan: 'Penambahan dokumen sokongan wajib' },
        { versi: '3.0', tarikh: '2024-03-01', perubahan: 'Selaraskan dengan Arahan Perbendaharaan terkini' },
      ]),
    },
    {
      kodProsedur: 'MPK/UA/004',
      tajuk: 'Prosedur Pemindahan & Pelupusan Aset Alih',
      tujuan: 'Memastikan pemindahan dan pelupusan aset alih kerajaan dilakukan mengikut Tatacara Pengurusan Aset Alih (TPA).',
      skop: 'Unit Aset dan pegawai yang terlibat dengan pemindahan/pelupusan aset.',
      tanggungjawab: J([
        { jawatan: 'Pegawai Aset', peranan: 'Proses pemindahan/pelupusan' },
        { jawatan: 'Ketua Unit', peranan: 'Sahkan' },
        { jawatan: 'Lembaga Pemeriksa', peranan: 'Penilaian pelupusan' },
      ]),
      langkahKerja: J([
        { no: 1, tindakan: 'Pegawai Aset terima permohonan pemindahan/pelupusan', tanggungjawab: 'Pegawai Aset', tempohMasa: 'Sama hari' },
        { no: 2, tindakan: 'Pemeriksaan fizikal aset', tanggungjawab: 'Pegawai Aset', tempohMasa: '3 hari bekerja' },
        { no: 3, tindakan: 'Lembaga Pemeriksa nilai dan sahkan', tanggungjawab: 'Lembaga Pemeriksa', tempohMasa: '7 hari bekerja' },
        { no: 4, tindakan: 'Kemas kini rekod daftar aset', tanggungjawab: 'Pegawai Aset', tempohMasa: '2 hari bekerja' },
        { no: 5, tindakan: 'Serah terima / pelupusan dilaksana', tanggungjawab: 'Pegawai Aset', tempohMasa: 'Mengikut jadual' },
      ]),
      borangBerkaitan: J([]),
      rujukanPeraturan: J([]),
      tarikhKuatKuasa: new Date('2023-01-01'),
      tarikhSemakan: new Date('2026-01-01'),
      versi: '2.1',
      status: 'Aktif',
      sejarahSemakan: J([
        { versi: '1.0', tarikh: '2018-01-01', perubahan: 'Versi awal' },
        { versi: '2.0', tarikh: '2021-01-01', perubahan: 'Penambahbaikan lembaga pemeriksa' },
        { versi: '2.1', tarikh: '2023-01-01', perubahan: 'Selaraskan dengan Pindaan TPA 2022' },
      ]),
    },
  ]
  for (const p of prosedurList) {
    await db.prosedurKerja.create({ data: p })
  }

  // ============ CHECKLIST ============
  const checklistList = [
    {
      tajuk: 'Checklist Tugasan Harian - Unit Pentadbiran',
      kekerapan: 'Harian',
      jawatanId: (await db.jawatan.findUnique({ where: { kodJawatan: 'JT001' } }))!.id,
      unit: 'Unit Pentadbiran',
      items: J([
        { id: 'h1', bil: 1, tugasan: 'Semak dan balas e-mel rasmi jabatan', tanggungjawab: 'Semua Pegawai', status: 'Belum Selesai', catatan: '' },
        { id: 'h2', bil: 2, tugasan: 'Kemas kini daftar surat masuk/keluar', tanggungjawab: 'Pegawai Tadbir', status: 'Belum Selesai', catatan: '' },
        { id: 'h3', bil: 3, tugasan: 'Semak jadual/agenda mesyuarat hari ini', tanggungjawab: 'Setiausaha/PA', status: 'Selesai', catatan: 'Mesyuarat 10:00 pagi' },
        { id: 'h4', bil: 4, tugasan: 'Kemas kini status tugasan dalam MyPortfolio', tanggungjawab: 'Semua Pegawai', status: 'Belum Selesai', catatan: '' },
      ]),
      tarikhMula: new Date(),
    },
    {
      tajuk: 'Checklist Tugasan Harian - Unit Kewangan',
      kekerapan: 'Harian',
      jawatanId: (await db.jawatan.findUnique({ where: { kodJawatan: 'JT002' } }))!.id,
      unit: 'Unit Kewangan',
      items: J([
        { id: 'h1', bil: 1, tugasan: 'Semak e-mel tuntutan baru', tanggungjawab: 'Pegawai Kewangan', status: 'Selesai', catatan: '' },
        { id: 'h2', bil: 2, tugasan: 'Proses voucher bayaran hari ini', tanggungjawab: 'Pegawai Kewangan', status: 'Belum Selesai', catatan: '' },
        { id: 'h3', bil: 3, tugasan: 'Kemas kini penyata akaun harian', tanggungjawab: 'Pegawai Kewangan', status: 'Belum Selesai', catatan: '' },
      ]),
      tarikhMula: new Date(),
    },
    {
      tajuk: 'Checklist Tugasan Mingguan - Unit Pentadbiran',
      kekerapan: 'Mingguan',
      jawatanId: (await db.jawatan.findUnique({ where: { kodJawatan: 'JT001' } }))!.id,
      unit: 'Unit Pentadbiran',
      items: J([
        { id: 'm1', bil: 1, tugasan: 'Mesyuarat penyelarasan mingguan unit/bahagian', tanggungjawab: 'Ketua Unit', status: 'Belum Selesai', catatan: 'Setiap Isnin' },
        { id: 'm2', bil: 2, tugasan: 'Kemas kini laporan prestasi mingguan', tanggungjawab: 'Semua Pegawai', status: 'Belum Selesai', catatan: '' },
        { id: 'm3', bil: 3, tugasan: 'Semakan stok/inventori pejabat', tanggungjawab: 'Pegawai Aset', status: 'Selesai', catatan: 'Selesai Khamis' },
      ]),
      tarikhMula: new Date(),
    },
    {
      tajuk: 'Checklist Tugasan Bulanan - Jabatan',
      kekerapan: 'Bulanan',
      jawatanId: null,
      unit: 'Jabatan Pentadbiran',
      items: J([
        { id: 'b1', bil: 1, tugasan: 'Penyediaan laporan prestasi bulanan jabatan', tanggungjawab: 'Ketua Jabatan', status: 'Belum Selesai', catatan: '' },
        { id: 'b2', bil: 2, tugasan: 'Tuntutan perjalanan & elaun bulanan', tanggungjawab: 'Semua Pegawai', status: 'Belum Selesai', catatan: '' },
        { id: 'b3', bil: 3, tugasan: 'Penyelarasan & pengesahan kehadiran/cuti', tanggungjawab: 'Pegawai HR', status: 'Selesai', catatan: '' },
        { id: 'b4', bil: 4, tugasan: 'Semakan dan penutupan akaun perbelanjaan bulanan', tanggungjawab: 'Pegawai Kewangan', status: 'Belum Selesai', catatan: '' },
      ]),
      tarikhMula: new Date(),
    },
  ]
  for (const c of checklistList) {
    await db.checklist.create({ data: c })
  }

  // ============ BORANG (Forms/Documents) ============
  const borangList = [
    { kodBorang: 'B001', nama: 'Borang Permohonan Cuti Rehat', kategori: 'Sumber Manusia', format: 'PDF', kekerapan: 'Kerap', penerangan: 'Borang rasmi permohonan cuti rehat kakitangan.', failUrl: '/forms/borang-cuti.pdf', saizFail: '120 KB' },
    { kodBorang: 'B002', nama: 'Borang Tuntutan Perjalanan & Elaun', kategori: 'Kewangan', format: 'Excel', kekerapan: 'Bulanan', penerangan: 'Borang tuntutan elaun perjalanan rasmi.', failUrl: '/forms/borang-tuntutan.xlsx', saizFail: '85 KB' },
    { kodBorang: 'B003', nama: 'Templat Minit Mesyuarat', kategori: 'Pentadbiran', format: 'Word', kekerapan: 'Mingguan', penerangan: 'Templat standard minit mesyuarat jabatan.', failUrl: '/forms/templat-minit.docx', saizFail: '45 KB' },
    { kodBorang: 'B004', nama: 'Borang Serah Terima Aset', kategori: 'Pengurusan Aset', format: 'PDF', kekerapan: 'Situasional', penerangan: 'Borang serah terima aset alih jabatan.', failUrl: '/forms/borang-serah-terima.pdf', saizFail: '95 KB' },
    { kodBorang: 'B005', nama: 'Borang Aduan/Maklum Balas Pelanggan', kategori: 'Perkhidmatan Pelanggan', format: 'PDF', kekerapan: 'Kerap', penerangan: 'Borang aduan dan maklum balas pelanggan.', failUrl: '/forms/borang-aduan.pdf', saizFail: '110 KB' },
    { kodBorang: 'B006', nama: 'Senarai Semak Fail Meja Jawatan', kategori: 'Pentadbiran', format: 'Excel', kekerapan: 'Bulanan', penerangan: 'Senarai semak penyediaan fail meja jawatan.', failUrl: '/forms/senarai-semak-fail-meja.xlsx', saizFail: '60 KB' },
    { kodBorang: 'B007', nama: 'Templat Kertas Kerja/Kertas Cadangan', kategori: 'Pentadbiran', format: 'Word', kekerapan: 'Situasional', penerangan: 'Templat kertas kerja dan kertas cadangan projek.', failUrl: '/forms/templat-kertas-kerja.docx', saizFail: '55 KB' },
    { kodBorang: 'B008', nama: 'Borang Permohonan Capaian Sistem ICT', kategori: 'ICT', format: 'PDF', kekerapan: 'Situasional', penerangan: 'Borang permohonan capaian sistem ICT jabatan.', failUrl: '/forms/borang-capaian-ict.pdf', saizFail: '90 KB' },
  ]
  for (const b of borangList) {
    await db.borang.create({ data: b })
  }

  // ============ RUJUKAN PERATURAN ============
  const rujukanList = [
    { kodRujukan: 'R001', tajuk: 'Peraturan-Peraturan Pegawai Awam (Kelakuan dan Tatatertib) 1993', kategori: 'Peraturan Am', penerangan: 'Peraturan berkaitan kelakuan dan tatatertib pegawai awam.', pautanLuaran: 'https://www.jpa.gov.my', status: 'Aktif', versi: 'Pindaan 2022', tarikhKuatKuasa: new Date('1993-01-01') },
    { kodRujukan: 'R002', tajuk: 'Pekeliling Perkhidmatan - Cuti Rehat', kategori: 'Pekeliling Perkhidmatan', penerangan: 'Pekeliling berkaitan pengurusan cuti rehat pegawai.', pautanLuaran: 'https://www.jpa.gov.my/pekeliling', status: 'Aktif', versi: '2024', tarikhKuatKuasa: new Date('2024-01-15') },
    { kodRujukan: 'R003', tajuk: 'Pekeliling Kemajuan Pentadbiran Awam (PKPA) - Kualiti Perkhidmatan', kategori: 'PKPA', penerangan: 'PKPA berkaitan kualiti dan sistem penyampaian perkhidmatan awam.', pautanLuaran: 'https://www.mampu.gov.my', status: 'Aktif', versi: '2023', tarikhKuatKuasa: new Date('2023-06-01') },
    { kodRujukan: 'R004', tajuk: 'Arahan Perbendaharaan - Tatacara Pengurusan Kewangan', kategori: 'Arahan Perbendaharaan', penerangan: 'Tatacara pengurusan kewangan kerajaan.', pautanLuaran: 'https://www.treasury.gov.my', status: 'Aktif', versi: 'Pindaan 2024', tarikhKuatKuasa: new Date('2024-01-01') },
    { kodRujukan: 'R005', tajuk: 'Tatacara Pengurusan Aset Alih Kerajaan (TPA)', kategori: 'Arahan Perbendaharaan', penerangan: 'Tatacara pengurusan aset alih kerajaan.', pautanLuaran: 'https://www.treasury.gov.my/tpa', status: 'Aktif', versi: 'Pindaan 2022', tarikhKuatKuasa: new Date('2022-03-01') },
    { kodRujukan: 'R006', tajuk: 'SOP Pengurusan Surat Rasmi Jabatan', kategori: 'SOP Dalaman', penerangan: 'SOP dalaman pengurusan surat rasmi jabatan.', pautanLuaran: null, status: 'Aktif', versi: '1.0', tarikhKuatKuasa: new Date('2024-01-01') },
    { kodRujukan: 'R007', tajuk: 'Piagam Pelanggan Jabatan', kategori: 'Piagam Pelanggan', penerangan: 'Piagam pelanggan rasmi jabatan.', pautanLuaran: null, status: 'Aktif', versi: '2024', tarikhKuatKuasa: new Date('2024-02-01') },
    { kodRujukan: 'R008', tajuk: 'Pekeliling Perkhidmatan - Elaun & Kemudahan', kategori: 'Pekeliling Perkhidmatan', penerangan: 'Pekeliling berkaitan elaun dan kemudahan pegawai.', pautanLuaran: 'https://www.jpa.gov.my/pekeliling', status: 'Digantikan', versi: '2019', tarikhKuatKuasa: new Date('2019-01-01') },
  ]
  for (const r of rujukanList) {
    await db.rujukan.create({ data: r })
  }

  // Wire up borang & rujukan references in prosedur
  const borangCuti = await db.borang.findUnique({ where: { kodBorang: 'B001' } })
  const borangTuntutan = await db.borang.findUnique({ where: { kodBorang: 'B002' } })
  const borangAset = await db.borang.findUnique({ where: { kodBorang: 'B004' } })
  const rujukanCuti = await db.rujukan.findUnique({ where: { kodRujukan: 'R002' } })
  const rujukanKew = await db.rujukan.findUnique({ where: { kodRujukan: 'R004' } })
  const rujukanTPA = await db.rujukan.findUnique({ where: { kodRujukan: 'R005' } })

  if (borangCuti && rujukanCuti) {
    await db.prosedurKerja.update({
      where: { kodProsedur: 'MPK/UP/002' },
      data: {
        borangBerkaitan: J([borangCuti.id]),
        rujukanPeraturan: J([rujukanCuti.id]),
      },
    })
  }
  if (borangTuntutan && rujukanKew) {
    await db.prosedurKerja.update({
      where: { kodProsedur: 'MPK/UK/003' },
      data: {
        borangBerkaitan: J([borangTuntutan.id]),
        rujukanPeraturan: J([rujukanKew.id]),
      },
    })
  }
  if (borangAset && rujukanTPA) {
    await db.prosedurKerja.update({
      where: { kodProsedur: 'MPK/UA/004' },
      data: {
        borangBerkaitan: J([borangAset.id]),
        rujukanPeraturan: J([rujukanTPA.id]),
      },
    })
  }

  console.log('✅ Seed complete!')
  console.log(`   Jawatan: ${await db.jawatan.count()}`)
  console.log(`   Carta Alir: ${await db.cartaAlir.count()}`)
  console.log(`   Prosedur: ${await db.prosedurKerja.count()}`)
  console.log(`   Checklist: ${await db.checklist.count()}`)
  console.log(`   Borang: ${await db.borang.count()}`)
  console.log(`   Rujukan: ${await db.rujukan.count()}`)
  console.log(`   Pengguna: ${await db.pengguna.count()}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
