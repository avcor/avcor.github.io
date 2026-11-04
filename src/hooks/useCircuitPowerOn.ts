import { useEffect, useState, type RefObject } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/** Tracks the board's one-time power-on: `powered` flips true the first
 *  time half the board is on screen, `surging` stays true while the
 *  current trail is drawn, for `surgeMs`. Under prefers-reduced-motion
 *  the board still powers on, but there is no surge. */
export function useCircuitPowerOn(boardRef: RefObject<Element | null>, surgeMs: number) {
  const reduceMotion = useReducedMotion() === true
  const powered = useInView(boardRef, { once: true, amount: 0.5 })
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!powered || reduceMotion) return
    const timer = window.setTimeout(() => setSettled(true), surgeMs)
    return () => window.clearTimeout(timer)
  }, [powered, reduceMotion, surgeMs])

  return { powered, surging: powered && !settled && !reduceMotion }
}
