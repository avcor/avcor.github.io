import { useId } from 'react'
import CircuitChipNoise from './CircuitChipNoise'
import type { CircuitDomain } from './circuitData'
import { LABEL_CHIP_GAP, LABEL_LINE_HEIGHT } from './circuitData'
import { getFramingBox, inflateBox } from './circuitChipFraming'
import styles from './IndexCircuit.module.css'

interface CircuitDomainChipProps {
  domain: CircuitDomain
  isHighlighted?: boolean
  onHoverChange?: (hovered: boolean) => void
}

const ICON_SIZE = 18

/** Green bloom layers for the framing box, shown only on hover, each
 *  rendered on a copy inflated by half its own stroke width, so its inner
 *  edge sits exactly on the (invisible) box edge and the whole stroke
 *  bleeds outward toward the nearest wire, rather than the default
 *  centered-on-path half-in/half-out spread. */
const FRAMING_GLOW_LAYERS = [
  { strokeWidth: 8, className: 'framingBoxGlowFar' },
  { strokeWidth: 4, className: 'framingBoxGlow' },
] as const

export default function CircuitDomainChip({
  domain,
  isHighlighted = false,
  onHoverChange,
}: CircuitDomainChipProps) {
  const { rect, lines, icon: Icon } = domain
  const lastLineY = rect.y - LABEL_CHIP_GAP
  const firstLineY = lastLineY - (lines.length - 1) * LABEL_LINE_HEIGHT
  const framingBox = getFramingBox(rect)
  const gradientId = useId()

  return (
    <g data-domain={domain.id}>
      {isHighlighted &&
        framingBox &&
        FRAMING_GLOW_LAYERS.map(({ strokeWidth, className }) => {
          const glowBox = inflateBox(framingBox, strokeWidth / 2)
          return (
            <rect
              key={className}
              x={glowBox.x}
              y={glowBox.y}
              width={glowBox.width}
              height={glowBox.height}
              rx={glowBox.rx}
              className={styles[className]}
              pointerEvents="none"
            />
          )
        })}
      {isHighlighted && <CircuitChipNoise rect={rect} />}
      {/* Same faint at-rest outline as the leaf pills; the full blueprint
       *  stroke shows while the chip's wire is highlighted */}
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        rx={rect.rx}
        className={`${isHighlighted ? styles.stroke : styles.nodeOutlineFaint} ${styles.hoverTarget}`}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
      />
      {isHighlighted && (
        <g className={styles.centerGlowGroup} aria-hidden="true">
          <defs>
            {/* objectBoundingBox spans the chip box horizontally,
                transparent at the left edge, glowing brightest at the
                center, fading back to transparent at the right edge */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            rx={rect.rx}
            className={styles.centerGlowHalo}
            stroke={`url(#${gradientId})`}
          />
          <rect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            rx={rect.rx}
            className={styles.centerGlowCore}
            stroke={`url(#${gradientId})`}
          />
        </g>
      )}
      <Icon
        x={rect.x + (rect.width - ICON_SIZE) / 2}
        y={rect.y + (rect.height - ICON_SIZE) / 2}
        width={ICON_SIZE}
        height={ICON_SIZE}
        className={isHighlighted ? `${styles.chipIcon} ${styles.chipIconHighlight}` : styles.chipIcon}
      />
      <text
        className={`${styles.text} ${styles.textLeft} ${isHighlighted ? styles.textHighlight : ''}`}
      >
        {lines.map((line, i) => (
          <tspan key={line} x={rect.x} y={firstLineY + i * LABEL_LINE_HEIGHT}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}
