import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Network, Workflow } from 'lucide-react'
import { SiAndroid, SiFirebase, SiGrafana, SiKotlin, SiSqlite } from 'react-icons/si'
import styles from './LoggingIntro.module.css'

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
  { icon: <Workflow size={14} strokeWidth={1.75} />, label: 'Channels' },
  { icon: <SiSqlite size={13} color="var(--color-brand-sqlite)" />, label: 'Room' },
  { icon: <SiAndroid size={13} color="var(--color-brand-android)" />, label: 'WorkManager' },
  { icon: <Network size={14} strokeWidth={1.75} />, label: 'OkHttp' },
  { icon: <SiGrafana size={13} color="var(--color-brand-grafana)" />, label: 'Grafana Loki' },
  { icon: <SiFirebase size={13} color="var(--color-brand-firebase)" />, label: 'Remote Config' },
]

export default function LoggingIntro() {
  return (
    <div className={styles.column}>
      <div className={styles.textLayer}>
        <motion.div {...fadeUp(0.05)} className={styles.eyebrow}>
          <span className={styles.eyebrowDash} />
          <span>Production Observability</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.15)} className={styles.heading}>
          <span className={styles.headingLine}>Diagnose production</span>
          <span className={styles.headingLineAccent}>from structured logs,</span>
          <span className={styles.headingLine}>not user reports.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.3)} className={styles.description}>
          Structured logs streamed from production Android devices to Grafana Loki.
          Privacy-first, offline-durable, never blocks the UI thread.
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
