import { motion } from 'framer-motion'
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className={styles.label}
        >
          <span className={styles.labelDot} />
          <span className={styles.labelNum}>02</span>
          <span className={styles.labelDivider} />
          <span className={styles.labelText}>Impact at a glance</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className={styles.heading}
        >
          <span className={styles.headingLine}>Engineering</span>
          <span className={styles.headingLine}>decisions that</span>
          <span className={styles.headingLine}>
            drive{' '}
            <span className={styles.headingHighlight}>real impact.</span>
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className={styles.description}
        >
          Metrics that reflect performance,
          <br />
          productivity and trust at scale.
        </motion.p>
      </div>

      {/* ── Scroll hint (mouse capsule) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={styles.scrollHint}
      >
        <div className={styles.scrollTrack}>
          <div className={styles.scrollLine} />
          <div className={styles.scrollCapsule}>
            <motion.div
              className={styles.scrollDot}
              animate={{ y: [0, 10, 0], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
        <span className={styles.scrollLabel}>Scroll to explore work</span>
      </motion.div>
    </div>
  )
}
