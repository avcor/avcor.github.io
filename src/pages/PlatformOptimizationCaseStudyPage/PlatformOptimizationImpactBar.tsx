import { motion } from 'framer-motion'
import { Database, Layers, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import styles from './PlatformOptimizationImpactBar.module.css'

interface ImpactItem {
  icon: LucideIcon
  title?: string
  description: string
}

const heroLine = '45 GB to 200 MB'
const heroDescription = '99.5% storage reduction for existing installs; new installs never exceed the ~200 MB cache ceiling.'

const items: ImpactItem[] = [
  { icon: Timer, title: 'Cold Start ANRs Fixed', description: 'Slow cold start down to 0.78%, from ~1.05% in April 2026.' },
  { icon: Database, title: 'Flutter Size Regression Reverted', description: '~92MB back down to 54.8MB within weeks.' },
  { icon: Layers, title: 'View Recycling Restored', description: 'RecyclerView nested in NestedScrollView fixed on classroom resources.' },
]

export default function PlatformOptimizationImpactBar() {
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
