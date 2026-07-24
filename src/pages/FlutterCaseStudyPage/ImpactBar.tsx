import { motion } from 'framer-motion'
import { TrendingUp, Timer, Boxes, Layers, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './ImpactBar.module.css'

interface ImpactItem {
  icon: LucideIcon
  primary: string
  secondary: string
}

const items: ImpactItem[] = [
  { icon: Timer, primary: '90 → 18 min', secondary: 'Android CI build time' },
  { icon: Boxes, primary: 'Independent Releases', secondary: 'Android and Flutter shipped separately' },
  { icon: Layers, primary: 'Reusable Platform', secondary: 'Foundation for future Flutter modules' },
  { icon: Zap, primary: 'Reduced Engineering Effort', secondary: 'Eliminated duplicate feature development' },
]

export default function ImpactBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className={styles.panel}
    >
      <div className={styles.label}>
        <TrendingUp size={20} strokeWidth={2} className={styles.labelIcon} />
        <span>Impact</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.itemsGroup}>
        {items.map(({ icon: Icon, primary, secondary }, i) => (
          <div key={primary} className={styles.item}>
            {i > 0 && <div className={styles.itemDivider} />}
            <div className={styles.iconTile}>
              <Icon size={17} strokeWidth={1.75} />
            </div>
            <div>
              <div className={styles.primary}>{primary}</div>
              <div className={styles.secondary}>{secondary}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
