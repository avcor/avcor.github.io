import { useContext } from 'react'
import { CaseStudyOverlayContext } from '../context/caseStudyOverlayContextValue'

export function useCaseStudyOverlay() {
  const ctx = useContext(CaseStudyOverlayContext)
  if (!ctx) {
    throw new Error('useCaseStudyOverlay must be used within a CaseStudyOverlayProvider')
  }
  return ctx
}
