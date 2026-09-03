import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { SiAndroid, SiKotlin } from 'react-icons/si'
import { FileText, Usb, WifiOff, Workflow } from 'lucide-react'
import styles from './EcgIntro.module.css'

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

const tags: Tag[] = [
  { icon: <SiKotlin size={13} color="var(--color-brand-kotlin)" />, label: 'Kotlin' },
  { icon: <SiAndroid size={13} color="var(--color-brand-android)" />, label: 'WorkManager' },
  { icon: <Workflow size={13} color="var(--color-tag-coroutines)" />, label: 'Coroutines' },
  { icon: <Usb size={13} color="var(--color-tag-wiredconn)" />, label: 'Wired Connection' },
  { icon: <WifiOff size={13} color="var(--color-tag-offline)" />, label: 'Offline-First' },
  { icon: <FileText size={13} color="var(--color-tag-pdf)" />, label: 'PDF Generation' },
]

export default function EcgIntro() {
  return (
    <div className={styles.column}>
      <div className={styles.textLayer}>
        <motion.div {...fadeUp(0.05)} className={styles.eyebrow}>
          <span className={styles.eyebrowDash} />
          <span>Background ECG Sync</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.15)} className={styles.heading}>
          <span className={styles.headingLine}>A doctor takes an ECG and moves on,</span>
          <span className={styles.headingLineAccent}>the record uploads on its own</span>
          <span className={styles.headingLine}>and stays reviewable either way.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.3)} className={styles.description}>
          A wired ECG device connects to the phone, captures the reading, and turns it
          into a PDF the doctor can review immediately or later. Upload happens in the
          background so it never blocks the doctor's flow, and the report stays
          available locally if the network does not cooperate.
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
