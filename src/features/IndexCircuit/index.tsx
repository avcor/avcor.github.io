import { forwardRef, useMemo, useState, type CSSProperties } from 'react'
import CircuitCaseStudyPill from './CircuitCaseStudyPill'
import CircuitDomainChip from './CircuitDomainChip'
import CircuitWireIdleGlow from './CircuitWireIdleGlow'
import CircuitWirePulse from './CircuitWirePulse'
import {
  CIRCUIT_CASE_STUDIES,
  CIRCUIT_DOMAINS,
  CIRCUIT_VIEWBOX,
  CIRCUIT_WIRES,
  type CircuitWire,
} from './circuitData'
import pcb from '../../assets/pcb.png'
import styles from './IndexCircuit.module.css'

interface IndexCircuitProps {
  style?: CSSProperties
}

type HoveredNode = { id: string; type: 'leaf' | 'domain' } | null

/** The full set of wire segments belonging to the hover target's route — a
 *  leaf's own wire plus its domain's trunk line to the center chip, or for a
 *  domain, every wire touching it (trunk first, then each leaf branch). Both
 *  the static glow and the traveling pulse render from this exact same list,
 *  so they always cover the identical whole path — never just a fragment. */
function getRouteWires(hovered: HoveredNode): CircuitWire[] {
  if (!hovered) return []

  if (hovered.type === 'domain') {
    return CIRCUIT_WIRES.filter((wire) => wire.nodeIds.includes(hovered.id)).sort(
      (a, b) => a.nodeIds.length - b.nodeIds.length,
    )
  }

  const leafWire = CIRCUIT_WIRES.find((wire) => wire.nodeIds.includes(hovered.id))
  if (!leafWire) return []

  const domainId = leafWire.nodeIds.find((id) => id !== hovered.id)
  const trunkWire = CIRCUIT_WIRES.find(
    (wire) => wire.nodeIds.length === 1 && wire.nodeIds[0] === domainId,
  )

  return trunkWire ? [leafWire, trunkWire] : [leafWire]
}

const IndexCircuit = forwardRef<HTMLDivElement, IndexCircuitProps>(function IndexCircuit(
  { style },
  ref,
) {
  const [hovered, setHovered] = useState<HoveredNode>(null)
  const routeWires = useMemo(() => getRouteWires(hovered), [hovered])
  const highlightedWireIds = useMemo(
    () => new Set(routeWires.map((wire) => wire.id)),
    [routeWires],
  )
  const pulsePath = useMemo(
    () => (routeWires.length > 0 ? routeWires.map((wire) => wire.d).join(' ') : null),
    [routeWires],
  )

  const highlightedLeafIds = useMemo(() => {
    const ids = new Set<string>()
    for (const study of CIRCUIT_CASE_STUDIES) {
      const leafWire = CIRCUIT_WIRES.find((wire) => wire.nodeIds.includes(study.id))
      if (leafWire && highlightedWireIds.has(leafWire.id)) ids.add(study.id)
    }
    return ids
  }, [highlightedWireIds])

  /** Every domain chip the current route passes through — not just a
   *  directly-hovered domain, but also the domain a hovered leaf's wire
   *  routes into, so the chip glows wherever the pulse actually travels. */
  const highlightedDomainIds = useMemo(() => {
    const domainIds = new Set(CIRCUIT_DOMAINS.map((domain) => domain.id))
    const ids = new Set<string>()
    for (const wire of routeWires) {
      for (const nodeId of wire.nodeIds) {
        if (domainIds.has(nodeId)) ids.add(nodeId)
      }
    }
    return ids
  }, [routeWires])

  return (
    <div className={styles.board} style={style} ref={ref}>
      <img src={pcb} alt="" className={styles.background} />

      <svg
        viewBox={CIRCUIT_VIEWBOX}
        preserveAspectRatio="none"
        className={styles.overlay}
        role="img"
        aria-label="Engineering domains circuit map"
      >
        {CIRCUIT_WIRES.map((wire) => (
          <g key={wire.id}>
            <CircuitWireIdleGlow d={wire.d} />
            {highlightedWireIds.has(wire.id) && (
              <g className={styles.wireNeon}>
                <path d={wire.d} className={styles.wireGlowFar} />
                <path d={wire.d} className={styles.wireGlowMid} />
                <path d={wire.d} className={styles.wireGlowCore} />
                <path d={wire.d} className={styles.wireGlowHot} />
              </g>
            )}
          </g>
        ))}

        {hovered && pulsePath && (
          <CircuitWirePulse d={pulsePath} pulseKey={`${hovered.type}-${hovered.id}`} />
        )}

        {CIRCUIT_DOMAINS.map((domain) => (
          <CircuitDomainChip
            key={domain.id}
            domain={domain}
            isHighlighted={highlightedDomainIds.has(domain.id)}
            onHoverChange={(isHovered) =>
              setHovered(isHovered ? { id: domain.id, type: 'domain' } : null)
            }
          />
        ))}

        {CIRCUIT_CASE_STUDIES.map((study) => (
          <CircuitCaseStudyPill
            key={study.id}
            study={study}
            isHighlighted={highlightedLeafIds.has(study.id)}
            onHoverChange={(isHovered) =>
              setHovered(isHovered ? { id: study.id, type: 'leaf' } : null)
            }
          />
        ))}
      </svg>
    </div>
  )
})

export default IndexCircuit
