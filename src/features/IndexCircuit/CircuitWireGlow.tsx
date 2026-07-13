import { useEffect, useRef, useState } from 'react'
import styles from './IndexCircuit.module.css'

interface CircuitWireGlowProps {
  /** Wire path data, verbatim from the blueprint */
  d: string
  /** 'idle' (warm-white, always on) or 'active' (green, only while on the
   *  hovered route) — same diameters/falloff, different color and blend. */
  tone: 'idle' | 'active'
}

/** Symmetric brightness bands centered on the path's own midpoint, in
 *  viewBox units (narrowest/brightest first) — layering them creates a
 *  hotspot that smoothly fades toward both ends instead of a hard edge. */
const HOTSPOT_HALF_WIDTHS = [14, 38, 76] as const

const TONE_CLASSES = {
  idle: {
    group: 'idleWire',
    halo: 'idleGlowHalo',
    core: 'idleCore',
    bands: ['idleHotspotInner', 'idleHotspotMid', 'idleHotspotOuter'],
  },
  active: {
    group: 'activeWire',
    halo: 'activeGlowHalo',
    core: 'activeCore',
    bands: ['activeHotspotInner', 'activeHotspotMid', 'activeHotspotOuter'],
  },
} as const

function centeredBandDash(pathLength: number, halfWidth: number) {
  const visible = Math.min(halfWidth * 2, pathLength)
  const midpoint = pathLength / 2
  return {
    strokeDasharray: `${visible} ${Math.max(pathLength - visible, 0)}`,
    strokeDashoffset: pathLength - midpoint + visible / 2,
  }
}

/**
 * A circuit wire's glow, in either its dormant (`idle`, warm-white) or
 * hovered (`active`, green) tone: a 1px sharp core with a soft blurred
 * bloom, brightest at the path's own midpoint and gradually dimming
 * toward both ends — a sensor line rather than a flat blueprint outline
 * or a uniformly-lit highlight. No shapes, no motion.
 */
export default function CircuitWireGlow({ d, tone }: CircuitWireGlowProps) {
  const measureRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)
  const classes = TONE_CLASSES[tone]

  useEffect(() => {
    setPathLength(measureRef.current?.getTotalLength() ?? 0)
  }, [d])

  return (
    <g className={styles[classes.group]}>
      <path ref={measureRef} d={d} fill="none" stroke="none" />
      <path d={d} className={styles[classes.halo]} />
      <path d={d} className={styles[classes.core]} />
      {pathLength > 0 &&
        classes.bands.map((className, i) => (
          <path
            key={className}
            d={d}
            className={styles[className]}
            {...centeredBandDash(pathLength, HOTSPOT_HALF_WIDTHS[i])}
          />
        ))}
    </g>
  )
}
