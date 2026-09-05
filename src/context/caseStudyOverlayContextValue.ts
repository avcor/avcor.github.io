import { createContext } from 'react'

export interface CaseStudyOverlayValue {
  /** id of the case study whose details sheet is open, or null when closed. */
  openId: string | null
  open: (id: string) => void
  close: () => void
}

export const CaseStudyOverlayContext = createContext<CaseStudyOverlayValue | null>(null)
