import type { CircuitWire } from './circuitData'

/**
 * Power-on sequence, played once when the board first scrolls into view,
 * in seconds: the center chip lights, current draws out along each trunk
 * to its domain chip, then along each branch to its leaf, then the trail
 * fades back to idle. Labels switch on as the current reaches them.
 */
export const POWER_ON = {
  trunkDelay: 0.15,
  trunkDuration: 0.55,
  branchDuration: 0.45,
  /** How long the full trail stays lit after reaching the last leaf */
  hold: 0.35,
  fadeOut: 0.6,
  /** Fade-in time for a label once current reaches it */
  labelFade: 0.4,
} as const

/** When current reaches the domain chips */
export const DOMAIN_ARRIVAL_S = POWER_ON.trunkDelay + POWER_ON.trunkDuration
/** When current reaches the leaf pills */
export const LEAF_ARRIVAL_S = DOMAIN_ARRIVAL_S + POWER_ON.branchDuration
/** How long the surge trail stays on before fading, in ms */
export const POWER_ON_SURGE_MS = (LEAF_ARRIVAL_S + POWER_ON.hold) * 1000
/** The click demo waits until the surge has fully faded, in ms */
export const CLICK_HINT_START_MS = POWER_ON_SURGE_MS + POWER_ON.fadeOut * 1000 + 300

/** A trunk wire touches only its domain chip; a branch touches chip and leaf */
export function isTrunkWire(wire: CircuitWire): boolean {
  return wire.nodeIds.length === 1
}
