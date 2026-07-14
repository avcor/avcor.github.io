import { useEffect, useRef, useState } from 'react'
import styles from './IndexCircuit.module.css'

interface CircuitWireGlowProps {
  /** Wire path data, verbatim from the blueprint */
  d: string
  /** 'idle' (thin flat line, always on) or 'active' (green, full glow —
   *  only while on the hovered route). */
  tone: 'idle' | 'active'
}

/** Symmetric brightness bands centered on the path's own midpoint, in
 *  viewBox units (narrowest/brightest first) — layering them creates a
 *  hotspot that smoothly fades toward both ends instead of a hard edge. */
const HOTSPOT_HALF_WIDTHS = [14, 38, 76] as const
const ACTIVE_BANDS = ['activeHotspotInner', 'activeHotspotMid', 'activeHotspotOuter'] as const

function centeredBandDash(pathLength: number, halfWidth: number) {
  const visible = Math.min(halfWidth * 2, pathLength)
  const midpoint = pathLength / 2
  return {
    strokeDasharray: `${visible} ${Math.max(pathLength - visible, 0)}`,
    strokeDashoffset: pathLength - midpoint + visible / 2,
  }
}

/**
 * A circuit wire's glow. In its dormant `idle` tone it's just a thin flat
 * core line — no bloom, no hotspot — kept minimal until hovered. In its
 * `active` (green) tone, hover adds the full treatment: a soft blurred
 * halo plus a hotspot brightest at the path's own midpoint, gradually
 * dimming toward both ends. No shapes, no motion.
 */
export default function CircuitWireGlow({ d, tone }: CircuitWireGlowProps) {
  if (tone === 'idle') {
    return (
      <g className={styles.idleWire}>
        <path d={d} className={styles.idleCore} />
      </g>
    )
  }

  return <ActiveWireGlow d={d} />
}

function ActiveWireGlow({ d }: { d: string }) {
  const measureRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)

  useEffect(() => {
    setPathLength(measureRef.current?.getTotalLength() ?? 0)
  }, [d])

  return (
    <g className={styles.activeWire}>
      <path ref={measureRef} d={d} fill="none" stroke="none" />
      <path d={d} className={styles.activeGlowHalo} />
      <path d={d} className={styles.activeCore} />
      {pathLength > 0 &&
        ACTIVE_BANDS.map((className, i) => (
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
