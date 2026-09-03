import {
  BLOOM_GRADIENT_STOPS,
  BLOOM_MASK_MARGIN,
  OUTER_BOX_BLOOM_LAYERS,
} from './circuitCenterCardGeometry'
import styles from './IndexCircuit.module.css'

interface Rect {
  x: number
  y: number
  width: number
  height: number
  rx: number
}

interface CircuitCenterCardBloomProps {
  outerRect: Rect
  /** Base id for this instance's mask, blur filters, and edge gradients. */
  bloomMaskId: string
}

/**
 * Soft diffused glow radiating outward from all four edges of the card's
 * outer framing box. The mask paints the box interior with --color-bg-card,
 * so every blurred layer shows only outside the box: the inside stays matte,
 * no border, no inner glow. Shown only while the card is lit.
 */
export default function CircuitCenterCardBloom({ outerRect, bloomMaskId }: CircuitCenterCardBloomProps) {
  return (
    <g className={styles.centerCardBloomGroup} aria-hidden="true">
      <defs>
        {/* Explicit userSpaceOnUse region, the default mask region stops
         *  just 10% past the masked group's bounding box, which slices the
         *  widest bloom flat in a straight line */}
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
            style={{ fill: 'var(--color-white)' }}
          />
          <rect
            x={outerRect.x}
            y={outerRect.y}
            width={outerRect.width}
            height={outerRect.height}
            rx={outerRect.rx}
            style={{ fill: 'var(--color-bg-card)' }}
          />
        </mask>
        {/* Per-layer Gaussian blurs with enlarged filter regions, CSS
         *  filter: blur() on SVG elements clips at the default region
         *  (10% past the bounding box), cutting the glow off in a
         *  straight line well before it has faded out */}
        {OUTER_BOX_BLOOM_LAYERS.map(({ blur }, i) => (
          <filter key={i} id={`${bloomMaskId}-blur${i}`} x="-150%" y="-150%" width="400%" height="400%">
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
  )
}
