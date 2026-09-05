import { useCallback, useId, useMemo, useState, type CSSProperties } from 'react'
import styles from './DottedWorldMap.module.css'

export type DottedWorldMapDensity = 'low' | 'medium' | 'high'

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
  /** Coastline resolution: "low" (3° cells, ~2k dots), "medium" (2°, ~4.3k,
   *  the original), or "high" (1°, ~16.5k, resolves island chains). */
  density?: DottedWorldMapDensity
  dotColor?: string
  /** Renders land dots with a diagonal brushed-steel gradient instead of a
   *  flat dotColor fill. */
  metallic?: boolean
  /** In grid cells; 0.5 makes dots touch. Falls back to a density-tuned
   *  default when omitted, since a radius that suits 2° cells reads too
   *  thick at 1° and too sparse at 3°. */
  dotRadius?: number
  /** Cells over which dots ramp up from the coastline; 0 = hard edge.
   *  Falls back to a density-tuned default when omitted. */
  edgeFade?: number
  /** Size of the outermost coastal dot, relative to dotRadius. */
  edgeMinScale?: number
  /** Opacity of the outermost coastal dot; 1 = size fade only. */
  edgeMinOpacity?: number
  /** Fade quantisation levels; each becomes one <path>. */
  fadeSteps?: number
  markers?: DottedWorldMapMarker[]
  connections?: DottedWorldMapConnection[]
  accent?: string
  showLabels?: boolean
  animate?: boolean
  onMarkerSelect?: (marker: DottedWorldMapMarker) => void
  /** SVG preserveAspectRatio. "meet" (default) letterboxes to fit the
   *  container without cropping; "slice" fills the container on both axes,
   *  cropping whichever side overflows, so the container's height actually
   *  changes what's visible instead of just adding empty space. */
  preserveAspectRatio?: string
  className?: string
  style?: CSSProperties
}

/* ------------------------------------------------------------------ *
 *  Three pre-rasterised land masks, each from Natural Earth 1:50m
 *  coastlines at a different grid step, so "density" changes actual
 *  coastline resolution rather than just thinning out one grid:
 *
 *    low     3 degree cells, 120x47   grid, ~2,000 land cells  (~1 KB)
 *    medium  2 degree cells, 180x71   grid, ~4,300 land cells  (~2 KB)
 *    high    1 degree cells, 360x142  grid, ~16,500 land cells (~8.5 KB)
 *
 *  Each fades toward the coast via a chamfer distance-to-water field,
 *  computed lazily and cached per density so switching between them
 *  doesn't pay for grids you never use.
 * ------------------------------------------------------------------ */

const LAT_TOP = 84
const LAT_BOTTOM = -58

const MASK_LOW =
  'AAAAB/3/+wAAAAAAAAAAAAAAf////gDoHwA+AAAAAAAPt4f//ABAAcBfwHAAAAA+u4B/+AAABxH/' +
  '/gAAh/jX6/x/+AA+Ar/////P7////78/wAD/////////b////74+DwH/////////B///+DwcAAff' +
  '///////+A4f/+D8AACfv//////ngBgH///+AAHP//////8DgAAB////AAPf///////CAAAB///7A' +
  'AD////////EAAAA///4gAB///////+AAAAA///oAAH/8d////7AAAAA///AAAHj/+////jAAAAAf' +
  '/+AAAHdX/////iAAAAAf/+AAAH8J////8uAAAAAH/4AAAP//////+QAAAAAH/oAAAf//////+AAA' +
  'AAAD8MAAAf//+///8AAAAAAA8EAAA////x//6AAAAAAAdjgAA////w+fgAAAAAAAPwAAA///vg8f' +
  'CAAAAAAABwAAA///+AYPiAAAAAAAAZ8AAf//+AYDDAAAAAAAAL+AAf//+AcEBAAAAAAAAD/gAHP/' +
  '8AAOMAAAAAAAAH/gAAH/4AAO/AAAAAAAAH/4AAH/wAAG+OAAAAAAAH//AAH/wAADKvgAAAAAAH//' +
  'gAD/gAABZLwAAAAAAD//AAD/wAAABQQAAAAAAD//AAD/yAAAA9AAAAAAAB/+AAD/+AAAD/gAAAAA' +
  'AA/+AAD/GQAAH/wAAAAAAA/+AAD/MAAAP/4QAAAAAA/wAAB/MAAAP/4AAAAAAA/wAAB+AAAAP/4A' +
  'AAAAAA/gAAA8AAAAP/4AAAAAAA/AAAA4AAAAOH4EAAAAAB+AAAAAAAAAADwDAAAAAB8AAAAAAAAA' +
  'AAwCAAAAAB4AAAAAAAAAAAwMAAAAABwAAAAAAAAAAAAYAAAAABwAAAAAAAAAAAAAAAAAABgAAAAA' +
  'AAAAAAAAAAAAAAQAAAAAAAAAAAAA'

