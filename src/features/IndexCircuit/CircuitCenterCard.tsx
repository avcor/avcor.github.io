import { useId, useState, type CSSProperties } from 'react'
import avMonogram from '../../assets/av-monogram.png'
import { CIRCUIT_CENTER_CARD } from './circuitData'
import CircuitCenterCardGrid from './CircuitCenterCardGrid'
import CircuitCenterCardBloom from './CircuitCenterCardBloom'
import styles from './IndexCircuit.module.css'

/** Native aspect ratio (width / height) of the AV monogram asset, used to
 *  size it at the same font-size the "AV" text label used, without
 *  distorting it. */
const AV_MONOGRAM_ASPECT_RATIO = 1665 / 945
/** Matches .centerCardLabel's font-size, the monogram replaces that text
 *  1:1 so it reads as the same size the letters did. */
const AV_MONOGRAM_HEIGHT = 22
const AV_MONOGRAM_WIDTH = AV_MONOGRAM_HEIGHT * AV_MONOGRAM_ASPECT_RATIO

interface CircuitCenterCardProps {
  /** Whether anything on the board is currently hovered/highlighted, the
   *  glow/bloom layers only show then; the base card is always visible.
   *  Also switches the grid/label color: the same idle warm-white used by
   *  the wires at rest, neon green while highlighted. */
  isHighlighted?: boolean
  /** Notifies the board when the card itself is hovered, so it can light
   *  every route and pulse current out to all nodes */
  onHoverChange?: (hovered: boolean) => void
}

interface AccentCSSProperties extends CSSProperties {
  '--center-card-accent'?: string
}

/**
 * The premium microchip-style hub card every trunk wire converges into:
 * transparent background, a faint dotted matrix grid, and a thin border,
 * all always visible (idle warm-white, matching the wires at rest, no
 * fill); the neon treatment (border strip + green dot matrix + the center
 * "AV" label's bloom halo) fires while the card is hovered or something on
 * the board is hovered/highlighted.
 */
export default function CircuitCenterCard({
  isHighlighted = false,
  onHoverChange,
}: CircuitCenterCardProps) {
  const { rect, outerRect } = CIRCUIT_CENTER_CARD
  const [isCardHovered, setIsCardHovered] = useState(false)
  /** The neon treatment (border strip + green dot matrix) fires both when
   *  the card itself is hovered and whenever a wire path is glowing,
   *  i.e. anything on the board is hovered/highlighted. */
  const isGlowing = isCardHovered || isHighlighted
  const cardClipId = useId()
  const borderGradientId = useId()
  const bloomMaskId = useId()
  const logoMaskId = useId()
  const centerX = rect.x + rect.width / 2
  const centerY = rect.y + rect.height / 2
  const logoX = centerX - AV_MONOGRAM_WIDTH / 2
  const logoY = centerY - AV_MONOGRAM_HEIGHT / 2
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

      <CircuitCenterCardGrid isGlowing={isGlowing} clipId={cardClipId} />

      {/* Card border, same idle warm-white as the default (non-hover) wire
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
       *  glowing, the exact same treatment as the sub chips' highlighted
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

      {isGlowing && <CircuitCenterCardBloom outerRect={outerRect} bloomMaskId={bloomMaskId} />}

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
        onMouseEnter={() => {
          setIsCardHovered(true)
          onHoverChange?.(true)
        }}
        onMouseLeave={() => {
          setIsCardHovered(false)
          onHoverChange?.(false)
        }}
      />

      {/* Center mark, the AV monogram masked by its own alpha so it tints
       *  with the same accent color the "AV" text used, crisp version always
       *  visible, bloom halo only while the card is hovered or a wire path
       *  is glowing */}
      <defs>
        <mask id={logoMaskId}>
          <image
            href={avMonogram}
            x={logoX}
            y={logoY}
            width={AV_MONOGRAM_WIDTH}
            height={AV_MONOGRAM_HEIGHT}
            preserveAspectRatio="xMidYMid meet"
          />
        </mask>
      </defs>
      {isGlowing && (
        <rect
          x={logoX}
          y={logoY}
          width={AV_MONOGRAM_WIDTH}
          height={AV_MONOGRAM_HEIGHT}
          mask={`url(#${logoMaskId})`}
          className={styles.centerCardLabelGlow}
        />
      )}
      <rect
        x={logoX}
        y={logoY}
        width={AV_MONOGRAM_WIDTH}
        height={AV_MONOGRAM_HEIGHT}
        mask={`url(#${logoMaskId})`}
        className={styles.centerCardLabel}
      />
    </g>
  )
}
