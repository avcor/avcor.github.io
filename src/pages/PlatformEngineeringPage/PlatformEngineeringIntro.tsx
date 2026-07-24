import { motion } from 'framer-motion'
import { Feather, Bot, Layers, Infinity as InfinityIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './PlatformEngineeringIntro.module.css'

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
  { icon: InfinityIcon, label: 'CI/CD' },
]

export default function PlatformEngineeringIntro() {
  return (
    <div className={styles.column}>
      <motion.div {...fadeUp(0.05)} className={styles.eyebrow}>
        <span className={styles.eyebrowDash} />
        <span>Platform Engineering</span>
      </motion.div>

      <motion.h1 {...fadeUp(0.15)} className={styles.heading}>
        <span className={styles.headingLine}>Engineering Behind</span>
        <span className={styles.headingLine}>
          the <span className={styles.headingAccent}>Platform</span>
        </span>
      </motion.h1>

      <motion.p {...fadeUp(0.3)} className={styles.description}>
        Technical decisions and execution that made the platform robust, scalable and
        independent.
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
