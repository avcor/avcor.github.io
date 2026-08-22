import { motion } from 'framer-motion'
import { Timer, Shield, Zap, Package } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import styles from './ImpactBar.module.css'

interface ImpactItem {
  icon: LucideIcon
  value?: string
  unit?: string
  title?: string
  description: string
}

const items: ImpactItem[] = [
  { icon: Timer, value: '90 → 18', unit: 'min', description: 'CI/CD pipeline duration, start to finish' },
  { icon: Shield, title: 'Zero Blast Radius', description: 'No regressions on the existing native Android app' },
  { icon: Zap, title: '4s → Instant', description: 'Engine warm-up on repeat navigation' },
  { icon: Package, title: '~140MB → ~9MB', description: 'Stripped release APK size, per ABI' },
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
      <div className={styles.heading}>
        <span className={styles.headingText}>Impact</span>
        <span className={styles.headingDash} />
      </div>

      <div className={styles.itemsRow}>
        {items.map(({ icon: Icon, value, unit, title, description }, i) => (
          <div key={description} className={styles.itemWrap}>
            {i > 0 && <div className={styles.itemDivider} />}

            {i === 0 ? (
              <div className={styles.hero}>
                <div className={styles.heroValue}>
                  {value}
                  {unit && <span className={styles.heroUnit}>{unit}</span>}
                </div>
                <div className={styles.heroDescription}>{description}</div>
              </div>
            ) : (
              <div className={styles.item}>
                <GlassBadge icon={Icon} size={40} />
                <div className={styles.text}>
                  <div className={styles.title}>{title}</div>
                  <div className={styles.description}>{description}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
