import { motion } from 'framer-motion'
import {
  Zap,
  Clock,
  Code2,
  Shield,
  TrendingUp,
  LayoutGrid,
  Users,
  Database,
  Cloud,
  Sparkles,
  Rocket,
  Smartphone,
  CalendarDays,
} from 'lucide-react'
import MetricCard from '../../components/MetricCard'

// ─── Card data ────────────────────────────────────────────────────────────────

const cards = [
  {
    icon: Zap,
    metricPrefix: '4s →',
    metric: 'Instant',
    title: 'Flutter Engine Startup',
    description:
      'Optimized engine initialization and warmup to make Flutter screens load instantly.',
  },
  {
    icon: Clock,
    metricPrefix: '90m →',
    metric: '18m',
    title: 'CI/CD Pipeline',
    description:
      'Reduced build and deploy time to Firebase App Distribution from 90 minutes to 18.',
  },
  {
    icon: Code2,
    metric: '100+',
    title: 'Files Modernized',
    description:
      'Migrated legacy codebase, removed outdated libraries and enabled modern Android stack.',
  },
  {
    icon: Shield,
    metric: 'Fraud Prevented',
    title: 'Attendance Verification',
    description:
      'Implemented liveness verification to prevent proxy attendance using images or videos.',
  },
  {
    icon: TrendingUp,
    metric: '20%',
    title: 'Faster Development',
    description:
      'Adoption of Kotlin, Coroutines, Flow and Jetpack libraries improved team velocity.',
  },
  {
    icon: LayoutGrid,
    metric: '15%',
    title: 'Reduced UI Testing Time',
    description:
      'Architecture and state improvements reduced UI test cycles significantly.',
  },
  {
    icon: Users,
    metric: 'Seamless',
    title: 'Multi-Tenant Switching',
    description:
      'Designed secure and reliable account switching across roles and tenants.',
  },
  {
    icon: Database,
    metric: '9000+',
    title: 'Data Points Processed',
    description:
      'Optimized chart processing and rendering from 5 seconds to under 2 seconds.',
  },
  {
    icon: Cloud,
    metric: 'Offline',
    title: 'Reliable Data Sync',
    description:
      'Background uploads with WorkManager ensure no data loss even offline.',
  },
]

// ─── Bottom stats ─────────────────────────────────────────────────────────────

const stats = [
  { icon: Users, value: '500K+', label: 'Users Impacted' },
  { icon: Rocket, value: '25+', label: 'Features Delivered' },
  { icon: Smartphone, value: '2', label: 'Platforms Optimized' },
  { icon: CalendarDays, value: '5+', label: 'Years of Engineering' },
]

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV = ['Work', 'About', 'Writing', 'Contact']

// ─── Component ───────────────────────────────────────────────────────────────

