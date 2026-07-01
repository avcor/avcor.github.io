import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Fade-out starts this many px before the first-page boundary
const FADE_ZONE = 160

export default function CursorGlow() {
  const rawX = useMotionValue(-600)
  const rawY = useMotionValue(-600)
  const glowOpacity = useMotionValue(1)

  const glowX = useSpring(rawX, { damping: 26, stiffness: 220, mass: 0.5 })
  const glowY = useSpring(rawY, { damping: 26, stiffness: 220, mass: 0.5 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)

      // Document Y of the cursor (accounts for scroll position)
      const docY = e.clientY + window.scrollY
      const heroBottom = window.innerHeight // Home is exactly 100svh

      if (docY >= heroBottom) {
        // Cursor is on second page — fully hidden
        glowOpacity.set(0)
      } else if (docY >= heroBottom - FADE_ZONE) {
        // Cursor in fade zone — smoothly ramp from 1 → 0
        glowOpacity.set(1 - (docY - (heroBottom - FADE_ZONE)) / FADE_ZONE)
      } else {
        // Cursor well within first page — fully visible
        glowOpacity.set(1)
      }
    }

    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [rawX, rawY, glowOpacity])

  return (
    <motion.div
      className="pointer-events-none fixed"
      style={{
        x: glowX,
        y: glowY,
        opacity: glowOpacity,
        translateX: '-50%',
        translateY: '-50%',
        zIndex: 20,
        width: 380,
        height: 380,
        borderRadius: '50%',
        background: `radial-gradient(
          circle,
          rgba(91,255,106,0.32) 0%,
          rgba(46,204,113,0.16) 35%,
          rgba(46,204,113,0.06) 60%,
          rgba(46,204,113,0)    78%
        )`,
      }}
    />
  )
}
