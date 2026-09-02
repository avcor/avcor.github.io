import { forwardRef, useMemo, useState, type CSSProperties } from 'react'
import CircuitCaseStudyPill from './CircuitCaseStudyPill'
import CircuitCenterCard from './CircuitCenterCard'
import CircuitDomainChip from './CircuitDomainChip'
import CircuitWireGlow from './CircuitWireGlow'
import CircuitWirePulse from './CircuitWirePulse'
import {
  CIRCUIT_CASE_STUDIES,
  CIRCUIT_DOMAINS,
  CIRCUIT_VIEWBOX,
  CIRCUIT_WIRES,
  type CircuitWire,
} from './circuitData'
import { useCaseStudyOverlay } from '../../context/CaseStudyOverlayContext'
import pcb from '../../assets/pcb.png'
import styles from './IndexCircuit.module.css'

/** Leaf nodes wired to open a details sheet. */
const OPENABLE_CASE_STUDY_IDS = new Set([
  'flutter-integration',
  'logging-system',
  'ml-kit-liveness',
  'app-security',
  'android-optimization',
  'medical-chart-optimization',
])

interface IndexCircuitProps {
  style?: CSSProperties
}

type HoveredNode = { id: string; type: 'leaf' | 'domain' | 'center' } | null

/** The full set of wire segments belonging to the hover target's route — a
 *  leaf's own wire plus its domain's trunk line to the center chip; for a
 *  domain, every wire touching it (trunk first, then each leaf branch); for
 *  the center chip, every wire on the board. Both the static glow and the
 *  traveling pulse render from this exact same list, so they always cover
 *  the identical whole path — never just a fragment. */
function getRouteWires(hovered: HoveredNode): CircuitWire[] {
  if (!hovered) return []

  if (hovered.type === 'center') return CIRCUIT_WIRES

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

/** One outbound pulse route per domain for the center-chip hover — the
 *  domain's leaf branches first and its trunk last, so playing the
 *  concatenated path in reverse reads center → chip → each leaf. */
const CENTER_PULSE_ROUTES = CIRCUIT_DOMAINS.map((domain) => {
  const wires = CIRCUIT_WIRES.filter((wire) => wire.nodeIds.includes(domain.id)).sort(
    (a, b) => b.nodeIds.length - a.nodeIds.length,
  )
  return { id: domain.id, d: wires.map((wire) => wire.d).join(' ') }
})

const IndexCircuit = forwardRef<HTMLDivElement, IndexCircuitProps>(function IndexCircuit(
  { style },
  ref,
) {
  const { open } = useCaseStudyOverlay()
  const [hovered, setHovered] = useState<HoveredNode>(null)
  const routeWires = useMemo(() => getRouteWires(hovered), [hovered])
  const highlightedWireIds = useMemo(
    () => new Set(routeWires.map((wire) => wire.id)),
    [routeWires],
  )
  const pulsePath = useMemo(
    () =>
      hovered?.type !== 'center' && routeWires.length > 0
        ? routeWires.map((wire) => wire.d).join(' ')
        : null,
    [hovered, routeWires],
  )

  /** On a center-chip hover only the wires light up and pulse — the leaf
   *  pills and domain chips themselves stay in their resting state. */
  const isCenterHover = hovered?.type === 'center'

  /** Leaves whose wire is lit — used for the connector dots, which glow on
   *  every kind of hover, including the center chip's. */
  const litWireLeafIds = useMemo(() => {
    const ids = new Set<string>()
    for (const study of CIRCUIT_CASE_STUDIES) {
      const leafWire = CIRCUIT_WIRES.find((wire) => wire.nodeIds.includes(study.id))
      if (leafWire && highlightedWireIds.has(leafWire.id)) ids.add(study.id)
    }
    return ids
  }, [highlightedWireIds])

  const highlightedLeafIds = isCenterHover ? new Set<string>() : litWireLeafIds

  /** Every domain chip the current route passes through — not just a
   *  directly-hovered domain, but also the domain a hovered leaf's wire
   *  routes into, so the chip glows wherever the pulse actually travels. */
  const highlightedDomainIds = useMemo(() => {
    const domainIds = new Set(CIRCUIT_DOMAINS.map((domain) => domain.id))
    const ids = new Set<string>()
    if (isCenterHover) return ids
    for (const wire of routeWires) {
      for (const nodeId of wire.nodeIds) {
        if (domainIds.has(nodeId)) ids.add(nodeId)
      }
    }
    return ids
  }, [routeWires, isCenterHover])

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
            <CircuitWireGlow d={wire.d} tone="idle" />
            {highlightedWireIds.has(wire.id) && <CircuitWireGlow d={wire.d} tone="active" />}
          </g>
        ))}

        <CircuitCenterCard
          isHighlighted={hovered !== null}
          onHoverChange={(isHovered) =>
            setHovered(isHovered ? { id: 'center', type: 'center' } : null)
          }
        />

        {hovered && pulsePath && (
          <CircuitWirePulse d={pulsePath} pulseKey={`${hovered.type}-${hovered.id}`} />
        )}

        {/* Center-chip hover — current flows outward from the hub, one
         *  pulse per domain route, each reaching its leaf nodes */}
        {hovered?.type === 'center' &&
          CENTER_PULSE_ROUTES.map((route) => (
            <CircuitWirePulse key={route.id} d={route.d} pulseKey={`center-${route.id}`} reverse />
          ))}

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
            isDotHighlighted={litWireLeafIds.has(study.id)}
            onHoverChange={(isHovered) =>
              setHovered(isHovered ? { id: study.id, type: 'leaf' } : null)
            }
            onSelect={OPENABLE_CASE_STUDY_IDS.has(study.id) ? () => open(study.id) : undefined}
          />
        ))}
      </svg>
    </div>
  )
})

export default IndexCircuit