export default function ImpactPage() {
  return (
    <section
      id="work"
      style={{
        height: '100vh',
        background: '#050608',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'var(--font-primary)',
      }}
    >
      {/* ══ Navigation ══════════════════════════════════════════════════════ */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '26px 48px',
          flexShrink: 0,
        }}
      >
        {/* AV logo */}
        <span
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: '#FFFFFF',
          }}
        >
          AV
        </span>

        {/* Nav links with green dot separators */}
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          {NAV.map((link, i) => (
            <span key={link} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#5BFF6A',
                    opacity: 0.55,
                    margin: '0 16px',
                  }}
                />
              )}
              <a
                href={`#${link.toLowerCase()}`}
                style={{
                  fontSize: '0.82rem',
                  fontWeight: link === 'Work' ? 500 : 400,
                  color: link === 'Work' ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: 3,
                  letterSpacing: '0.02em',
                }}
              >
                {link}
                {link === 'Work' && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 1.5,
                      background: '#5BFF6A',
                      borderRadius: 1,
                      display: 'block',
                    }}
                  />
                )}
              </a>
            </span>
          ))}
        </nav>
      </header>

      {/* ══ Main content ════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          padding: '0 48px',
          gap: 40,
          minHeight: 0,
          alignItems: 'stretch',
        }}
      >
        {/* ── Left column (34%) ─────────────────────────────────────────── */}
        <div
          style={{
            width: '34%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            paddingBottom: 4,
          }}
        >
          {/* Central radial glow + concentric rings */}
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '42%',
              left: '40%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            {/* Soft glow blob at center */}
            <div
              style={{
                position: 'absolute',
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(91,255,106,0.12) 0%, rgba(91,255,106,0.04) 45%, transparent 70%)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            {/* Concentric ring outlines */}
            {[360, 270, 180, 90].map((size) => (
              <div
                key={size}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  border: '1px solid rgba(91,255,106,0.1)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </motion.div>

          {/* ── Top text block ── */}
          <div style={{ position: 'relative', zIndex: 1, paddingTop: 2 }}>
            {/* Label: green dot · 02 · divider · IMPACT AT A GLANCE */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#5BFF6A',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '0.63rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.18em',
                }}
              >
                02
              </span>
              <span
                style={{
                  width: 1,
                  height: 11,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '0.63rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                Impact at a glance
              </span>
            </motion.div>

            {/* Heading — large, multi-line */}
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              style={{
                fontWeight: 700,
                lineHeight: 1.06,
                letterSpacing: '-0.035em',
                margin: 0,
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: 'clamp(2.6rem, 4vw, 4.4rem)',
                  color: '#FFFFFF',
                }}
              >
                Engineering
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 'clamp(2.6rem, 4vw, 4.4rem)',
                  color: '#FFFFFF',
                }}
              >
                decisions that
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 'clamp(2.6rem, 4vw, 4.4rem)',
                  color: '#FFFFFF',
                }}
              >
                drive{' '}
                <span style={{ color: '#5BFF6A' }}>real impact.</span>
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35 }}
              style={{
                marginTop: 20,
                fontSize: '0.92rem',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.7,
              }}
            >
              Metrics that reflect performance,
              <br />
              productivity and trust at scale.
            </motion.p>
          </div>

          {/* ── Scroll indicator (mouse capsule) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Vertical track + mouse capsule */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              {/* Thin line above capsule */}
              <div
                style={{
                  width: 1,
                  height: 28,
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: 1,
                }}
              />
              {/* Mouse capsule */}
              <div
                style={{
                  width: 20,
                  height: 30,
                  borderRadius: 12,
                  border: '1.5px solid rgba(255,255,255,0.22)',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: 5,
                  marginTop: 2,
                }}
              >
                <motion.div
                  style={{
                    width: 3,
                    height: 6,
                    borderRadius: 3,
                    background: '#5BFF6A',
                  }}
                  animate={{ y: [0, 10, 0], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>

            <span
              style={{
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.28)',
                letterSpacing: '0.06em',
              }}
            >
              Scroll to explore work
            </span>
          </motion.div>
        </div>

        {/* ── Right column (66%) — 3×3 grid ─────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: '15px',
            minHeight: 0,
          }}
        >
          {cards.map((card, i) => (
            <MetricCard
              key={card.title}
              icon={card.icon}
              metric={card.metric}
              metricPrefix={card.metricPrefix}
              title={card.title}
              description={card.description}
              delay={i * 0.06}
            />
          ))}
        </div>
      </div>

      {/* ══ Bottom stats bar ════════════════════════════════════════════════ */}
      <div style={{ padding: '18px 48px 20px', flexShrink: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          style={{
            background: 'rgba(10,13,16,0.95)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '16px 28px',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {/* Left: sparkle + "Impact that scales" + description */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              flex: 1,
              minWidth: 0,
            }}
          >
            <Sparkles
              size={28}
              color="#5BFF6A"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <div>
              <div
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#5BFF6A',
                  marginBottom: 4,
                  letterSpacing: '-0.01em',
                }}
              >
                Impact that scales
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#82888B',
                  lineHeight: 1.5,
                  maxWidth: 420,
                }}
              >
                Every metric here represents a problem solved for thousands of users — with
                reliability, speed and trust.
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 40,
              background: 'rgba(255,255,255,0.08)',
              flexShrink: 0,
            }}
          />

          {/* Stat items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 36, flexShrink: 0 }}>
            {stats.map(({ icon: StatIcon, value, label }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
                {i > 0 && (
                  <div
                    style={{
                      width: 1,
                      height: 28,
                      background: 'rgba(255,255,255,0.07)',
                      flexShrink: 0,
                      marginRight: -24,
                    }}
                  />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
                  <StatIcon size={30} color="#82888B" strokeWidth={1.5} />
                  <div>
                    <div
                      style={{
                        fontSize: '1.6rem',
                        fontWeight: 500,
                        color: '#5BFF6A',
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: '#82888B',
                        marginTop: 3,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
