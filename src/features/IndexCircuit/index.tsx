import CircuitCaseStudyPill from './CircuitCaseStudyPill'
import CircuitDomainChip from './CircuitDomainChip'
import {
  CIRCUIT_CASE_STUDIES,
  CIRCUIT_DOMAINS,
  CIRCUIT_VIEWBOX,
  CIRCUIT_WIRING_PATH,
} from './circuitData'
import pcb from '../../assets/pcb.png'
import styles from './IndexCircuit.module.css'

export default function IndexCircuit() {
  return (
    <div className={styles.board}>
      <img src={pcb} alt="" className={styles.background} />

      <svg
        viewBox={CIRCUIT_VIEWBOX}
        preserveAspectRatio="none"
        className={styles.overlay}
        role="img"
        aria-label="Engineering domains circuit map"
      >
        <path d={CIRCUIT_WIRING_PATH} className={styles.stroke} />

        {CIRCUIT_DOMAINS.map((domain) => (
          <CircuitDomainChip key={domain.id} domain={domain} />
        ))}

        {CIRCUIT_CASE_STUDIES.map((study) => (
          <CircuitCaseStudyPill key={study.id} study={study} />
        ))}
      </svg>
    </div>
  )
}
