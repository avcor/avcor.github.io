import { motion } from 'framer-motion'
import { KeyRound, ScanLine, ShieldAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import InfoTooltip from '../../components/InfoTooltip'
import styles from './SecurityImpactBar.module.css'

interface ImpactItem {
  icon: LucideIcon
  title?: string
  description: string
}

const heroLine = 'Zero Pins In The Clear'
const heroCaveat =
  'Pin hashes and signer digests are XOR-obfuscated, so `strings apk.apk | grep sha256` returns nothing, the technique a tester used to locate the pinning code.'

const items: ImpactItem[] = [
  { icon: KeyRound, title: 'Self-Healing Token Store', description: 'Keystore-backed, survives OS keystore migrations without bricking login.' },
  { icon: ShieldAlert, title: '1,200-Line Detection Engine', description: 'Root, hook, and signature checks with zero third-party security libraries.' },
  { icon: ScanLine, title: 'Fail-Open By Design', description: 'Indeterminate signals never lock a user out, only confirmed tampering does.' },
]

export default function SecurityImpactBar() {
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
