import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Network, Shrink } from 'lucide-react'
import { SiGlide, SiKotlin } from 'react-icons/si'
import styles from './PlatformOptimizationIntro.module.css'

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
  { icon: <Network size={14} strokeWidth={1.75} />, label: 'OkHttp' },
  { icon: <SiGlide size={13} />, label: 'Glide' },
  { icon: <Shrink size={14} strokeWidth={1.75} />, label: 'ProGuard/R8' },
]

export default function PlatformOptimizationIntro() {
  return (
    <div className={styles.column}>
      <div className={styles.textLayer}>
        <motion.div {...fadeUp(0.05)} className={styles.eyebrow}>
          <span className={styles.eyebrowDash} />
          <span>Platform Optimization</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.15)} className={styles.heading}>
          <span className={styles.headingLine}>Storage, startup, and build size,</span>
          <span className={styles.headingLineAccent}>all traced back</span>
          <span className={styles.headingLine}>to production telemetry.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.3)} className={styles.description}>
          Ten years of engineering debt let storage, cold start, and build size degrade
          quietly, in ways synthetic testing never caught. Fixed area by area using
          production telemetry: cache ceilings, startup threading, view recycling, and
          build shrinking.
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
