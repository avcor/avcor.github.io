import { useEffect, useRef, useState, type CSSProperties } from 'react'
import styles from './IndexCircuit.module.css'

interface CircuitWirePulseProps {
  /** Concatenated path data for the full route the pulse should travel (leaf → domain → center) */
  d: string
  /** Unique key identifying the currently hovered target — changing it restarts the pulse cleanly */
  pulseKey: string
}

/** Duration of one full traversal of the path, in ms */
const TRAVEL_DURATION = 1500
/** Trailing dash lengths, in SVG viewBox units, from nearest-the-head to furthest.
 *  Stacking three progressively longer + dimmer dashes at the same offset fakes a
 *  smooth feathered falloff without needing a gradient-along-a-curved-path. */
const TRAIL_LAYERS = [
  { length: 10, className: 'pulseTrailNear' },
  { length: 28, className: 'pulseTrailMid' },
  { length: 62, className: 'pulseTrailFar' },
] as const

interface PulseCSSProperties extends CSSProperties {
  '--pulse-length'?: number
  '--pulse-visible'?: number
  '--pulse-duration'?: string
}

/**
 * Renders a single traveling electrical pulse along an SVG path: a bright
 * head orb followed by a soft feathered trail that dissipates. The head's
 * position is driven by rAF + getPointAtLength so it follows the path
 * exactly; the trail is three stacked dashed strokes (near/mid/far, each
 * dimmer and longer) sharing one dashoffset animation, which reads as a
 * smooth feather rather than a hard-edged dash.
 */
export default function CircuitWirePulse({ d, pulseKey }: CircuitWirePulseProps) {
  const measureRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGCircleElement>(null)
  const rafRef = useRef<number>(0)
  const [pathLength, setPathLength] = useState(0)

  useEffect(() => {
    const length = measureRef.current?.getTotalLength() ?? 0
    setPathLength(length)
  }, [d])

  useEffect(() => {
    if (!pathLength) return
    const path = measureRef.current
    const head = headRef.current
    if (!path || !head) return

    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = (now - start) % TRAVEL_DURATION
      const progress = elapsed / TRAVEL_DURATION
      const point = path.getPointAtLength(progress * pathLength)
      head.setAttribute('cx', String(point.x))
      head.setAttribute('cy', String(point.y))
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [pathLength, pulseKey])

  if (!pathLength) {
    return (
      <g aria-hidden="true">
        <path ref={measureRef} d={d} fill="none" stroke="none" />
      </g>
    )
  }

  return (
    <g key={pulseKey} className={styles.pulseGroup} aria-hidden="true">
      <path ref={measureRef} d={d} fill="none" stroke="none" />

      {TRAIL_LAYERS.map(({ length, className }) => {
        const visible = Math.min(length, pathLength)
        const style: PulseCSSProperties = {
          '--pulse-length': pathLength,
          '--pulse-visible': visible,
          '--pulse-duration': `${TRAVEL_DURATION}ms`,
        }
        return (
          <path
            key={className}
            d={d}
            className={`${styles.pulseTrail} ${styles[className]}`}
            strokeDasharray={`${visible} ${Math.max(pathLength - visible, 0)}`}
            pathLength={pathLength}
            style={style}
          />
        )
      })}

      {/* Bright head orb — exact position via getPointAtLength */}
      <circle ref={headRef} r={2.6} className={styles.pulseHead} />
    </g>
  )
}
