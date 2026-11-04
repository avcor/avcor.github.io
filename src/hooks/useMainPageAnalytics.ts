import { useEffect } from 'react'
import { SITE_SECTION_IDS } from '../config/siteSections'
import { trackPageView } from '../services/analytics'
import { caseStudyIdFromHash } from '../utils/caseStudyHash'
import { useCaseStudyOverlay } from './useCaseStudyOverlay'
import { useScrollSpy } from './useScrollSpy'
import { useSectionAnalytics } from './useSectionAnalytics'

/**
 * Main scroll page analytics: the landing page view, then reach and engaged
 * time per top-level section. Section time pauses while a case study sheet
 * covers the page, so it isn't credited to whatever section sits behind it.
 */
export function useMainPageAnalytics() {
  const activeId = useScrollSpy(SITE_SECTION_IDS)
  const { openId } = useCaseStudyOverlay()

  useEffect(() => {
    // A shared case study link lands on that case study: its own page view
    // fires on open, and it should be the landing page, not `/`.
    if (caseStudyIdFromHash(window.location.hash)) return
    trackPageView('/', document.title)
  }, [])

  useSectionAnalytics(openId ? null : activeId, SITE_SECTION_IDS)
}
