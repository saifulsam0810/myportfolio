import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { ok, err } from '@/lib/api'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const kategori = searchParams.get('kategori')?.trim()
  const status = searchParams.get('status')?.trim()

  const where = {
    AND: [
      q ? { OR: [{ tajuk: { contains: q } }, { kodRujukan: { contains: q } }] } : {},
      kategori ? { kategori } : {},
      status ? { status } : {},
    ],
  }

  const rujukan = await db.rujukan.findMany({ where, orderBy: { kodRujukan: 'asc' } })
  return ok(rujukan)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const created = await db.rujukan.create({
      data: {
        kodRujukan: body.kodRujukan,
        tajuk: body.tajuk,
        kategori: body.kategori ?? 'Peraturan Am',
        penerangan: body.penerangan ?? '',
        pautanLuaran: body.pautanLuaran ?? null,
        status: body.status ?? 'Aktif',
        versi: body.versi ?? null,
        tarikhKuatKuasa: body.tarikhKuatKuasa ? new Date(body.tarikhKuatKuasa) : null,
      },
    })
    return ok(created, { status: 201 })
  } catch (e) {
    return err(`Gagal cipta rujukan: ${(e as Error).message}`, 500)
  }
}
