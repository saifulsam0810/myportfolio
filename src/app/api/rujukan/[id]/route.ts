import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { ok, err } from '@/lib/api'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const r = await db.rujukan.findUnique({ where: { id } })
  if (!r) return err('Rujukan tidak dijumpai', 404)
  return ok(r)
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params
  try {
    const body = await req.json()
    const updated = await db.rujukan.update({
      where: { id },
      data: {
        ...(body.kodRujukan !== undefined && { kodRujukan: body.kodRujukan }),
        ...(body.tajuk !== undefined && { tajuk: body.tajuk }),
        ...(body.kategori !== undefined && { kategori: body.kategori }),
        ...(body.penerangan !== undefined && { penerangan: body.penerangan }),
        ...(body.pautanLuaran !== undefined && { pautanLuaran: body.pautanLuaran }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.versi !== undefined && { versi: body.versi }),
        ...(body.tarikhKuatKuasa !== undefined && { tarikhKuatKuasa: body.tarikhKuatKuasa ? new Date(body.tarikhKuatKuasa) : null }),
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
    await db.rujukan.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return err(`Gagal padam: ${(e as Error).message}`, 500)
  }
}
