import type { CircuitCaseStudy } from './circuitData'
import styles from './IndexCircuit.module.css'

interface CircuitCaseStudyPillProps {
  study: CircuitCaseStudy
  isHighlighted?: boolean
  onHoverChange?: (hovered: boolean) => void
}

export default function CircuitCaseStudyPill({
  study,
  isHighlighted = false,
  onHoverChange,
}: CircuitCaseStudyPillProps) {
  return (
    <g data-case-study={study.id}>
      <path
        d={study.pillPath}
        className={`${styles.stroke} ${styles.hoverTarget}`}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
      />
      {isHighlighted && (
        <g className={styles.wireNeon}>
          {([styles.wireGlowFar, styles.wireGlowMid, styles.wireGlowCore, styles.wireGlowHot] as const).map(
            (glowClass) => (
              <path key={glowClass} d={study.pillPath} className={glowClass} pointerEvents="none" />
            ),
          )}
        </g>
      )}
      <circle
        cx={study.dot.cx}
        cy={study.dot.cy}
        r={2}
        className={isHighlighted ? `${styles.dot} ${styles.dotHighlight}` : styles.dot}
      />
      <text
        x={study.text.x}
        y={study.text.y}
        dominantBaseline="central"
        className={`${styles.text} ${styles.pillText}`}
      >
        {study.label}
      </text>
    </g>
  )
}
