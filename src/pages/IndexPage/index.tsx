import { useRef } from 'react'
import Nav from '../../components/Nav'
import IndexCircuit from '../../features/IndexCircuit'
import {
  LEFT_BLEED_MARKER_FRACTION,
  RIGHT_BLEED_MARKER_FRACTION,
} from '../../features/IndexCircuit/circuitData'
import { useCircuitBleed } from '../../hooks/useCircuitBleed'
import IndexLeftPanel from './IndexLeftPanel'
import styles from './IndexPage.module.css'

export default function IndexPage() {
  const leftPanelRef = useRef<HTMLDivElement>(null)
  const rightColumnRef = useRef<HTMLDivElement>(null)
  const bleedStyle = useCircuitBleed(
    leftPanelRef,
    rightColumnRef,
    LEFT_BLEED_MARKER_FRACTION,
    RIGHT_BLEED_MARKER_FRACTION,
  )

  return (
    <section id="index" className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>AV</span>
        <Nav />
      </header>

      <div className={styles.content}>
        <IndexLeftPanel ref={leftPanelRef} />
        <div className={styles.rightColumn} ref={rightColumnRef}>
          <IndexCircuit style={bleedStyle} />
        </div>
      </div>
    </section>
  )
}
