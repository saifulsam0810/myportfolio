import { db } from '@/lib/db'
import { ok } from '@/lib/api'

// GET /api/pengguna - list demo users (for role-switching demo)
export async function GET() {
  const pengguna = await db.pengguna.findMany({ orderBy: { nama: 'asc' } })
  return ok(pengguna)
}
