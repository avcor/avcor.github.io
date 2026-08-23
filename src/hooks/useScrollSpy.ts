import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Tracks which section is currently in view inside a scroll container, for a
 * scrollspy nav. Sections are matched by `id` within `rootRef`. A section
 * counts as visible while it overlaps a thin activation band near the top-third
 * of the viewport; the active section is the topmost visible one, so the
 * highlight advances in order as the reader scrolls.
 */
export function useScrollSpy(ids: string[], rootRef: RefObject<HTMLElement | null>) {
  const [activeId, setActiveId] = useState(ids[0] ?? '')
  const visible = useRef<Set<string>>(new Set())

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    visible.current.clear()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.current.add(entry.target.id)
          else visible.current.delete(entry.target.id)
        }
        const topmost = ids.find((id) => visible.current.has(id))
        if (topmost) setActiveId(topmost)
      },
      { root, rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    )

    ids
      .map((id) => root.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
      .filter((el): el is HTMLElement => el != null)
      .forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [ids, rootRef])

  return activeId
}
