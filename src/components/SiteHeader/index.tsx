import { motion } from 'framer-motion'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import styles from './SiteHeader.module.css'

const ease = [0.16, 1, 0.3, 1] as const

/** The site's 3 real scroll sections, in document order. */
const SECTIONS = [
  { id: 'hero-section', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'index', label: 'Index' },
]

const SECTION_IDS = SECTIONS.map((s) => s.id)

/**
 * Fixed, sticky site-wide header: brand mark + section nav with scroll-spy
 * highlighting. Mounted once in App, floats above all 3 stacked full-viewport
 * sections rather than being rebuilt inside each one.
 */
export default function SiteHeader() {
  const activeId = useScrollSpy(SECTION_IDS)

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease }}
      className={styles.header}
    >
      <nav className={styles.track} aria-label="Section">
        {SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`${styles.link} ${activeId === id ? styles.linkActive : ''}`}
          >
            {activeId === id && (
              <motion.span
                layoutId="navPill"
                className={styles.pillBg}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              />
            )}
            <span className={styles.linkLabel}>{label}</span>
          </a>
        ))}
      </nav>
    </motion.header>
  )
}
