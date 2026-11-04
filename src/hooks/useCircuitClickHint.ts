import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/** waiting → hover (route lights, pulse runs to the leaf) → press (click
 *  ripple and label) → done. `done` is sticky. */
export type ClickHintStep = 'waiting' | 'hover' | 'press' | 'done'

const SEEN_KEY = 'circuit-click-hint-seen'
/** Each step and how long it holds before the next one */
const TIMELINE: [ClickHintStep, number][] = [
  ['hover', 1400],
  ['press', 2200],
]

function hasSeenHint(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markHintSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* storage blocked: the hint just replays next visit */
  }
}

/** Plays the one-time "click a case study" demo on the circuit board,
 *  `startDelayMs` after `isBoardReady` turns true. Stops for good the moment the visitor hovers a
 *  real node, and never replays in the same browser session. Skipped
 *  entirely under prefers-reduced-motion. */
export function useCircuitClickHint(
  isBoardReady: boolean,
  isUserHovering: boolean,
  startDelayMs: number,
): ClickHintStep {
  const reduceMotion = useReducedMotion() === true
  const [step, setStep] = useState<ClickHintStep>(() => (hasSeenHint() ? 'done' : 'waiting'))

  /* A real hover means the visitor found the interaction on their own */
  if (isUserHovering && step !== 'done') setStep('done')

  useEffect(() => {
    if (!isBoardReady || reduceMotion || hasSeenHint()) return

    const timers: number[] = []
    let at = startDelayMs
    for (const [next, holdMs] of TIMELINE) {
      timers.push(window.setTimeout(() => setStep((prev) => (prev === 'done' ? prev : next)), at))
      at += holdMs
    }
    timers.push(window.setTimeout(() => setStep('done'), at))

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [isBoardReady, reduceMotion, startDelayMs])

  useEffect(() => {
    if (step === 'done') markHintSeen()
  }, [step])

  return reduceMotion ? 'done' : step
}
