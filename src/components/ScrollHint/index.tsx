import { motion } from 'framer-motion'
import styles from './ScrollHint.module.css'

interface ScrollHintProps {
  label: string
}

export default function ScrollHint({ label }: ScrollHintProps) {
  return (
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
      <span className={styles.scrollLabel}>{label}</span>
    </motion.div>
  )
}
