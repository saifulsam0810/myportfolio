import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { parseJSON, stringifyJSON, ok, err } from '@/lib/api'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const kategori = searchParams.get('kategori')?.trim()

  const where = {
    AND: [
      q ? { OR: [{ tajuk: { contains: q } }, { kodCarta: { contains: q } }] } : {},
      kategori ? { kategori } : {},
    ],
  }

  const carta = await db.cartaAlir.findMany({ where, orderBy: { kodCarta: 'asc' } })
  return ok(
    carta.map((c) => ({
      ...c,
      nod: parseJSON(c.nod, []),
      sambungan: parseJSON(c.sambungan, []),
    }))
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const created = await db.cartaAlir.create({
      data: {
        kodCarta: body.kodCarta,
        tajuk: body.tajuk,
        kategori: body.kategori ?? 'Pentadbiran',
        jawatanId: body.jawatanId ?? null,
        penerangan: body.penerangan ?? '',
        nod: stringifyJSON(body.nod ?? []),
        sambungan: stringifyJSON(body.sambungan ?? []),
      },
    })
    return ok(created, { status: 201 })
  } catch (e) {
    return err(`Gagal cipta carta alir: ${(e as Error).message}`, 500)
  }
}
