import { motion } from 'framer-motion'
import IndexMetricsCard from './IndexMetricsCard'
import IndexImpactCard from './IndexImpactCard'
import styles from './IndexLeftPanel.module.css'

const ease = [0.16, 1, 0.3, 1] as const

function fadeUp(delay: number) {
  return {
    initial:    { opacity: 0, y: 14 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  }
}

export default function IndexLeftPanel() {
  return (
    <div className={styles.column}>

      <div className={styles.topGroup}>

        {/* 1. Section label */}
        <motion.div {...fadeUp(0.1)} className={styles.label}>
          <span className={styles.labelDot} />
          <span className={styles.labelText}>WORK INDEX</span>
        </motion.div>

        {/* 2. Hero heading */}
        <motion.h2 {...fadeUp(0.2)} className={styles.heading}>
          <span className={styles.headingLine}>Engineering</span>
          <span className={styles.headingLineAccent}>Achievements.</span>
        </motion.h2>

        {/* 3. Supporting description */}
        <motion.p {...fadeUp(0.32)} className={styles.description}>
          A structured index of engineering domains and the real-world impact I've delivered.
        </motion.p>

        {/* 4 & 5. Metrics + Impact cards */}
        <motion.div {...fadeUp(0.44)} className={styles.cardsGroup}>
          <IndexMetricsCard />
          <IndexImpactCard />
        </motion.div>

      </div>

      {/* 6. Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className={styles.scrollIndicator}
      >
        <div className={styles.scrollCapsule}>
          <motion.div
            className={styles.scrollTrackDot}
            animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className={styles.scrollMeta}>
          <span className={styles.scrollLabel}>Scroll to explore</span>
          <motion.span
            className={styles.scrollArrow}
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
        </div>
      </motion.div>

    </div>
  )
}
