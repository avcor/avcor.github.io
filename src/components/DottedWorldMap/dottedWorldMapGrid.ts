import type { DottedWorldMapDensity } from './dottedWorldMapTypes'
import { DENSITY_PRESETS, LAT_BOTTOM, LAT_TOP } from './dottedWorldMapMasks'

export interface Grid {
  cols: number
  rows: number
  step: number
  cells: [number, number, number][]
}

/**
 * Given a step (degrees per cell), unpack its mask and compute how far each
 * land cell sits from open water via a two-pass chamfer transform.
 * Longitude wraps at the dateline; rows off the top/bottom of the grid
 * count as water. Cached per step so a density that's never selected never
 * pays for its own transform.
 */
function buildGrid(step: number, mask: string): Grid {
  const cols = Math.round(360 / step)
  const rows = Math.round((LAT_TOP - LAT_BOTTOM) / step)

  const bytes = atob(mask)
  const land = new Uint8Array(rows * cols)
  for (let i = 0; i < land.length; i++) {
    land[i] = bytes.charCodeAt(i >> 3) & (128 >> (i & 7)) ? 1 : 0
  }

  const ORTH = 1
  const DIAG = 1.4142
  const dist = new Float32Array(land.length)
  for (let i = 0; i < dist.length; i++) dist[i] = land[i] ? 1e6 : 0

  const at = (r: number, c: number) =>
    r < 0 || r >= rows ? 0 : dist[r * cols + (((c % cols) + cols) % cols)]

  for (let pass = 0; pass < 2; pass++) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        if (!land[i]) continue
        dist[i] = Math.min(
          dist[i],
          at(r - 1, c - 1) + DIAG,
          at(r - 1, c) + ORTH,
          at(r - 1, c + 1) + DIAG,
          at(r, c - 1) + ORTH,
        )
      }
    }
    for (let r = rows - 1; r >= 0; r--) {
      for (let c = cols - 1; c >= 0; c--) {
        const i = r * cols + c
        if (!land[i]) continue
        dist[i] = Math.min(
          dist[i],
          at(r + 1, c + 1) + DIAG,
          at(r + 1, c) + ORTH,
          at(r + 1, c - 1) + DIAG,
          at(r, c + 1) + ORTH,
        )
      }
    }
  }

  const cells: [number, number, number][] = []
  for (let i = 0; i < land.length; i++) {
    if (land[i]) cells.push([i % cols, (i / cols) | 0, dist[i]])
  }
  return { cols, rows, step, cells }
}

const gridCache = new Map<DottedWorldMapDensity, Grid>()

export function getGrid(density: DottedWorldMapDensity): Grid {
  const preset = DENSITY_PRESETS[density]
  if (!gridCache.has(density)) {
    gridCache.set(density, buildGrid(preset.step, preset.mask))
  }
  return gridCache.get(density) as Grid
}
