import { motion } from 'framer-motion'
import { Bluetooth, RefreshCw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import InfoTooltip from '../../components/InfoTooltip'
import styles from './ManagingProfileImpactBar.module.css'

interface ImpactItem {
  icon: LucideIcon
  title?: string
  description: string
}

const heroLine = 'One state transition, not many'
const heroCaveat = 'Collapsed multiple intermediate Redux reads between the API call and the final state into one transition, removing the render cascade that caused screen flicker on profile switch.'

const items: ImpactItem[] = [
  { icon: RefreshCw, title: 'Zero Render Flicker', description: 'Profile switch updates render once, not per intermediate Redux read.' },
  { icon: Bluetooth, title: 'Live Pod State', description: 'Hardware state and reconfiguration available immediately after switching accounts.' },
]

export default function ManagingProfileImpactBar() {
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
