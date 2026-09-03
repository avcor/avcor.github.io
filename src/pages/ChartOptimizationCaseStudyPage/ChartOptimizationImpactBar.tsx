import { motion } from 'framer-motion'
import { Activity, Database, Ruler } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import InfoTooltip from '../../components/InfoTooltip'
import styles from './ChartOptimizationImpactBar.module.css'

interface ImpactItem {
  icon: LucideIcon
  title?: string
  description: string
}

const heroLine = '5s to under 2s draw time'
const heroCaveat = 'Chart calculation time on a full night of sleep data (9,000+ points), from the first iteration to the optimized pipeline.'

const items: ImpactItem[] = [
  { icon: Ruler, title: 'Accurate At Any Size', description: 'Smoothing and label density scale to screen width without losing point accuracy.' },
  { icon: Database, title: 'Instant Redraw', description: 'Computed chart data persisted for instant draw on repeat opens.' },
  { icon: Activity, title: 'One Computation, Not Many', description: 'Heavy work consolidated into a single memoized pass.' },
]

export default function ChartOptimizationImpactBar() {
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
