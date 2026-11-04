import { useMemo } from 'react'
import {
  CIRCUIT_CASE_STUDIES,
  CIRCUIT_WIRES,
  type CircuitWire,
} from '../features/IndexCircuit/circuitData'

export type HoveredNode = { id: string; type: 'leaf' | 'domain' | 'center' } | null

export interface PulseRoute {
  /** Leaf id the route ends at */
  id: string
  /** Leaf branch followed by its domain's trunk. Every wire is drawn
   *  leaf → chip → center, so the pulse plays this path in reverse to
   *  read center → chip → leaf. */
  d: string
}

interface LeafRoute {
  leafId: string
  domainId: string
  wires: CircuitWire[]
}

/** One route per leaf: its own branch wire plus its domain's trunk wire
 *  into the center chip. Built once, every hover type reads from it. */
const LEAF_ROUTES: LeafRoute[] = CIRCUIT_CASE_STUDIES.flatMap((study) => {
  const leafWire = CIRCUIT_WIRES.find((wire) => wire.nodeIds.includes(study.id))
  const domainId = leafWire?.nodeIds.find((id) => id !== study.id)
  if (!leafWire || !domainId) return []

  const trunkWire = CIRCUIT_WIRES.find(
    (wire) => wire.nodeIds.length === 1 && wire.nodeIds[0] === domainId,
  )
  return [{ leafId: study.id, domainId, wires: trunkWire ? [leafWire, trunkWire] : [leafWire] }]
})

/** The leaf routes a hover lights: the hovered leaf's own route, every
 *  route through a hovered domain chip, or every route for the center chip. */
function getActiveRoutes(hovered: HoveredNode): LeafRoute[] {
  if (!hovered) return []
  if (hovered.type === 'center') return LEAF_ROUTES
  if (hovered.type === 'domain') return LEAF_ROUTES.filter((r) => r.domainId === hovered.id)
  return LEAF_ROUTES.filter((r) => r.leafId === hovered.id)
}

const EMPTY_IDS = new Set<string>()

/** Derives every highlight set the circuit board needs from the currently
 *  hovered node: which wires glow, which leaves light up, and one outbound
 *  pulse per lit leaf. Keeps the board component to composition only.
 *
 *  Domain chips never light up themselves, only the wires through them. */
export function useCircuitHighlight(hovered: HoveredNode) {
  const activeRoutes = useMemo(() => getActiveRoutes(hovered), [hovered])

  const highlightedWireIds = useMemo(
    () => new Set(activeRoutes.flatMap((route) => route.wires.map((wire) => wire.id))),
    [activeRoutes],
  )

  /** Every lit route pulses at once, each starting at the center chip. */
  const pulseRoutes = useMemo<PulseRoute[]>(
    () =>
      activeRoutes.map((route) => ({
        id: route.leafId,
        d: route.wires.map((wire) => wire.d).join(' '),
      })),
    [activeRoutes],
  )

  /** Leaves whose wire is lit, used for the connector dots, which glow on
   *  every kind of hover. */
  const litWireLeafIds = useMemo(
    () => new Set(activeRoutes.map((route) => route.leafId)),
    [activeRoutes],
  )

  /** Only a directly hovered leaf pill lights up. A domain or center hover
   *  lights the wires and dots, the pills stay at rest. */
  const highlightedLeafIds = useMemo(
    () => (hovered?.type === 'leaf' ? new Set([hovered.id]) : EMPTY_IDS),
    [hovered],
  )

  return {
    highlightedWireIds,
    pulseRoutes,
    litWireLeafIds,
    highlightedLeafIds,
  }
}
