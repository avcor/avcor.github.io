import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Binary, KeyRound, Lock, ScrollText } from 'lucide-react'
import styles from './SecurityIntro.module.css'

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

// NOTE: tag set is provisional, pending confirmed brand-mark icons. Only
// technologies the app actually uses are listed (Frida/RootBeer removed, they
// are detection targets, not dependencies). Using neutral lucide glyphs for now.
const tags: Tag[] = [
  { icon: <Lock size={13} />, label: 'OkHttp' },
  { icon: <Binary size={13} />, label: 'C / JNI' },
  { icon: <KeyRound size={13} />, label: 'Android Keystore' },
  { icon: <ScrollText size={13} />, label: 'ProGuard / R8' },
]

export default function SecurityIntro() {
  return (
    <div className={styles.column}>
      <div className={styles.textLayer}>
        <motion.div {...fadeUp(0.05)} className={styles.eyebrow}>
          <span className={styles.eyebrowDash} />
          <span>App Security Hardening</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.15)} className={styles.heading}>
          <span className={styles.headingLine}>The device isn't trusted,</span>
          <span className={styles.headingLineAccent}>the network isn't trusted,</span>
          <span className={styles.headingLine}>the binary isn't trusted.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.3)} className={styles.description}>
          Digiicampus handles payments and student records on devices we don't control.
          Pinning, a Keystore-backed token store, and a from-scratch tamper-detection
          engine make the binary itself trustworthy, not just the app.
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
