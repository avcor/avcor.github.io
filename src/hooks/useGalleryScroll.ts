import { useRef } from 'react'
import { trackEvent } from '../services/analytics'
import { useCaseStudyOverlay } from './useCaseStudyOverlay'
import { useScrollDepth } from './useScrollDepth'
import { useScrollSpy } from './useScrollSpy'
import { useSectionAnalytics } from './useSectionAnalytics'

/**
 * Scroll-spy plus smooth jump for a case-study gallery's inner scroll
 * container. Owns the ref, tracks which section is in view, and scrolls a
 * section to the top of the container when its spy-bar item is clicked.
 *
 * Every gallery goes through here, so this is also where per-case-study
 * reading analytics attach (section reach/time, scroll depth, spy-bar jumps).
 */
export function useGalleryScroll(scrollIds: string[]) {
  const scrollRef = useRef<HTMLElement>(null)
  const activeId = useScrollSpy(scrollIds, scrollRef)
  // Null while the sheet animates closed, which stops the section timers.
  const { openId } = useCaseStudyOverlay()

  useSectionAnalytics(openId ? activeId : null, scrollIds, openId ?? undefined)
  useScrollDepth(scrollRef, openId)

  const onJump = (id: string) => {
    const container = scrollRef.current
    const el = container?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    if (container && el) container.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
    if (openId) trackEvent('case_study_nav', { case_study_id: openId, section_id: id })
  }

  return { scrollRef, activeId, onJump }
}
