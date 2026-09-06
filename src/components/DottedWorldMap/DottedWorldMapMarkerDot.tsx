import styles from './DottedWorldMap.module.css'
import type { DottedWorldMapMarker } from './dottedWorldMapTypes'

interface PlacedMarker extends DottedWorldMapMarker {
  x: number
  y: number
}

interface DottedWorldMapMarkerDotProps {
  marker: PlacedMarker
  accent: string
  markerCoreColor: string
  markerGlowIntensity: number
  showLabels: boolean
  animate: boolean
  selectable: boolean
  hovered: boolean
  onHoverStart: (id: string) => void
  onHoverEnd: () => void
  onSelect: (marker: DottedWorldMapMarker) => void
}

/** One marker: an optional ping ring, a two-layer neon bloom behind a bright
 *  core, and an optional label. Opacity is base * markerGlowIntensity
 *  throughout, so brightness only ever changes via that one prop. */
export default function DottedWorldMapMarkerDot({
  marker: m,
  accent,
  markerCoreColor,
  markerGlowIntensity,
  showLabels,
  animate,
  selectable,
  hovered,
  onHoverStart,
  onHoverEnd,
  onSelect,
}: DottedWorldMapMarkerDotProps) {
  const size = m.size ?? 0.85
  const color = m.color ?? accent
  const on = hovered

  return (
    <g
      onMouseEnter={() => onHoverStart(m.id)}
      onMouseLeave={onHoverEnd}
      onClick={() => onSelect(m)}
      onFocus={() => onHoverStart(m.id)}
      onBlur={onHoverEnd}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(m)}
      tabIndex={selectable ? 0 : -1}
      className={styles.marker}
      style={{ cursor: selectable ? 'pointer' : 'default' }}
    >
      {animate && (
        <circle
          cx={m.x}
          cy={m.y}
          r={size}
          fill={color}
          className={styles.ping}
          style={{ animationDelay: `${(m.x % 7) * 0.35}s` }}
        />
      )}
      <circle
        cx={m.x}
        cy={m.y}
        r={size * (on ? 4.2 : 3.4)}
        fill={color}
        opacity={(on ? 0.22 : 0.16) * markerGlowIntensity}
        className={styles.markerGlowOuter}
      />
      <circle
        cx={m.x}
        cy={m.y}
        r={size * (on ? 2.2 : 1.8)}
        fill={color}
        opacity={(on ? 0.55 : 0.4) * markerGlowIntensity}
        className={styles.markerGlowInner}
      />
      <circle
        cx={m.x}
        cy={m.y}
        r={size * (on ? 1.35 : 1) * 0.55}
        fill={markerCoreColor}
        className={styles.markerDot}
        style={{
          filter: `drop-shadow(0 0 1.5px ${color}) drop-shadow(0 0 3px ${color}) drop-shadow(0 0 6px ${color})`,
        }}
      />
      {(showLabels || on) && (
        <text
          x={m.x + size + 1}
          y={m.y + 0.85}
          fontSize={2.4}
          fill="var(--color-white)"
          fontFamily="inherit"
          fontWeight={on ? 600 : 500}
          className={styles.markerLabel}
        >
          {m.label.split('\n').map((line, i) => (
            <tspan key={line} x={m.x + size + 1} dy={i === 0 ? 0 : '1.2em'}>
              {line}
            </tspan>
          ))}
        </text>
      )}
    </g>
  )
}
