'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard,
  Briefcase,
  Workflow,
  ClipboardList,
  CheckSquare,
  FileText,
  BookOpen,
  QrCode,
  Settings,
  Menu,
  Moon,
  Sun,
  Search,
  ShieldCheck,
  X,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { usePengguna } from '@/lib/hooks'
import type { ModuleKey, Role } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const NAV: Array<{
  key: ModuleKey
  label: string
  icon: React.ElementType
  desc: string
  adminOnly?: boolean
}> = [
  { key: 'dashboard', label: 'Papan Pemuka', icon: LayoutDashboard, desc: 'Ringkasan sistem' },
  { key: 'jawatan', label: 'Skop Tugas Jawatan', icon: Briefcase, desc: 'Profil & tanggungjawab' },
  { key: 'carta-alir', label: 'Carta Alir', icon: Workflow, desc: 'Proses kerja visual' },
  { key: 'prosedur', label: 'Prosedur Kerja', icon: ClipboardList, desc: 'SOP piawai' },
  { key: 'checklist', label: 'Checklist Tugasan', icon: CheckSquare, desc: 'Harian / Mingguan / Bulanan' },
  { key: 'borang', label: 'Borang & Dokumen', icon: FileText, desc: 'Repositori pusat' },
  { key: 'rujukan', label: 'Rujukan Peraturan', icon: BookOpen, desc: 'Pekeliling & SOP' },
  { key: 'qr', label: 'Kod QR', icon: QrCode, desc: 'Capaian pantas' },
  { key: 'admin', label: 'Panel Admin', icon: Settings, desc: 'Pengurusan kandungan', adminOnly: true },
]

function AnimatedBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-gradient-hero">
      <div className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-teal-400/25 blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-24 size-[26rem] rounded-full bg-amber-300/25 blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/3 size-[30rem] rounded-full bg-emerald-400/20 blur-3xl animate-blob animation-delay-4000" />
    </div>
  )
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { activeModule, setActiveModule, role } = useAppStore()
  return (
    <nav className="flex flex-col gap-1.5">
      {NAV.filter((n) => !n.adminOnly || role === 'Admin').map((item) => {
        const Icon = item.icon
        const active = activeModule === item.key
        return (
          <button
            key={item.key}
            onClick={() => {
              setActiveModule(item.key)
              onNavigate?.()
            }}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all',
              active
                ? 'bg-gradient-to-r from-primary/90 to-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'hover:bg-sidebar-accent/70 text-sidebar-foreground'
            )}
          >
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                active
                  ? 'bg-white/20 text-primary-foreground'
                  : 'bg-sidebar-accent text-primary group-hover:bg-primary/15'
              )}
            >
              <Icon className="size-4.5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold leading-tight truncate">{item.label}</span>
              <span
                className={cn(
                  'block text-[11px] leading-tight truncate',
                  active ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}
              >
                {item.desc}
              </span>
            </span>
            {active && (
              <span className="absolute -left-0.5 top-1/2 -translate-y-1/2 h-7 w-1 rounded-full bg-accent" />
            )}
          </button>
        )
      })}
    </nav>
  )
}

function BrandHeader() {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="relative">
        <div className="size-11 rounded-xl bg-gradient-to-br from-primary via-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/40">
          <Building2 className="size-6 text-white" />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-amber-400 border-2 border-background" />
      </div>
      <div className="min-w-0">
        <div className="text-base font-bold tracking-tight text-foreground leading-tight">
          Sistem MyPortfolio
        </div>
        <div className="text-[11px] text-muted-foreground leading-tight">
          Portfolio Digital Jawatan
        </div>
      </div>
    </div>
  )
}

