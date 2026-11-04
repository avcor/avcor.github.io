import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { POWER_ON } from './circuitPowerOn'

interface CircuitPowerRevealProps {
  powered: boolean
  /** Seconds after power-on, when the current reaches this node */
  delay: number
  children: ReactNode
}

/** Keeps a board node's labels and icon dark until the power-on current
 *  reaches it, then switches it on. */
export default function CircuitPowerReveal({ powered, delay, children }: CircuitPowerRevealProps) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: powered ? 1 : 0 }}
      transition={{ duration: POWER_ON.labelFade, delay }}
    >
      {children}
    </motion.g>
  )
}
