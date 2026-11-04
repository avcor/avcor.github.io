import { useEffect, useId, useRef, useState } from 'react'
import { cubicBezier } from './cubicBezier'
import styles from './IndexCircuit.module.css'

interface CircuitWirePulseProps {
  /** Concatenated path data for the full route the pulse should travel (leaf → domain → center) */
  d: string
  /** Unique key identifying the currently hovered target, changing it restarts the pulse cleanly */
  pulseKey: string
  /** Travel the path end → start instead, used when current should flow
   *  outward from the center chip rather than inward toward it */
  reverse?: boolean
  /** Wait this long before the head appears and starts moving, in ms */
  delay?: number
  /** Time for one full traversal, in ms */
  duration?: number
  /** Loop forever (hover) or travel once and rest at the end (power-on) */
  repeat?: boolean
  /** Maps linear time 0–1 to path progress 0–1 */
  ease?: (t: number) => number
}

/** Duration of one full traversal of the path, in ms */
const TRAVEL_DURATION = 1300

/** Eases the head's motion so it surges and settles like current through a
 *  PCB trace instead of crawling at constant speed. */
const EASE = cubicBezier(0.45, 0, 0.15, 1)

/**
 * Renders a single traveling electrical pulse along an SVG path: a bright
 * head orb with an 8–12px Gaussian-blurred bloom. The wire's own stroke
 * color never changes, this layer is the entire hover effect. Position is
 * driven by rAF + getPointAtLength (eased, not linear) so the motion surges
 * and settles like current through a PCB trace, not a dot crawling at
 * constant speed.
 */
export default function CircuitWirePulse({
  d,
  pulseKey,
  reverse = false,
  delay = 0,
  duration = TRAVEL_DURATION,
  repeat = true,
  ease = EASE,
}: CircuitWirePulseProps) {
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
      const sinceStart = now - start - delay
      if (sinceStart < 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const done = !repeat && sinceStart >= duration
      const linear = done ? 1 : (sinceStart % duration) / duration
      const progress = reverse ? 1 - ease(linear) : ease(linear)
      const point = path.getPointAtLength(progress * pathLength)
      headGroup.setAttribute('transform', `translate(${point.x} ${point.y})`)
      headGroup.setAttribute('visibility', 'visible')
      if (!done) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [pathLength, pulseKey, reverse, delay, duration, repeat, ease])

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

      {/* Head, blurred bloom halo behind a small sharp core, exact position
       *  via getPointAtLength. Hidden until the first tick places it, so it
       *  never flashes at the SVG origin or waits visibly during a delay. */}
      <g ref={headGroupRef} visibility="hidden">
        <circle r={3.2} className={styles.pulseHead} style={{ filter: `url(#${blurHead})` }} />
        <circle r={1.1} className={styles.pulseHeadCore} />
      </g>
    </g>
  )
}
