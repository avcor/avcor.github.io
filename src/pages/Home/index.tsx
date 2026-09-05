import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ScrollHint from '../../components/ScrollHint'
import signatureAnimation from '../../assets/abhishek-signature.gif'
import styles from './Home.module.css'

// ─── Animation presets ───────────────────────────────────────────────────────

const ease = [0.16, 1, 0.3, 1] as const

// Headline/subtext fades finish at 1.95s (last of the delay+duration pairs
// below). The signature <img> is mounted at that point rather than just
// faded in, since a GIF starts playing on mount regardless of CSS opacity.
const SIGNATURE_START_DELAY_MS = 1950

// Length of the signature GIF's own draw-on animation. A GIF's loop count is
// baked into the file and browsers just honor it, so the only way to stop it
// after one pass is to swap the <img> to a frozen frame once this elapses.
const SIGNATURE_GIF_DURATION_MS = 1500

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
  const [showSignature, setShowSignature] = useState(false)
  const [frozenSignatureSrc, setFrozenSignatureSrc] = useState<string | null>(null)
  const signatureImgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowSignature(true), SIGNATURE_START_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const handleSignatureLoad = () => {
    // Swapping to the frozen data URL below fires another load event on
    // this same <img>; skip re-arming the freeze timer for that one.
    if (frozenSignatureSrc) return

    // The GIF only starts animating once it has actually loaded, not at
    // mount time, so the freeze timer has to be anchored here.
    setTimeout(() => {
      const img = signatureImgRef.current
      if (!img) return

      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      canvas.getContext('2d')?.drawImage(img, 0, 0)
      setFrozenSignatureSrc(canvas.toDataURL())
    }, SIGNATURE_GIF_DURATION_MS)
  }

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
            ref={signatureImgRef}
            src={frozenSignatureSrc ?? signatureAnimation}
            alt="Abhishek's signature"
            className={styles.signature}
            onLoad={handleSignatureLoad}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease }}
          />
        )}
      </div>
    </main>
  )
}
