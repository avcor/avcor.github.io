import { useEffect, useId, useRef, useState } from 'react'
import styles from './IndexCircuit.module.css'

interface CircuitWirePulseProps {
  /** Concatenated path data for the full route the pulse should travel (leaf → domain → center) */
  d: string
  /** Unique key identifying the currently hovered target — changing it restarts the pulse cleanly */
  pulseKey: string
}

/** Duration of one full traversal of the path, in ms */
const TRAVEL_DURATION = 1300

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

/**
 * Renders a single traveling electrical pulse along an SVG path: a bright
 * head orb with an 8–12px Gaussian-blurred bloom. The wire's own stroke
 * color never changes — this layer is the entire hover effect. Position is
 * driven by rAF + getPointAtLength (eased, not linear) so the motion surges
 * and settles like current through a PCB trace, not a dot crawling at
 * constant speed.
 */
export default function CircuitWirePulse({ d, pulseKey }: CircuitWirePulseProps) {
  const filterId = useId()
  const measureRef = useRef<SVGPathElement>(null)
  const headGroupRef = useRef<SVGGElement>(null)
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

    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = (now - start) % TRAVEL_DURATION
      const linear = elapsed / TRAVEL_DURATION
      const progress = EASE(linear)
      const point = path.getPointAtLength(progress * pathLength)
      headGroup.setAttribute('transform', `translate(${point.x} ${point.y})`)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [pathLength, pulseKey])

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
        <filter id={blurHead} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      <path ref={measureRef} d={d} fill="none" stroke="none" />

      {/* Head — blurred bloom halo behind a small sharp core, exact position via getPointAtLength */}
      <g ref={headGroupRef}>
        <circle r={3.2} className={styles.pulseHead} style={{ filter: `url(#${blurHead})` }} />
        <circle r={1.1} className={styles.pulseHeadCore} />
      </g>
    </g>
  )
}
