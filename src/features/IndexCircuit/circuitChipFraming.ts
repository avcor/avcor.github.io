import type { CircuitDomain } from './circuitData'
import { CIRCUIT_WIRES } from './circuitData'
import { tracePathVertices } from './pathGeometry'

/** Every wire vertex on the blueprint, computed once, reused across every
 *  chip's nearest-wire lookup instead of re-tracing all wires per chip. */
const ALL_WIRE_VERTICES = CIRCUIT_WIRES.flatMap((wire) => tracePathVertices(wire.d))

/** How much of the space to the nearest wire the framing box actually
 *  uses, kept small so it hugs close to the chip's own box instead of
 *  reaching all the way out to touch the wire. */
const FRAMING_GAP_FRACTION = 0.35

/** Corner radius as a fraction of width, matching the reference asset
 *  (Rectangle 4.svg: 47.3x49.3 box, rx 2.65, so ~0.056 of its width). */
export const FRAMING_RX_RATIO = 2.65 / 47.3

export type FramingBox = NonNullable<ReturnType<typeof getFramingBox>>

/** A rounded rect framing the chip, same aspect ratio as the chip's own
 *  box, padded outward by a fraction of the space to the nearest wire on
 *  either side (within the chip's own vertical span), with rounded corners
 *  matching the reference asset. Not forced into a literal square. */
export function getFramingBox(rect: CircuitDomain['rect']) {
  const top = rect.y
  const bottom = rect.y + rect.height
  const left = rect.x
  const right = rect.x + rect.width

  let leftGap = Infinity
  let rightGap = Infinity
  for (const vertex of ALL_WIRE_VERTICES) {
    if (vertex.y < top || vertex.y > bottom) continue
    if (vertex.x < left) leftGap = Math.min(leftGap, left - vertex.x)
    else if (vertex.x > right) rightGap = Math.min(rightGap, vertex.x - right)
  }

  const gap = Math.min(leftGap, rightGap) * FRAMING_GAP_FRACTION
  if (!Number.isFinite(gap)) return null

  const width = rect.width + gap * 2
  const height = rect.height + gap * 2

  return {
    x: rect.x - gap,
    y: rect.y - gap,
    width,
    height,
    rx: width * FRAMING_RX_RATIO,
  }
}

export function inflateBox(box: FramingBox, amount: number) {
  return {
    x: box.x - amount,
    y: box.y - amount,
    width: box.width + amount * 2,
    height: box.height + amount * 2,
    rx: box.rx + amount * FRAMING_RX_RATIO,
  }
}
