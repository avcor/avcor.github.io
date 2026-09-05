import { useCallback, useMemo, useState, type CSSProperties } from 'react'
import styles from './DottedWorldMap.module.css'

export interface DottedWorldMapMarker {
  id: string
  label: string
  lat: number
  lng: number
  color?: string
  size?: number
}

export interface DottedWorldMapConnection {
  from: string | [number, number]
  to: string | [number, number]
  lift?: number
}

interface DottedWorldMapProps {
  dotColor?: string
  dotRadius?: number
  markers?: DottedWorldMapMarker[]
  connections?: DottedWorldMapConnection[]
  accent?: string
  showLabels?: boolean
  animate?: boolean
  onMarkerSelect?: (marker: DottedWorldMapMarker) => void
  className?: string
  style?: CSSProperties
}

/* ------------------------------------------------------------------ *
 *  The land mask below is a 180 x 71 grid (2 degrees per cell)
 *  rasterised from Natural Earth 1:50m coastlines, packed as bits and
 *  base64'd, 2.1 KB for 4,341 land cells. No network request, no map
 *  library.
 *
 *  Grid covers longitude -180..180 and latitude +84..-58, which is the
 *  usual "everything except Antarctica" crop.
 * ------------------------------------------------------------------ */

const COLS = 180
const ROWS = 71
const LAT_TOP = 84
const STEP = 2

const LAND_MASK =
  'AAAAAAAAf+A//gAAAAAAAAAAAAAAAAAAAAAAA///////AAAABjgADgAAAAAAAAAAADd/+////4AB' +
  '/gAAAAD+AAAAAAAAAAB3e74f///wAAbAAAOAAG4AAAAAAAAABPjtwAf//4AAAAADgAf/4APwAAAA' +
  'AAH/3/+AP//wAAAAAOD7///8DgAAgDwADf63/wP//gAAB8AMH///////wAgf////59jwH//AAAf/' +
  'iP//////////+f//////3+H/wAAA//7///////////s///////l+H8AeAB+/////////////Cf//' +
  '///5k8D8AIAH//////////////Af/////gHgB4AAAP5///////////v4AHgP///wH+AAAAGP5///' +
  '///////+cAADwB///8H+AAAAOC//////////8A8AAQAA////v/gAAAPDv/////////4A4AAAABf/' +
  '//v/wAAAbv///////////AwAAAAAP/////wAAAHf///////////AgAAAAAP////+YAAAH///////' +
  '////9AAAAAAAD////9EAAAB///////////9AAAAAAAD/////AAAAB/f7ff//////5AAAAAAAD///' +
  '/gAAAAf/v4Pf//////zgAAAAAAD////gAAAAfi///v/////+CAAAAAAAD///+AAAEAfCLf/v////' +
  '/8CAAAAAAAB///8AAAAAf/xf///////mOAAAAAAAB///8AAAAAH/AA///////H8AAAAAAAAf//4A' +
  'AAAAf/jB///////hgAAAAAAAAf//wAAAAAf//////////hAAAAAAAAAP/owAAAAA/////f/////g' +
  'AAAAAAAAAP/AwAAAAB///+/v/////gAAAAAAAAAD/AQAAAAD/////3/////gAAAAAAAAAB+A4AAA' +
  'AD////f/D///+gAAAAAAAAAAfGOAAAAH//////B/z/QAAAAAAAgAAAf+BwAAAD////v+A/h+wAAA' +
  'AAAAAAAAH8AAAAAD////38A/B/AgAAAAAAAAAAAfgAAAAH/////wAcAfggAAAAAAAAAAAHAAAAAH' +
  '/////IAcAfgYAAAAAAAAAAABj6AAAD/////wAMAXhYAAAAAAAAAAAA//AAAB/////wAOASBYAAAA' +
  'AAAAAAAAX/gAAA/////gACAYCMAAAAAAAAAAAAH/8AAAfP///gAABsHAAAAAAAAAAAAAH/+AAAAB' +
  '///AAAA8eCAAAAAAAAAAAAP/+AAAAD//8AAAAc+SAAAAAAAAAAAAf//wAAAD//4AAAAO/kgAAAAA' +
  'AAAAAAf//+AAAB//4AAAAOdl/AAAAAAAAAAAf///gAAA//wAAAAGBAPkAAAAAAAAAAP///gAAA//' +
  'wAAAAB4BHxAAAAAAAAAAP///gAAA//wAAAAAH8DYAAAAAAAAAAH///AAAAf/wAAAAAABBGAAAAAA' +
  'AAAAH//+AAAA//4gAAAAAB5AAAAAAAAAAAD//+AAAA//5gAAAAAPxgAAAAAAAAAAB//+AAAA//zg' +
  'AAAAAf/gBBAAAAAAAAAf/8AAAA//jgAAAAA//wAAAAAAAAAAAf/8AAAA//HgAAAAH//4CAAAAAAA' +
  'AAAf/4AAAAf/HAAAAAH//8AAAAAAAAAAA//gAAAAf/DAAAAAP//+AAAAAAAAAAA//AAAAAf+AAAA' +
  'AAP//+AAAAAAAAAAA//AAAAAP8AAAAAAH//+AAAAAAAAAAA/+AAAAAP8AAAAAAH//+AAAAAAAAAA' +
  'A/8AAAAAH4AAAAAAD4f8AAAAAAAAAAB/4AAAAAEAAAAAAADAf8AIAAAAAAAAB/wAAAAAAAAAAAAA' +
  'AAD4AEAAAAAAAAB/gAAAAAAAAAAAAAAABwAGAAAAAAAAB+AAAAAAAAAAAAAAAAAwAOAAAAAAAAB8' +
  'AAAAAAAAAAAAAAAAAwAYAAAAAAAAD8AAAAAAAAAAAAAAAAAABwAAAAAAAAD4AAAAAAAAAAAAAAAA' +
  'AAAgAAAAAAAAD4AAAAAAAAAACAAAAAAAAAAAAAAAAADwgAAAAAAAAAAAAAAAAAAAAAAAAAAABwAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAA='

