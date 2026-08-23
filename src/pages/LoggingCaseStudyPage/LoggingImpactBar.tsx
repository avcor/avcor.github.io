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
const heroDescription = 'Diagnosed from logs, not user reports.'

const items: ImpactItem[] = [
  { icon: ShieldCheck, title: 'Fail-Closed Masking', description: 'PII stripped before any write.' },
  { icon: Gauge, title: 'Zero UI-Thread Blocking', description: 'Batched writes, ~50x fewer.' },
  { icon: CloudOff, title: 'Delivery Survives Offline', description: 'Guaranteed by Room + WorkManager.' },
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
