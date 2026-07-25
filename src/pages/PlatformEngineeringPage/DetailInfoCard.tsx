import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import styles from './DetailInfoCard.module.css'

interface DetailItem {
  title: string
  description: string
}

interface DetailInfoCardProps {
  icon: LucideIcon
  tone: 'warning' | 'primary'
  title: string
  items: DetailItem[]
  delay?: number
}

export default function DetailInfoCard({ icon: Icon, tone, title, items, delay = 0 }: DetailInfoCardProps) {
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
            <Icon size={16} strokeWidth={1.75} className={tone === 'warning' ? styles.iconWarning : styles.icon} />
          </div>
          <span className={styles.title}>{title}</span>
        </div>

        <div className={styles.divider} />

        <ul className={styles.list}>
          {items.map(({ title: itemTitle, description }, i) => (
            <li key={itemTitle} className={styles.item}>
              <span className={styles.bulletCol}>
                <span className={styles.bullet} />
                {i < items.length - 1 && <span className={styles.line} />}
              </span>
              <div>
                <div className={styles.itemTitle}>{itemTitle}</div>
                <div className={styles.itemDescription}>{description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
