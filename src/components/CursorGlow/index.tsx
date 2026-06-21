import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const rawX = useMotionValue(-600)
  const rawY = useMotionValue(-600)

  // Glow follows with a slow, heavy spring — fluid and atmospheric
  const glowX = useSpring(rawX, { damping: 26, stiffness: 220, mass: 0.5 })
  const glowY = useSpring(rawY, { damping: 26, stiffness: 220, mass: 0.5 })

  // Dot snaps faster — feels responsive without breaking the calm
  const dotX = useSpring(rawX, { damping: 36, stiffness: 260, mass: 0.4 })
  const dotY = useSpring(rawY, { damping: 36, stiffness: 260, mass: 0.4 })

  useEffect(() => {
    const move = (e: MouseEvent) => { rawX.set(e.clientX); rawY.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [rawX, rawY])

  return (
    <>
      {/* 600×600 atmospheric glow */}
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
            rgba(74,222,128,0.38) 0%,
            rgba(74,222,128,0.18) 30%,
            rgba(74,222,128,0.07) 55%,
            rgba(74,222,128,0)    75%
          )`,
        }}
      />

      {/* Cursor dot */}
      <motion.div
        className="pointer-events-none fixed"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 9999,
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: '#4ADE80',
          opacity: 0.75,
        }}
      />
    </>
  )
}
