import { motion } from 'framer-motion'
import Nav from '../../components/Nav'
import ScrollIndicator from '../../components/ScrollIndicator'
import HeroCanvas from '../../components/HeroCanvas'

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

const headline = [
  'The best engineered',
  'products are the',
  'ones users never',
  'notice.',
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main
      style={{
        position: 'relative',
        height: '100svh',
        overflow: 'hidden',
        background: '#050505',
      }}
    >
      {/* ── Particle canvas — full viewport, behind content ─────────────── */}
      <HeroCanvas />

      {/* ── Left-edge canvas fade ────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          background:
            'linear-gradient(to right, #050505 0%, #050505 28%, rgba(5,5,5,0.7) 42%, transparent 62%)',
        }}
      />

      {/* ── Content layer ────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '36px 48px 0',
          }}
        >
          {/* AV logo */}
          <motion.div {...fadeUp(0.1, 0.7)}>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                color: 'rgba(230, 237, 243, 0.85)',
              }}
            >
              AV
            </span>
          </motion.div>

          <Nav />
        </header>

        {/* Hero text */}
        <section
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 48px',
          }}
        >
          {/* Headline */}
          <h1
            style={{
              fontWeight: 300,
              letterSpacing: '-0.028em',
              lineHeight: 1.06,
              color: '#e6edf3',
              marginBottom: 32,
              maxWidth: '52vw',
            }}
          >
            {headline.map((line, i) => (
              <motion.span
                key={line}
                className="block"
                style={{ fontSize: 'clamp(2.8rem, 5.2vw, 5rem)' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.55 + i * 0.1, ease }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          {/* Supporting text */}
          <motion.p
            {...fadeUp(1.05)}
            style={{
              fontSize: '0.9rem',
              lineHeight: 1.7,
              color: 'rgba(139, 148, 158, 0.6)',
              fontWeight: 300,
              letterSpacing: '0.01em',
              maxWidth: 360,
              marginBottom: 40,
            }}
          >
            I build digital experiences that disappear
            <br />
            behind what truly matters.
          </motion.p>

          {/* Scroll indicator */}
          <ScrollIndicator />
        </section>
      </div>
    </main>
  )
}
