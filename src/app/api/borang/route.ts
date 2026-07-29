import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { ok, err } from '@/lib/api'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const kategori = searchParams.get('kategori')?.trim()

  const where = {
    AND: [
      q ? { OR: [{ nama: { contains: q } }, { kodBorang: { contains: q } }] } : {},
      kategori ? { kategori } : {},
    ],
  }

  const borang = await db.borang.findMany({ where, orderBy: { kodBorang: 'asc' } })
  return ok(borang)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const created = await db.borang.create({
      data: {
        kodBorang: body.kodBorang,
        nama: body.nama,
        kategori: body.kategori ?? 'Pentadbiran',
        format: body.format ?? 'PDF',
        kekerapan: body.kekerapan ?? 'Situasional',
        penerangan: body.penerangan ?? '',
        failUrl: body.failUrl ?? '#',
        saizFail: body.saizFail ?? null,
        versi: body.versi ?? '1.0',
        status: body.status ?? 'Aktif',
      },
    })
    return ok(created, { status: 201 })
  } catch (e) {
    return err(`Gagal cipta borang: ${(e as Error).message}`, 500)
  }
}
