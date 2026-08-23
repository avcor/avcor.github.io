import { motion } from 'framer-motion'
import { CloudOff, Gauge, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import styles from './LoggingImpactBar.module.css'

interface ImpactItem {
  icon: LucideIcon
  title?: string
  description: string
}

const heroLine = 'Debug with evidence, not anecdotes'
const heroDescription = 'Production issues are diagnosed from structured logs, not reproduced from user reports.'

const items: ImpactItem[] = [
  { icon: ShieldCheck, title: 'Fail-Closed Masking', description: 'Credentials, PII, and payment data are stripped before a log is persisted or sent; a masking error drops the log instead of leaking it.' },
  { icon: Gauge, title: 'Zero UI-Thread Blocking', description: 'Non-blocking channel writes and 50-log batched transactions replace per-log inserts, roughly 50x fewer writes.' },
  { icon: CloudOff, title: 'Delivery Survives Offline', description: 'Room persistence plus WorkManager guarantee eventual delivery after days without network.' },
]

export default function LoggingImpactBar() {
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
            <div className={styles.heroDescription}>{heroDescription}</div>
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