/** Unpack the bitmask once, at module load, into [col, row] pairs. */
const LAND_CELLS: [number, number][] = (() => {
  const bytes = atob(LAND_MASK)
  const cells: [number, number][] = []
  for (let i = 0; i < ROWS * COLS; i++) {
    if (bytes.charCodeAt(i >> 3) & (128 >> (i & 7))) {
      cells.push([i % COLS, (i / COLS) | 0])
    }
  }
  return cells
})()

/** Latitude/longitude to the map's internal coordinate space (viewBox units). */
function project(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * COLS,
    y: (LAT_TOP - lat) / STEP,
  }
}

/** Bowed connector between two projected points. */
function arc(a: { x: number; y: number }, b: { x: number; y: number }, lift = 0.22) {
  const d = Math.hypot(b.x - a.x, b.y - a.y)
  return `M${a.x.toFixed(2)},${a.y.toFixed(2)} Q${((a.x + b.x) / 2).toFixed(2)},${(
    (a.y + b.y) / 2 -
    d * lift
  ).toFixed(2)} ${b.x.toFixed(2)},${b.y.toFixed(2)}`
}

/** Quiet dot-matrix world map: one <path> for every land cell, so panning
 *  and resizing stay cheap no matter how many dots are on screen. Markers
 *  accept lat/lng, connections take marker ids or raw [lat, lng] pairs. */
export default function DottedWorldMap({
  dotColor = 'var(--color-white-a25)',
  dotRadius = 0.15,
  markers = [],
  connections = [],
  accent = 'var(--color-primary)',
  showLabels = false,
  animate = true,
  onMarkerSelect,
  className,
  style,
}: DottedWorldMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  const r = Math.min(0.5, Math.max(0.05, dotRadius))

  const landPath = useMemo(() => {
    const rr = r.toFixed(3)
    let d = ''
    for (const [c, row] of LAND_CELLS) {
      d += `M${(c + 0.5 - r).toFixed(2)},${row + 0.5}a${rr},${rr} 0 1,0 ${(r * 2).toFixed(
        3,
      )},0a${rr},${rr} 0 1,0 -${(r * 2).toFixed(3)},0`
    }
    return d
  }, [r])

  const placed = useMemo(
    () => markers.map((m) => ({ ...m, ...project(m.lat, m.lng) })),
    [markers],
  )

  const links = useMemo(() => {
    const byId = new Map(placed.map((m) => [m.id, m]))
    const resolve = (v: string | [number, number]) =>
      Array.isArray(v) ? project(v[0], v[1]) : byId.get(v)
    return connections
      .map((cn, i) => {
        const a = resolve(cn.from)
        const b = resolve(cn.to)
        return a && b ? { d: arc(a, b, cn.lift), i } : null
      })
      .filter((link): link is { d: string; i: number } => link !== null)
  }, [connections, placed])

  const select = useCallback(
    (m: DottedWorldMapMarker) => onMarkerSelect?.(m),
    [onMarkerSelect],
  )

  return (
    <svg
      viewBox={`0 0 ${COLS} ${ROWS}`}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
      role="img"
      aria-label={`World map with ${markers.length} marked location${markers.length === 1 ? '' : 's'}`}
    >
      <path d={landPath} fill={dotColor} shapeRendering="geometricPrecision" />

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

      {placed.map((m) => {
        const size = m.size ?? 0.85
        const color = m.color ?? accent
        const on = hovered === m.id
        return (
          <g
            key={m.id}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => select(m)}
            onFocus={() => setHovered(m.id)}
            onBlur={() => setHovered(null)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && select(m)}
            tabIndex={onMarkerSelect ? 0 : -1}
            className={styles.marker}
            style={{ cursor: onMarkerSelect ? 'pointer' : 'default' }}
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
              r={size * (on ? 1.35 : 1)}
              fill={color}
              stroke="var(--color-white)"
              strokeWidth={0.3}
              className={styles.markerDot}
            />
            {(showLabels || on) && (
              <text
                x={m.x + size + 1}
                y={m.y + 0.85}
                fontSize={2.4}
                fill={on ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'}
                fontFamily="inherit"
                fontWeight={on ? 600 : 500}
                className={styles.markerLabel}
              >
                {m.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
