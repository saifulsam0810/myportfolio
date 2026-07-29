'use client'

import { AppShell } from '@/components/app-shell'
import { Providers } from '@/components/providers'
import { useAppStore } from '@/lib/store'
import { DashboardModule } from '@/components/modules/dashboard'
import { JawatanModule } from '@/components/modules/jawatan'
import { CartaAlirModule } from '@/components/modules/carta-alir'
import { ProsedurModule } from '@/components/modules/prosedur'
import { ChecklistModule } from '@/components/modules/checklist'
import { BorangModule } from '@/components/modules/borang'
import { RujukanModule } from '@/components/modules/rujukan'
import { QrCodeModule } from '@/components/modules/qr-code'
import { AdminModule } from '@/components/modules/admin'

function ActiveModule() {
  const active = useAppStore((s) => s.activeModule)
  const role = useAppStore((s) => s.role)

  // Guard admin module for non-admins
  if (active === 'admin' && role !== 'Admin') {
    return (
      <div className="glass-strong rounded-2xl p-12 text-center">
        <p className="text-muted-foreground">Akses terhad. Modul ini hanya untuk Pentadbir.</p>
      </div>
    )
  }

  switch (active) {
    case 'dashboard':
      return <DashboardModule />
    case 'jawatan':
      return <JawatanModule />
    case 'carta-alir':
      return <CartaAlirModule />
    case 'prosedur':
      return <ProsedurModule />
    case 'checklist':
      return <ChecklistModule />
    case 'borang':
      return <BorangModule />
    case 'rujukan':
      return <RujukanModule />
    case 'qr':
      return <QrCodeModule />
    case 'admin':
      return <AdminModule />
    default:
      return <DashboardModule />
  }
}

export default function Home() {
  return (
    <Providers>
      <AppShell>
        <ActiveModule />
      </AppShell>
    </Providers>
  )
}
