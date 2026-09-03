import { useCallback, useRef, useState } from 'react'

interface PanZoomOptions {
  minScale?: number
  maxScale?: number
  /** Multiplier applied per zoomIn()/zoomOut() step. */
  zoomStep?: number
}

interface Transform {
  scale: number
  x: number
  y: number
}

const DEFAULT_TRANSFORM: Transform = { scale: 1, x: 0, y: 0 }

/**
 * Pan/zoom for a fixed-size canvas (button-driven zoom, drag to pan),
 * clamped so the content can never be zoomed or panned fully out of view:
 * at scale 1 panning is locked (nothing to pan yet), and the max pan
 * distance grows only as fast as the content grows past the container edge,
 * so some part of it is always on screen. Zoom always anchors on the
 * container's own centre rather than the cursor, which keeps repeated
 * zooming from drifting the content toward an edge.
 *
 * Deliberately not wheel-driven: inside a page that itself scrolls, a wheel
 * gesture over the canvas is ambiguous (page scroll vs. zoom), so zoom is
 * button-only and drag remains the only gesture that needs disambiguating
 * from a click.
 */
export function usePanZoom({ minScale = 1, maxScale = 2.5, zoomStep = 1.3 }: PanZoomOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM)
  const [isDragging, setIsDragging] = useState(false)
  const pointerState = useRef<{
    startX: number
    startY: number
    originX: number
    originY: number
    dragging: boolean
    pointerId: number
  } | null>(null)

  const clamp = useCallback(
    (next: Transform): Transform => {
      const scale = Math.min(maxScale, Math.max(minScale, next.scale))
      const rect = containerRef.current?.getBoundingClientRect()
      const w = rect?.width ?? 0
      const h = rect?.height ?? 0
      const maxPanX = (w * (scale - 1)) / 2
      const maxPanY = (h * (scale - 1)) / 2
      return {
        scale,
        x: Math.min(maxPanX, Math.max(-maxPanX, next.x)),
        y: Math.min(maxPanY, Math.max(-maxPanY, next.y)),
      }
    },
    [minScale, maxScale],
  )

  const zoomIn = useCallback(() => {
    setTransform((t) => clamp({ ...t, scale: t.scale * zoomStep }))
  }, [clamp, zoomStep])

  const zoomOut = useCallback(() => {
    setTransform((t) => clamp({ ...t, scale: t.scale / zoomStep }))
  }, [clamp, zoomStep])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointerState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: transform.x,
      originY: transform.y,
      dragging: false,
      pointerId: e.pointerId,
    }
  }, [transform.x, transform.y])

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const s = pointerState.current
      if (!s) return
      const dx = e.clientX - s.startX
      const dy = e.clientY - s.startY

      // Below the threshold this is still a plain click, don't capture the
      // pointer or move anything, so a node's own onClick fires normally.
      if (!s.dragging) {
        if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return
        s.dragging = true
        setIsDragging(true)
        containerRef.current?.setPointerCapture(s.pointerId)
      }

      setTransform((t) => clamp({ ...t, x: s.originX + dx, y: s.originY + dy }))
    },
    [clamp],
  )

  const endDrag = useCallback(() => {
    const s = pointerState.current
    if (s?.dragging) {
      containerRef.current?.releasePointerCapture(s.pointerId)
      setIsDragging(false)
    }
    pointerState.current = null
  }, [])

  const reset = useCallback(() => setTransform(DEFAULT_TRANSFORM), [])

  const isZoomed = transform.scale > 1.01 || Math.abs(transform.x) > 1 || Math.abs(transform.y) > 1

  return {
    containerRef,
    transform,
    isDragging,
    isZoomed,
    reset,
    zoomIn,
    zoomOut,
    canZoomIn: transform.scale < maxScale - 0.01,
    canZoomOut: transform.scale > minScale + 0.01,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onPointerCancel: endDrag,
    },
  }
}
