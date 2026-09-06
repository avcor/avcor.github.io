import { useEffect, useState } from 'react'

/** Flips true `delayMs` after mount. Used to defer mounting an element
 *  (rather than just fading it in) when the element itself starts an
 *  animation on mount that CSS opacity can't pause. */
export function useDelayedReveal(delayMs: number) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  return revealed
}
