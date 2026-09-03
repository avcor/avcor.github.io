import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Bluetooth, GitBranch, TabletSmartphone } from 'lucide-react'
import styles from './ManagingProfileIntro.module.css'

const ease = [0.16, 1, 0.3, 1] as const

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  }
}

interface Tag {
  icon: ReactNode
  label: string
}

// NOTE: tag icons are provisional pending confirmed brand-mark verification.
const tags: Tag[] = [
  { icon: <TabletSmartphone size={13} />, label: 'React Native' },
  { icon: <GitBranch size={13} />, label: 'Redux' },
  { icon: <Bluetooth size={13} />, label: 'BLE' },
]

export default function ManagingProfileIntro() {
  return (
    <div className={styles.column}>
      <div className={styles.textLayer}>
        <motion.div {...fadeUp(0.05)} className={styles.eyebrow}>
          <span className={styles.eyebrowDash} />
          <span>Dozee Home</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.15)} className={styles.heading}>
          <span className={styles.headingLine}>Switching a profile</span>
          <span className={styles.headingLineAccent}>should feel instant,</span>
          <span className={styles.headingLine}>not flicker into place.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.3)} className={styles.description}>
          A caregiver managing someone else's health data should never wonder whose
          account they're looking at, or whether the shared pod is still listening.
        </motion.p>

        <motion.div {...fadeUp(0.42)} className={styles.tags}>
          {tags.map(({ icon, label }) => (
            <span key={label} className={styles.tag}>
              {icon}
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
