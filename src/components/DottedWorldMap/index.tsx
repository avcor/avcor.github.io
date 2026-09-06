import { useCallback, useId, useState } from 'react'
import styles from './DottedWorldMap.module.css'
import DottedWorldMapMarkerDot from './DottedWorldMapMarkerDot'
import { useDottedWorldMapLayers } from './useDottedWorldMapLayers'
import type { DottedWorldMapMarker, DottedWorldMapProps } from './dottedWorldMapTypes'

export type {
  DottedWorldMapConnection,
  DottedWorldMapDensity,
  DottedWorldMapMarker,
} from './dottedWorldMapTypes'

/** Quiet dot-matrix world map: land cells are grouped into a handful of
 *  coastal-fade levels, each rendered as one <path>, so the whole map stays
 *  cheap to pan and resize no matter how many dots are on screen. Markers
 *  accept lat/lng, connections take marker ids or raw [lat, lng] pairs. */
export default function DottedWorldMap({
  density = 'medium',
  dotColor = 'var(--color-white-a25)',
  landOpacity = 1,
  metallic = false,
  dotRadius,
  edgeFade,
  edgeMinScale = 0.3,
  edgeMinOpacity = 0.4,
  fadeSteps = 8,
  markers = [],
  connections = [],
  accent = 'var(--color-primary)',
  markerCoreColor = 'var(--color-glow)',
  markerGlowIntensity = 1,
  showLabels = false,
  animate = true,
  onMarkerSelect,
  preserveAspectRatio = 'xMidYMid meet',
  className,
  style,
}: DottedWorldMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const gradientId = useId()

  const { cols, rows, layers, placed, links } = useDottedWorldMapLayers({
    density,
    dotRadius,
    edgeFade,
    edgeMinScale,
    edgeMinOpacity,
    fadeSteps,
    markers,
    connections,
  })

  const select = useCallback(
    (m: DottedWorldMapMarker) => onMarkerSelect?.(m),
    [onMarkerSelect],
  )

  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
      role="img"
      aria-label={`World map with ${markers.length} marked location${markers.length === 1 ? '' : 's'}`}
    >
      {metallic && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-map-dot-metallic-highlight)" />
            <stop offset="55%" stopColor="var(--color-map-dot-metallic-mid)" />
            <stop offset="100%" stopColor="var(--color-map-dot-metallic-shadow)" />
          </linearGradient>
        </defs>
      )}

      <g opacity={landOpacity}>
        {layers.map((l) => (
          <path
            key={l.key}
            d={l.d}
            fill={metallic ? `url(#${gradientId})` : dotColor}
            fillOpacity={l.opacity}
            shapeRendering="geometricPrecision"
          />
        ))}
      </g>

      {links.map((l) => (
        <path
          key={l.i}
          d={l.d}
          fill="none"
          stroke={accent}
          strokeWidth={0.28}
          strokeOpacity={0.5}
          strokeLinecap="round"
          className={animate ? styles.link : undefined}
          style={animate ? { animationDelay: `${l.i * 0.18}s` } : undefined}
        />
      ))}

      {placed.map((m) => (
        <DottedWorldMapMarkerDot
          key={m.id}
          marker={m}
          accent={accent}
          markerCoreColor={markerCoreColor}
          markerGlowIntensity={markerGlowIntensity}
          showLabels={showLabels}
          animate={animate}
          selectable={Boolean(onMarkerSelect)}
          hovered={hovered === m.id}
          onHoverStart={setHovered}
          onHoverEnd={() => setHovered(null)}
          onSelect={select}
        />
      ))}
    </svg>
  )
}
