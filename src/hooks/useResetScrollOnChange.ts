import { useEffect, useRef } from 'react'

/**
 * Scrolls a container back to the top whenever `dep` changes. The deep-dive
 * detail panel swaps its content in place inside a fixed-height scroll
 * container (AnimatePresence just remounts the inner child), so without this
 * the new panel's text starts wherever the reader had scrolled the old one.
 */
export function useResetScrollOnChange<T>(dep: T) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollTo({ top: 0 })
  }, [dep])

  return ref
}
