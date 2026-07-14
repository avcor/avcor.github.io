import { useId, useState, type CSSProperties } from 'react'
import { CIRCUIT_CENTER_CARD } from './circuitData'
import styles from './IndexCircuit.module.css'

interface CircuitCenterCardProps {
  /** Whether anything on the board is currently hovered/highlighted — the
   *  glow/bloom layers only show then; the base card is always visible.
   *  Also switches the grid/label color: the same idle warm-white used by
   *  the wires at rest, neon green while highlighted. */
  isHighlighted?: boolean
}

interface AccentCSSProperties extends CSSProperties {
  '--center-card-accent'?: string
}

/** Base spacing of the dotted matrix grid, in viewBox units — the finest
 *  spacing, used right at the border. */
const GRID_SPACING = 6

/** Distance-from-nearest-edge bands (0 = right at the edge, 1 = card
 *  center) mapped to how many grid cells are skipped between kept dots —
 *  1 keeps every dot (densest, at the border), 4 keeps only every 4th
 *  (sparsest, at the center), so density thins out band by band. */
const DENSITY_BANDS = [
  { upTo: 0.25, skip: 1 },
  { upTo: 0.5, skip: 2 },
  { upTo: 0.75, skip: 3 },
  { upTo: Infinity, skip: 4 },
] as const

/** Every matrix-grid dot's position, computed once — densest along the
 *  card's border, thinning out in concentric bands toward the center. */
const GRID_DOTS = (() => {
  const { rect } = CIRCUIT_CENTER_CARD
  const cols = Math.floor(rect.width / GRID_SPACING)
  const rows = Math.floor(rect.height / GRID_SPACING)
  const offsetX = rect.x + (rect.width - cols * GRID_SPACING) / 2
  const offsetY = rect.y + (rect.height - rows * GRID_SPACING) / 2
  const halfWidth = rect.width / 2
  const halfHeight = rect.height / 2

  const dots: { x: number; y: number; distFromEdge: number }[] = []
  for (let iy = 0; iy <= rows; iy++) {
    for (let ix = 0; ix <= cols; ix++) {
      const x = offsetX + ix * GRID_SPACING
      const y = offsetY + iy * GRID_SPACING
      const distToEdgeX = Math.min(x - rect.x, rect.x + rect.width - x) / halfWidth
      const distToEdgeY = Math.min(y - rect.y, rect.y + rect.height - y) / halfHeight
      const distFromEdge = Math.min(distToEdgeX, distToEdgeY)

      const { skip } = DENSITY_BANDS.find((band) => distFromEdge < band.upTo) ?? DENSITY_BANDS[3]
      if (ix % skip === 0 && iy % skip === 0) dots.push({ x, y, distFromEdge })
    }
  }
  return dots
})()

/** Hover-dot brightness falloff — matches the reference's dim-pinprick
 *  peak (0.25) right at the border, dimming linearly toward a faint floor
 *  at the card center, mirroring the idle grid's inward thinning. */
function hoverDotOpacity(distFromEdge: number): number {
  return Math.max(0.06, 0.25 * (1 - distFromEdge * 0.85))
}

/** Outward border-glow layers — brightest close to the border, softer and
 *  wider further out; each is rendered on a copy inflated by half its own
 *  stroke width so the bloom escapes the box without lighting its inside. */
const OUTER_GLOW_LAYERS = [
  { strokeWidth: 8, className: 'centerCardOuterGlowFar' },
  { strokeWidth: 4, className: 'centerCardOuterGlowNear' },
  { strokeWidth: 1.5, className: 'centerCardOuterGlowEdge' },
] as const

/**
 * The premium microchip-style hub card every trunk wire converges into:
 * transparent background, a faint dotted matrix grid, and a thin border,
 * all always visible (idle warm-white, matching the wires at rest — no
 * fill); the neon treatment (border strip + green dot matrix + the center
 * "AV" label's bloom halo) fires while the card is hovered or something on
 * the board is hovered/highlighted.
 */
export default function CircuitCenterCard({ isHighlighted = false }: CircuitCenterCardProps) {
  const { rect, label } = CIRCUIT_CENTER_CARD
  const [isCardHovered, setIsCardHovered] = useState(false)
  /** The neon treatment (border strip + green dot matrix) fires both when
   *  the card itself is hovered and whenever a wire path is glowing —
   *  i.e. anything on the board is hovered/highlighted. */
  const isGlowing = isCardHovered || isHighlighted
  const cardClipId = useId()
  const centerX = rect.x + rect.width / 2
  const centerY = rect.y + rect.height / 2
  const accentStyle: AccentCSSProperties = {
    '--center-card-accent': isGlowing ? 'var(--color-primary)' : 'var(--color-idle-glow)',
  }

  return (
    <g aria-hidden="true" style={accentStyle}>
      <defs>
        <clipPath id={cardClipId}>
          <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx={rect.rx} />
        </clipPath>
      </defs>

      {/* Fine dotted matrix grid — densest at the border, thinning toward
       *  the center; the same pattern in both states, switching from the
       *  idle accent to dim green dots (brightest at the border, fading
       *  inward) while the card is hovered or a wire path is glowing
       *  (single blur filter on the group, not per-dot, so it stays cheap
       *  with hundreds of dots) */}
      <g
        clipPath={`url(#${cardClipId})`}
        className={isGlowing ? styles.centerCardGridGroupHovered : undefined}
      >
        {GRID_DOTS.map(({ x, y, distFromEdge }, i) => (
          <rect
            key={i}
            x={x - 0.7}
            y={y - 0.7}
            width="1.4"
            height="1.4"
            className={
              isGlowing
                ? `${styles.centerCardGridDot} ${styles.centerCardGridDotHovered}`
                : styles.centerCardGridDot
            }
            style={isGlowing ? { opacity: hoverDotOpacity(distFromEdge) } : undefined}
          />
        ))}
      </g>

      {/* Card border — same idle warm-white as the default (non-hover) wire
       *  core, switching to neon green alongside everything else on highlight */}
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        rx={rect.rx}
        className={styles.centerCardBorder}
      />

      {/* Border glow, shown while the card is hovered or a wire path is
       *  glowing — light escaping outward from the card's outer box. Each
       *  layer is a copy inflated by half its own stroke width, so its
       *  inner edge sits exactly on the border and the whole blurred
       *  stroke bleeds outward only — nothing spills inside the card.
       *  Same outward-bleed technique as the sub chips' framing box glow
       *  in CircuitDomainChip.tsx. */}
      {isGlowing && (
        <g className={styles.centerGlowGroup} aria-hidden="true">
          {OUTER_GLOW_LAYERS.map(({ strokeWidth, className }) => {
            const inset = strokeWidth / 2
            return (
              <rect
                key={className}
                x={rect.x - inset}
                y={rect.y - inset}
                width={rect.width + strokeWidth}
                height={rect.height + strokeWidth}
                rx={rect.rx + inset}
                className={styles[className]}
              />
            )
          })}
        </g>
      )}

      {/* Invisible hit target covering the whole card, driving the hover
       *  glow above */}
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        rx={rect.rx}
        fill="transparent"
        className={styles.centerCardHoverTarget}
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
      />

      {/* Center label — crisp text always visible, bloom halo only while
       *  the card is hovered or a wire path is glowing */}
      {isGlowing && (
        <text x={centerX} y={centerY} dominantBaseline="central" className={styles.centerCardLabelGlow}>
          {label}
        </text>
      )}
      <text x={centerX} y={centerY} dominantBaseline="central" className={styles.centerCardLabel}>
        {label}
      </text>
    </g>
  )
}
