import { useEffect, type RefObject } from 'react'
import { trackEvent, trackPageView } from '../services/analytics'
import { useEngagementEvent } from './useEngagementEvent'

/** How a case study sheet came to be open. `deep_link` means the visitor
 *  arrived on a shared `#case-study/<id>` URL. */
export type CaseStudyOpenSource = 'click' | 'deep_link' | 'history'

/**
 * Sheet-level case study analytics: a virtual page view plus
 * `case_study_open` (with how it was opened) on every open, and
 * `case_study_engagement` with engaged seconds while it stays open.
 *
 * `sourceRef` is read when `openId` changes, so the caller sets it just
 * before changing the open id.
 */
export function useCaseStudyAnalytics(openId: string | null, sourceRef: RefObject<CaseStudyOpenSource>) {
  useEffect(() => {
    if (!openId) return
    trackPageView(`/case-study/${openId}`, `Case study: ${openId}`)
    trackEvent('case_study_open', { case_study_id: openId, open_method: sourceRef.current })
  }, [openId, sourceRef])

  useEngagementEvent('case_study_engagement', openId ? { case_study_id: openId } : null)
}
