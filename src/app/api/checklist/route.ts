import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { parseJSON, stringifyJSON, ok, err } from '@/lib/api'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const kekerapan = searchParams.get('kekerapan')?.trim()
  const unit = searchParams.get('unit')?.trim()

  const where = {
    AND: [
      kekerapan ? { kekerapan } : {},
      unit ? { unit: { contains: unit } } : {},
    ],
  }

  const checklist = await db.checklist.findMany({ where, orderBy: { createdAt: 'desc' } })
  return ok(
    checklist.map((c) => ({
      ...c,
      items: parseJSON(c.items, []),
    }))
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const created = await db.checklist.create({
      data: {
        tajuk: body.tajuk,
        kekerapan: body.kekerapan ?? 'Harian',
        jawatanId: body.jawatanId ?? null,
        unit: body.unit ?? '',
        items: stringifyJSON(body.items ?? []),
        tarikhMula: body.tarikhMula ? new Date(body.tarikhMula) : new Date(),
      },
    })
    return ok(created, { status: 201 })
  } catch (e) {
    return err(`Gagal cipta checklist: ${(e as Error).message}`, 500)
  }
}
