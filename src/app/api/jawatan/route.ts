import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseJSON, stringifyJSON, ok, err } from '@/lib/api'

// GET /api/jawatan - list all positions
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  const where = q
    ? {
        OR: [
          { namaJawatan: { contains: q } },
          { kodJawatan: { contains: q } },
          { jabatan: { contains: q } },
          { unit: { contains: q } },
        ],
      }
    : {}

  const jawatan = await db.jawatan.findMany({
    where,
    orderBy: { kodJawatan: 'asc' },
  })

  const parsed = jawatan.map((j) => ({
    ...j,
    skopTugas: parseJSON(j.skopTugas, []),
    tanggungjawab: parseJSON(j.tanggungjawab, []),
    hubunganKerja: parseJSON(j.hubunganKerja, { dalaman: [], luaran: [] }),
    autoriti: parseJSON(j.autoriti, { hadKuasa: '', melulus: [] }),
    kpi: parseJSON(j.kpi, []),
  }))

  return ok(parsed)
}

// POST /api/jawatan - create new position
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const created = await db.jawatan.create({
      data: {
        kodJawatan: body.kodJawatan,
        namaJawatan: body.namaJawatan,
        gred: body.gred ?? '',
        jabatan: body.jabatan ?? '',
        bahagian: body.bahagian ?? '',
        unit: body.unit ?? '',
        penyelia: body.penyelia ?? '',
        objektifAm: body.objektifAm ?? '',
        skopTugas: stringifyJSON(body.skopTugas ?? []),
        tanggungjawab: stringifyJSON(body.tanggungjawab ?? []),
        hubunganKerja: stringifyJSON(body.hubunganKerja ?? { dalaman: [], luaran: [] }),
        autoriti: stringifyJSON(body.autoriti ?? { hadKuasa: '', melulus: [] }),
        kpi: stringifyJSON(body.kpi ?? []),
        qrCodeUrl: `/jawatan/${body.kodJawatan}`,
      },
    })
    return ok(created, { status: 201 })
  } catch (e) {
    return err(`Gagal cipta jawatan: ${(e as Error).message}`, 500)
  }
}
