import { motion } from 'framer-motion'
import styles from './ViewToggle.module.css'

const steps = [
  { num: '01', label: 'Recruiter View' },
  { num: '02', label: 'Engineer View' },
]

export default function ViewToggle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={styles.toggle}
    >
      <span className={styles.dotFilled} />
      <span className={styles.stepLabel}>
        {steps[0].num}&nbsp;&nbsp;{steps[0].label}
      </span>

      <span className={styles.trackLine} />

      <span className={styles.dotRing} />
      <span className={`${styles.stepLabel} ${styles.stepLabelActive}`}>
        {steps[1].num}&nbsp;&nbsp;{steps[1].label}
      </span>
    </motion.div>
  )
}
