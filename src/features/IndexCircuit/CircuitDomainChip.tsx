import type { CircuitDomain } from './circuitData'
import { LABEL_CHIP_GAP, LABEL_LINE_HEIGHT } from './circuitData'
import styles from './IndexCircuit.module.css'

interface CircuitDomainChipProps {
  domain: CircuitDomain
  isHighlighted?: boolean
  onHoverChange?: (hovered: boolean) => void
}

const ICON_SIZE = 18

export default function CircuitDomainChip({
  domain,
  isHighlighted = false,
  onHoverChange,
}: CircuitDomainChipProps) {
  const { rect, lines, icon: Icon } = domain
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
        className={`${styles.stroke} ${styles.hoverTarget}`}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
      />
      <Icon
        x={rect.x + (rect.width - ICON_SIZE) / 2}
        y={rect.y + (rect.height - ICON_SIZE) / 2}
        width={ICON_SIZE}
        height={ICON_SIZE}
        className={isHighlighted ? `${styles.chipIcon} ${styles.chipIconHighlight}` : styles.chipIcon}
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
