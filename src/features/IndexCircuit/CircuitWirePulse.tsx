import { useEffect, useId, useRef, useState } from 'react'
import styles from './IndexCircuit.module.css'

interface CircuitWirePulseProps {
  /** Concatenated path data for the full route the pulse should travel (leaf → domain → center) */
  d: string
  /** Unique key identifying the currently hovered target — changing it restarts the pulse cleanly */
  pulseKey: string
}

/** Duration of one full traversal of the path, in ms */
const TRAVEL_DURATION = 3200

/** Eases the head's motion so it surges and settles like current through a
 *  PCB trace instead of crawling at constant speed. */
const EASE = cubicBezier(0.45, 0, 0.15, 1)

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const bezierPoint = (t: number, p1: number, p2: number) =>
    3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t

  return (t: number) => {
    let lo = 0
    let hi = 1
    let mid = t
    for (let i = 0; i < 8; i++) {
      mid = (lo + hi) / 2
      const x = bezierPoint(mid, x1, x2)
      if (x < t) lo = mid
      else hi = mid
    }
    return bezierPoint(mid, y1, y2)
  }
}

/** Trail layers, in SVG viewBox units — a short bright body right behind the
 *  head, then progressively longer + dimmer layers so the 200–400 unit tail
 *  reads as a smooth, continuous fade. Each is a polyline built from the
 *  head's own recent sampled positions, so it is always physically attached
 *  to the moving ball (never a separately-animated, potentially-drifting dash). */
const TRAIL_LAYERS = [
  { length: 20, className: 'pulseTrailBody', blurTier: 'sm' },
  { length: 80, className: 'pulseTrailTail1', blurTier: 'sm' },
  { length: 180, className: 'pulseTrailTail2', blurTier: 'md' },
  { length: 320, className: 'pulseTrailTail3', blurTier: 'md' },
  { length: 480, className: 'pulseTrailTail4', blurTier: 'lg' },
] as const

const MAX_TRAIL_LENGTH = TRAIL_LAYERS[TRAIL_LAYERS.length - 1].length

interface TrailSample {
  len: number
  x: number
  y: number
}

/**
 * Renders a single traveling electrical pulse along an SVG path: a bright
 * head orb with an 8–12px Gaussian-blurred bloom, and a long feathered tail
 * that fades to nothing behind it. The wire's own stroke color never
 * changes — this layer is the entire hover effect. Every frame, the head's
 * position (rAF + getPointAtLength, eased) is sampled into a rolling buffer,
 * and each trail layer is redrawn as a polyline through the most recent
 * slice of that buffer — so the tail is always literally attached to the
 * ball, not a separately-timed animation that can drift apart from it.
 */
export default function CircuitWirePulse({ d, pulseKey }: CircuitWirePulseProps) {
  const filterId = useId()
  const measureRef = useRef<SVGPathElement>(null)
  const headGroupRef = useRef<SVGGElement>(null)
  const trailRefs = useRef<(SVGPolylineElement | null)[]>([])
  const bufferRef = useRef<TrailSample[]>([])
  const lastLenRef = useRef(0)
  const rafRef = useRef<number>(0)
  const [pathLength, setPathLength] = useState(0)

  useEffect(() => {
    const length = measureRef.current?.getTotalLength() ?? 0
    setPathLength(length)
  }, [d])

  useEffect(() => {
    if (!pathLength) return
    const path = measureRef.current
    const headGroup = headGroupRef.current
    if (!path || !headGroup) return

    bufferRef.current = []
    lastLenRef.current = 0
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = (now - start) % TRAVEL_DURATION
      const linear = elapsed / TRAVEL_DURATION
      const progress = EASE(linear)
      const len = progress * pathLength
      const point = path.getPointAtLength(len)

      headGroup.setAttribute('transform', `translate(${point.x} ${point.y})`)

      const buffer = bufferRef.current
      const prev = buffer[buffer.length - 1]
      const lenDelta = len - lastLenRef.current
      const spatialJump = prev ? Math.hypot(point.x - prev.x, point.y - prev.y) : 0

      // A new loop started (len jumped back to ~0), or the route crossed a
      // gap between two disconnected wire segments (e.g. behind a domain
      // chip) where the path data jumps via an invisible "moveto" — either
      // way, drop the old tail instead of drawing a straight line across
      // the gap / snapping across the path.
      if (len < lastLenRef.current || spatialJump > lenDelta + 1.5) buffer.length = 0
      lastLenRef.current = len

      buffer.push({ len, x: point.x, y: point.y })
      while (buffer.length > 1 && len - buffer[0].len > MAX_TRAIL_LENGTH) buffer.shift()

      TRAIL_LAYERS.forEach((layer, i) => {
        const el = trailRefs.current[i]
        if (!el) return
        const cutoff = len - layer.length
        let points = ''
        for (const sample of buffer) {
          if (sample.len < cutoff) continue
          points += `${sample.x},${sample.y} `
        }
        points += `${point.x},${point.y}`
        el.setAttribute('points', points)
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [pathLength, pulseKey])

  const blurUrl = {
    sm: `${filterId}-sm`,
    md: `${filterId}-md`,
    lg: `${filterId}-lg`,
  } as const
  const blurHead = `${filterId}-head`

  if (!pathLength) {
    return (
      <g aria-hidden="true">
        <path ref={measureRef} d={d} fill="none" stroke="none" />
      </g>
    )
  }

  return (
    <g key={pulseKey} className={styles.pulseGroup} aria-hidden="true">
      <defs>
        <filter id={blurUrl.sm} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        <filter id={blurUrl.md} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <filter id={blurUrl.lg} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
        <filter id={blurHead} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      <path ref={measureRef} d={d} fill="none" stroke="none" />

      {TRAIL_LAYERS.map(({ className, blurTier }, i) => (
        <polyline
          key={className}
          ref={(el) => {
            trailRefs.current[i] = el
          }}
          className={`${styles.pulseTrail} ${styles[className]}`}
          style={{ filter: `url(#${blurUrl[blurTier]})` }}
        />
      ))}

      {/* Head — blurred bloom halo behind a small sharp core, exact position via getPointAtLength */}
      <g ref={headGroupRef}>
        <circle r={3.2} className={styles.pulseHead} style={{ filter: `url(#${blurHead})` }} />
        <circle r={1.1} className={styles.pulseHeadCore} />
      </g>
    </g>
  )
}
