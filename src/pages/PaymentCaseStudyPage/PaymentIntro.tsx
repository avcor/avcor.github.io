import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { SiKotlin } from 'react-icons/si'
import { Blocks, DatabaseZap, GitFork, Layers, MessageSquare, PenTool } from 'lucide-react'
import styles from './PaymentIntro.module.css'

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
  { icon: <SiKotlin size={13} color="var(--color-brand-kotlin)" />, label: 'Kotlin & Coroutines' },
  { icon: <GitFork size={13} color="var(--color-tag-concurrency)" />, label: 'Concurrency' },
  { icon: <DatabaseZap size={13} color="var(--color-tag-caching)" />, label: 'Caching / API Reduction' },
  { icon: <Layers size={13} color="var(--color-tag-mvvm)" />, label: 'MVVM (StateFlow)' },
  { icon: <Blocks size={13} color="var(--color-tag-product-building)" />, label: 'Product Building' },
  { icon: <MessageSquare size={13} color="var(--color-tag-cross-team)" />, label: 'Cross-team Communication' },
  { icon: <PenTool size={13} color="var(--color-tag-ux-iteration)" />, label: 'UX Iteration' },
]

export default function PaymentIntro() {
  return (
    <div className={styles.column}>
      <div className={styles.textLayer}>
        <motion.div {...fadeUp(0.05)} className={styles.eyebrow}>
          <span className={styles.eyebrowDash} />
          <span>Fee Payments</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.15)} className={styles.heading}>
          <span className={styles.headingLine}>A student sees where they stand on fees</span>
          <span className={styles.headingLineAccent}>at a glance,</span>
          <span className={styles.headingLine}>without a wall of numbers.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.3)} className={styles.description}>
          The payment module shows a student their financial status in one screen: what
          is due, what is cleared, and what they can pay next. Requirements were vague
          at the start, so the work was as much product definition as it was Android.
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
