'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export function GlassCard({
  className,
  children,
  strong,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return (
    <div
      className={cn(
        strong ? 'glass-strong' : 'glass',
        'rounded-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SectionHeader({
  title,
  description,
  icon,
  action,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="size-11 rounded-xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  )
}

const statusColors: Record<string, string> = {
  Aktif: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  'Dikemas Kini': 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  Dimansuhkan: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  Digantikan: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  Diarkib: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
  Selesai: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  'Belum Selesai': 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const colorClass = statusColors[status] || 'bg-slate-500/15 text-slate-700 border-slate-500/30'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        colorClass,
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export function PageLoader({ label = 'Memuatkan...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="size-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
      {icon && (
        <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
      {action}
    </div>
  )
}
