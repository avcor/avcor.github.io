import type { CircuitDomain } from './circuitData'
import { LABEL_LINE_HEIGHT } from './circuitData'
import styles from './IndexCircuit.module.css'

interface CircuitDomainChipProps {
  domain: CircuitDomain
}

export default function CircuitDomainChip({ domain }: CircuitDomainChipProps) {
  const { rect, label } = domain
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
      <text className={styles.text}>
        {domain.lines.map((line, i) => (
          <tspan key={line} x={label.x} y={label.y + i * LABEL_LINE_HEIGHT}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}
