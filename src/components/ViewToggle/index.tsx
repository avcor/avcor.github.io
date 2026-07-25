import { motion } from 'framer-motion'
import styles from './ViewToggle.module.css'

interface ViewToggleProps {
  activeIndex: number
  onChange: (index: number) => void
}

const TABS = ['Overview', 'Engineering']
const TRANSITION = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }

export default function ViewToggle({ activeIndex, onChange }: ViewToggleProps) {
  return (
    <div className={styles.capsule} role="tablist" aria-label="Case study section">
      <motion.div
        className={styles.indicator}
        animate={{ x: `${activeIndex * 100}%` }}
        transition={TRANSITION}
        aria-hidden="true"
      />

      {TABS.map((label, index) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={activeIndex === index}
          data-active={activeIndex === index || undefined}
          className={styles.tab}
          onClick={() => onChange(index)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
