import { motion } from 'framer-motion'
import Nav from '../../components/Nav'
import ScrollIndicator from '../../components/ScrollIndicator'
import HeroCanvas from '../../components/HeroCanvas'
import styles from './Home.module.css'

// ─── Animation presets ───────────────────────────────────────────────────────

const ease = [0.16, 1, 0.3, 1] as const

function fadeUp(delay: number, duration = 0.9) {
  return {
    initial:    { opacity: 0, y: 22 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration, delay, ease },
  }
}

// ─── Headline lines ──────────────────────────────────────────────────────────

const headlinePrimary = [
  'The best engineered',
  'products are the ones',
  'users never notice',
]

const headlineSecondary = [
  'because they never',
  'get in the way.',
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main id="hero-section" className={styles.page}>
      {/* ── Particle canvas — full viewport, behind content ── */}
      <HeroCanvas />

      {/* ── Content layer ── */}
      <div className={styles.contentLayer}>
        {/* Header */}
        <header className={styles.header}>
          <motion.div {...fadeUp(0.1, 0.7)}>
            <span className={styles.logo}>AV</span>
          </motion.div>
          <Nav />
        </header>

        {/* Hero text */}
        <section className={styles.heroSection}>
          <h1 className={styles.headline}>
            {headlinePrimary.map((line, i) => (
              <motion.span
                key={line}
                className={styles.headlinePrimary}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.55 + i * 0.1, ease }}
              >
                {line}
              </motion.span>
            ))}
            {headlineSecondary.map((line, i) => (
              <motion.span
                key={line}
                className={styles.headlineSecondary}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.85 + i * 0.1, ease }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p {...fadeUp(1.05)} className={styles.subtext}>
            I build digital experiences that disappear
            <br />
            behind what truly matters.
          </motion.p>

          <ScrollIndicator />
        </section>
      </div>
    </main>
  )
}
