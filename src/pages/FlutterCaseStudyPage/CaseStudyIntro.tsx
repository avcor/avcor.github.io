import { motion } from 'framer-motion'
import { Feather, Bot, Layers, Blocks, Infinity as InfinityIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './CaseStudyIntro.module.css'

const ease = [0.16, 1, 0.3, 1] as const

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  }
}

interface Tag {
  icon: LucideIcon
  label: string
}

const tags: Tag[] = [
  { icon: Feather, label: 'Flutter' },
  { icon: Bot, label: 'Android' },
  { icon: Layers, label: 'Architecture' },
  { icon: Blocks, label: 'Modular' },
  { icon: InfinityIcon, label: 'CI/CD' },
]

export default function CaseStudyIntro() {
  return (
    <div className={styles.column}>
      <motion.div {...fadeUp(0.05)} className={styles.eyebrow}>
        <span className={styles.eyebrowDash} />
        <span>Platform Engineering</span>
      </motion.div>

      <motion.h1 {...fadeUp(0.15)} className={styles.heading}>
        <span className={styles.headingLine}>Building a Modular</span>
        <span className={styles.headingLineAccent}>Flutter Platform</span>
        <span className={styles.headingLine}>for Android</span>
      </motion.h1>

      <motion.p {...fadeUp(0.3)} className={styles.description}>
        Built the platform that enabled Flutter features to run inside an existing
        Android application while allowing Android and Flutter to evolve and release
        independently.
      </motion.p>

      <motion.div {...fadeUp(0.42)} className={styles.tags}>
        {tags.map(({ icon: Icon, label }) => (
          <span key={label} className={styles.tag}>
            <Icon size={14} strokeWidth={1.75} />
            {label}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
