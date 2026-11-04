import { motion } from 'framer-motion'
import { revealOnScroll } from '../../utils/motion'
import styles from './ImpactLeftColumn.module.css'

export default function ImpactLeftColumn() {
  return (
    <div className={styles.column}>
      {/* ── Central radial glow + concentric rings ── */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className={styles.glowContainer}
      >
        <div className={styles.glowBlob} />
        {[360, 270, 180, 90].map((size) => (
          <div
            key={size}
            className={styles.ring}
            style={{ width: size, height: size }}
          />
        ))}
      </motion.div>

      {/* ── Top text block ── */}
      <div className={styles.textBlock}>
        <motion.div {...revealOnScroll(0.1, { y: 12 })} className={styles.label}>
          <span className={styles.labelDot} />
          <span className={styles.labelText}>Impact at a glance</span>
        </motion.div>

        <motion.h2 {...revealOnScroll(0.2, { y: 18 })} className={styles.heading}>
          <span className={styles.headingLine}>Engineering</span>
          <span className={styles.headingLine}>decisions that</span>
          <span className={styles.headingLine}>
            drive{' '}
            <span className={styles.headingHighlight}>real impact.</span>
          </span>
        </motion.h2>

        <motion.p {...revealOnScroll(0.35, { y: 12 })} className={styles.description}>
          Metrics that reflect performance,
          <br />
          productivity and trust at scale.
        </motion.p>
      </div>
    </div>
  )
}
