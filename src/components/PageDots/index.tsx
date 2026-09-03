import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './PageDots.module.css'

interface Section {
  id: string
  label: string
}

const SECTIONS: Section[] = [
  { id: 'hero-section', label: 'Home' },
  { id: 'work', label: 'Work' },
]

export default function PageDots() {
  const [active, setActive] = useState(0)

  // Track which section is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }, i) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i) },
        { threshold: 0.5 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Arrow / PageUp / PageDown keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && active < SECTIONS.length - 1) {
        e.preventDefault()
        goTo(active + 1)
      } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && active > 0) {
        e.preventDefault()
        goTo(active - 1)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  const goTo = (i: number) => {
    document.getElementById(SECTIONS[i].id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.container}>
      {/* Thin connecting line behind dots */}
      <div className={styles.connector} />

      {SECTIONS.map(({ id, label }, i) => {
        const isActive = active === i

        return (
          <div key={id} className={styles.dotWrapper}>
            {/* Label, fades in on hover */}
            <span className={`${styles.label} ${isActive ? styles.labelActive : ''}`}>
              {label}
            </span>

            {/* Dot */}
            <button
              onClick={() => goTo(i)}
              title={label}
              className={styles.dotButton}
            >
              <motion.div
                animate={{
                  width: isActive ? 10 : 5,
                  height: isActive ? 10 : 5,
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`${styles.dot} ${isActive ? styles.dotActive : styles.dotInactive}`}
              />
            </button>

            {/* Active page number label */}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  key="num"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.25 }}
                  className={styles.pageNum}
                >
                  0{i + 1}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
