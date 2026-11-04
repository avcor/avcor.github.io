import { useEffect, useRef } from 'react'
import { trackEvent } from '../services/analytics'
import { useEngagementEvent } from './useEngagementEvent'

/**
 * Section-level reading analytics for a scroll-spied page:
 *  - `section_reach` the first time each section becomes active (a funnel:
 *    how far down the page or case study people get)
 *  - `section_engagement` with engaged seconds on the active section
 *
 * `activeId` is null while the sections aren't visible (e.g. the main page
 * behind an open case study sheet). `caseStudyId` scopes events to a sheet;
 * omit it for the main page.
 */
export function useSectionAnalytics(activeId: string | null, sectionIds: string[], caseStudyId?: string) {
  const reached = useRef(new Set<string>())

  useEffect(() => {
    if (!activeId || reached.current.has(activeId)) return
    reached.current.add(activeId)
    trackEvent('section_reach', {
      ...(caseStudyId ? { case_study_id: caseStudyId } : {}),
      section_id: activeId,
      section_index: sectionIds.indexOf(activeId) + 1,
      sections_total: sectionIds.length,
    })
  }, [activeId, sectionIds, caseStudyId])

  useEngagementEvent(
    'section_engagement',
    activeId ? { ...(caseStudyId ? { case_study_id: caseStudyId } : {}), section_id: activeId } : null,
  )
}
