-- ============================================================
-- Sistem MyPortfolio - Complete Supabase Setup (Schema + Data)
-- Run this in Supabase SQL Editor → New Query → Run
-- ============================================================

-- Clean up existing data (safe to re-run)
DROP TABLE IF EXISTS "checklist_log" CASCADE;
DROP TABLE IF EXISTS "checklist" CASCADE;
DROP TABLE IF EXISTS "borang" CASCADE;
DROP TABLE IF EXISTS "rujukan" CASCADE;
DROP TABLE IF EXISTS "prosedur_kerja" CASCADE;
DROP TABLE IF EXISTS "carta_alir" CASCADE;
DROP TABLE IF EXISTS "jawatan" CASCADE;
DROP TABLE IF EXISTS "pengguna" CASCADE;

-- ============================================================
-- 1. SCHEMA (Tables + Indexes)
-- ============================================================

CREATE TABLE "jawatan" (
    "id" TEXT NOT NULL,
    "kodJawatan" TEXT NOT NULL,
    "namaJawatan" TEXT NOT NULL,
    "gred" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "bahagian" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "penyelia" TEXT NOT NULL,
    "objektifAm" TEXT NOT NULL,
    "skopTugas" TEXT NOT NULL,
    "tanggungjawab" TEXT NOT NULL,
    "hubunganKerja" TEXT NOT NULL,
    "autoriti" TEXT NOT NULL,
    "kpi" TEXT NOT NULL,
    "qrCodeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "jawatan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "carta_alir" (
    "id" TEXT NOT NULL,
    "kodCarta" TEXT NOT NULL,
    "tajuk" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jawatanId" TEXT,
    "penerangan" TEXT NOT NULL,
    "nod" TEXT NOT NULL,
    "sambungan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "carta_alir_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "prosedur_kerja" (
    "id" TEXT NOT NULL,
    "kodProsedur" TEXT NOT NULL,
    "tajuk" TEXT NOT NULL,
    "tujuan" TEXT NOT NULL,
    "skop" TEXT NOT NULL,
    "tanggungjawab" TEXT NOT NULL,
    "langkahKerja" TEXT NOT NULL,
    "borangBerkaitan" TEXT NOT NULL,
    "rujukanPeraturan" TEXT NOT NULL,
    "tarikhKuatKuasa" TIMESTAMP(3) NOT NULL,
    "tarikhSemakan" TIMESTAMP(3) NOT NULL,
    "versi" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "sejarahSemakan" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "prosedur_kerja_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "checklist" (
    "id" TEXT NOT NULL,
    "tajuk" TEXT NOT NULL,
    "kekerapan" TEXT NOT NULL,
    "jawatanId" TEXT,
    "unit" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "tarikhMula" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "checklist_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "checklist_log" (
    "id" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "pengguna" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "catatan" TEXT,
    "tarikh" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "checklist_log_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "borang" (
    "id" TEXT NOT NULL,
    "kodBorang" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "kekerapan" TEXT NOT NULL,
    "penerangan" TEXT NOT NULL,
    "failUrl" TEXT NOT NULL,
    "saizFail" TEXT,
    "versi" TEXT NOT NULL DEFAULT '1.0',
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "tarikhKemasKini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "borang_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rujukan" (
    "id" TEXT NOT NULL,
    "kodRujukan" TEXT NOT NULL,
    "tajuk" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "penerangan" TEXT NOT NULL,
    "pautanLuaran" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "versi" TEXT,
    "tarikhKuatKuasa" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "rujukan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pengguna" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "emel" TEXT NOT NULL,
    "kataLaluan" TEXT NOT NULL DEFAULT 'password123',
    "peranan" TEXT NOT NULL,
    "jawatanId" TEXT,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "jawatan_kodJawatan_key" ON "jawatan"("kodJawatan");
CREATE UNIQUE INDEX "carta_alir_kodCarta_key" ON "carta_alir"("kodCarta");
CREATE UNIQUE INDEX "prosedur_kerja_kodProsedur_key" ON "prosedur_kerja"("kodProsedur");
CREATE UNIQUE INDEX "borang_kodBorang_key" ON "borang"("kodBorang");
CREATE UNIQUE INDEX "rujukan_kodRujukan_key" ON "rujukan"("kodRujukan");
CREATE UNIQUE INDEX "pengguna_emel_key" ON "pengguna"("emel");

-- ============================================================
-- 2. DUMMY DATA
-- ============================================================

-- Timestamps
-- All records use a fixed timestamp for consistency

-- ---- Jawatan (4 positions) ----
INSERT INTO "jawatan" ("id","kodJawatan","namaJawatan","gred","jabatan","bahagian","unit","penyelia","objektifAm","skopTugas","tanggungjawab","hubunganKerja","autoriti","kpi","qrCodeUrl","createdAt","updatedAt") VALUES (
  'jw1', 'JT001', 'Pegawai Tadbir', 'N41', 'Jabatan Pentadbiran', 'Bahagian Pengurusan', 'Unit Pentadbiran', 'Siti Aishah binti Hassan (Ketua Unit Pentadbiran)', 'Memastikan kelancaran operasi pentadbiran am jabatan termasuk pengurusan surat-menyurat, fail rekod, mesyuarat, aset dan perkhidmatan pelanggan mengikut piawaian yang ditetapkan.',
  '[{"kra":"Pengurusan Pentadbiran Am","tugas":["Menguruskan surat-menyurat masuk/keluar","Menyenggara fail rekod dan inventori pejabat","Menguruskan daftar surat masuk/keluar"]},{"kra":"Pengurusan Mesyuarat","tugas":["Menyediakan minit mesyuarat","Menyediakan agenda mesyuarat","Susulan tindakan (action tracking)"]},{"kra":"Pengurusan Aset & Stor","tugas":["Merekod aset alih jabatan","Menyelenggara inventori aset","Melapor status aset mengikut TPA"]},{"kra":"Perkhidmatan Pelanggan","tugas":["Mengendali aduan pelanggan","Mengendali pertanyaan dalaman/luaran","Mematuhi Piagam Pelanggan"]}]', '["Pengurusan aset pejabat dan inventori","Pengurusan fail rasmi dan rekod","Urusan surat-menyurat rasmi jabatan","Penyediaan minit dan dokumentasi mesyuarat"]', '{"dalaman":["Ketua Unit Pentadbiran","Pegawai Kewangan","Unit ICT","Semua kakitangan jabatan"],"luaran":["Pembekal dan vendor","Pelanggan awam","Jabatan kerajaan lain"]}', '{"hadKuasa":"Pelulus tuntutan sehingga RM5,000","melulus":["Permohonan alat tulis pejabat","Tuntutan perjalanan kecil"]}', '[{"kpi":"Masa tindak balas surat rasmi","sasaran":"< 3 hari bekerja"},{"kpi":"Ketepatan rekod fail","sasaran":"100%"},{"kpi":"Kepatuhan checklist harian","sasaran":"> 85%"}]', '/jawatan/JT001',
  NOW(), NOW())
  ON CONFLICT ("kodJawatan") DO NOTHING;
INSERT INTO "jawatan" ("id","kodJawatan","namaJawatan","gred","jabatan","bahagian","unit","penyelia","objektifAm","skopTugas","tanggungjawab","hubunganKerja","autoriti","kpi","qrCodeUrl","createdAt","updatedAt") VALUES (
  'jw2', 'JT002', 'Pegawai Kewangan', 'N44', 'Jabatan Kewangan', 'Bahagian Akaun', 'Unit Akaun', 'Tn. Hj. Razak bin Osman (Ketua Penolong Pengarah Kewangan)', 'Memastikan pengurusan kewangan, perakaunan dan pembayaran jabatan dilaksanakan mengikut Arahan Perbendaharaan dan tatacara kewangan kerajaan yang berkuat kuasa.',
  '[{"kra":"Pengurusan Pembayaran","tugas":["Memproses tuntutan pembayaran","Menyemak voucher bayaran","Mengeluarkan arahan bayaran"]},{"kra":"Pengurusan Akaun","tugas":["Menyediakan penyata akaun bulanan","Penutupan akaun akhir tahun","Audit dalaman akaun"]},{"kra":"Tuntutan & Elaun","tugas":["Memproses tuntutan perjalanan","Memproses elaun kakitangan","Semakan dokumen sokongan"]}]', '["Pengurusan akaun perbelanjaan bulanan","Penyediaan laporan kewangan","Semakan dan pengesahan tuntutan"]', '{"dalaman":["Ketua Penolong Pengarah Kewangan","Pegawai Tadbir","Jabatan Audit"],"luaran":["Arahan Perbendaharaan Malaysia","Bank Negara","Jabatan Audit Negara"]}', '{"hadKuasa":"Pelulus bayaran sehingga RM50,000","melulus":["Tuntutan perbelanjaan operasi","Bayaran pembekal"]}', '[{"kpi":"Masa pemprosesan bayaran","sasaran":"< 5 hari bekerja"},{"kpi":"Ketepatan penyata akaun","sasaran":"100%"}]', '/jawatan/JT002',
  NOW(), NOW())
  ON CONFLICT ("kodJawatan") DO NOTHING;
INSERT INTO "jawatan" ("id","kodJawatan","namaJawatan","gred","jabatan","bahagian","unit","penyelia","objektifAm","skopTugas","tanggungjawab","hubunganKerja","autoriti","kpi","qrCodeUrl","createdAt","updatedAt") VALUES (
  'jw3', 'JT003', 'Setiausaha Pejabat', 'N27', 'Jabatan Pentadbiran', 'Bahagian Pengurusan', 'Unit Sokongan', 'Siti Aishah binti Hassan (Ketua Unit Pentadbiran)', 'Menyediakan sokongan pentadbiran dan setiausaha kepada pejabat ketua jabatan bagi memastikan kelancaran urusan harian dan mesyuarat.',
  '[{"kra":"Sokongan Pentadbiran","tugas":["Mengurus jadual ketua jabatan","Menerima dan mengagihkan panggilan","Menyusun dokumen rasmi"]},{"kra":"Setiausaha Mesyuarat","tugas":["Menyediakan notis mesyuarat","Mencatat minit mesyuarat","Susulan tindakan mesyuarat"]},{"kra":"Pengurusan Fail","tugas":["Menyenggara fail sulit","Mengemas kini fail meja","Pengarkiban dokumen"]}]', '["Pengurusan jadual dan temujanji ketua jabatan","Penyediaan minit mesyuarat","Pengurusan fail sulit dan rasmi"]', '{"dalaman":["Ketua Jabatan","Pegawai Tadbir","Semua unit"],"luaran":["Setiausaha jabatan lain","Pegawai kerajaan lain"]}', '{"hadKuasa":"Akses dokumen sulit tahap tertentu","melulus":[]}', '[{"kpi":"Ketepatan masa mesyuarat","sasaran":"> 95%"},{"kpi":"Masa siap minit mesyuarat","sasaran":"< 3 hari bekerja"}]', '/jawatan/JT003',
  NOW(), NOW())
  ON CONFLICT ("kodJawatan") DO NOTHING;
INSERT INTO "jawatan" ("id","kodJawatan","namaJawatan","gred","jabatan","bahagian","unit","penyelia","objektifAm","skopTugas","tanggungjawab","hubunganKerja","autoriti","kpi","qrCodeUrl","createdAt","updatedAt") VALUES (
  'jw4', 'JT004', 'Pegawai Aset', 'N36', 'Jabatan Pentadbiran', 'Bahagian Pengurusan', 'Unit Aset', 'Siti Aishah binti Hassan (Ketua Unit Pentadbiran)', 'Mengurus dan menyelenggara aset alih kerajaan jabatan mengikut Tatacara Pengurusan Aset Alih Kerajaan (TPA) bagi memastikan rekod dan inventori aset sentiasa kemas kini dan boleh dijejaki.',
  '[{"kra":"Pendaftaran Aset","tugas":["Mendaftar aset baharu","Mengeluarkan tag aset","Mengemas kini daftar aset"]},{"kra":"Pemindahan & Pelupusan","tugas":["Memproses pemindahan aset","Penilaian pelupusan","Serah terima aset"]},{"kra":"Audit & Inventori","tugas":["Pemeriksaan fizikal tahunan","Laporan inventori","Semakan rekod aset"]}]', '["Pengurusan aset alih jabatan","Pengurusan stor pejabat","Pemeliharaan inventori"]', '{"dalaman":["Ketua Unit Pentadbiran","Pegawai Kewangan","Semua pegawai"],"luaran":["Jabatan Kastam","Pembekal aset","Syarikat pelupusan"]}', '{"hadKuasa":"Pelulus pengeluaran aset di bawah RM10,000","melulus":["Permintaan alat tulis","Pengeluaran aset stor"]}', '[{"kpi":"Ketepatan rekod inventori","sasaran":"> 98%"},{"kpi":"Masa pemeriksaan fizikal","sasaran":"Tahunan 100%"}]', '/jawatan/JT004',
  NOW(), NOW())
  ON CONFLICT ("kodJawatan") DO NOTHING;

-- ---- Pengguna (4 users) ----
INSERT INTO "pengguna" ("id","nama","emel","kataLaluan","peranan","jawatanId","unit","createdAt","updatedAt") VALUES (
  'pg1', 'Ahmad Faizal bin Rahman', 'faizal@agensi.gov.my', 'admin123', 'Admin', NULL, 'Unit ICT', NOW(), NOW())
  ON CONFLICT ("emel") DO NOTHING;
INSERT INTO "pengguna" ("id","nama","emel","kataLaluan","peranan","jawatanId","unit","createdAt","updatedAt") VALUES (
  'pg2', 'Siti Aishah binti Hassan', 'aishah@agensi.gov.my', 'penyelia123', 'Penyelia', 'jw1', 'Unit Pentadbiran', NOW(), NOW())
  ON CONFLICT ("emel") DO NOTHING;
INSERT INTO "pengguna" ("id","nama","emel","kataLaluan","peranan","jawatanId","unit","createdAt","updatedAt") VALUES (
  'pg3', 'Mohd Hafiz bin Ibrahim', 'hafiz@agensi.gov.my', 'pengguna123', 'Pengguna', 'jw1', 'Unit Pentadbiran', NOW(), NOW())
  ON CONFLICT ("emel") DO NOTHING;
INSERT INTO "pengguna" ("id","nama","emel","kataLaluan","peranan","jawatanId","unit","createdAt","updatedAt") VALUES (
  'pg4', 'Nurul Ain binti Yusof', 'nurul@agensi.gov.my', 'pengguna123', 'Pengguna', 'jw2', 'Unit Kewangan', NOW(), NOW())
  ON CONFLICT ("emel") DO NOTHING;

-- ---- Carta Alir (3 flowcharts) ----
INSERT INTO "carta_alir" ("id","kodCarta","tajuk","kategori","jawatanId","penerangan","nod","sambungan","createdAt","updatedAt") VALUES (
  'ca1', 'CA001', 'Proses Pengurusan Surat Masuk', 'Pentadbiran', 'jw1', 'Carta alir ringkas proses penerimaan, pendaftaran dan pengagihan surat rasmi masuk di jabatan.',
  '[{"id":"n1","label":"MULA\nSurat diterima di kaunter","jenis":"mula","penerangan":"Surat/dokumen diterima di kaunter URUS SETIA."},{"id":"n2","label":"Rekod dalam Buku Daftar Surat Masuk / e-Surat","jenis":"proses","penerangan":"Surat direkod dalam Buku Daftar Surat Masuk atau Sistem e-Surat."},{"id":"n3","label":"Serah kepada Ketua Jabatan","jenis":"proses","penerangan":"Surat diserahkan kepada Ketua Jabatan untuk arahan/minit."},{"id":"n4","label":"Arahan minit?","jenis":"keputusan","penerangan":"Ketua Jabatan beri arahan minit kepada unit berkaitan."},{"id":"n5","label":"Agih kepada Pegawai/Unit","jenis":"proses","penerangan":"Surat diagihkan kepada Pegawai/Unit berkaitan mengikut minit arahan."},{"id":"n6","label":"Pegawai bertindak (3 hari bekerja)","jenis":"proses","penerangan":"Pegawai bertindak mengikut tempoh masa yang ditetapkan."},{"id":"n7","label":"Rekod tindakan & difailkan","jenis":"proses","penerangan":"Tindakan/maklum balas direkodkan dan difailkan."},{"id":"n8","label":"TAMAT\nStatus dikemas kini","jenis":"tamat","penerangan":"Status tindakan dikemas kini dalam sistem."}]', '[{"from":"n1","to":"n2"},{"from":"n2","to":"n3"},{"from":"n3","to":"n4"},{"from":"n4","to":"n5","label":"Ya"},{"from":"n5","to":"n6"},{"from":"n6","to":"n7"},{"from":"n7","to":"n8"}]', NOW(), NOW())
  ON CONFLICT ("kodCarta") DO NOTHING;
INSERT INTO "carta_alir" ("id","kodCarta","tajuk","kategori","jawatanId","penerangan","nod","sambungan","createdAt","updatedAt") VALUES (
  'ca2', 'CA002', 'Proses Permohonan Cuti Rehat', 'Sumber Manusia', 'jw1', 'Carta alir proses permohonan cuti rehat kakitangan jabatan.',
  '[{"id":"n1","label":"MULA\nPegawai isi borang cuti","jenis":"mula","penerangan":"Pegawai mengisi permohonan cuti sekurang-kurangnya 3 hari bekerja sebelum tarikh cuti."},{"id":"n2","label":"Hantar kepada Penyelia","jenis":"proses","penerangan":"Sistem/borang dihantar kepada Penyelia untuk kelulusan."},{"id":"n3","label":"Semakan baki cuti & keperluan operasi","jenis":"keputusan","penerangan":"Penyelia menyemak baki cuti dan keperluan operasi."},{"id":"n4","label":"Lulus","jenis":"proses","penerangan":"Permohonan diluluskan."},{"id":"n5","label":"Tolak","jenis":"proses","penerangan":"Permohonan ditolak dengan alasan."},{"id":"n6","label":"Rekod cuti dikemas kini","jenis":"proses","penerangan":"Rekod cuti dikemas kini dalam sistem pengurusan cuti/HRMIS."},{"id":"n7","label":"TAMAT\nMaklum balas kepada pemohon","jenis":"tamat","penerangan":"Status kelulusan dimaklumkan kepada pemohon."}]', '[{"from":"n1","to":"n2"},{"from":"n2","to":"n3"},{"from":"n3","to":"n4","label":"Lulus"},{"from":"n3","to":"n5","label":"Tolak"},{"from":"n4","to":"n6"},{"from":"n6","to":"n7"},{"from":"n5","to":"n7"}]', NOW(), NOW())
  ON CONFLICT ("kodCarta") DO NOTHING;
INSERT INTO "carta_alir" ("id","kodCarta","tajuk","kategori","jawatanId","penerangan","nod","sambungan","createdAt","updatedAt") VALUES (
  'ca3', 'CA003', 'Proses Tuntutan Perbelanjaan', 'Kewangan', 'jw2', 'Carta alir proses tuntutan perbelanjaan dan elaun kakitangan.',
  '[{"id":"n1","label":"MULA\nPegawai hantar tuntutan","jenis":"mula","penerangan":"Pegawai menghantar borang tuntutan dengan dokumen sokongan."},{"id":"n2","label":"Semakan dokumen","jenis":"proses","penerangan":"Pegawai Kewangan menyemak dokumen sokongan."},{"id":"n3","label":"Dokumen lengkap?","jenis":"keputusan","penerangan":"Semakan sama ada dokumen lengkap."},{"id":"n4","label":"Pulangkan untuk semakan semula","jenis":"proses","penerangan":"Dokumen tidak lengkap dikembalikan."},{"id":"n5","label":"Pengesahan & pengiraan","jenis":"proses","penerangan":"Pegawai Kewangan mengira dan mengesahkan jumlah."},{"id":"n6","label":"Kelulusan Ketua Kewangan","jenis":"proses","penerangan":"Tuntutan diluluskan oleh Ketua Kewangan."},{"id":"n7","label":"TAMAT\nBayaran diproses","jenis":"tamat","penerangan":"Arahan bayaran dikeluarkan."}]', '[{"from":"n1","to":"n2"},{"from":"n2","to":"n3"},{"from":"n3","to":"n4","label":"Tidak"},{"from":"n3","to":"n5","label":"Ya"},{"from":"n4","to":"n1"},{"from":"n5","to":"n6"},{"from":"n6","to":"n7"}]', NOW(), NOW())
  ON CONFLICT ("kodCarta") DO NOTHING;

-- ---- Prosedur Kerja (4 SOPs) ----
INSERT INTO "prosedur_kerja" ("id","kodProsedur","tajuk","tujuan","skop","tanggungjawab","langkahKerja","borangBerkaitan","rujukanPeraturan","tarikhKuatKuasa","tarikhSemakan","versi","status","sejarahSemakan","createdAt","updatedAt") VALUES (
  'pk1', 'MPK/UP/001', 'Prosedur Pengurusan Surat Masuk', 'Memastikan setiap surat rasmi masuk direkod, diagih dan ditindak dengan tepat dan dalam tempoh masa yang ditetapkan.', 'Unit Pentadbiran dan semua pegawai yang menerima minit arahan surat.',
  '[{"jawatan":"Pegawai Tadbir","peranan":"Mendaftar dan mengagih surat"},{"jawatan":"Ketua Jabatan","peranan":"Berikan minit arahan"},{"jawatan":"Pegawai Bertindak","peranan":"Melaksana tindakan surat"}]', '[{"no":1,"tindakan":"Surat diterima di kaunter URUS SETIA","tanggungjawab":"Pegawai Tadbir","tempohMasa":"Sama hari"},{"no":2,"tindakan":"Surat direkod dalam Buku Daftar Surat Masuk / e-Surat","tanggungjawab":"Pegawai Tadbir","tempohMasa":"Sama hari"},{"no":3,"tindakan":"Surat diserahkan kepada Ketua Jabatan untuk arahan/minit","tanggungjawab":"Pegawai Tadbir","tempohMasa":"1 hari bekerja"},{"no":4,"tindakan":"Surat diagihkan kepada Pegawai/Unit berkaitan","tanggungjawab":"Ketua Jabatan","tempohMasa":"1 hari bekerja"},{"no":5,"tindakan":"Pegawai bertindak mengikut tempoh yang ditetapkan","tanggungjawab":"Pegawai Bertindak","tempohMasa":"3 hari bekerja"},{"no":6,"tindakan":"Tindakan/maklum balas direkod dan difailkan","tanggungjawab":"Pegawai Bertindak","tempohMasa":"1 hari bekerja selepas tindakan"},{"no":7,"tindakan":"Status tindakan dikemas kini dalam sistem","tanggungjawab":"Pegawai Tadbir","tempohMasa":"Sama hari"}]', '[]', '[]',
  '2024-01-01', '2026-01-01', '2.0', 'Aktif', '[{"versi":"1.0","tarikh":"2022-01-01","perubahan":"Pindaan awal prosedur"},{"versi":"2.0","tarikh":"2024-01-01","perubahan":"Penambahan langkah e-Surat dan tempoh masa standard"}]', NOW(), NOW())
  ON CONFLICT ("kodProsedur") DO NOTHING;
INSERT INTO "prosedur_kerja" ("id","kodProsedur","tajuk","tujuan","skop","tanggungjawab","langkahKerja","borangBerkaitan","rujukanPeraturan","tarikhKuatKuasa","tarikhSemakan","versi","status","sejarahSemakan","createdAt","updatedAt") VALUES (
  'pk2', 'MPK/UP/002', 'Prosedur Permohonan Cuti Rehat', 'Memastikan permohonan cuti rehat diproses secara telus dan terkini mengikut pekeliling perkhidmatan.', 'Semua kakitangan jabatan.',
  '[{"jawatan":"Pegawai","peranan":"Memohon cuti"},{"jawatan":"Penyelia","peranan":"Meluluskan/menolak permohonan"},{"jawatan":"Pegawai HR","peranan":"Kemas kini rekod cuti"}]', '[{"no":1,"tindakan":"Pegawai mengisi permohonan cuti sekurang-kurangnya 3 hari bekerja sebelum tarikh cuti","tanggungjawab":"Pegawai","tempohMasa":"3 hari bekerja sebelum cuti"},{"no":2,"tindakan":"Sistem/borang dihantar kepada Penyelia","tanggungjawab":"Sistem","tempohMasa":"Auto"},{"no":3,"tindakan":"Penyelia semak baki cuti & keperluan operasi","tanggungjawab":"Penyelia","tempohMasa":"1 hari bekerja"},{"no":4,"tindakan":"Status kelulusan dimaklumkan kepada pemohon","tanggungjawab":"Sistem","tempohMasa":"Auto selepas keputusan"},{"no":5,"tindakan":"Rekod cuti dikemas kini dalam HRMIS","tanggungjawab":"Pegawai HR","tempohMasa":"1 hari bekerja"}]', '["br1"]', '["rj2"]',
  '2023-06-01', '2026-06-01', '1.5', 'Aktif', '[{"versi":"1.0","tarikh":"2020-01-01","perubahan":"Versi awal prosedur cuti"},{"versi":"1.5","tarikh":"2023-06-01","perubahan":"Penambahbaikan tempoh dan notifikasi sistem"}]', NOW(), NOW())
  ON CONFLICT ("kodProsedur") DO NOTHING;
INSERT INTO "prosedur_kerja" ("id","kodProsedur","tajuk","tujuan","skop","tanggungjawab","langkahKerja","borangBerkaitan","rujukanPeraturan","tarikhKuatKuasa","tarikhSemakan","versi","status","sejarahSemakan","createdAt","updatedAt") VALUES (
  'pk3', 'MPK/UK/003', 'Prosedur Tuntutan Perbelanjaan & Elaun', 'Memastikan tuntutan perbelanjaan dan elaun diproses mengikut Arahan Perbendaharaan dan dokumen sokongan yang lengkap.', 'Semua kakitangan yang membuat tuntutan perbelanjaan.',
  '[{"jawatan":"Pegawai","peranan":"Menghantar tuntutan"},{"jawatan":"Pegawai Kewangan","peranan":"Semak dan sahkan"},{"jawatan":"Ketua Kewangan","peranan":"Lulus bayaran"}]', '[{"no":1,"tindakan":"Pegawai mengisi borang tuntutan dan lampirkan dokumen sokongan","tanggungjawab":"Pegawai","tempohMasa":"Selepas urusan"},{"no":2,"tindakan":"Pegawai Kewangan menyemak dokumen","tanggungjawab":"Pegawai Kewangan","tempohMasa":"2 hari bekerja"},{"no":3,"tindakan":"Pengesahan dan pengiraan jumlah","tanggungjawab":"Pegawai Kewangan","tempohMasa":"1 hari bekerja"},{"no":4,"tindakan":"Kelulusan Ketua Kewangan","tanggungjawab":"Ketua Kewangan","tempohMasa":"2 hari bekerja"},{"no":5,"tindakan":"Arahan bayaran dikeluarkan","tanggungjawab":"Pegawai Kewangan","tempohMasa":"2 hari bekerja"}]', '["br2"]', '["rj4"]',
  '2024-03-01', '2026-03-01', '3.0', 'Dikemas Kini', '[{"versi":"1.0","tarikh":"2019-01-01","perubahan":"Versi awal"},{"versi":"2.0","tarikh":"2021-06-01","perubahan":"Penambahan dokumen sokongan wajib"},{"versi":"3.0","tarikh":"2024-03-01","perubahan":"Selaraskan dengan Arahan Perbendaharaan terkini"}]', NOW(), NOW())
  ON CONFLICT ("kodProsedur") DO NOTHING;
INSERT INTO "prosedur_kerja" ("id","kodProsedur","tajuk","tujuan","skop","tanggungjawab","langkahKerja","borangBerkaitan","rujukanPeraturan","tarikhKuatKuasa","tarikhSemakan","versi","status","sejarahSemakan","createdAt","updatedAt") VALUES (
  'pk4', 'MPK/UA/004', 'Prosedur Pemindahan & Pelupusan Aset Alih', 'Memastikan pemindahan dan pelupusan aset alih kerajaan dilakukan mengikut Tatacara Pengurusan Aset Alih (TPA).', 'Unit Aset dan pegawai yang terlibat dengan pemindahan/pelupusan aset.',
  '[{"jawatan":"Pegawai Aset","peranan":"Proses pemindahan/pelupusan"},{"jawatan":"Ketua Unit","peranan":"Sahkan"},{"jawatan":"Lembaga Pemeriksa","peranan":"Penilaian pelupusan"}]', '[{"no":1,"tindakan":"Pegawai Aset terima permohonan pemindahan/pelupusan","tanggungjawab":"Pegawai Aset","tempohMasa":"Sama hari"},{"no":2,"tindakan":"Pemeriksaan fizikal aset","tanggungjawab":"Pegawai Aset","tempohMasa":"3 hari bekerja"},{"no":3,"tindakan":"Lembaga Pemeriksa nilai dan sahkan","tanggungjawab":"Lembaga Pemeriksa","tempohMasa":"7 hari bekerja"},{"no":4,"tindakan":"Kemas kini rekod daftar aset","tanggungjawab":"Pegawai Aset","tempohMasa":"2 hari bekerja"},{"no":5,"tindakan":"Serah terima / pelupusan dilaksana","tanggungjawab":"Pegawai Aset","tempohMasa":"Mengikut jadual"}]', '["br4"]', '["rj5"]',
  '2023-01-01', '2026-01-01', '2.1', 'Aktif', '[{"versi":"1.0","tarikh":"2018-01-01","perubahan":"Versi awal"},{"versi":"2.0","tarikh":"2021-01-01","perubahan":"Penambahbaikan lembaga pemeriksa"},{"versi":"2.1","tarikh":"2023-01-01","perubahan":"Selaraskan dengan Pindaan TPA 2022"}]', NOW(), NOW())
  ON CONFLICT ("kodProsedur") DO NOTHING;

-- ---- Checklist (4 checklists) ----
INSERT INTO "checklist" ("id","tajuk","kekerapan","jawatanId","unit","items","tarikhMula","createdAt","updatedAt") VALUES (
  'ck1', 'Checklist Tugasan Harian - Unit Pentadbiran', 'Harian', 'jw1', 'Unit Pentadbiran', '[{"id":"h1","bil":1,"tugasan":"Semak dan balas e-mel rasmi jabatan","tanggungjawab":"Semua Pegawai","status":"Belum Selesai","catatan":""},{"id":"h2","bil":2,"tugasan":"Kemas kini daftar surat masuk/keluar","tanggungjawab":"Pegawai Tadbir","status":"Belum Selesai","catatan":""},{"id":"h3","bil":3,"tugasan":"Semak jadual/agenda mesyuarat hari ini","tanggungjawab":"Setiausaha/PA","status":"Selesai","catatan":"Mesyuarat 10:00 pagi"},{"id":"h4","bil":4,"tugasan":"Kemas kini status tugasan dalam MyPortfolio","tanggungjawab":"Semua Pegawai","status":"Belum Selesai","catatan":""}]', NOW(), NOW(), NOW())
  ON CONFLICT ("id") DO NOTHING;
INSERT INTO "checklist" ("id","tajuk","kekerapan","jawatanId","unit","items","tarikhMula","createdAt","updatedAt") VALUES (
  'ck2', 'Checklist Tugasan Harian - Unit Kewangan', 'Harian', 'jw2', 'Unit Kewangan', '[{"id":"h1","bil":1,"tugasan":"Semak e-mel tuntutan baru","tanggungjawab":"Pegawai Kewangan","status":"Selesai","catatan":""},{"id":"h2","bil":2,"tugasan":"Proses voucher bayaran hari ini","tanggungjawab":"Pegawai Kewangan","status":"Belum Selesai","catatan":""},{"id":"h3","bil":3,"tugasan":"Kemas kini penyata akaun harian","tanggungjawab":"Pegawai Kewangan","status":"Belum Selesai","catatan":""}]', NOW(), NOW(), NOW())
  ON CONFLICT ("id") DO NOTHING;
INSERT INTO "checklist" ("id","tajuk","kekerapan","jawatanId","unit","items","tarikhMula","createdAt","updatedAt") VALUES (
  'ck3', 'Checklist Tugasan Mingguan - Unit Pentadbiran', 'Mingguan', 'jw1', 'Unit Pentadbiran', '[{"id":"m1","bil":1,"tugasan":"Mesyuarat penyelarasan mingguan unit/bahagian","tanggungjawab":"Ketua Unit","status":"Belum Selesai","catatan":"Setiap Isnin"},{"id":"m2","bil":2,"tugasan":"Kemas kini laporan prestasi mingguan","tanggungjawab":"Semua Pegawai","status":"Belum Selesai","catatan":""},{"id":"m3","bil":3,"tugasan":"Semakan stok/inventori pejabat","tanggungjawab":"Pegawai Aset","status":"Selesai","catatan":"Selesai Khamis"}]', NOW(), NOW(), NOW())
  ON CONFLICT ("id") DO NOTHING;
INSERT INTO "checklist" ("id","tajuk","kekerapan","jawatanId","unit","items","tarikhMula","createdAt","updatedAt") VALUES (
  'ck4', 'Checklist Tugasan Bulanan - Jabatan', 'Bulanan', NULL, 'Jabatan Pentadbiran', '[{"id":"b1","bil":1,"tugasan":"Penyediaan laporan prestasi bulanan jabatan","tanggungjawab":"Ketua Jabatan","status":"Belum Selesai","catatan":""},{"id":"b2","bil":2,"tugasan":"Tuntutan perjalanan & elaun bulanan","tanggungjawab":"Semua Pegawai","status":"Belum Selesai","catatan":""},{"id":"b3","bil":3,"tugasan":"Penyelarasan & pengesahan kehadiran/cuti","tanggungjawab":"Pegawai HR","status":"Selesai","catatan":""},{"id":"b4","bil":4,"tugasan":"Semakan dan penutupan akaun perbelanjaan bulanan","tanggungjawab":"Pegawai Kewangan","status":"Belum Selesai","catatan":""}]', NOW(), NOW(), NOW())
  ON CONFLICT ("id") DO NOTHING;

-- ---- Borang (8 forms) ----
INSERT INTO "borang" ("id","kodBorang","nama","kategori","format","kekerapan","penerangan","failUrl","saizFail","versi","status","tarikhKemasKini","createdAt","updatedAt") VALUES (
  'br1', 'B001', 'Borang Permohonan Cuti Rehat', 'Sumber Manusia', 'PDF', 'Kerap', 'Borang rasmi permohonan cuti rehat kakitangan.',
  '/forms/borang-cuti.pdf', '120 KB', '1.0', 'Aktif', NOW(), NOW(), NOW())
  ON CONFLICT ("kodBorang") DO NOTHING;
INSERT INTO "borang" ("id","kodBorang","nama","kategori","format","kekerapan","penerangan","failUrl","saizFail","versi","status","tarikhKemasKini","createdAt","updatedAt") VALUES (
  'br2', 'B002', 'Borang Tuntutan Perjalanan & Elaun', 'Kewangan', 'Excel', 'Bulanan', 'Borang tuntutan elaun perjalanan rasmi.',
  '/forms/borang-tuntutan.xlsx', '85 KB', '1.0', 'Aktif', NOW(), NOW(), NOW())
  ON CONFLICT ("kodBorang") DO NOTHING;
INSERT INTO "borang" ("id","kodBorang","nama","kategori","format","kekerapan","penerangan","failUrl","saizFail","versi","status","tarikhKemasKini","createdAt","updatedAt") VALUES (
  'br3', 'B003', 'Templat Minit Mesyuarat', 'Pentadbiran', 'Word', 'Mingguan', 'Templat standard minit mesyuarat jabatan.',
  '/forms/templat-minit.docx', '45 KB', '1.0', 'Aktif', NOW(), NOW(), NOW())
  ON CONFLICT ("kodBorang") DO NOTHING;
INSERT INTO "borang" ("id","kodBorang","nama","kategori","format","kekerapan","penerangan","failUrl","saizFail","versi","status","tarikhKemasKini","createdAt","updatedAt") VALUES (
  'br4', 'B004', 'Borang Serah Terima Aset', 'Pengurusan Aset', 'PDF', 'Situasional', 'Borang serah terima aset alih jabatan.',
  '/forms/borang-serah-terima.pdf', '95 KB', '1.0', 'Aktif', NOW(), NOW(), NOW())
  ON CONFLICT ("kodBorang") DO NOTHING;
INSERT INTO "borang" ("id","kodBorang","nama","kategori","format","kekerapan","penerangan","failUrl","saizFail","versi","status","tarikhKemasKini","createdAt","updatedAt") VALUES (
  'br5', 'B005', 'Borang Aduan/Maklum Balas Pelanggan', 'Perkhidmatan Pelanggan', 'PDF', 'Kerap', 'Borang aduan dan maklum balas pelanggan.',
  '/forms/borang-aduan.pdf', '110 KB', '1.0', 'Aktif', NOW(), NOW(), NOW())
  ON CONFLICT ("kodBorang") DO NOTHING;
INSERT INTO "borang" ("id","kodBorang","nama","kategori","format","kekerapan","penerangan","failUrl","saizFail","versi","status","tarikhKemasKini","createdAt","updatedAt") VALUES (
  'br6', 'B006', 'Senarai Semak Fail Meja Jawatan', 'Pentadbiran', 'Excel', 'Bulanan', 'Senarai semak penyediaan fail meja jawatan.',
  '/forms/senarai-semak-fail-meja.xlsx', '60 KB', '1.0', 'Aktif', NOW(), NOW(), NOW())
  ON CONFLICT ("kodBorang") DO NOTHING;
INSERT INTO "borang" ("id","kodBorang","nama","kategori","format","kekerapan","penerangan","failUrl","saizFail","versi","status","tarikhKemasKini","createdAt","updatedAt") VALUES (
  'br7', 'B007', 'Templat Kertas Kerja/Kertas Cadangan', 'Pentadbiran', 'Word', 'Situasional', 'Templat kertas kerja dan kertas cadangan projek.',
  '/forms/templat-kertas-kerja.docx', '55 KB', '1.0', 'Aktif', NOW(), NOW(), NOW())
  ON CONFLICT ("kodBorang") DO NOTHING;
INSERT INTO "borang" ("id","kodBorang","nama","kategori","format","kekerapan","penerangan","failUrl","saizFail","versi","status","tarikhKemasKini","createdAt","updatedAt") VALUES (
  'br8', 'B008', 'Borang Permohonan Capaian Sistem ICT', 'ICT', 'PDF', 'Situasional', 'Borang permohonan capaian sistem ICT jabatan.',
  '/forms/borang-capaian-ict.pdf', '90 KB', '1.0', 'Aktif', NOW(), NOW(), NOW())
  ON CONFLICT ("kodBorang") DO NOTHING;

-- ---- Rujukan (8 references) ----
INSERT INTO "rujukan" ("id","kodRujukan","tajuk","kategori","penerangan","pautanLuaran","status","versi","tarikhKuatKuasa","createdAt","updatedAt") VALUES (
  'rj1', 'R001', 'Peraturan-Peraturan Pegawai Awam (Kelakuan dan Tatatertib) 1993', 'Peraturan Am', 'Peraturan berkaitan kelakuan dan tatatertib pegawai awam.',
  'https://www.jpa.gov.my', 'Aktif', 'Pindaan 2022', '1993-01-01', NOW(), NOW())
  ON CONFLICT ("kodRujukan") DO NOTHING;
INSERT INTO "rujukan" ("id","kodRujukan","tajuk","kategori","penerangan","pautanLuaran","status","versi","tarikhKuatKuasa","createdAt","updatedAt") VALUES (
  'rj2', 'R002', 'Pekeliling Perkhidmatan - Cuti Rehat', 'Pekeliling Perkhidmatan', 'Pekeliling berkaitan pengurusan cuti rehat pegawai.',
  'https://www.jpa.gov.my/pekeliling', 'Aktif', '2024', '2024-01-15', NOW(), NOW())
  ON CONFLICT ("kodRujukan") DO NOTHING;
INSERT INTO "rujukan" ("id","kodRujukan","tajuk","kategori","penerangan","pautanLuaran","status","versi","tarikhKuatKuasa","createdAt","updatedAt") VALUES (
  'rj3', 'R003', 'Pekeliling Kemajuan Pentadbiran Awam (PKPA) - Kualiti Perkhidmatan', 'PKPA', 'PKPA berkaitan kualiti dan sistem penyampaian perkhidmatan awam.',
  'https://www.mampu.gov.my', 'Aktif', '2023', '2023-06-01', NOW(), NOW())
  ON CONFLICT ("kodRujukan") DO NOTHING;
INSERT INTO "rujukan" ("id","kodRujukan","tajuk","kategori","penerangan","pautanLuaran","status","versi","tarikhKuatKuasa","createdAt","updatedAt") VALUES (
  'rj4', 'R004', 'Arahan Perbendaharaan - Tatacara Pengurusan Kewangan', 'Arahan Perbendaharaan', 'Tatacara pengurusan kewangan kerajaan.',
  'https://www.treasury.gov.my', 'Aktif', 'Pindaan 2024', '2024-01-01', NOW(), NOW())
  ON CONFLICT ("kodRujukan") DO NOTHING;
INSERT INTO "rujukan" ("id","kodRujukan","tajuk","kategori","penerangan","pautanLuaran","status","versi","tarikhKuatKuasa","createdAt","updatedAt") VALUES (
  'rj5', 'R005', 'Tatacara Pengurusan Aset Alih Kerajaan (TPA)', 'Arahan Perbendaharaan', 'Tatacara pengurusan aset alih kerajaan.',
  'https://www.treasury.gov.my/tpa', 'Aktif', 'Pindaan 2022', '2022-03-01', NOW(), NOW())
  ON CONFLICT ("kodRujukan") DO NOTHING;
INSERT INTO "rujukan" ("id","kodRujukan","tajuk","kategori","penerangan","pautanLuaran","status","versi","tarikhKuatKuasa","createdAt","updatedAt") VALUES (
  'rj6', 'R006', 'SOP Pengurusan Surat Rasmi Jabatan', 'SOP Dalaman', 'SOP dalaman pengurusan surat rasmi jabatan.',
  NULL, 'Aktif', '1.0', '2024-01-01', NOW(), NOW())
  ON CONFLICT ("kodRujukan") DO NOTHING;
INSERT INTO "rujukan" ("id","kodRujukan","tajuk","kategori","penerangan","pautanLuaran","status","versi","tarikhKuatKuasa","createdAt","updatedAt") VALUES (
  'rj7', 'R007', 'Piagam Pelanggan Jabatan', 'Piagam Pelanggan', 'Piagam pelanggan rasmi jabatan.',
  NULL, 'Aktif', '2024', '2024-02-01', NOW(), NOW())
  ON CONFLICT ("kodRujukan") DO NOTHING;
INSERT INTO "rujukan" ("id","kodRujukan","tajuk","kategori","penerangan","pautanLuaran","status","versi","tarikhKuatKuasa","createdAt","updatedAt") VALUES (
  'rj8', 'R008', 'Pekeliling Perkhidmatan - Elaun & Kemudahan', 'Pekeliling Perkhidmatan', 'Pekeliling berkaitan elaun dan kemudahan pegawai.',
  'https://www.jpa.gov.my/pekeliling', 'Digantikan', '2019', '2019-01-01', NOW(), NOW())
  ON CONFLICT ("kodRujukan") DO NOTHING;

-- ============================================================
-- Setup complete!
-- ============================================================
-- Summary:
--   8 tables created (jawatan, carta_alir, prosedur_kerja, checklist, checklist_log, borang, rujukan, pengguna)
--   6 unique indexes created
--   4 jawatan, 3 carta alir, 4 prosedur, 4 checklist, 8 borang, 8 rujukan, 4 pengguna
--   
--   Demo login credentials:
--     Admin   : faizal@agensi.gov.my / admin123
--     Penyelia : aishah@agensi.gov.my / penyelia123
--     Pengguna : hafiz@agensi.gov.my / pengguna123
--     Pengguna : nurul@agensi.gov.my / pengguna123
-- ============================================================