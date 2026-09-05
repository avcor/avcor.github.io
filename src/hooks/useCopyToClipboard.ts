import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Copies text via the Clipboard API, falling back to a prompt when it's
 * unavailable (insecure context, permission denied). `copied` flips true for
 * `resetDelay` ms after a successful copy so callers can swap in a
 * check/confirmation icon.
 */
export function useCopyToClipboard(resetDelay = 1800) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        window.prompt('Copy this:', text)
        return
      }
      setCopied(true)
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => setCopied(false), resetDelay)
    },
    [resetDelay],
  )

  const reset = useCallback(() => setCopied(false), [])

  return { copied, copy, reset }
}
