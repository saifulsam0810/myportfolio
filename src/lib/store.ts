'use client'

import { create } from 'zustand'
import type { ModuleKey, Role } from '@/lib/types'

interface AppState {
  activeModule: ModuleKey
  setActiveModule: (m: ModuleKey) => void

  // role-switching demo
  role: Role
  setRole: (r: Role) => void

  // mobile sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // selected jawatan detail
  selectedJawatanId: string | null
  setSelectedJawatanId: (id: string | null) => void

  // selected prosedur detail
  selectedProsedurId: string | null
  setSelectedProsedurId: (id: string | null) => void

  // selected carta alir
  selectedCartaId: string | null
  setSelectedCartaId: (id: string | null) => void

  // global search query
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeModule: 'dashboard',
  setActiveModule: (m) => set({ activeModule: m }),

  role: 'Admin',
  setRole: (r) => set({ role: r }),

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  selectedJawatanId: null,
  setSelectedJawatanId: (id) => set({ selectedJawatanId: id }),

  selectedProsedurId: null,
  setSelectedProsedurId: (id) => set({ selectedProsedurId: id }),

  selectedCartaId: null,
  setSelectedCartaId: (id) => set({ selectedCartaId: id }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
