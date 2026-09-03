import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Tracks which section is currently in view, for a scrollspy nav. Sections
 * are matched by `id`. A section counts as visible while it overlaps a thin
 * activation band near the top-third of the viewport; the active section is
 * the topmost visible one, so the highlight advances in order as the reader
 * scrolls.
 *
 * Pass `rootRef` to scope this to a scrolling container's own viewport (a
 * gallery's inner scroll panel). Omit it to spy on the browser window itself,
 * for a page with no scroll container of its own (stacked full-viewport
 * sections scrolled natively).
 */
export function useScrollSpy(ids: string[], rootRef?: RefObject<HTMLElement | null>) {
  const [activeId, setActiveId] = useState(ids[0] ?? '')
  const visible = useRef<Set<string>>(new Set())

  useEffect(() => {
    const root = rootRef ? rootRef.current : null
    if (rootRef && !root) return
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

    const scope: ParentNode = root ?? document
    ids
      .map((id) => scope.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
      .filter((el): el is HTMLElement => el != null)
      .forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [ids, rootRef])

  return activeId
}
