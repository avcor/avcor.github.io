import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import styles from './EcgImpactBar.module.css'

interface ImpactItem {
  icon: LucideIcon
  title?: string
  description: string
}

const heroLine = 'Zero Upload Wait'

const items: ImpactItem[] = [
  { icon: WifiOff, title: 'Offline-Safe', description: 'Every recording is saved and reviewable locally, regardless of network state.' },
  { icon: RefreshCw, title: 'Tracked Delivery', description: "WorkManager retries a failed or pending upload instead of losing it." },
  { icon: AlertTriangle, title: 'Error Visibility', description: 'Hardware connection errors surface to the doctor immediately, not after the fact.' },
]

export default function EcgImpactBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className={styles.panel}
    >
      <div className={styles.heading}>
        <span className={styles.headingText}>Impact</span>
        <span className={styles.headingDash} />
      </div>

      <div className={styles.itemsRow}>
        <div className={`${styles.itemWrap} ${styles.heroWrap}`}>
          <div className={styles.hero}>
            <div className={styles.heroValue}>{heroLine}</div>
          </div>
        </div>

        {items.map(({ icon: Icon, title, description }) => (
          <div key={description} className={styles.itemWrap}>
            <div className={styles.itemDivider} />
            <div className={styles.item}>
              <GlassBadge icon={Icon} size={40} />
              <div className={styles.text}>
                <div className={styles.title}>{title}</div>
                <div className={styles.description}>{description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
