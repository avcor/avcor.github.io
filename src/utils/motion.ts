/** Fast start, long soft settle. The site-wide entrance curve. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

interface RevealOptions {
  /** Distance the element rises from, in px. 0 for a pure fade. */
  y?: number
  duration?: number
}

/** Motion props that fade an element up the first time it scrolls into
 *  view, rather than on page load, so sections below the fold still
 *  animate when the visitor actually reaches them. Spread onto any
 *  `motion.*` element. */
export function revealOnScroll(delay = 0, { y = 16, duration = 0.65 }: RevealOptions = {}) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration, delay, ease: EASE_OUT_EXPO },
  }
}
