import { motion } from 'framer-motion'
import styles from './IndexImpactCard.module.css'

export default function IndexImpactCard() {
  return (
    <div className={styles.card}>
      <div className={styles.inner}>

        {/* Status icon */}
        <div className={styles.statusRow}>
          <div className={styles.statusDot}>
            <motion.div
              className={styles.statusPulse}
              animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Body */}
        <p className={styles.body}>
          Every connection represents<br />
          a problem solved.<br />
          <br />
          Every signal represents<br />
          <span className={styles.bodyEmphasis}>impact delivered.</span>
        </p>

        {/* Inline action */}
        <button className={styles.action} type="button">
          View Impact Overview
          <span className={styles.arrow}>→</span>
        </button>

      </div>
    </div>
  )
}
