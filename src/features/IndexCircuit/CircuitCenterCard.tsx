import { useId, type CSSProperties } from 'react'
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
/** Smoke texture tint, as an `feColorMatrix` RGBA row set — SVG filter
 *  primitives can't read CSS custom properties, so the idle (warm-white)
 *  and highlighted (neon green, matching `--color-primary`) tints are
 *  hardcoded here, mirroring the fixed-color approach in
 *  CircuitChipNoise.tsx. Highlighted uses a much higher alpha so the haze
 *  reads as a bright neon glow instead of a faint idle haze. */
const SMOKE_TINT = {
  idle: '0 0 0 0 0.97  0 0 0 0 0.99  0 0 0 0 0.91  0 0 0 0.5 0',
  highlighted: '0 0 0 0 0.357  0 0 0 0 1  0 0 0 0 0.416  0 0 0 0.95 0',
} as const

const GRID_DOTS = (() => {
  const { rect } = CIRCUIT_CENTER_CARD
  const cols = Math.floor(rect.width / GRID_SPACING)
  const rows = Math.floor(rect.height / GRID_SPACING)
  const offsetX = rect.x + (rect.width - cols * GRID_SPACING) / 2
  const offsetY = rect.y + (rect.height - rows * GRID_SPACING) / 2
  const halfWidth = rect.width / 2
  const halfHeight = rect.height / 2

  const dots: { x: number; y: number }[] = []
  for (let iy = 0; iy <= rows; iy++) {
    for (let ix = 0; ix <= cols; ix++) {
      const x = offsetX + ix * GRID_SPACING
      const y = offsetY + iy * GRID_SPACING
      const distToEdgeX = Math.min(x - rect.x, rect.x + rect.width - x) / halfWidth
      const distToEdgeY = Math.min(y - rect.y, rect.y + rect.height - y) / halfHeight
      const distFromEdge = Math.min(distToEdgeX, distToEdgeY)

      const { skip } = DENSITY_BANDS.find((band) => distFromEdge < band.upTo) ?? DENSITY_BANDS[3]
      if (ix % skip === 0 && iy % skip === 0) dots.push({ x, y })
    }
  }
  return dots
})()

/**
 * The premium microchip-style hub card every trunk wire converges into:
 * transparent background, a faint dotted matrix grid, a thin border, and a
 * static smoke haze hugging the border (fading out toward the center) all
 * always visible (idle warm-white, matching the wires at rest — no fill);
 * the center "AV" label's bloom halo only shows — in neon green — while
 * something on the board is hovered/highlighted.
 */
export default function CircuitCenterCard({ isHighlighted = false }: CircuitCenterCardProps) {
  const { rect, label } = CIRCUIT_CENTER_CARD
  const cardClipId = useId()
  const smokeFilterId = useId()
  const smokeMaskId = useId()
  const smokeGradientId = useId()
  const centerX = rect.x + rect.width / 2
  const centerY = rect.y + rect.height / 2
  const accentStyle: AccentCSSProperties = {
    '--center-card-accent': isHighlighted ? 'var(--color-primary)' : 'var(--color-idle-glow)',
  }

  return (
    <g aria-hidden="true" style={accentStyle}>
      <defs>
        <clipPath id={cardClipId}>
          <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx={rect.rx} />
        </clipPath>

        {/* Smoke texture — a fixed (non-animated) noise field, masked so
         *  it's only visible right at the border and fades to nothing
         *  toward the center. The alpha contrast boost keeps it reading as
         *  mottled wisps rather than a flat blob; tinted warm-white idle /
         *  brighter neon green on highlight. */}
        <filter id={smokeFilterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="4" seed="7" result="noise" />
          <feComponentTransfer in="noise" result="noise">
            <feFuncA type="gamma" amplitude="1" exponent={isHighlighted ? 1.6 : 2.2} offset="0" />
          </feComponentTransfer>
          <feColorMatrix in="noise" type="matrix" values={isHighlighted ? SMOKE_TINT.highlighted : SMOKE_TINT.idle} />
        </filter>
        <radialGradient id={smokeGradientId} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" stopOpacity="1" />
        </radialGradient>
        <mask id={smokeMaskId}>
          <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill={`url(#${smokeGradientId})`} />
        </mask>
      </defs>

      {/* Fine dotted matrix grid, densest at the border — transparent background otherwise */}
      <g clipPath={`url(#${cardClipId})`}>
        {GRID_DOTS.map(({ x, y }, i) => (
          <rect key={i} x={x - 0.7} y={y - 0.7} width="1.4" height="1.4" className={styles.centerCardGridDot} />
        ))}
      </g>

      {/* Border smoke — always visible, brightest right at the edge and
       *  fading out well before the center; subtle warm-white haze at
       *  rest, brighter neon-green glow while something on the board is
       *  hovered/highlighted */}
      <g
        className={isHighlighted ? styles.centerCardSmokeHighlighted : styles.centerCardSmoke}
        clipPath={`url(#${cardClipId})`}
        mask={`url(#${smokeMaskId})`}
      >
        <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} filter={`url(#${smokeFilterId})`} />
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

      {/* Center label — crisp text always visible, bloom halo only on highlight */}
      {isHighlighted && (
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
