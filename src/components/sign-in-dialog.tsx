'use client'

import * as React from 'react'
import { LogIn, Shield, User, Eye, EyeOff, KeyRound, Mail, Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useLogin } from '@/lib/hooks'
import { useAppStore, AUTH_STORAGE_KEY } from '@/lib/store'
import type { AuthUser, Role } from '@/lib/types'

const DEMO_ACCOUNTS: Array<{
  peranan: Role
  emel: string
  kataLaluan: string
  nama: string
  icon: React.ElementType
  tint: string
}> = [
  { peranan: 'Admin', emel: 'faizal@agensi.gov.my', kataLaluan: 'admin123', nama: 'Ahmad Faizal', icon: Shield, tint: 'bg-rose-500/15 text-rose-700' },
  { peranan: 'Penyelia', emel: 'aishah@agensi.gov.my', kataLaluan: 'penyelia123', nama: 'Siti Aishah', icon: User, tint: 'bg-amber-500/15 text-amber-700' },
  { peranan: 'Pengguna', emel: 'hafiz@agensi.gov.my', kataLaluan: 'pengguna123', nama: 'Mohd Hafiz', icon: User, tint: 'bg-emerald-500/15 text-emerald-700' },
]

export function SignInDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPwd, setShowPwd] = React.useState(false)
  const login = useLogin()
  const loginUser = useAppStore((s) => s.loginUser)

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!email || !password) {
      toast.error('Sila isi emel dan kata laluan')
      return
    }
    login.mutate(
      { email: email.trim().toLowerCase(), kataLaluan: password },
      {
        onSuccess: (user: AuthUser) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
          }
          loginUser(user)
          toast.success(`Selamat datang, ${user.nama}`, {
            description: `Log masuk sebagai ${user.peranan}`,
          })
          setEmail('')
          setPassword('')
          onOpenChange(false)
        },
        onError: (err: Error) => {
          toast.error('Log masuk gagal', { description: err.message })
        },
      }
    )
  }

  const quickLogin = (acc: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(acc.emel)
    setPassword(acc.kataLaluan)
    login.mutate(
      { email: acc.emel, kataLaluan: acc.kataLaluan },
      {
        onSuccess: (user: AuthUser) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
          }
          loginUser(user)
          toast.success(`Selamat datang, ${user.nama}`, {
            description: `Log masuk sebagai ${user.peranan}`,
          })
          setEmail('')
          setPassword('')
          onOpenChange(false)
        },
        onError: (err: Error) => {
          toast.error('Log masuk gagal', { description: err.message })
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-0 max-w-md">
        <DialogHeader>
          <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-2 shadow-lg shadow-primary/30">
            <LogIn className="size-6" />
          </div>
          <DialogTitle className="text-xl">Log Masuk Sistem</DialogTitle>
          <DialogDescription>
            Log masuk untuk mengakses modul penuh MyPortfolio. Pengguna awam boleh melayari tanpa log masuk.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="signin-email" className="flex items-center gap-1.5">
              <Mail className="size-3.5" /> Emel
            </Label>
            <Input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@agensi.gov.my"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="signin-pwd" className="flex items-center gap-1.5">
              <KeyRound className="size-3.5" /> Kata Laluan
            </Label>
            <div className="relative">
              <Input
                id="signin-pwd"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPwd ? 'Sembunyi kata laluan' : 'Tunjuk kata laluan'}
              >
                {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? 'Sedang log masuk...' : 'Log Masuk'}
          </Button>
        </form>

        <div className="relative my-1">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[11px] text-muted-foreground flex items-center gap-1">
            <Sparkles className="size-3" /> Log masuk pantas demo
          </span>
        </div>

        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.emel}
              type="button"
              onClick={() => quickLogin(acc)}
              disabled={login.isPending}
              className="w-full flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 hover:bg-card/80 p-2.5 transition-colors text-left disabled:opacity-50"
            >
              <div className={`size-9 rounded-lg flex items-center justify-center ${acc.tint}`}>
                <acc.icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{acc.nama}</div>
                <div className="text-[11px] text-muted-foreground truncate">{acc.emel}</div>
              </div>
              <span className="text-[11px] font-semibold text-primary shrink-0">{acc.peranan}</span>
            </button>
          ))}
        </div>

        <DialogFooter className="text-[11px] text-muted-foreground text-center sm:text-center pt-2">
          Akaun demo untuk tujuan PoC. Jangan gunakan kata laluan sebenar.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
