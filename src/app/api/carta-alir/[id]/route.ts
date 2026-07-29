import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { parseJSON, stringifyJSON, ok, err } from '@/lib/api'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const c = await db.cartaAlir.findUnique({ where: { id } })
  if (!c) return err('Carta alir tidak dijumpai', 404)
  return ok({
    ...c,
    nod: parseJSON(c.nod, []),
    sambungan: parseJSON(c.sambungan, []),
  })
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params
  try {
    const body = await req.json()
    const updated = await db.cartaAlir.update({
      where: { id },
      data: {
        ...(body.kodCarta !== undefined && { kodCarta: body.kodCarta }),
        ...(body.tajuk !== undefined && { tajuk: body.tajuk }),
        ...(body.kategori !== undefined && { kategori: body.kategori }),
        ...(body.jawatanId !== undefined && { jawatanId: body.jawatanId }),
        ...(body.penerangan !== undefined && { penerangan: body.penerangan }),
        ...(body.nod !== undefined && { nod: stringifyJSON(body.nod) }),
        ...(body.sambungan !== undefined && { sambungan: stringifyJSON(body.sambungan) }),
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
    await db.cartaAlir.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return err(`Gagal padam: ${(e as Error).message}`, 500)
  }
}
