import { forwardRef, useState, type CSSProperties } from 'react'
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
} from './circuitData'
import {
  CENTER_PULSE_ROUTES,
  useCircuitHighlight,
  type HoveredNode,
} from '../../hooks/useCircuitHighlight'
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
  'ecg-background-sync',
  'medical-chart-optimization',
  'payment-experience',
])

interface IndexCircuitProps {
  style?: CSSProperties
}

const IndexCircuit = forwardRef<HTMLDivElement, IndexCircuitProps>(function IndexCircuit(
  { style },
  ref,
) {
  const { open } = useCaseStudyOverlay()
  const [hovered, setHovered] = useState<HoveredNode>(null)
  const {
    highlightedWireIds,
    pulsePath,
    litWireLeafIds,
    highlightedLeafIds,
    highlightedDomainIds,
  } = useCircuitHighlight(hovered)

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

        {/* Center-chip hover, current flows outward from the hub, one
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