function RoleSwitcher() {
  const { role, setRole } = useAppStore()
  const { data: pengguna } = usePengguna()
  const currentUser = pengguna?.find((p) => p.peranan === role) ?? pengguna?.[0]

  const roleStyles: Record<Role, string> = {
    Admin: 'bg-rose-500/15 text-rose-700 border-rose-500/30',
    Penyelia: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
    Pengguna: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
    Awam: 'bg-slate-500/15 text-slate-700 border-slate-500/30',
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={role} onValueChange={(v) => setRole(v as Role)}>
        <SelectTrigger className="w-[150px] h-9 glass-subtle border-0 rounded-full text-xs font-medium">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Admin">🛡️ Admin</SelectItem>
          <SelectItem value="Penyelia">📋 Penyelia</SelectItem>
          <SelectItem value="Pengguna">👤 Pengguna</SelectItem>
          <SelectItem value="Awam">🌐 Awam (QR)</SelectItem>
        </SelectContent>
      </Select>
      <div className="hidden md:flex items-center gap-2">
        <Avatar className="size-9 border-2 border-background shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-emerald-600 text-white text-xs font-semibold">
            {currentUser?.nama
              ?.split(' ')
              .slice(0, 2)
              .map((n) => n[0])
              .join('') || 'MP'}
          </AvatarFallback>
        </Avatar>
        <div className="hidden lg:block leading-tight">
          <div className="text-xs font-semibold text-foreground max-w-[140px] truncate">
            {currentUser?.nama ?? 'Pengguna Sistem'}
          </div>
          <Badge
            variant="outline"
            className={cn('h-4 px-1.5 text-[10px] font-semibold', roleStyles[role])}
          >
            {role}
          </Badge>
        </div>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="size-9" />
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="glass-subtle rounded-full size-9 border-0 hover:bg-accent/30"
      aria-label="Tukar tema"
    >
      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}

function SearchBar() {
  const { searchQuery, setSearchQuery } = useAppStore()
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Cari jawatan, prosedur, borang..."
        className="pl-9 h-9 glass-subtle border-0 rounded-full text-sm"
      />
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const { activeModule } = useAppStore()
  const activeLabel = NAV.find((n) => n.key === activeModule)?.label ?? 'Papan Pemuka'

  // Close sidebar on module change handled in NavList onNavigate
  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 px-3 pt-3">
        <div className="glass-strong rounded-2xl px-3 sm:px-4 h-16 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden glass-subtle rounded-xl size-9 border-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="size-5" />
          </Button>

          <div className="lg:hidden">
            <BrandHeader />
          </div>

          <div className="hidden lg:flex items-center gap-2 min-w-0">
            <ShieldCheck className="size-5 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate">{activeLabel}</span>
          </div>

          <div className="flex-1 flex justify-center px-2">
            <div className="hidden sm:block w-full max-w-md">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <RoleSwitcher />
          </div>
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="flex flex-1 px-3 pt-3 gap-3">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="glass-strong rounded-2xl sticky top-[88px] p-4 max-h-[calc(100vh-110px)] overflow-y-auto">
            <div className="mb-4">
              <BrandHeader />
            </div>
            <NavList />
            <div className="mt-6 pt-4 border-t border-sidebar-border/60">
              <div className="glass-subtle rounded-xl p-3 text-center">
                <div className="text-[11px] text-muted-foreground mb-1">Versi Sistem</div>
                <div className="text-xs font-semibold text-foreground">MyPortfolio v1.0</div>
                <div className="text-[10px] text-muted-foreground mt-1">Fasa PoC • GLM 5.2</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-[300px] p-0 glass-strong border-0">
            <SheetHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-left">
                  <BrandHeader />
                </SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-lg"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </SheetHeader>
            <div className="px-4 pb-6 overflow-y-auto">
              <NavList onNavigate={() => setSidebarOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-6">
          <div className="sm:hidden mb-3">
            <SearchBar />
          </div>
          <div className="animate-fade-in-up">{children}</div>
        </main>
      </div>

      {/* Sticky footer */}
      <footer className="mt-auto px-3 pb-3">
        <div className="glass rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="size-3.5 text-primary" />
            <span>
              <span className="font-semibold text-foreground">Sistem MyPortfolio</span> — Portfolio
              Digital Tugas, Tanggungjawab & Prosedur Kerja Jawatan
            </span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span>© 2026 Unit ICT</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Dibangunkan dengan Z.AI (GLM 5.2)</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
