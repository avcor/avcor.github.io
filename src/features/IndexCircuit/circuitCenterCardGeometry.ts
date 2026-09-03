import { CIRCUIT_CENTER_CARD } from './circuitData'

/** Base spacing of the dotted matrix grid, in viewBox units, the finest
 *  spacing, used right at the border. */
const GRID_SPACING = 6

/** Distance-from-nearest-edge bands (0 = right at the edge, 1 = card
 *  center) mapped to how many grid cells are skipped between kept dots,
 *  1 keeps every dot (densest, at the border), 4 keeps only every 4th
 *  (sparsest, at the center), so density thins out band by band. */
const DENSITY_BANDS = [
  { upTo: 0.25, skip: 1 },
  { upTo: 0.5, skip: 2 },
  { upTo: 0.75, skip: 3 },
  { upTo: Infinity, skip: 4 },
] as const

/** Every matrix-grid dot's position, computed once, densest along the
 *  card's border, thinning out in concentric bands toward the center. */
export const GRID_DOTS = (() => {
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

/** Hover-dot brightness falloff, matches the reference's dim-pinprick
 *  peak (0.25) right at the border, dimming linearly toward a faint floor
 *  at the card center, mirroring the idle grid's inward thinning. */
export function hoverDotOpacity(distFromEdge: number): number {
  return Math.max(0.06, 0.25 * (1 - distFromEdge * 0.85))
}

/** Soft bloom layers for the card's outer framing box, one blurred strip
 *  per edge, at increasing blur radii, so the light is strongest right at
 *  the edges and fades smoothly into the background. */
export const OUTER_BOX_BLOOM_LAYERS = [
  { className: 'centerCardBloomNear', strokeWidth: 6, blur: 5 },
  { className: 'centerCardBloomMid', strokeWidth: 14, blur: 14 },
  { className: 'centerCardBloomFar', strokeWidth: 28, blur: 30 },
] as const

/** Where each edge strip's gradient reaches full strength, fading in from
 *  transparent at the corners over the first/last fraction of the edge. */
const BLOOM_CORNER_FADE = 0.22

/** Gradient stops for an edge strip: a smoothstep-eased fade in from the
 *  corner, flat through the middle, eased back out, a plain linear ramp
 *  produces Mach bands (a visible straight seam where the slope changes)
 *  once blurred, so the ease-in/out curve is sampled at several points. */
export const BLOOM_GRADIENT_STOPS: { offset: number; opacity: number }[] = (() => {
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

/** How far past the outer box the bloom mask reaches, must comfortably
 *  exceed the largest bloom layer's full visible spread (~3x its blur
 *  radius plus half its stroke width), or the haze gets cut off in a
 *  hard straight line at the mask's edge. */
export const BLOOM_MASK_MARGIN = 150
