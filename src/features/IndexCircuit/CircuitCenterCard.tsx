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

/** Soft bloom layers for the card's outer framing box — one blurred strip
 *  per edge, at increasing blur radii, so the light is strongest right at
 *  the edges and fades smoothly into the background. Each strip's stroke
 *  gradient fades to transparent before it reaches the corners, so the
 *  glow radiates from the four sides only — the corners stay dark. The
 *  box's interior is masked out entirely: no border, no inner glow, just
 *  energy radiating into the surrounding space. */
const OUTER_BOX_BLOOM_LAYERS = [
  { className: 'centerCardBloomNear', strokeWidth: 6, blur: 5 },
  { className: 'centerCardBloomMid', strokeWidth: 14, blur: 14 },
  { className: 'centerCardBloomFar', strokeWidth: 28, blur: 30 },
] as const

/** Where each edge strip's gradient reaches full strength — fading in from
 *  transparent at the corners over the first/last fraction of the edge. */
const BLOOM_CORNER_FADE = 0.22

/** Gradient stops for an edge strip: a smoothstep-eased fade in from the
 *  corner, flat through the middle, eased back out — a plain linear ramp
 *  produces Mach bands (a visible straight seam where the slope changes)
 *  once blurred, so the ease-in/out curve is sampled at several points. */
const BLOOM_GRADIENT_STOPS: { offset: number; opacity: number }[] = (() => {
  const SAMPLES = 6
  const stops: { offset: number; opacity: number }[] = []
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES
    const eased = t * t * (3 - 2 * t)
    stops.push({ offset: t * BLOOM_CORNER_FADE, opacity: eased })
  }
  const fadeIn = [...stops]
  const fadeOut = fadeIn
    .map(({ offset, opacity }) => ({ offset: 1 - offset, opacity }))
    .reverse()
  return [...fadeIn, ...fadeOut]
})()

/** How far past the outer box the bloom mask reaches — must comfortably
 *  exceed the largest bloom layer's full visible spread (~3× its blur
 *  radius plus half its stroke width), or the haze gets cut off in a
 *  hard straight line at the mask's edge. */
const BLOOM_MASK_MARGIN = 150

/**
 * The premium microchip-style hub card every trunk wire converges into:
 * transparent background, a faint dotted matrix grid, and a thin border,
 * all always visible (idle warm-white, matching the wires at rest — no
 * fill); the neon treatment (border strip + green dot matrix + the center
 * "AV" label's bloom halo) fires while the card is hovered or something on
 * the board is hovered/highlighted.
 */
