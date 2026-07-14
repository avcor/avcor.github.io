import { useId } from 'react'
import type { CircuitCaseStudy } from './circuitData'
import styles from './IndexCircuit.module.css'

interface CircuitCaseStudyPillProps {
  study: CircuitCaseStudy
  isHighlighted?: boolean
  /** Lights just the connector dots — set whenever the pill's wire is lit,
   *  including a center-chip hover where the rest of the pill stays at rest */
  isDotHighlighted?: boolean
  onHoverChange?: (hovered: boolean) => void
}

export default function CircuitCaseStudyPill({
  study,
  isHighlighted = false,
  isDotHighlighted = false,
  onHoverChange,
}: CircuitCaseStudyPillProps) {
  const gradientId = useId()

  return (
    <g data-case-study={study.id}>
      {/* Very faint outline at rest; the full blueprint stroke shows while
       *  the pill's wire is highlighted */}
      <path
        d={study.pillPath}
        className={`${isHighlighted ? styles.stroke : styles.nodeOutlineFaint} ${styles.hoverTarget}`}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
      />
      {isHighlighted && (
        <g className={styles.centerGlowGroup} aria-hidden="true">
          <defs>
            {/* objectBoundingBox spans the pill horizontally — transparent
                at the left edge, glowing brightest at the center, fading
                back to transparent at the right edge */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={study.pillPath} className={styles.centerGlowHalo} stroke={`url(#${gradientId})`} />
          <path d={study.pillPath} className={styles.centerGlowCore} stroke={`url(#${gradientId})`} />
        </g>
      )}
      <circle
        cx={study.dot.cx}
        cy={study.dot.cy}
        r={0.0}
        className={isDotHighlighted ? `${styles.dot} ${styles.dotHighlight}` : styles.dot}
      />
      {/* Wire-side connector dot — explicit placement from the blueprint */}
      <circle
        cx={study.innerDot.cx}
        cy={study.innerDot.cy}
        r={1.5}
        className={isDotHighlighted ? `${styles.dot} ${styles.dotHighlight}` : styles.dot}
      />
      <text
        x={study.text.x}
        y={study.text.y}
        dominantBaseline="central"
        className={`${styles.text} ${styles.pillText} ${isHighlighted ? styles.textHighlight : ''}`}
      >
        {study.label}
      </text>
    </g>
  )
}
