import { motion } from 'framer-motion'
import { Timer, Boxes, Layers, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import styles from './ImpactBar.module.css'

interface ImpactItem {
  icon: LucideIcon
  value?: string
  title: string
  description: string
}

const items: ImpactItem[] = [
  { icon: Timer, value: '90 → 18 min', title: 'CI Build Time', description: 'Android build pipeline duration, start to finish' },
  { icon: Boxes, title: 'Independent Releases', description: 'Android and Flutter shipped separately' },
  { icon: Layers, title: 'Reusable Platform', description: 'Foundation for future Flutter modules' },
  { icon: Zap, title: 'Reduced Engineering Effort', description: 'Eliminated duplicate feature development' },
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
      {items.map(({ icon: Icon, value, title, description }, i) => (
        <div key={title} className={styles.item}>
          {i > 0 && <div className={styles.itemDivider} />}
          <GlassBadge icon={Icon} size={40} />
          <div className={styles.text}>
            <div className={styles.titleRow}>
              {value && <span className={styles.value}>{value}</span>}
              <span className={styles.title}>{title}</span>
            </div>
            <div className={styles.description}>{description}</div>
          </div>
        </div>
      ))}
    </motion.div>
  )
}
