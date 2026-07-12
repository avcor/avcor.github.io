import { useEffect, useState, type CSSProperties, type RefObject } from 'react'

/** How much of the circuit's natural width may bleed left, at most. */
const DESIRED_BLEED_RATIO = 0.35
/** Breathing room kept between the left panel's edge and the bleed marker. */
const EDGE_BUFFER_PX = 16

const NO_BLEED: CSSProperties = { marginLeft: 0, width: '100%' }

function getStackBreakpoint(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--bp-md')
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? 768 : parsed
}

/**
 * Computes a marginLeft/width pair that lets the circuit board bleed left,
 * underneath the left panel, without ever pushing the given marker fraction
 * (a horizontal position within the circuit's own width) past the panel's
 * right edge — keeping whatever sits at that marker clear of panel text.
 */
export function useCircuitBleed(
  leftPanelRef: RefObject<HTMLElement | null>,
  rightColumnRef: RefObject<HTMLElement | null>,
  markerFraction: number,
): CSSProperties {
  const [style, setStyle] = useState<CSSProperties>(NO_BLEED)

  useEffect(() => {
    const leftPanel = leftPanelRef.current
    const rightColumn = rightColumnRef.current
    if (!leftPanel || !rightColumn) return

    const measure = () => {
      if (window.innerWidth <= getStackBreakpoint()) {
        setStyle(NO_BLEED)
        return
      }

      const leftPanelRect = leftPanel.getBoundingClientRect()
      const rightColumnRect = rightColumn.getBoundingClientRect()
      const naturalWidth = rightColumnRect.width
      const naturalMarkerX = rightColumnRect.left + markerFraction * naturalWidth

      const maxAllowedBleed = Math.max(0, naturalMarkerX - leftPanelRect.right - EDGE_BUFFER_PX)
      const bleed = Math.min(naturalWidth * DESIRED_BLEED_RATIO, maxAllowedBleed)

      setStyle({ marginLeft: -bleed, width: `calc(100% + ${bleed}px)` })
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(leftPanel)
    observer.observe(rightColumn)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [leftPanelRef, rightColumnRef, markerFraction])

  return style
}
