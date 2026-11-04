import { useEffect, type RefObject } from 'react'
import { trackEvent } from '../services/analytics'

const MILESTONES = [25, 50, 75, 100]
/** Sub-pixel rounding can leave scrollTop a pixel short of the true bottom. */
const BOTTOM_TOLERANCE_PX = 2

/**
 * Reports `case_study_scroll` once per milestone (25/50/75/100%) as the reader
 * scrolls a case study sheet's container. GA4's built-in scroll event only
 * watches the window, which never scrolls while a sheet is open.
 */
export function useScrollDepth(scrollRef: RefObject<HTMLElement | null>, caseStudyId: string | null) {
  useEffect(() => {
    const el = scrollRef.current
    if (!el || !caseStudyId) return
    const sent = new Set<number>()

    const onScroll = () => {
      const scrollable = el.scrollHeight - el.clientHeight
      if (scrollable <= 0) return
      const percent = ((el.scrollTop + BOTTOM_TOLERANCE_PX) / scrollable) * 100
      MILESTONES.forEach((milestone) => {
        if (percent < milestone || sent.has(milestone)) return
        sent.add(milestone)
        trackEvent('case_study_scroll', { case_study_id: caseStudyId, scroll_percent: milestone })
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [scrollRef, caseStudyId])
}
