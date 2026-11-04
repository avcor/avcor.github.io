import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { revealOnScroll } from '../../utils/motion'
import IndexMetricsCard from './IndexMetricsCard'
import IndexImpactCard from './IndexImpactCard'
import styles from './IndexLeftPanel.module.css'

const IndexLeftPanel = forwardRef<HTMLDivElement>(function IndexLeftPanel(_props, ref) {
  return (
    <div className={styles.column} ref={ref}>

      <div className={styles.topGroup}>

        {/* 1. Section label */}
        <motion.div {...revealOnScroll(0.1)} className={styles.label}>
          <span className={styles.labelDot} />
          <span className={styles.labelText}>WORK INDEX</span>
        </motion.div>

        {/* 2. Hero heading */}
        <motion.h2 {...revealOnScroll(0.2)} className={styles.heading}>
          <span className={styles.headingLine}>Engineering</span>
          <span className={styles.headingLineAccent}>Achievements.</span>
        </motion.h2>

        {/* 3. Supporting description */}
        <motion.p {...revealOnScroll(0.32)} className={styles.description}>
          A structured index of engineering domains and the real-world impact I've delivered.
        </motion.p>

        {/* 4 & 5. Metrics + Impact cards */}
        <motion.div {...revealOnScroll(0.44)} className={styles.cardsGroup}>
          <IndexMetricsCard />
          <IndexImpactCard />
        </motion.div>

      </div>

    </div>
  )
})

export default IndexLeftPanel
