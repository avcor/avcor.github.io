import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CaseStudyOverlayContext } from './caseStudyOverlayContextValue'

/** Deep-link prefix: a shared URL like `#case-study/flutter-integration` opens
 *  that case study's sheet directly on load, distinct from plain section
 *  anchors (`#work`, `#about`, ...). */
const HASH_PREFIX = '#case-study/'

function idFromHash(hash: string): string | null {
  return hash.startsWith(HASH_PREFIX) ? hash.slice(HASH_PREFIX.length) : null
}

export function CaseStudyOverlayProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(() => idFromHash(window.location.hash))

  // Back/forward navigation (including the entry pushed by `open`) drives the
  // sheet open/closed in sync with the hash, not just the in-app buttons.
  useEffect(() => {
    const onPopState = () => setOpenId(idFromHash(window.location.hash))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const open = useCallback((id: string) => {
    setOpenId(id)
    window.history.pushState(null, '', `${HASH_PREFIX}${id}`)
  }, [])

  const close = useCallback(() => {
    setOpenId(null)
    if (idFromHash(window.location.hash)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  const value = useMemo(() => ({ openId, open, close }), [openId, open, close])

  return (
    <CaseStudyOverlayContext.Provider value={value}>{children}</CaseStudyOverlayContext.Provider>
  )
}
