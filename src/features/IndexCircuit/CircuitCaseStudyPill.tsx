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
