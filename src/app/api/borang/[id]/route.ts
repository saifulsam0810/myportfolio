import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { ok, err } from '@/lib/api'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const b = await db.borang.findUnique({ where: { id } })
  if (!b) return err('Borang tidak dijumpai', 404)
  return ok(b)
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params
  try {
    const body = await req.json()
    const updated = await db.borang.update({
      where: { id },
      data: {
        ...(body.kodBorang !== undefined && { kodBorang: body.kodBorang }),
        ...(body.nama !== undefined && { nama: body.nama }),
        ...(body.kategori !== undefined && { kategori: body.kategori }),
        ...(body.format !== undefined && { format: body.format }),
        ...(body.kekerapan !== undefined && { kekerapan: body.kekerapan }),
        ...(body.penerangan !== undefined && { penerangan: body.penerangan }),
        ...(body.failUrl !== undefined && { failUrl: body.failUrl }),
        ...(body.saizFail !== undefined && { saizFail: body.saizFail }),
        ...(body.versi !== undefined && { versi: body.versi }),
        ...(body.status !== undefined && { status: body.status }),
        tarikhKemasKini: new Date(),
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
    await db.borang.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return err(`Gagal padam: ${(e as Error).message}`, 500)
  }
}
