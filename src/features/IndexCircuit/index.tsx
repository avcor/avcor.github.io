import { forwardRef, useRef, useState, type CSSProperties } from 'react'
import CircuitCaseStudyPill from './CircuitCaseStudyPill'
import CircuitCenterCard from './CircuitCenterCard'
import CircuitClickHint from './CircuitClickHint'
import CircuitDomainChip from './CircuitDomainChip'
import CircuitPowerReveal from './CircuitPowerReveal'
import CircuitPowerSurge from './CircuitPowerSurge'
import CircuitWireGlow from './CircuitWireGlow'
import CircuitWirePulse from './CircuitWirePulse'
import {
  CIRCUIT_CASE_STUDIES,
  CIRCUIT_CLICK_HINT,
  CIRCUIT_DOMAINS,
  CIRCUIT_VIEWBOX,
  CIRCUIT_WIRES,
  OPENABLE_CASE_STUDY_IDS,
} from './circuitData'
import {
  CLICK_HINT_START_MS,
  DOMAIN_ARRIVAL_S,
  LEAF_ARRIVAL_S,
  POWER_ON,
  POWER_ON_SURGE_MS,
} from './circuitPowerOn'
import { useCircuitHighlight, type HoveredNode } from '../../hooks/useCircuitHighlight'
import { useCaseStudyOverlay } from '../../hooks/useCaseStudyOverlay'
import { useCanHover } from '../../hooks/useCanHover'
import { useCircuitClickHint } from '../../hooks/useCircuitClickHint'
import { useCircuitPowerOn } from '../../hooks/useCircuitPowerOn'
import pcb from '../../assets/pcb.png'
import styles from './IndexCircuit.module.css'

/** The leaf the click demo lights while it plays */
const HINT_NODE: HoveredNode = { id: CIRCUIT_CLICK_HINT.leafId, type: 'leaf' }

/** Labels start fading in just before the current arrives, so they are
 *  fully on as it reaches them */
const DOMAIN_REVEAL_S = DOMAIN_ARRIVAL_S - POWER_ON.labelFade / 2
const LEAF_REVEAL_S = LEAF_ARRIVAL_S - POWER_ON.labelFade / 2

interface IndexCircuitProps {
  style?: CSSProperties
}

const IndexCircuit = forwardRef<HTMLDivElement, IndexCircuitProps>(function IndexCircuit(
  { style },
  ref,
) {
  const { open } = useCaseStudyOverlay()
  const [hovered, setHovered] = useState<HoveredNode>(null)
  const backgroundRef = useRef<HTMLImageElement>(null)
  const canHover = useCanHover()
  const { powered, surging } = useCircuitPowerOn(backgroundRef, POWER_ON_SURGE_MS)
  const hintStep = useCircuitClickHint(powered, hovered !== null, CLICK_HINT_START_MS)
  /* A real hover always wins; otherwise the demo drives the board */
  const activeNode = hovered ?? (hintStep === 'hover' || hintStep === 'press' ? HINT_NODE : null)
  const { highlightedWireIds, pulseRoutes, litWireLeafIds, highlightedLeafIds } =
    useCircuitHighlight(activeNode)

  return (
    <div className={styles.board} style={style} ref={ref}>
      <img src={pcb} alt="" className={styles.background} ref={backgroundRef} />

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

        <CircuitPowerSurge surging={surging} />

        <CircuitPowerReveal powered={powered} delay={0}>
          <CircuitCenterCard
            isHighlighted={activeNode !== null || surging}
            onHoverChange={(isHovered) =>
              setHovered(isHovered ? { id: 'center', type: 'center' } : null)
            }
          />
        </CircuitPowerReveal>

        {/* Current always flows outward from the hub: one pulse per lit
         *  leaf, center chip to domain chip to leaf, on every hover type */}
        {activeNode &&
          pulseRoutes.map((route) => (
            <CircuitWirePulse
              key={route.id}
              d={route.d}
              pulseKey={`${activeNode.type}-${activeNode.id}-${route.id}`}
              reverse
            />
          ))}

        <CircuitPowerReveal powered={powered} delay={DOMAIN_REVEAL_S}>
          {CIRCUIT_DOMAINS.map((domain) => (
            <CircuitDomainChip
              key={domain.id}
              domain={domain}
              onHoverChange={(isHovered) =>
                setHovered(isHovered ? { id: domain.id, type: 'domain' } : null)
              }
            />
          ))}
        </CircuitPowerReveal>

        <CircuitPowerReveal powered={powered} delay={LEAF_REVEAL_S}>
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
        </CircuitPowerReveal>
      </svg>

      <CircuitClickHint
        step={hintStep}
        clickAt={CIRCUIT_CLICK_HINT.clickAt}
        labelAt={CIRCUIT_CLICK_HINT.labelAt}
        label={canHover ? 'Click to open' : 'Tap to open'}
      />
    </div>
  )
})

export default IndexCircuit
