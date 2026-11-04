import { motion } from 'framer-motion'
import { SITE_SECTIONS, SITE_SECTION_IDS } from '../../config/siteSections'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { trackEvent } from '../../services/analytics'
import GlassSurface from '../GlassSurface'
import ResumeButton from '../ResumeButton'
import styles from './SiteHeader.module.css'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Fixed, sticky site-wide header: brand mark + section nav with scroll-spy
 * highlighting. Mounted once in App, floats above all 3 stacked full-viewport
 * sections rather than being rebuilt inside each one.
 *
 * The pill's surface is a `GlassSurface`, tuned from `config/glass.ts`.
 */
export default function SiteHeader() {
  const activeId = useScrollSpy(SITE_SECTION_IDS)

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease }}
      className={styles.header}
    >
      <GlassSurface padding="4px 7px">
        <nav className={styles.track} aria-label="Section">
          {SITE_SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => trackEvent('nav_click', { section_id: id })}
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
      </GlassSurface>
      <ResumeButton />
    </motion.header>
  )
}
