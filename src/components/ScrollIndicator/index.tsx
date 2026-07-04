import { motion } from 'framer-motion'
import styles from './ScrollIndicator.module.css'

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.9 }}
      className={styles.container}
    >
      <motion.span
        className={styles.arrow}
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        ↓
      </motion.span>
    </motion.div>
  )
}
