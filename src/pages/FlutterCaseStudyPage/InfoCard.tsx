import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import styles from './InfoCard.module.css'

interface InfoCardProps {
  icon: LucideIcon
  tone?: 'warning' | 'primary'
  title: string
  delay?: number
  children: ReactNode
}

export default function InfoCard({ icon: Icon, tone = 'primary', title, delay = 0, children }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={`${styles.iconCircle} ${tone === 'warning' ? styles.iconCircleWarning : ''}`}>
            <Icon size={18} strokeWidth={1.75} className={tone === 'warning' ? styles.iconWarning : styles.icon} />
          </div>
          <span className={styles.title}>{title}</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.body}>{children}</div>
      </div>
    </motion.div>
  )
}
