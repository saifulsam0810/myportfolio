import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { ok, err } from '@/lib/api'

// POST /api/auth/login — validate email + password, return safe user (no password)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email: string = (body.email ?? '').trim().toLowerCase()
    const kataLaluan: string = body.kataLaluan ?? ''

    if (!email || !kataLaluan) {
      return err('Emel dan kata laluan diperlukan', 400)
    }

    const user = await db.pengguna.findUnique({ where: { emel: email } })
    if (!user || user.kataLaluan !== kataLaluan) {
      return err('Emel atau kata laluan tidak sah', 401)
    }

    // Strip password before returning
    const { kataLaluan: _kp, ...safeUser } = user
    return ok(safeUser)
  } catch (e) {
    return err(`Gagal log masuk: ${(e as Error).message}`, 500)
  }
}
