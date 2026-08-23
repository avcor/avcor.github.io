import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import styles from './InfoCard.module.css'

interface InfoCardProps {
  title: string
  delay?: number
  children: ReactNode
}

export default function InfoCard({ title, delay = 0, children }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <div className={styles.inner}>
        <div className={styles.eyebrow}>
          <span>{title}</span>
          <span className={styles.eyebrowDash} />
        </div>

        <div className={styles.bodyLarge}>{children}</div>
      </div>
    </motion.div>
  )
}
