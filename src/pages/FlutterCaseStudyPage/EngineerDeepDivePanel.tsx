import { motion } from 'framer-motion'
import { Layers, Code2, Package, GitMerge, Scale, ChevronRight, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './EngineerDeepDivePanel.module.css'

interface NavItem {
  icon: LucideIcon
  label: string
}

const navItems: NavItem[] = [
  { icon: Layers, label: 'Architecture Overview' },
  { icon: Code2, label: 'Module Communication' },
  { icon: Package, label: 'Platform Integration' },
  { icon: GitMerge, label: 'Release & CI/CD Pipeline' },
  { icon: Scale, label: 'Trade-offs & Decisions' },
]

interface EngineerDeepDivePanelProps {
  onAdvance?: () => void
}

export default function EngineerDeepDivePanel({ onAdvance }: EngineerDeepDivePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <div className={styles.inner}>
        <button type="button" className={styles.arrowButton} onClick={onAdvance} aria-label="Next section">
          <ChevronRight size={18} strokeWidth={2} />
        </button>

        <div className={styles.label}>
          <span className={styles.labelDot} />
          <span className={styles.labelNum}>02</span>
          <span className={styles.labelDivider} />
          <span className={styles.labelText}>Engineer View</span>
        </div>

        <div
          className={styles.headingButton}
          role="button"
          tabIndex={0}
          onClick={onAdvance}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onAdvance?.()
            }
          }}
        >
          <h2 className={styles.heading}>
            <span className={styles.headingLine}>Engineering</span>
            <span className={styles.headingLine}>Deep Dive</span>
          </h2>
        </div>

        <p className={styles.description}>A technical look at how the platform was built.</p>

        <nav className={styles.navList}>
          {navItems.map(({ icon: Icon, label }, i) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              onClick={(e) => {
                e.preventDefault()
                onAdvance?.()
              }}
              className={`${styles.navItem} ${i === 0 ? styles.navItemActive : ''}`}
            >
              <Icon size={17} strokeWidth={1.75} className={styles.navIcon} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className={styles.footer}>
          <span>Swipe or use keyboard arrow to navigate</span>
          <ArrowRight size={14} strokeWidth={2} />
        </div>
      </div>
    </motion.div>
  )
}