export default function CircuitCenterCard({ isHighlighted = false }: CircuitCenterCardProps) {
  const { rect, outerRect, label } = CIRCUIT_CENTER_CARD
  const [isCardHovered, setIsCardHovered] = useState(false)
  /** The neon treatment (border strip + green dot matrix) fires both when
   *  the card itself is hovered and whenever a wire path is glowing —
   *  i.e. anything on the board is hovered/highlighted. */
  const isGlowing = isCardHovered || isHighlighted
  const cardClipId = useId()
  const borderGradientId = useId()
  const bloomMaskId = useId()
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
       *  glowing — the exact same treatment as the sub chips' highlighted
       *  box border: a gradient stroke transparent at the left and right
       *  edges and brightest at the horizontal center (halo + core),
       *  additively blended. Mirrors CircuitDomainChip.tsx. */}
      {isGlowing && (
        <g className={styles.centerGlowGroup} aria-hidden="true">
          <defs>
            <linearGradient id={borderGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
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
            stroke={`url(#${borderGradientId})`}
          />
          <rect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            rx={rect.rx}
            className={styles.centerGlowCore}
            stroke={`url(#${borderGradientId})`}
          />
        </g>
      )}

      {/* Outer framing box bloom — a soft, diffused glow radiating outward
       *  from all four edges while the card is lit. The mask below paints
       *  the box's interior black, so every blurred layer is visible only
       *  outside the box: the inside stays perfectly matte, with no border
       *  and no inner glow. */}
      {isGlowing && (
        <g className={styles.centerCardBloomGroup} aria-hidden="true">
          <defs>
            {/* Explicit userSpaceOnUse region — the default mask region
             *  stops just 10% past the masked group's bounding box, which
             *  slices the widest bloom flat in a straight line */}
            <mask
              id={bloomMaskId}
              maskUnits="userSpaceOnUse"
              x={outerRect.x - BLOOM_MASK_MARGIN}
              y={outerRect.y - BLOOM_MASK_MARGIN}
              width={outerRect.width + BLOOM_MASK_MARGIN * 2}
              height={outerRect.height + BLOOM_MASK_MARGIN * 2}
            >
              <rect
                x={outerRect.x - BLOOM_MASK_MARGIN}
                y={outerRect.y - BLOOM_MASK_MARGIN}
                width={outerRect.width + BLOOM_MASK_MARGIN * 2}
                height={outerRect.height + BLOOM_MASK_MARGIN * 2}
                fill="#fff"
              />
              <rect
                x={outerRect.x}
                y={outerRect.y}
                width={outerRect.width}
                height={outerRect.height}
                rx={outerRect.rx}
                fill="#000"
              />
            </mask>
            {/* Per-layer Gaussian blurs with enlarged filter regions — CSS
             *  filter: blur() on SVG elements clips at the default region
             *  (10% past the bounding box), cutting the glow off in a
             *  straight line well before it has faded out */}
            {OUTER_BOX_BLOOM_LAYERS.map(({ blur }, i) => (
              <filter
                key={i}
                id={`${bloomMaskId}-blur${i}`}
                x="-150%"
                y="-150%"
                width="400%"
                height="400%"
              >
                <feGaussianBlur stdDeviation={blur} />
              </filter>
            ))}
            {/* Edge-strip gradients, transparent at both ends so the bloom
             *  dies out before reaching the corners */}
            <linearGradient
              id={`${bloomMaskId}-h`}
              gradientUnits="userSpaceOnUse"
              x1={outerRect.x}
              y1="0"
              x2={outerRect.x + outerRect.width}
              y2="0"
            >
              {BLOOM_GRADIENT_STOPS.map(({ offset, opacity }, i) => (
                <stop key={i} offset={offset} stopColor="var(--color-primary)" stopOpacity={opacity} />
              ))}
            </linearGradient>
            <linearGradient
              id={`${bloomMaskId}-v`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={outerRect.y}
              x2="0"
              y2={outerRect.y + outerRect.height}
            >
              {BLOOM_GRADIENT_STOPS.map(({ offset, opacity }, i) => (
                <stop key={i} offset={offset} stopColor="var(--color-primary)" stopOpacity={opacity} />
              ))}
            </linearGradient>
          </defs>
          <g mask={`url(#${bloomMaskId})`}>
            {OUTER_BOX_BLOOM_LAYERS.map(({ className, strokeWidth }, i) => (
              <g key={className} className={styles[className]} filter={`url(#${bloomMaskId}-blur${i})`}>
                <line
                  x1={outerRect.x}
                  y1={outerRect.y}
                  x2={outerRect.x + outerRect.width}
                  y2={outerRect.y}
                  stroke={`url(#${bloomMaskId}-h)`}
                  strokeWidth={strokeWidth}
                />
                <line
                  x1={outerRect.x}
                  y1={outerRect.y + outerRect.height}
                  x2={outerRect.x + outerRect.width}
                  y2={outerRect.y + outerRect.height}
                  stroke={`url(#${bloomMaskId}-h)`}
                  strokeWidth={strokeWidth}
                />
                <line
                  x1={outerRect.x}
                  y1={outerRect.y}
                  x2={outerRect.x}
                  y2={outerRect.y + outerRect.height}
                  stroke={`url(#${bloomMaskId}-v)`}
                  strokeWidth={strokeWidth}
                />
                <line
                  x1={outerRect.x + outerRect.width}
                  y1={outerRect.y}
                  x2={outerRect.x + outerRect.width}
                  y2={outerRect.y + outerRect.height}
                  stroke={`url(#${bloomMaskId}-v)`}
                  strokeWidth={strokeWidth}
                />
              </g>
            ))}
          </g>
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
