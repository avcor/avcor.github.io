import type { CircuitCaseStudy } from './circuitData'
import styles from './IndexCircuit.module.css'

interface CircuitCaseStudyPillProps {
  study: CircuitCaseStudy
}

export default function CircuitCaseStudyPill({ study }: CircuitCaseStudyPillProps) {
  return (
    <g data-case-study={study.id}>
      <path d={study.pillPath} className={styles.stroke} />
      <circle cx={study.dot.cx} cy={study.dot.cy} r={1.5} className={styles.stroke} />
      <text
        x={study.text.x}
        y={study.text.y}
        dominantBaseline="central"
        className={styles.text}
      >
        {study.label}
      </text>
    </g>
  )
}
