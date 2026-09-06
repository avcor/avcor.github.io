import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import styles from './CaseStudyIntro.module.css'

const ease = [0.16, 1, 0.3, 1] as const

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  }
}

export interface CaseStudyIntroTag {
  icon: ReactNode
  label: string
}

interface CaseStudyIntroProps {
  eyebrow: string
  /** Always 3 lines; the middle line renders as the accent line, matching
   *  every case study intro's heading shape. */
  headingLines: readonly [string, string, string]
  description: string
  tags: CaseStudyIntroTag[]
  /** Overrides the description's default 44ch wrap width for the rare case
   *  study whose copy needs a touch more room per line. */
  descriptionMaxWidth?: string
}

/** Shared shape behind every case study's opening panel: eyebrow label,
 *  3-line heading with an accented middle line, one description paragraph,
 *  and a tag row. Each case study page supplies only its own content. */
export default function CaseStudyIntro({
  eyebrow,
  headingLines: [firstLine, accentLine, lastLine],
  description,
  tags,
  descriptionMaxWidth,
}: CaseStudyIntroProps) {
  return (
    <div className={styles.column}>
      <div className={styles.textLayer}>
        <motion.div {...fadeUp(0.05)} className={styles.eyebrow}>
          <span className={styles.eyebrowDash} />
          <span>{eyebrow}</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.15)} className={styles.heading}>
          <span className={styles.headingLine}>{firstLine}</span>
          <span className={styles.headingLineAccent}>{accentLine}</span>
          <span className={styles.headingLine}>{lastLine}</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.3)}
          className={styles.description}
          style={descriptionMaxWidth ? { maxWidth: descriptionMaxWidth } : undefined}
        >
          {description}
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
