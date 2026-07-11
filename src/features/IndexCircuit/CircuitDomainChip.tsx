import type { CircuitDomain } from './circuitData'
import { LABEL_CHIP_GAP, LABEL_LINE_HEIGHT } from './circuitData'
import styles from './IndexCircuit.module.css'

interface CircuitDomainChipProps {
  domain: CircuitDomain
}

export default function CircuitDomainChip({ domain }: CircuitDomainChipProps) {
  const { rect, lines } = domain
  const lastLineY = rect.y - LABEL_CHIP_GAP
  const firstLineY = lastLineY - (lines.length - 1) * LABEL_LINE_HEIGHT

  return (
    <g data-domain={domain.id}>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        rx={rect.rx}
        className={styles.stroke}
      />
      <text className={`${styles.text} ${styles.textLeft}`}>
        {lines.map((line, i) => (
          <tspan key={line} x={rect.x} y={firstLineY + i * LABEL_LINE_HEIGHT}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}
