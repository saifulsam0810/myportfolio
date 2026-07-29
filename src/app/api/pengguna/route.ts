import { db } from '@/lib/db'
import { ok } from '@/lib/api'

// GET /api/pengguna - list demo users (excludes passwords)
export async function GET() {
  const pengguna = await db.pengguna.findMany({
    orderBy: { nama: 'asc' },
    select: {
      id: true,
      nama: true,
      emel: true,
      peranan: true,
      jawatanId: true,
      unit: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  return ok(pengguna)
}
