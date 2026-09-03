import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Database, TabletSmartphone } from 'lucide-react'
import styles from './ChartOptimizationIntro.module.css'

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
  { icon: <Database size={13} />, label: 'WatermelonDB' },
]

export default function ChartOptimizationIntro() {
  return (
    <div className={styles.column}>
      <div className={styles.textLayer}>
        <motion.div {...fadeUp(0.05)} className={styles.eyebrow}>
          <span className={styles.eyebrowDash} />
          <span>Dozee Home</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.15)} className={styles.heading}>
          <span className={styles.headingLine}>9,000 points a night,</span>
          <span className={styles.headingLineAccent}>drawn in under 2 seconds,</span>
          <span className={styles.headingLine}>on any screen.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.3)} className={styles.description}>
          A chart that takes 5 seconds to draw, or mislabels its own axis, does not read
          as accurate, even when the underlying data is.
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
