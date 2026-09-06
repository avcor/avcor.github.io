import { motion } from 'framer-motion'
import ScrollHint from '../../components/ScrollHint'
import { useDelayedReveal } from '../../hooks/useDelayedReveal'
import signatureImage from '../../assets/abhishek-signature.png'
import styles from './Home.module.css'

// ─── Animation presets ───────────────────────────────────────────────────────

const ease = [0.16, 1, 0.3, 1] as const

// Matches the headline's own start delay (0.5s) so the signature reveals
// alongside the text instead of visibly lagging behind it.
const SIGNATURE_START_DELAY_MS = 500

// A static PNG can't draw itself the way the old GIF did, so the "written"
// feel is faked with a left-to-right clip-path wipe over this duration.
const SIGNATURE_REVEAL_DURATION_S = 5

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
]

const headlineSecondary = [
  'because they never',
  'get in the way.',
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const showSignature = useDelayedReveal(SIGNATURE_START_DELAY_MS)

  return (
    <main id="hero-section" className={styles.page}>
      {/* ── Content layer ── */}
      <div className={styles.contentLayer}>
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
            <motion.span
              className={styles.headlinePrimary}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease }}
            >
              users <span className={styles.headlineAccent}>never notice</span>
            </motion.span>
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
        </section>

        <div className={styles.scrollHintWrap}>
          <ScrollHint label="Scroll to explore" />
        </div>

        {showSignature && (
          <motion.img
            src={signatureImage}
            alt="Abhishek's signature"
            className={styles.signature}
            initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: SIGNATURE_REVEAL_DURATION_S, ease }}
          />
        )}
      </div>
    </main>
  )
}
