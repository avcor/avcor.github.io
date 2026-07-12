import { forwardRef, useMemo, useState, type CSSProperties } from 'react'
import CircuitCaseStudyPill from './CircuitCaseStudyPill'
import CircuitDomainChip from './CircuitDomainChip'
import {
  CIRCUIT_CASE_STUDIES,
  CIRCUIT_DOMAINS,
  CIRCUIT_VIEWBOX,
  CIRCUIT_WIRES,
} from './circuitData'
import pcb from '../../assets/pcb.png'
import styles from './IndexCircuit.module.css'

interface IndexCircuitProps {
  style?: CSSProperties
}

type HoveredNode = { id: string; type: 'leaf' | 'domain' } | null

/** Wire ids to highlight for the given hover target — a leaf highlights its own
 *  wire plus its domain's trunk line to the center chip; a domain highlights
 *  every wire touching it (its leaves' wires and its own trunk line). */
function getHighlightedWireIds(hovered: HoveredNode): Set<string> {
  if (!hovered) return new Set()

  if (hovered.type === 'domain') {
    return new Set(
      CIRCUIT_WIRES.filter((wire) => wire.nodeIds.includes(hovered.id)).map((wire) => wire.id),
    )
  }

  const leafWire = CIRCUIT_WIRES.find((wire) => wire.nodeIds.includes(hovered.id))
  if (!leafWire) return new Set()

  const domainId = leafWire.nodeIds.find((id) => id !== hovered.id)
  const trunkWire = CIRCUIT_WIRES.find(
    (wire) => wire.nodeIds.length === 1 && wire.nodeIds[0] === domainId,
  )

  return new Set(trunkWire ? [leafWire.id, trunkWire.id] : [leafWire.id])
}

const IndexCircuit = forwardRef<HTMLDivElement, IndexCircuitProps>(function IndexCircuit(
  { style },
  ref,
) {
  const [hovered, setHovered] = useState<HoveredNode>(null)
  const highlightedWireIds = useMemo(() => getHighlightedWireIds(hovered), [hovered])

  const highlightedLeafIds = useMemo(() => {
    const ids = new Set<string>()
    for (const study of CIRCUIT_CASE_STUDIES) {
      const leafWire = CIRCUIT_WIRES.find((wire) => wire.nodeIds.includes(study.id))
      if (leafWire && highlightedWireIds.has(leafWire.id)) ids.add(study.id)
    }
    return ids
  }, [highlightedWireIds])

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
          <path
            key={wire.id}
            d={wire.d}
            className={
              highlightedWireIds.has(wire.id)
                ? `${styles.stroke} ${styles.wireHighlight}`
                : styles.stroke
            }
          />
        ))}

        {CIRCUIT_DOMAINS.map((domain) => (
          <CircuitDomainChip
            key={domain.id}
            domain={domain}
            isHighlighted={hovered?.type === 'domain' && hovered.id === domain.id}
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
