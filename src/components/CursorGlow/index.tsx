import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import styles from './CursorGlow.module.css'

// Fade-out starts this many px before the first-page boundary
const FADE_ZONE = 160

export default function CursorGlow() {
  const rawX = useMotionValue(-600)
  const rawY = useMotionValue(-600)
  // rawOpacity is set instantly; glowOpacity springs toward it smoothly
  const rawOpacity = useMotionValue(1)
  const glowOpacity = useSpring(rawOpacity, { damping: 36, stiffness: 180, mass: 0.6 })
  // Persists last known viewport Y so the scroll handler can reuse it
  const lastClientY = useRef(0)

  const glowX = useSpring(rawX, { damping: 26, stiffness: 220, mass: 0.5 })
  const glowY = useSpring(rawY, { damping: 26, stiffness: 220, mass: 0.5 })

  useEffect(() => {
    const updateOpacity = (clientY: number) => {
      const docY = clientY + window.scrollY
      const heroBottom = window.innerHeight

      if (docY >= heroBottom) {
        rawOpacity.set(0)
      } else if (docY >= heroBottom - FADE_ZONE) {
        rawOpacity.set(1 - (docY - (heroBottom - FADE_ZONE)) / FADE_ZONE)
      } else {
        rawOpacity.set(1)
      }
    }

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      lastClientY.current = e.clientY
      updateOpacity(e.clientY)
    }

    // When the user scrolls with cursor stationary, recalculate using
    // the last known cursor position so the glow dims gracefully
    const onScroll = () => updateOpacity(lastClientY.current)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [rawX, rawY, rawOpacity])

  return (
    <motion.div
      className={styles.glow}
      style={{
        x: glowX,
        y: glowY,
        opacity: glowOpacity,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  )
}
