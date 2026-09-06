import type { CSSProperties } from 'react'

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

export interface DottedWorldMapProps {
  /** Coastline resolution: "low" (3° cells, ~2k dots), "medium" (2°, ~4.3k,
   *  the original), or "high" (1°, ~16.5k, resolves island chains). */
  density?: DottedWorldMapDensity
  dotColor?: string
  /** Dims only the land dot-matrix, not markers/labels, so a caller can
   *  fade the background map without also dimming a marker's white label. */
  landOpacity?: number
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
  /** Marker's hot center color, distinct from the surrounding `accent`
   *  glow so the dot can read as a bright core inside a softer halo. */
  markerCoreColor?: string
  /** Multiplies every marker glow layer's opacity; 1 = the tuned default,
   *  0 turns the bloom off, >1 pushes it brighter. The only place glow
   *  strength is controlled, no brightness is hardcoded in the layers. */
  markerGlowIntensity?: number
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
