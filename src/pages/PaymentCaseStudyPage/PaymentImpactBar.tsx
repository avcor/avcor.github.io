import { motion } from 'framer-motion'
import { DatabaseZap, Gauge, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import InfoTooltip from '../../components/InfoTooltip'
import styles from './PaymentImpactBar.module.css'

interface ImpactItem {
  icon: LucideIcon
  title?: string
  description: string
}

const heroLine = '5 Calls, 1 Load'
const heroCaveat =
  'Settings, dues status, hostel, transport, and academic fee, fetched concurrently instead of one after another.'

const items: ImpactItem[] = [
  { icon: Gauge, title: 'One-Glance Status', description: 'Color-coded overall dues state before any number.' },
  {
    icon: DatabaseZap,
    title: 'Fewer Re-Entry Calls',
    description: 'Shared settings cached once per session, not re-fetched per tab.',
  },
  {
    icon: ShieldCheck,
    title: 'Server-Verified Success',
    description: 'Payment status is confirmed by the backend, never inferred from the client.',
  },
]

export default function PaymentImpactBar() {
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
            <div className={styles.heroValue}>
              {heroLine}
              <InfoTooltip text={heroCaveat} />
            </div>
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