const MASK_MEDIUM =
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

const MASK_HIGH =
  'AAAAAAAAAAAAAAAAAAAAAAAf/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD' +
  'v//+DXP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////h////////AAAA' +
  'AAAAAAAeAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAA////9////////4AAAAAKgAAB/f0AAAAPwA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAOA///9g////////AAAAD/n4AAAAAAAAAAL9gAAAAAAAAAAAAAAAA' +
  'AAAAAAAAD/n//9////////6AAAAC/+AAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAdcNgRP/Af/' +
  '///////gAAAAPngAAAAAAAAABAA8AAAAAAAAAAAAAAAAAAAAAH/jD////AP///////5AAAAACAAA' +
  'AAAAX4AAABn/+AAAAABAAAAAAAAAAAAAAAf/98//+AAAf//////AAAAAAAAAAAAH+AAAD////AAA' +
  'F/uAAAAAAAAAAAAAAfA8AAb/8AAAH/////+AAAAAAAAAAAAfAAAAP///+AAAAwAAAAAAAAAAAAAA' +
  'Af9Ase/f7wAAD/////8AAAAAAAAAAAB8ADAP/////+HwAHAAAAAAAAAAAAAAA/v/5/w//4AAD///' +
  '//wAAAAAAAAAAADwAHk////////8AfeAAAAA4AABAAAAAPf/8P4///gADf////4AAAAAAAAAAAHw' +
  'Af/////////8///wAAABAAA//wAACAP//h+f//4AB/////4AAAAAAD/gAAA/Afv/////////////' +
  '8AAAAAD////O//n//n+D2//AB/////AAAAAAB//+AAwB+f/////////////////+4AP/////////' +
  'YH/z4f/AAf///8AAAAAAf///4MPf//u/////////////////+AH/////////////45/4A///4AAA' +
  'AAAAH///+M////v//////////////////8N/////////////wD/+A///wAQYAAAAf///+///////' +
  '/////////////////8//////////////A/+8Af/+AAf+AAAA/+/+D///////////////////////' +
  'Bgff////////////4//gAP/wAAP8AAAD/4/////////////////////////+ACB////////////H' +
  'ch/wAP/wAAHAAAAP/7/////////////////////////+AAP///////////8Ay+fgAD/AAAAAAAB/' +
  '/H//////////////////////////AAP///////////4AC/gAAD/AAAAAAAB//H//////////////' +
  '////////zv/AAAf//7////////wAA/4QAAOAAAAAACB//3//////////////////////C/8AAAA/' +
  '7AF///////gAA/44AAAAAAAAAAB//g/////////////////////+DwAAAAAv8AA///////4AB//4' +
  'AAAAAAAAAYB5+D///////////////////8AAPwAAAAAH8AAP//////8AAf/8AAAAAAAAB8AG+m//' +
  '/////////////////wAAfgAAAAAeAAAH///////wDf/+AAAAAAAAA8AO+H//////////////////' +
  '/gAA/wAAAABwAAAD////////g///gAAAAAAADeAPwH//////////////////+AAB/AAAAAGAAAAB' +
  'P///////z///wAAAAAAAPPAHj////////////////////iAB/AAAAAQAAAABf///////x///8AAA' +
  'AAAAPfh//////////////////////+AA8AAAAAAAAAAAj///////x///8AAAAAAAPPz/////////' +
  '//////////////AA4AAAMAAAAAAAD///////////8AAAAAAAMf3//////////////////////7AA' +
  'wAAAAAAAAAAAH///////////sAAAAAAAA8f//////////////////////7ABgAAAAAAAAAAAB///' +
  '//////+MPgAAAAAAAD///////////////////////7gAAAAAAAAAAAAAAf/////////wfgAAAAAA' +
  'Af///////////////////////yAAAAAAAAAAAAAAAf/////////g/gAAAAAAAP//////////////' +
  '/////////iAAAAAAAAAAAAAAAP//////////AgAAAAAAAD//////v/5//////////////jAAAAAA' +
  'AAAAAAAAAP//////////AAAAAAAAAB/////H//n//////////////EBAAAAAAAAAAAAAAP//////' +
  '//+4AAAAAAAAAD//n/+Gf+P/////////////+HEAAAAAAAAAAAAAAf////////wgAAAAAAAAH//z' +
  'z/+AH/H/////////////8HwAAAAAAAAAAAAAAf////////gAAAAAAAAAH/4N4/8AB/D/////////' +
  '///+APAAAAAAAAAAAAAAAP////////wAAAAAAAAAH/4E+f+fh/i////////////8AMAAAAAAAAAA' +
  'AAAAAf///////+AAAAAAAAAAH/gMP/v///z///////////v8AMAAAAAAAAAAAAAAAP///////8AA' +
  'AAAAAAAAP/IMCfP///x///////////dwAMAAAAAAAAAAAAAAAP///////4AAAAAAAIAAP/AAGHP/' +
  '//g//////////8B4AcAAAAAAAAAAAAAAAH///////4AAAAAAAAAAH+AE4OP///4//////////+48' +
  'A4AAAAAAAAAAAAAAAD///////wAAAAAAAAAABw/+IAH///////////////w8T4AAAAAAAAAAAAAA' +
  'AD///////wAAAAAAAAAAAj/+AAwE//////////////A8/4AAAAAAAAAAAAAAAB///////wAAAAAA' +
  'AAAAB//+AAAN//////////////gl/AAAAAAAAAAAAAAAAAP/////+AAAAAAAAAAAH//+AAAB////' +
  '//////////gn8AAAAAAAAAAAAAAAAAH/////8AAAAAAAAAAAP///8OAB//////////////wDAAAA' +
  'AAAAAAAAAAAAAAH/////4AAAAAAAAAAAP///8P8z//////////////wDAAAAAAAAAAAAAAAAAADf' +
  '////4AAAAAAAAAAAP/////////////////////wAAAAAAAAAAAAAAAAAAAD///3j4AAAAAAAAAAA' +
  'f/////////v///////////wAAAAAAAAAAAAAAAAAAABv//gAcAAAAAAAAAAQ//////////n/////' +
  '//////wEAAAAAAAAAAAAAAAAAAB3/+AAcAAAAAAAAAAD///////9//z///////////gAAAAAAAAA' +
  'AAAAAAAAAAAb/+AAMAAAAAAAAAAH///////8//x3//////////AYAAAAAAAAAAAAAAAAAAAL/+AA' +
  'MAAAAAAAAAAH///////+f/8f//////////AAAAAAAAAAAAAAAAAAAAAM/+AABAAAAAAAAAAP////' +
  '////f/84Af///////+wAAAAAAAAAAAAAAAAAAAAGf8AAAAAAAAAAAAAP////////P//+AP//////' +
  '/8wAAAAAAAAAAAAAAAAAAAAAP8AB/EAAAAAAAAAf////////n///AH///////ggAAAAAAAAAAAAA' +
  'AAAAAAAAP+A4TwAAAAAAAAAf////////n///AH///P//8AAAAAAAAAAAAAABAAAAAAAAP+B4A8AA' +
  'AAAAAAAf////////n//+AAf/4P/+IAAAAAAAAAAAAAAAgAAAAAAAP/B4AD4AAAAAAAAf////////' +
  'x//8AA//gH/84AAAAAAAAAAAAAAAAAAAAAAAD//4Bz9gAAAAAAAP////////x//4AAf/gD/84A4A' +
  'AAAAAAAAAAAAAAAAAAAAA//wAAAQAAAAAAAP////////4//wAAf/AD/+AA4AAAAAAAAAAAAAAAAA' +
  'AAAAAP/wAAACAAAAAAAf////////4//AAAf+AD//AA4AAAAAAAAAAAAAAAAAAAAAABP/AAAAAAAA' +
  'AAAf////////8/8AAAf4AAP/gAwAAAAAAAAAAAAAAAAAAAAAAAH/gAAAAAAAAAA//////////fwA' +
  'AAPwAAP/gA4AAAAAAAAAAAAAAAAAAAAAAAA/gAAAAAAAAAAf//////////AAAAP4AAP/wA+AAAAA' +
  'AAAAAAAAAAAAAAAAAAAPgAgAAAAAAAAf/////////4AAAAHwAAN/wATAAAAAAAAAAAAAAAAAAAAA' +
  'AAAHgD8AAAAAAAAP/////////w4AAAHwAAEfgALAAAAAAAAAAAAAAAAAAAAAAAADgP/eAAAAAAAH' +
  '//////////4AAADwAAMfABMAAAAAAAAAAAAAAAAAAAAAAAABzPf+AAAAAAAD//////////4AAADo' +
  'AAMGACPAAAAAAAAAAAAAAAAAAAAAAAAA9///gAAAAAAB//////////4AAADcAAOAAEHgAAAAAAAA' +
  'AAAAAAAAAAAAAAAAN///wAAAAAAB//////////wAAAAMAAGAAAPgAAAAAAAAAAAAAAAAAAAAAAAA' +
  'A///4AAAAAAA//////////gAAAAMAADAAMDAAAAAAAAAAAAAAAAAAAAAAAAAA////gAAAAAAP/B/' +
  '//////gAAAAAABDgAeAAAAAAAAAAAAAAAAAAAAAAAAAAA////4AAAAAAHAB///////AAAAAAABzw' +
  'A8AAAAAAAAAAAAAAAAAAAAAAAAAAA////4AAAAAAAAAH//////AAAAAAAA9wh8AAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAB////8AAAAAAAAAD/////+AAAAAAAAfwH8AAAAAAAAAAAAAAAAAAAAAAAAAAB///' +
  '/8AAAAAAAAAH/////4AAAAAAAAPQf+CYAAAAAAAAAAAAAAAAAAAAAAAAD////8AAAAAAAAAH////' +
  '/wAAAAAAAAXwf8+QAAAAAAAAAAAAAAAAAAAAAADAH/////gAAAAAAAAH/////gAAAAAAAADwf8ER' +
  'wAAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAH/////AAAAAAAAAL8P56DzgAAAAAAAAAAAAAA' +
  'AAAAAAAAH//////AAAAAAAAH////+AAAAAAAAAF/P5wA78AAAAAAAAAAAAAAAAAAAAAAH//////8' +
  'AAAAAAAD////8AAAAAAAAAB8D54u//AQAAAAAAAAAAAAAAAAAAAAP//////+AAAAAAAB////8AAA' +
  'AAAAAAA8AB4AH/wYAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////8AAAAAAAAAAMABgAg/7y' +
  'AAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAAHsAAAI/9hAAAAAAAAAAAAAAAA' +
  'AAAAD///////gAAAAAAAf///8AAAAAAAAAAD/gAhA/8A4AAAAAAAAAAAAAAAAAAAB///////gAAA' +
  'AAAAf///8AAAAAAAAAAAH+3gBvOASAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf///8AAAAAAA' +
  'AAAAABnAAAHACAAAAAAAAAAAAAAAAAAAA///////AAAAAAAAf///+AAAAAAAAAAAAAEAAABgAgAA' +
  'AAAAAAAAAAAAAAAAA//////+AAAAAAAAP///+AAAAAAAAAAAAAADwCAAAAAAAAAAAAAAAAAAAAAA' +
  'Af/////8AAAAAAAAf///+AQAAAAAAAAAAAAD+DAAAAAAAQAAAAAAAAAAAAAAAf/////4AAAAAAAA' +
  '////+AwAAAAAAAAAAAAD8HAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAA////+BwAAAAAAAAA' +
  'AAB38HgAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAA////+D4AAAAAAAAAAAD/+HwAACAAAAAA' +
  'AAAAAAAAAAAAAD/////4AAAAAAAA////8PwAAAAAAAAAAAH//nwAAAgDAAAAAgAAAAAAAAAAAA//' +
  '///4AAAAAAAA////wPwAAAAAAAAAAAP///wAAAAGAAAAAAAAAAAAAAAAAAf////4AAAAAAAA////' +
  'gPwAAAAAAAAAAAf///4AAAAAAAAAAAAAAAAAAAAAAAf////4AAAAAAAA////APgAAAAAAAAAAA//' +
  '//8AAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgEAAAAAAAAAP////+AAJAAAAAAAAAA' +
  'AAAAAAAAAAP////gAAAAAAAAf//+AfgQAAAAAAAAAf/////AAGAAAAAAAAAAAAAAAAAAAAf////g' +
  'AAAAAAAAP///AfAAAAAAAAAAA//////gACAAAAAAAAAAAAAAAAAAAAf///8AAAAAAAAAP///AfAA' +
  'AAAAAAAAB//////gAAAAAAAAAAAAAAAAAAAAAAf///gAAAAAAAAAP///AfAAAAAAAAAAB//////4' +
  'AAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAH//8AMAAAAAAAAAAA//////4AAAAAAAAAAAAAAAA' +
  'AAAAAAf///AAAAAAAAAAH//4AAAAAAAAAAAAB//////4AAAAAAAAAAAAAAAAAAAAAAf///AAAAAA' +
  'AAAAH//4AAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAD//4AAAAAAAA' +
  'AAAAA//////8AAAAAAAAAAAAAAAAAAAAAA///+AAAAAAAAAAB//wAAAAAAAAAAAAAf/////8AAAA' +
  'AAAAAAAAAAAAAAAAAA///8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAA' +
  'AA///wAAAAAAAAAAA//AAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///wAAAAAAAAAA' +
  'A/+AAAAAAAAAAAAAAf/gP//4AAAAAAAAAAAAAAAAAAAAAA///gAAAAAAAAAAA/8AAAAAAAAAAAAA' +
  'Af8AP//wAAAAAAAAAAAAAAAAAAAAAA///AAAAAAAAAAAAcAAAAAAAAAAAAAAAfAAF//gAAAAAAAA' +
  'AAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//gAABgAAAAAAAAAAAAAAAAAB//' +
  '8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAD//4AAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAP/AAAAeAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AD8AAAA+AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAA' +
  'AAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAYAAAAAAAAAAAAAAAAAD/gAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAAHwAAAAAAAAAAAAAAAAAD/4AAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAcAAAHAEAAAAAAAAAAAAAAAAF/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIA' +
  'AAeAAAAAAAAAAAAAAAAAAH/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAA' +
  'AAAAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAH+AAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AwAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAvwAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAA'

