import { useEffect, useRef, useState } from 'react'
import styles from './IndexCircuit.module.css'

interface CircuitWireIdleGlowProps {
  /** Wire path data, verbatim from the blueprint */
  d: string
}

/** Symmetric brightness bands centered on the path's own midpoint, in
 *  viewBox units (narrowest/brightest first) — layering them creates a
 *  hotspot that smoothly fades toward both ends instead of a hard edge. */
const HOTSPOT_BANDS = [
  { halfWidth: 14, className: 'idleHotspotInner' },
  { halfWidth: 38, className: 'idleHotspotMid' },
  { halfWidth: 76, className: 'idleHotspotOuter' },
] as const

function centeredBandDash(pathLength: number, halfWidth: number) {
  const visible = Math.min(halfWidth * 2, pathLength)
  const midpoint = pathLength / 2
  return {
    strokeDasharray: `${visible} ${Math.max(pathLength - visible, 0)}`,
    strokeDashoffset: pathLength - midpoint + visible / 2,
  }
}

/**
 * The default, non-hover look of a circuit wire: a 1px sharp warm-white
 * core with a soft blurred bloom, brightest at the path's own midpoint and
 * gradually dimming toward both ends — a dormant sensor line rather than a
 * flat blueprint outline. No shapes, no motion; hover-state glow layers
 * render separately on top of this.
 */
export default function CircuitWireIdleGlow({ d }: CircuitWireIdleGlowProps) {
  const measureRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)

  useEffect(() => {
    setPathLength(measureRef.current?.getTotalLength() ?? 0)
  }, [d])

  return (
    <g className={styles.idleWire}>
      <path ref={measureRef} d={d} fill="none" stroke="none" />
      <path d={d} className={styles.idleGlowHalo} />
      <path d={d} className={styles.idleCore} />
      {pathLength > 0 &&
        HOTSPOT_BANDS.map(({ halfWidth, className }) => (
          <path key={className} d={d} className={styles[className]} {...centeredBandDash(pathLength, halfWidth)} />
        ))}
    </g>
  )
}
