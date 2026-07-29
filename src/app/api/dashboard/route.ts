import { db } from '@/lib/db'
import { parseJSON, ok } from '@/lib/api'

// GET /api/dashboard - aggregate stats for dashboard
export async function GET() {
  const [jawatan, cartaAlir, prosedur, checklist, borang, rujukan, logs] = await Promise.all([
    db.jawatan.count(),
    db.cartaAlir.count(),
    db.prosedurKerja.count(),
    db.checklist.findMany(),
    db.borang.count(),
    db.rujukan.count(),
    db.checklistLog.findMany({ orderBy: { tarikh: 'desc' }, take: 20 }),
  ])

  // Checklist compliance calculation
  let totalItems = 0
  let selesaiItems = 0
  const checklistProgress = checklist.map((c) => {
    const items = parseJSON<Array<{ status: string }>>(c.items, [])
    const selesai = items.filter((it) => it.status === 'Selesai').length
    totalItems += items.length
    selesaiItems += selesai
    return {
      id: c.id,
      tajuk: c.tajuk,
      kekerapan: c.kekerapan,
      unit: c.unit,
      total: items.length,
      selesai,
      percent: items.length ? Math.round((selesai / items.length) * 100) : 0,
    }
  })

  const compliancePercent = totalItems ? Math.round((selesaiItems / totalItems) * 100) : 0

  // Prosedur by status
  const prosedurByStatus = await db.prosedurKerja.groupBy({
    by: ['status'],
    _count: true,
  })

  // Borang by kategori
  const borangByKategori = await db.borang.groupBy({
    by: ['kategori'],
    _count: true,
  })

  // Rujukan by kategori
  const rujukanByKategori = await db.rujukan.groupBy({
    by: ['kategori'],
    _count: true,
  })

  return ok({
    counts: {
      jawatan,
      cartaAlir,
      prosedur,
      checklist: checklist.length,
      borang,
      rujukan,
    },
    checklistProgress,
    compliance: {
      totalItems,
      selesaiItems,
      percent: compliancePercent,
    },
    prosedurByStatus: prosedurByStatus.map((s) => ({ status: s.status, count: s._count })),
    borangByKategori: borangByKategori.map((k) => ({ kategori: k.kategori, count: k._count })),
    rujukanByKategori: rujukanByKategori.map((k) => ({ kategori: k.kategori, count: k._count })),
    recentLogs: logs,
  })
}
