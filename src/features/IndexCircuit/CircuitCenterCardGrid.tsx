import { GRID_DOTS, hoverDotOpacity } from './circuitCenterCardGeometry'
import styles from './IndexCircuit.module.css'

interface CircuitCenterCardGridProps {
  isGlowing: boolean
  /** Clip path keeping the dots inside the card's rounded rect. */
  clipId: string
}

/**
 * Fine dotted matrix grid, densest at the border, thinning toward the
 * center. The same pattern in both states, switching from the idle accent to
 * dim green dots (brightest at the border, fading inward) while the card is
 * glowing. A single blur filter on the group, not per-dot, keeps it cheap
 * with hundreds of dots.
 */
export default function CircuitCenterCardGrid({ isGlowing, clipId }: CircuitCenterCardGridProps) {
  return (
    <g clipPath={`url(#${clipId})`} className={isGlowing ? styles.centerCardGridGroupHovered : undefined}>
      {GRID_DOTS.map(({ x, y, distFromEdge }, i) => (
        <rect
          key={i}
          x={x - 0.7}
          y={y - 0.7}
          width="1.4"
          height="1.4"
          className={
            isGlowing
              ? `${styles.centerCardGridDot} ${styles.centerCardGridDotHovered}`
              : styles.centerCardGridDot
          }
          style={isGlowing ? { opacity: hoverDotOpacity(distFromEdge) } : undefined}
        />
      ))}
    </g>
  )
}
