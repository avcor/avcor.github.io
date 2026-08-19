import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface CaseStudyOverlayValue {
  /** id of the case study whose details sheet is open, or null when closed. */
  openId: string | null
  open: (id: string) => void
  close: () => void
}

const CaseStudyOverlayContext = createContext<CaseStudyOverlayValue | null>(null)

export function CaseStudyOverlayProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null)

  const open = useCallback((id: string) => setOpenId(id), [])
  const close = useCallback(() => setOpenId(null), [])

  const value = useMemo(() => ({ openId, open, close }), [openId, open, close])

  return (
    <CaseStudyOverlayContext.Provider value={value}>{children}</CaseStudyOverlayContext.Provider>
  )
}

export function useCaseStudyOverlay() {
  const ctx = useContext(CaseStudyOverlayContext)
  if (!ctx) {
    throw new Error('useCaseStudyOverlay must be used within a CaseStudyOverlayProvider')
  }
  return ctx
}
