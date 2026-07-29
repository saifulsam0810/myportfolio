-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "jawatan_kodJawatan_key" ON "jawatan"("kodJawatan");

-- CreateIndex
CREATE UNIQUE INDEX "carta_alir_kodCarta_key" ON "carta_alir"("kodCarta");

-- CreateIndex
CREATE UNIQUE INDEX "prosedur_kerja_kodProsedur_key" ON "prosedur_kerja"("kodProsedur");

-- CreateIndex
CREATE UNIQUE INDEX "borang_kodBorang_key" ON "borang"("kodBorang");

-- CreateIndex
CREATE UNIQUE INDEX "rujukan_kodRujukan_key" ON "rujukan"("kodRujukan");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_emel_key" ON "pengguna"("emel");