interface Grid {
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

const DENSITY_PRESETS: Record<DottedWorldMapDensity, { step: number; mask: string }> = {
  low: { step: 3, mask: MASK_LOW },
  medium: { step: 2, mask: MASK_MEDIUM },
  high: { step: 1, mask: MASK_HIGH },
}

/** Sensible per-density defaults: a radius that suits 2 degree cells reads
 *  too thick at 1 degree and too sparse at 3 degrees. */
const DENSITY_DEFAULTS: Record<DottedWorldMapDensity, { dotRadius: number; edgeFade: number }> = {
  low: { dotRadius: 0.46, edgeFade: 1.4 },
  medium: { dotRadius: 0.38, edgeFade: 2 },
  high: { dotRadius: 0.32, edgeFade: 3.2 },
}

const gridCache = new Map<DottedWorldMapDensity, Grid>()
function getGrid(density: DottedWorldMapDensity): Grid {
  const preset = DENSITY_PRESETS[density]
  if (!gridCache.has(density)) {
    gridCache.set(density, buildGrid(preset.step, preset.mask))
  }
  return gridCache.get(density) as Grid
}

/** Bowed connector between two projected points. */
function arc(a: { x: number; y: number }, b: { x: number; y: number }, lift = 0.22) {
  const d = Math.hypot(b.x - a.x, b.y - a.y)
  return `M${a.x.toFixed(2)},${a.y.toFixed(2)} Q${((a.x + b.x) / 2).toFixed(2)},${(
    (a.y + b.y) / 2 -
    d * lift
  ).toFixed(2)} ${b.x.toFixed(2)},${b.y.toFixed(2)}`
}

const smoothstep = (t: number) => t * t * (3 - 2 * t)

function dotPath(cells: [number, number, number][], r: number) {
  const rr = r.toFixed(3)
  const dia = (r * 2).toFixed(3)
  let d = ''
  for (const [c, row] of cells) {
    d += `M${(c + 0.5 - r).toFixed(2)},${row + 0.5}a${rr},${rr} 0 1,0 ${dia},0a${rr},${rr} 0 1,0 -${dia},0`
  }
  return d
}

/** Quiet dot-matrix world map: land cells are grouped into a handful of
 *  coastal-fade levels, each rendered as one <path>, so the whole map stays
 *  cheap to pan and resize no matter how many dots are on screen. Markers
 *  accept lat/lng, connections take marker ids or raw [lat, lng] pairs. */
export default function DottedWorldMap({
  density = 'medium',
  dotColor = 'var(--color-white-a25)',
  metallic = false,
  dotRadius,
  edgeFade,
  edgeMinScale = 0.3,
  edgeMinOpacity = 0.4,
  fadeSteps = 8,
  markers = [],
  connections = [],
  accent = 'var(--color-primary)',
  showLabels = false,
  animate = true,
  onMarkerSelect,
  preserveAspectRatio = 'xMidYMid meet',
  className,
  style,
}: DottedWorldMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const gradientId = useId()

  const grid = useMemo(() => getGrid(density), [density])
  const { cols, rows, step } = grid
  const densityDefaults = DENSITY_DEFAULTS[density]
  const resolvedRadius = dotRadius ?? densityDefaults.dotRadius
  const resolvedFade = edgeFade ?? densityDefaults.edgeFade

  const project = useCallback(
    (lat: number, lng: number) => ({ x: ((lng + 180) / 360) * cols, y: (LAT_TOP - lat) / step }),
    [cols, step],
  )

  const r = Math.min(0.5, Math.max(0.05, resolvedRadius))

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

      {layers.map((l) => (
        <path
          key={l.key}
          d={l.d}
          fill={metallic ? `url(#${gradientId})` : dotColor}
          fillOpacity={l.opacity}
          shapeRendering="geometricPrecision"
        />
      ))}

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
              className={styles.markerDot}
              style={{ filter: `drop-shadow(0 0 2px ${color}) drop-shadow(0 0 4px ${color})` }}
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
