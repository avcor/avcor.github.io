import { useId } from 'react'
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
  const gradientId = useId()

  return (
    <g data-case-study={study.id}>
      <path
        d={study.pillPath}
        className={`${styles.stroke} ${styles.hoverTarget}`}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
      />
      {isHighlighted && (
        <g className={styles.pillGlowGroup} aria-hidden="true">
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
          <path d={study.pillPath} className={styles.pillGlowHalo} stroke={`url(#${gradientId})`} />
          <path d={study.pillPath} className={styles.pillGlowCore} stroke={`url(#${gradientId})`} />
        </g>
      )}
      <circle
        cx={study.dot.cx}
        cy={study.dot.cy}
        r={2.2}
        className={isHighlighted ? `${styles.dot} ${styles.dotHighlight}` : styles.dot}
      />
      {/* Mirrored dot on the opposite side — reflected across the pill's own center */}
      <circle
        cx={study.text.x * 2 - study.dot.cx}
        cy={study.dot.cy}
        r={2.8}
        className={isHighlighted ? `${styles.dot} ${styles.dotHighlight}` : styles.dot}
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
