import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { parseJSON, stringifyJSON, ok, err } from '@/lib/api'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const j = await db.jawatan.findUnique({ where: { id } })
  if (!j) return err('Jawatan tidak dijumpai', 404)
  return ok({
    ...j,
    skopTugas: parseJSON(j.skopTugas, []),
    tanggungjawab: parseJSON(j.tanggungjawab, []),
    hubunganKerja: parseJSON(j.hubunganKerja, { dalaman: [], luaran: [] }),
    autoriti: parseJSON(j.autoriti, { hadKuasa: '', melulus: [] }),
    kpi: parseJSON(j.kpi, []),
  })
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params
  try {
    const body = await req.json()
    const updated = await db.jawatan.update({
      where: { id },
      data: {
        ...(body.kodJawatan !== undefined && { kodJawatan: body.kodJawatan }),
        ...(body.namaJawatan !== undefined && { namaJawatan: body.namaJawatan }),
        ...(body.gred !== undefined && { gred: body.gred }),
        ...(body.jabatan !== undefined && { jabatan: body.jabatan }),
        ...(body.bahagian !== undefined && { bahagian: body.bahagian }),
        ...(body.unit !== undefined && { unit: body.unit }),
        ...(body.penyelia !== undefined && { penyelia: body.penyelia }),
        ...(body.objektifAm !== undefined && { objektifAm: body.objektifAm }),
        ...(body.skopTugas !== undefined && { skopTugas: stringifyJSON(body.skopTugas) }),
        ...(body.tanggungjawab !== undefined && { tanggungjawab: stringifyJSON(body.tanggungjawab) }),
        ...(body.hubunganKerja !== undefined && { hubunganKerja: stringifyJSON(body.hubunganKerja) }),
        ...(body.autoriti !== undefined && { autoriti: stringifyJSON(body.autoriti) }),
        ...(body.kpi !== undefined && { kpi: stringifyJSON(body.kpi) }),
        qrCodeUrl: `/jawatan/${body.kodJawatan ?? (await db.jawatan.findUnique({ where: { id }, select: { kodJawatan: true } }))?.kodJawatan}`,
      },
    })
    return ok(updated)
  } catch (e) {
    return err(`Gagal kemas kini: ${(e as Error).message}`, 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  try {
    await db.jawatan.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return err(`Gagal padam: ${(e as Error).message}`, 500)
  }
}
