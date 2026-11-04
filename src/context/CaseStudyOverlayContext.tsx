import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CaseStudyOverlayContext } from './caseStudyOverlayContextValue'
import { useCaseStudyAnalytics, type CaseStudyOpenSource } from '../hooks/useCaseStudyAnalytics'
import { CASE_STUDY_HASH_PREFIX, caseStudyIdFromHash } from '../utils/caseStudyHash'

export function CaseStudyOverlayProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(() => caseStudyIdFromHash(window.location.hash))
  // Whatever opened the sheet last; read by analytics when openId changes.
  const openSourceRef = useRef<CaseStudyOpenSource>('deep_link')
  useCaseStudyAnalytics(openId, openSourceRef)

  // Back/forward navigation (including the entry pushed by `open`) drives the
  // sheet open/closed in sync with the hash, not just the in-app buttons.
  useEffect(() => {
    const onPopState = () => {
      openSourceRef.current = 'history'
      setOpenId(caseStudyIdFromHash(window.location.hash))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const open = useCallback((id: string) => {
    openSourceRef.current = 'click'
    setOpenId(id)
    window.history.pushState(null, '', `${CASE_STUDY_HASH_PREFIX}${id}`)
  }, [])

  const close = useCallback(() => {
    setOpenId(null)
    if (caseStudyIdFromHash(window.location.hash)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  const value = useMemo(() => ({ openId, open, close }), [openId, open, close])

  return (
    <CaseStudyOverlayContext.Provider value={value}>{children}</CaseStudyOverlayContext.Provider>
  )
}
