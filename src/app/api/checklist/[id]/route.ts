import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { parseJSON, stringifyJSON, ok, err } from '@/lib/api'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const c = await db.checklist.findUnique({ where: { id } })
  if (!c) return err('Checklist tidak dijumpai', 404)
  return ok({ ...c, items: parseJSON(c.items, []) })
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params
  try {
    const body = await req.json()
    const updated = await db.checklist.update({
      where: { id },
      data: {
        ...(body.tajuk !== undefined && { tajuk: body.tajuk }),
        ...(body.kekerapan !== undefined && { kekerapan: body.kekerapan }),
        ...(body.jawatanId !== undefined && { jawatanId: body.jawatanId }),
        ...(body.unit !== undefined && { unit: body.unit }),
        ...(body.items !== undefined && { items: stringifyJSON(body.items) }),
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
    await db.checklist.delete({ where: { id } })
    return ok({ success: true })
  } catch (e) {
    return err(`Gagal padam: ${(e as Error).message}`, 500)
  }
}
