import { motion } from 'framer-motion'
import styles from './MetricCard.module.css'

interface MetricCardProps {
  metric: string
  metricPrefix?: string
  title: string
  description: string
  delay?: number
}

export default function MetricCard({
  metric,
  metricPrefix,
  title,
  description,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <div className={styles.inner}>
        {/* ── Metric ── */}
        <div className={styles.metricValue}>
          {metricPrefix && (
            <span className={styles.metricPrefix}>{metricPrefix}</span>
          )}
          <span className={styles.metricNumber}>{metric}</span>
        </div>

        {/* ── Title ── */}
        <div className={styles.title}>{title}</div>

        {/* ── Description ── */}
        <div className={styles.description}>{description}</div>
      </div>
    </motion.div>
  )
}
