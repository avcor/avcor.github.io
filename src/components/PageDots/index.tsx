import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    <div
      style={{
        position: 'fixed',
        right: 28,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}
    >
      {/* Thin connecting line behind dots */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1,
          background: 'rgba(255,255,255,0.08)',
          pointerEvents: 'none',
        }}
      />

      {SECTIONS.map(({ id, label }, i) => {
        const isActive = active === i

        return (
          <div
            key={id}
            className="group"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 0',
            }}
          >
            {/* Label — fades in on hover, slides from right */}
            <div
              className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ right: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)' }}
            >
              <span
                style={{
                  fontSize: '0.58rem',
                  fontWeight: 500,
                  color: isActive ? 'rgba(91,255,106,0.8)' : 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {label}
              </span>
            </div>

            {/* Dot */}
            <button
              onClick={() => goTo(i)}
              title={label}
              style={{
                background: 'none',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                borderRadius: '50%',
              }}
            >
              <motion.div
                animate={{
                  width: isActive ? 10 : 5,
                  height: isActive ? 10 : 5,
                  backgroundColor: isActive ? '#5BFF6A' : 'rgba(255,255,255,0.25)',
                  boxShadow: isActive
                    ? '0 0 0 3px rgba(91,255,106,0.15), 0 0 10px rgba(91,255,106,0.6)'
                    : '0 0 0 0px rgba(0,0,0,0)',
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ borderRadius: '50%' }}
              />
            </button>

            {/* Active page number label beside active dot */}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  key="num"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: 'absolute',
                    left: 'calc(100% + 10px)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.55rem',
                    fontWeight: 600,
                    color: 'rgba(91,255,106,0.6)',
                    letterSpacing: '0.1em',
                    fontFamily: "'Inter', sans-serif",
                    pointerEvents: 'none',
                  }}
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
