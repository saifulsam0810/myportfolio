import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { parseJSON, stringifyJSON, ok, err } from '@/lib/api'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const status = searchParams.get('status')?.trim()

  const where = {
    AND: [
      q ? { OR: [{ tajuk: { contains: q } }, { kodProsedur: { contains: q } }] } : {},
      status ? { status } : {},
    ],
  }

  const prosedur = await db.prosedurKerja.findMany({ where, orderBy: { kodProsedur: 'asc' } })
  return ok(
    prosedur.map((p) => ({
      ...p,
      tanggungjawab: parseJSON(p.tanggungjawab, []),
      langkahKerja: parseJSON(p.langkahKerja, []),
      borangBerkaitan: parseJSON(p.borangBerkaitan, []),
      rujukanPeraturan: parseJSON(p.rujukanPeraturan, []),
      sejarahSemakan: parseJSON(p.sejarahSemakan, []),
    }))
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const created = await db.prosedurKerja.create({
      data: {
        kodProsedur: body.kodProsedur,
        tajuk: body.tajuk,
        tujuan: body.tujuan ?? '',
        skop: body.skop ?? '',
        tanggungjawab: stringifyJSON(body.tanggungjawab ?? []),
        langkahKerja: stringifyJSON(body.langkahKerja ?? []),
        borangBerkaitan: stringifyJSON(body.borangBerkaitan ?? []),
        rujukanPeraturan: stringifyJSON(body.rujukanPeraturan ?? []),
        tarikhKuatKuasa: body.tarikhKuatKuasa ? new Date(body.tarikhKuatKuasa) : new Date(),
        tarikhSemakan: body.tarikhSemakan ? new Date(body.tarikhSemakan) : new Date(),
        versi: body.versi ?? '1.0',
        status: body.status ?? 'Aktif',
        sejarahSemakan: stringifyJSON(body.sejarahSemakan ?? []),
      },
    })
    return ok(created, { status: 201 })
  } catch (e) {
    return err(`Gagal cipta prosedur: ${(e as Error).message}`, 500)
  }
}
