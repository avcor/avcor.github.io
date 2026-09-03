import { useRef } from 'react'
import { useScrollSpy } from './useScrollSpy'

/**
 * Scroll-spy plus smooth jump for a case-study gallery's inner scroll
 * container. Owns the ref, tracks which section is in view, and scrolls a
 * section to the top of the container when its spy-bar item is clicked.
 */
export function useGalleryScroll(scrollIds: string[]) {
  const scrollRef = useRef<HTMLElement>(null)
  const activeId = useScrollSpy(scrollIds, scrollRef)

  const onJump = (id: string) => {
    const container = scrollRef.current
    const el = container?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    if (container && el) container.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
  }

  return { scrollRef, activeId, onJump }
}
