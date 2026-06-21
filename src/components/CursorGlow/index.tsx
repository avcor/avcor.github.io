import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)

  // Dot follows cursor with spring
  const dotX = useSpring(rawX, { damping: 35, stiffness: 250, mass: 0.4 })
  const dotY = useSpring(rawY, { damping: 35, stiffness: 250, mass: 0.4 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [rawX, rawY])

  return (
    /* Cursor dot only — canvas handles the atmospheric glow */
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
        backgroundColor: '#3DDC84',
        opacity: 0.85,
      }}
    />
  )
}
