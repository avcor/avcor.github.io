import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Database, HardDrive, Network, PlayCircle, Timer } from 'lucide-react'
import { SiFirebase, SiGlide, SiGoogleplay } from 'react-icons/si'
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
  icon?: ReactNode
  label: string
}

const tags: Tag[] = [
  { icon: <Network size={13} color="var(--color-tag-okhttp)" />, label: 'OkHttp' },
  { icon: <SiGlide size={13} color="var(--color-brand-glide)" />, label: 'Glide' },
  { icon: <PlayCircle size={13} color="var(--color-tag-exoplayer)" />, label: 'ExoPlayer' },
  { icon: <SiGoogleplay size={13} color="var(--color-brand-googleplay)" />, label: 'Play Console Vitals' },
  { icon: <SiFirebase size={13} color="var(--color-brand-firebase)" />, label: 'Firebase Crashlytics' },
  { icon: <HardDrive size={13} color="var(--color-tag-storage)" />, label: 'Storage' },
  { icon: <Timer size={13} color="var(--color-tag-coldstart)" />, label: 'Cold Start' },
  { icon: <Database size={13} color="var(--color-tag-buildsize)" />, label: 'Build Size' },
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
