import { motion } from 'framer-motion'
import styles from './StoryCard.module.css'

interface StoryCardProps {
  title: string
  issue: string
  investigation: string
  finding: string
  impact: string
  delay?: number
}

export default function StoryCard({ title, issue, investigation, finding, impact, delay = 0 }: StoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={styles.card}
    >
      <h3 className={styles.title}>
        {title}
        <span className={styles.titleDash} />
      </h3>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Issue</span>
          <p className={styles.rowText}>{issue}</p>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Investigation</span>
          <p className={styles.rowText}>{investigation}</p>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Finding</span>
          <p className={styles.rowText}>{finding}</p>
        </div>
      </div>

      <div className={styles.impact}>
        <span className={styles.impactDash} />
        <p>{impact}</p>
      </div>
    </motion.div>
  )
}
