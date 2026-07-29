'use client'

import { create } from 'zustand'
import type { ModuleKey, Role, AuthUser } from '@/lib/types'

const AUTH_STORAGE_KEY = 'myportfolio-auth-user'

interface AppState {
  activeModule: ModuleKey
  setActiveModule: (m: ModuleKey) => void

  // authentication
  currentUser: AuthUser | null
  isAuthenticated: boolean
  role: Role // derived: currentUser.peranan or 'Awam' when logged out
  loginUser: (user: AuthUser) => void
  logoutUser: () => void
  hydrateAuth: () => void

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

  // QR pre-select (when navigating from a jawatan profile to QR module)
  qrPresetKod: string | null
  setQrPresetKod: (kod: string | null) => void

  // global search query
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeModule: 'dashboard',
  setActiveModule: (m) => set({ activeModule: m }),

  currentUser: null,
  isAuthenticated: false,
  role: 'Awam', // default: not signed in = public/Awam access

  loginUser: (user) =>
    set({
      currentUser: user,
      isAuthenticated: true,
      role: user.peranan as Role,
    }),

  logoutUser: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
    set({
      currentUser: null,
      isAuthenticated: false,
      role: 'Awam',
      activeModule: 'dashboard',
    })
  },

  hydrateAuth: () => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
      if (raw) {
        const user = JSON.parse(raw) as AuthUser
        set({
          currentUser: user,
          isAuthenticated: true,
          role: user.peranan as Role,
        })
      }
    } catch {
      // invalid storage — ignore
    }
  },

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  selectedJawatanId: null,
  setSelectedJawatanId: (id) => set({ selectedJawatanId: id }),

  selectedProsedurId: null,
  setSelectedProsedurId: (id) => set({ selectedProsedurId: id }),

  selectedCartaId: null,
  setSelectedCartaId: (id) => set({ selectedCartaId: id }),

  qrPresetKod: null,
  setQrPresetKod: (kod) => set({ qrPresetKod: kod }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}))

export { AUTH_STORAGE_KEY }
