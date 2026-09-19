import { motion } from 'framer-motion'
import LiquidGlass from 'liquid-glass-react'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import ResumeButton from '../ResumeButton'
import styles from './SiteHeader.module.css'

/** The site's real scroll sections, in document order. */
const SECTIONS = [
  { id: 'hero-section', label: 'Home' },
  { id: 'work', label: 'Impact' },
  { id: 'index', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

const SECTION_IDS = SECTIONS.map((s) => s.id)

/**
 * Fixed, sticky site-wide header: brand mark + section nav with scroll-spy
 * highlighting. Mounted once in App, floats above all 3 stacked full-viewport
 * sections rather than being rebuilt inside each one.
 *
 * The pill's surface comes from `liquid-glass-react` (SVG displacement +
 * backdrop blur), not from CSS. The library renders its glass container and
 * four overlay layers as flow siblings, each offset by top/left 50% and pulled
 * back by translate(-50%, -50%), so `.trackShell` stacks them all into one
 * grid cell where those two offsets cancel out.
 *
 * The header itself is a plain element and slides in from CSS. An inline
 * `opacity` or `transform` left behind by a framer entrance animation turns it
 * into its own backdrop root in Chrome, and the glass then has nothing to
 * sample: the bar renders, but the page scrolls under it unrefracted.
 */
export default function SiteHeader() {
  const activeId = useScrollSpy(SECTION_IDS)

  return (
    <header className={styles.header}>
      <div className={styles.trackShell}>
        <LiquidGlass
          className={styles.glass}
          cornerRadius={9999}
          padding="4px 7px"
          displacementScale={60}
          blurAmount={0.2}
          saturation={130}
          aberrationIntensity={2}
          elasticity={0}
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
        </LiquidGlass>
      </div>
      <ResumeButton />
    </header>
  )
}
