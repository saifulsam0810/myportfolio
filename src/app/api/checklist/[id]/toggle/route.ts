import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { parseJSON, stringifyJSON, ok, err } from '@/lib/api'

type Ctx = { params: Promise<{ id: string }> }

// POST /api/checklist/[id]/toggle - toggle a checklist item's status
export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params
  try {
    const body = await req.json()
    const { itemId, status, catatan } = body as { itemId: string; status: string; catatan?: string }

    const checklist = await db.checklist.findUnique({ where: { id } })
    if (!checklist) return err('Checklist tidak dijumpai', 404)

    const items = parseJSON<Array<{ id: string; status: string; catatan?: string }>>(checklist.items, [])
    const idx = items.findIndex((it) => it.id === itemId)
    if (idx === -1) return err('Item tidak dijumpai', 404)

    items[idx] = {
      ...items[idx],
      status,
      ...(catatan !== undefined && { catatan }),
    }

    const updated = await db.checklist.update({
      where: { id },
      data: { items: stringifyJSON(items) },
    })

    // Log the toggle for compliance reporting
    await db.checklistLog.create({
      data: {
        checklistId: id,
        itemId,
        pengguna: body.pengguna ?? 'Pengguna Sistem',
        status,
        catatan: catatan ?? null,
      },
    })

    return ok({ ...updated, items: parseJSON(updated.items, []) })
  } catch (e) {
    return err(`Gagal tukar status: ${(e as Error).message}`, 500)
  }
}
