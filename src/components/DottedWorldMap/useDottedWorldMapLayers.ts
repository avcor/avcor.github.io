import { useCallback, useMemo } from 'react'
import { arc, dotPath, smoothstep } from './dottedWorldMapGeometry'
import { getGrid } from './dottedWorldMapGrid'
import { DENSITY_DEFAULTS, LAT_TOP } from './dottedWorldMapMasks'
import type {
  DottedWorldMapConnection,
  DottedWorldMapDensity,
  DottedWorldMapMarker,
} from './dottedWorldMapTypes'

interface UseDottedWorldMapLayersArgs {
  density: DottedWorldMapDensity
  dotRadius: number | undefined
  edgeFade: number | undefined
  edgeMinScale: number
  edgeMinOpacity: number
  fadeSteps: number
  markers: DottedWorldMapMarker[]
  connections: DottedWorldMapConnection[]
}

/** Projects markers/connections onto the grid and groups land cells into
 *  coastal-fade layers. Isolated from the component so the render function
 *  only wires props through, keeping DottedWorldMap itself composition-only. */
export function useDottedWorldMapLayers({
  density,
  dotRadius,
  edgeFade,
  edgeMinScale,
  edgeMinOpacity,
  fadeSteps,
  markers,
  connections,
}: UseDottedWorldMapLayersArgs) {
  const grid = useMemo(() => getGrid(density), [density])
  const { cols, rows, step } = grid
  const densityDefaults = DENSITY_DEFAULTS[density]
  const resolvedRadius = dotRadius ?? densityDefaults.dotRadius
  const resolvedFade = edgeFade ?? densityDefaults.edgeFade
  const r = Math.min(0.5, Math.max(0.05, resolvedRadius))

  const project = useCallback(
    (lat: number, lng: number) => ({ x: ((lng + 180) / 360) * cols, y: (LAT_TOP - lat) / step }),
    [cols, step],
  )

  /**
   * Group cells into fade levels and emit one <path> per level. A level is a
   * single DOM node holding hundreds of dots, so the whole map is ~8 nodes
   * rather than one per cell.
   */
  const layers = useMemo(() => {
    const steps = Math.max(2, Math.round(fadeSteps))
    const groups = new Map<number, [number, number, number][]>()

    for (const cell of grid.cells) {
      const t = resolvedFade > 0 ? Math.min(1, Math.max(0, (cell[2] - 1) / resolvedFade)) : 1
      const level = Math.round(t * (steps - 1))
      let bucket = groups.get(level)
      if (!bucket) {
        bucket = []
        groups.set(level, bucket)
      }
      bucket.push(cell)
    }

    return [...groups.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([level, cells]) => {
        const e = smoothstep(level / (steps - 1))
        const scale = edgeMinScale + (1 - edgeMinScale) * e
        return {
          key: level,
          d: dotPath(cells, r * scale),
          opacity: edgeMinOpacity + (1 - edgeMinOpacity) * e,
        }
      })
  }, [grid, r, resolvedFade, edgeMinScale, edgeMinOpacity, fadeSteps])

  const placed = useMemo(
    () => markers.map((m) => ({ ...m, ...project(m.lat, m.lng) })),
    [markers, project],
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
  }, [connections, placed, project])

  return { cols, rows, layers, placed, links }
}
