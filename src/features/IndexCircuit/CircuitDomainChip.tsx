import { useId } from 'react'
import CircuitChipNoise from './CircuitChipNoise'
import type { CircuitDomain } from './circuitData'
import { CIRCUIT_WIRES, LABEL_CHIP_GAP, LABEL_LINE_HEIGHT } from './circuitData'
import styles from './IndexCircuit.module.css'
import { tracePathVertices } from './pathGeometry'

interface CircuitDomainChipProps {
  domain: CircuitDomain
  isHighlighted?: boolean
  onHoverChange?: (hovered: boolean) => void
}

const ICON_SIZE = 18

/** Every wire vertex on the blueprint, computed once — reused across every
 *  chip's nearest-wire lookup below instead of re-tracing all wires per chip. */
const ALL_WIRE_VERTICES = CIRCUIT_WIRES.flatMap((wire) => tracePathVertices(wire.d))

/** How much of the space to the nearest wire the framing box actually
 *  uses — kept small so it hugs close to the chip's own box instead of
 *  reaching all the way out to touch the wire. */
const FRAMING_GAP_FRACTION = 0.35

/** Corner radius as a fraction of width, matching the reference asset
 *  (Rectangle 4.svg: 47.3×49.3 box, rx 2.65 → ~0.056 of its width). */
const FRAMING_RX_RATIO = 2.65 / 47.3

/** A rounded rect framing the chip — same aspect ratio as the chip's own
 *  box, padded outward by a fraction of the space to the nearest wire on
 *  either side (within the chip's own vertical span), with rounded corners
 *  matching the reference asset. Not forced into a literal square. */
function getFramingBox(rect: CircuitDomain['rect']) {
  const top = rect.y
  const bottom = rect.y + rect.height
  const left = rect.x
  const right = rect.x + rect.width

  let leftGap = Infinity
  let rightGap = Infinity
  for (const vertex of ALL_WIRE_VERTICES) {
    if (vertex.y < top || vertex.y > bottom) continue
    if (vertex.x < left) leftGap = Math.min(leftGap, left - vertex.x)
    else if (vertex.x > right) rightGap = Math.min(rightGap, vertex.x - right)
  }

  const gap = Math.min(leftGap, rightGap) * FRAMING_GAP_FRACTION
  if (!Number.isFinite(gap)) return null

  const width = rect.width + gap * 2
  const height = rect.height + gap * 2

  return {
    x: rect.x - gap,
    y: rect.y - gap,
    width,
    height,
    rx: width * FRAMING_RX_RATIO,
  }
}

/** Green bloom layers for the framing box, shown only on hover — each
 *  rendered on a copy inflated by half its own stroke width, so its inner
 *  edge sits exactly on the (invisible) box edge and the whole stroke
 *  bleeds outward toward the nearest wire, rather than the default
 *  centered-on-path half-in/half-out spread. */
const FRAMING_GLOW_LAYERS = [
  { strokeWidth: 8, className: 'framingBoxGlowFar' },
  { strokeWidth: 4, className: 'framingBoxGlow' },
] as const

type FramingBox = NonNullable<ReturnType<typeof getFramingBox>>

function inflateBox(box: FramingBox, amount: number) {
  return {
    x: box.x - amount,
    y: box.y - amount,
    width: box.width + amount * 2,
    height: box.height + amount * 2,
    rx: box.rx + amount * FRAMING_RX_RATIO,
  }
}

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
            {/* objectBoundingBox spans the chip box horizontally —
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
