import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Boxes, Database, LineChart, Network, Settings2, Workflow } from 'lucide-react'
import { SiKotlin } from 'react-icons/si'
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
  { icon: <SiKotlin size={12} color="var(--color-primary)" />, label: 'Kotlin' },
  { icon: <Workflow size={14} strokeWidth={1.75} />, label: 'Channels' },
  { icon: <Database size={14} strokeWidth={1.75} />, label: 'Room' },
  { icon: <Boxes size={14} strokeWidth={1.75} />, label: 'WorkManager' },
  { icon: <Network size={14} strokeWidth={1.75} />, label: 'OkHttp' },
  { icon: <LineChart size={14} strokeWidth={1.75} />, label: 'Grafana Loki' },
  { icon: <Settings2 size={14} strokeWidth={1.75} />, label: 'Remote Config' },
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
