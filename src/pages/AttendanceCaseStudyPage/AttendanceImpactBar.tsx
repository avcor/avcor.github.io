import { motion } from 'framer-motion'
import { MapPin, ScanFace, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import InfoTooltip from '../../components/InfoTooltip'
import styles from './AttendanceImpactBar.module.css'

interface ImpactItem {
  icon: LucideIcon
  title?: string
  description: string
}

const heroLine = 'Zero Fraud Incidents'
const heroCaveat = 'Reported by the Customer Success team since launch, a qualitative signal, not a measured detection rate.'

const items: ImpactItem[] = [
  { icon: MapPin, title: 'Live Location Gate', description: 'Geofence and IP validated server-side.' },
  { icon: ScanFace, title: 'Randomized Liveness', description: 'A different head-turn and blink challenge each session.' },
  { icon: ShieldCheck, title: 'Camera-Only Capture', description: 'No gallery or file-picker path to a punch photo.' },
]

export default function AttendanceImpactBar() {
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
