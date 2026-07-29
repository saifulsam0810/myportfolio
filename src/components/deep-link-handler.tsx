'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useJawatanList } from '@/lib/hooks'
import { useAppStore } from '@/lib/store'

/**
 * Reads URL search params on first load and deep-links to the relevant module.
 * Supported params:
 *   - ?jawatan=KOD   → open Jawatan detail for that kodJawatan
 *   - ?borang=KOD    → open Borang module
 *   - ?prosedur=KOD  → open Prosedur module
 *   - ?carta=KOD     → open Carta Alir module
 *   - ?module=qr     → open QR module directly
 *
 * This is what makes scanned QR codes open the linked profile.
 *
 * NOTE: The jawatan list is only fetched when a `jawatan` param is present,
 * to avoid an unnecessary request on every page load.
 */
export function DeepLinkHandler() {
  const params = useSearchParams()
  const jawatanKod = params.get('jawatan')
  const { data: jawatanList } = useJawatanList(undefined, { enabled: !!jawatanKod })
  const setActiveModule = useAppStore((s) => s.setActiveModule)
  const setSelectedJawatanId = useAppStore((s) => s.setSelectedJawatanId)
  const handledRef = React.useRef(false)

  React.useEffect(() => {
    if (handledRef.current) return

    const borangKod = params.get('borang')
    const prosedurKod = params.get('prosedur')
    const cartaKod = params.get('carta')
    const moduleKod = params.get('module')

    if (jawatanKod) {
      if (jawatanList && jawatanList.length > 0) {
        const found = jawatanList.find((j) => j.kodJawatan === jawatanKod)
        if (found) {
          setSelectedJawatanId(found.id)
          setActiveModule('jawatan')
          handledRef.current = true
        }
      }
    } else if (borangKod) {
      setActiveModule('borang')
      handledRef.current = true
    } else if (prosedurKod) {
      setActiveModule('prosedur')
      handledRef.current = true
    } else if (cartaKod) {
      setActiveModule('carta-alir')
      handledRef.current = true
    } else if (moduleKod === 'qr') {
      setActiveModule('qr')
      handledRef.current = true
    } else {
      handledRef.current = true
    }
  }, [params, jawatanKod, jawatanList, setActiveModule, setSelectedJawatanId])

  return null
}
