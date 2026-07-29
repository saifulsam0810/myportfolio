import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { parseJSON, stringifyJSON, ok, err } from '@/lib/api'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const p = await db.prosedurKerja.findUnique({ where: { id } })
  if (!p) return err('Prosedur tidak dijumpai', 404)
  return ok({
    ...p,
    tanggungjawab: parseJSON(p.tanggungjawab, []),
    langkahKerja: parseJSON(p.langkahKerja, []),
    borangBerkaitan: parseJSON(p.borangBerkaitan, []),
    rujukanPeraturan: parseJSON(p.rujukanPeraturan, []),
    sejarahSemakan: parseJSON(p.sejarahSemakan, []),
  })
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params
  try {
    const body = await req.json()
    const updated = await db.prosedurKerja.update({
      where: { id },
      data: {
        ...(body.kodProsedur !== undefined && { kodProsedur: body.kodProsedur }),
        ...(body.tajuk !== undefined && { tajuk: body.tajuk }),
        ...(body.tujuan !== undefined && { tujuan: body.tujuan }),
        ...(body.skop !== undefined && { skop: body.skop }),
        ...(body.tanggungjawab !== undefined && { tanggungjawab: stringifyJSON(body.tanggungjawab) }),
        ...(body.langkahKerja !== undefined && { langkahKerja: stringifyJSON(body.langkahKerja) }),
        ...(body.borangBerkaitan !== undefined && { borangBerkaitan: stringifyJSON(body.borangBerkaitan) }),
        ...(body.rujukanPeraturan !== undefined && { rujukanPeraturan: stringifyJSON(body.rujukanPeraturan) }),
        ...(body.tarikhKuatKuasa !== undefined && { tarikhKuatKuasa: new Date(body.tarikhKuatKuasa) }),
        ...(body.tarikhSemakan !== undefined && { tarikhSemakan: new Date(body.tarikhSemakan) }),
        ...(body.versi !== undefined && { versi: body.versi }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.sejarahSemakan !== undefined && { sejarahSemakan: stringifyJSON(body.sejarahSemakan) }),
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
    await db.prosedurKerja.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return err(`Gagal padam: ${(e as Error).message}`, 500)
  }
}
