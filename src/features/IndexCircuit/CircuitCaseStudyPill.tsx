import type { CircuitCaseStudy } from './circuitData'
import styles from './IndexCircuit.module.css'

interface CircuitCaseStudyPillProps {
  study: CircuitCaseStudy
}

export default function CircuitCaseStudyPill({ study }: CircuitCaseStudyPillProps) {
  return (
    <g data-case-study={study.id}>
      {study.accentLine && (
        <line
          x1={study.accentLine.x}
          y1={study.accentLine.y1}
          x2={study.accentLine.x}
          y2={study.accentLine.y2}
          className={styles.stroke}
        />
      )}
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
