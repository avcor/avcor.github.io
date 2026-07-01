import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const rawX = useMotionValue(-600)
  const rawY = useMotionValue(-600)
  const [onFirstPage, setOnFirstPage] = useState(true)

  // Glow follows with a slow, heavy spring — fluid and atmospheric
  const glowX = useSpring(rawX, { damping: 26, stiffness: 220, mass: 0.5 })
  const glowY = useSpring(rawY, { damping: 26, stiffness: 220, mass: 0.5 })

  useEffect(() => {
    const move = (e: MouseEvent) => { rawX.set(e.clientX); rawY.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [rawX, rawY])

  useEffect(() => {
    const onScroll = () => setOnFirstPage(window.scrollY < window.innerHeight)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!onFirstPage) return null

  return (
    <motion.div
      className="pointer-events-none fixed"
      style={{
        x: glowX,
        y: glowY,
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
