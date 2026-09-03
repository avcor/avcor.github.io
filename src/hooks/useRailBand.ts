import { useLayoutEffect, useRef, useState, type RefObject } from 'react'

interface RailBand {
  /** Attach to the flex row that holds the rail and the slide viewport. */
  containerRef: RefObject<HTMLDivElement | null>
  /** Attach to the left rail wrapper whose width should be mirrored. */
  railRef: RefObject<HTMLDivElement | null>
  /** Width of the left band (rail width + its outer margin), as a px string. */
  band: string
}

/**
 * Measures the left rail band, the distance from the container's left edge to
 * the rail's right edge (its content-driven width plus outer margin), so the
 * same amount of space can be mirrored on the right, centering the slide content
 * on the page without hard-coding the rail width. Returns '0px' when the rail is
 * hidden (below the desktop breakpoint) so the mirror collapses automatically.
 */
export function useRailBand(): RailBand {
  const containerRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [band, setBand] = useState('0px')

  useLayoutEffect(() => {
    const container = containerRef.current
    const rail = railRef.current
    if (!container || !rail) return

    const measure = () => {
      const railRect = rail.getBoundingClientRect()
      if (railRect.width === 0) {
        setBand('0px')
        return
      }
      const containerRect = container.getBoundingClientRect()
      setBand(`${Math.max(0, railRect.right - containerRect.left)}px`)
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(rail)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return { containerRef, railRef, band }
}
