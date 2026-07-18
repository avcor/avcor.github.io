import { useEffect, useState, type CSSProperties, type RefObject } from 'react'

/** How much of the circuit's natural width may bleed left, at most. */
const DESIRED_BLEED_RATIO = 0.35
/** Breathing room kept between a bleed marker and the edge it must clear. */
const EDGE_BUFFER_PX = 40

const NO_BLEED: CSSProperties = { marginLeft: 0, width: '100%' }

function getStackBreakpoint(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--bp-md')
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? 768 : parsed
}

/**
 * Computes a marginLeft/width pair that lets the circuit board bleed left,
 * underneath the left panel, without ever pushing `leftMarkerFraction` past
 * the panel's right edge — then grows the board further to the right,
 * shifting its content rightward without ever pushing `rightMarkerFraction`
 * past the viewport's right edge.
 */
export function useCircuitBleed(
  leftPanelRef: RefObject<HTMLElement | null>,
  rightColumnRef: RefObject<HTMLElement | null>,
  leftMarkerFraction: number,
  rightMarkerFraction: number,
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
      const naturalLeftMarkerX = rightColumnRect.left + leftMarkerFraction * naturalWidth
      const naturalRightMarkerX = rightColumnRect.left + rightMarkerFraction * naturalWidth

      // Right bleed: grow the board wider on the right so the right marker
      // shifts rightward, capped so it stays EDGE_BUFFER_PX clear of the
      // viewport's right edge. Solved first, independent of left bleed —
      // widening the board only ever moves the right marker further right.
      const targetRightMarkerX = window.innerWidth - EDGE_BUFFER_PX
      const rightBleed = Math.max(
        0,
        (targetRightMarkerX - naturalRightMarkerX) / rightMarkerFraction,
      )

      // Left bleed: slide the board left, underneath the left panel, capped
      // so the left marker never crosses the panel's right edge. The right
      // bleed above also scales the board, nudging the left marker rightward
      // too, so that has to be priced in before solving for how much further
      // left the board can slide.
      const midLeftMarkerX = naturalLeftMarkerX + leftMarkerFraction * rightBleed
      const maxAllowedLeftBleed = Math.max(
        0,
        (midLeftMarkerX - leftPanelRect.right - EDGE_BUFFER_PX) / (1 - leftMarkerFraction),
      )
      const leftBleed = Math.min(naturalWidth * DESIRED_BLEED_RATIO, maxAllowedLeftBleed)

      setStyle({
        marginLeft: -leftBleed,
        width: `calc(100% + ${leftBleed + rightBleed}px)`,
      })
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
  }, [leftPanelRef, rightColumnRef, leftMarkerFraction, rightMarkerFraction])

  return style
}
