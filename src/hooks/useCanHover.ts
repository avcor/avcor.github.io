import { useSyncExternalStore } from 'react'

const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

function subscribe(onChange: () => void) {
  const query = window.matchMedia(HOVER_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** True on a mouse/trackpad device, false on touch. Drives "click" vs
 *  "tap" wording and whether a hover-based hint makes sense at all. */
export function useCanHover(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => true,
  )
}
