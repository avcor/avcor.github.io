import { motion } from 'framer-motion'
import { TrendingUp, Clock, Layers, Box, Zap, Quote } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './ResultsImpactSection.module.css'

interface ResultItem {
  icon: LucideIcon
  value: string
  title: string
  description?: string
  badge: string
}

const results: ResultItem[] = [
  { icon: Clock, value: '18 min', title: 'Android CI Build Time', badge: '80% faster' },
  {
    icon: Layers,
    value: '100%',
    title: 'Independent Releases',
    description: 'Flutter and Android teams can release independently',
    badge: 'Decoupled',
  },
  {
    icon: Box,
    value: '3+',
    title: 'Reusability',
    description: 'Platform reused across multiple products',
    badge: 'Products',
  },
  {
    icon: Zap,
    value: '30-40%',
    title: 'Engineering Effort',
    description: 'Reduced duplicate code and maintenance',
    badge: 'Effort saved',
  },
]

export default function ResultsImpactSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className={styles.row}
    >
      <div className={styles.statsPanel}>
        <div className={styles.label}>
          <TrendingUp size={18} strokeWidth={2} className={styles.labelIcon} />
          <span>Results &amp; Impact</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.items}>
          {results.map(({ icon: Icon, value, title, description, badge }) => (
            <div key={title} className={styles.item}>
              <div className={styles.iconTile}>
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <div>
                <div className={styles.value}>{value}</div>
                <div className={styles.itemTitle}>{title}</div>
                {description && <div className={styles.itemDescription}>{description}</div>}
                <span className={styles.badge}>{badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.quoteCard}>
        <Quote size={26} strokeWidth={2} className={styles.quoteIcon} />
        <p className={styles.quoteText}>
          Separated Flutter and Android into independently releasable systems with a reusable,
          scalable platform.
        </p>
      </div>
    </motion.div>
  )
}
