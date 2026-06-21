import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)
  const x = useSpring(rawX, { damping: 38, stiffness: 280, mass: 0.4 })
  const y = useSpring(rawY, { damping: 38, stiffness: 280, mass: 0.4 })

  useEffect(() => {
    const move = (e: MouseEvent) => { rawX.set(e.clientX); rawY.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [rawX, rawY])

  return (
    <motion.div
      className="pointer-events-none fixed"
      style={{
        x, y,
        translateX: '-50%',
        translateY: '-50%',
        zIndex: 9999,
        width: 5,
        height: 5,
        borderRadius: '50%',
        backgroundColor: '#3DDC84',
        opacity: 0.8,
      }}
    />
  )
}
