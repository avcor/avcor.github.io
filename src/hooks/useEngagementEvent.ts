import { useEffect } from 'react'
import { trackEvent, type EventParams } from '../services/analytics'
import { startEngagementTimer } from '../services/engagement'

/**
 * Reports engaged time as `eventName` with `params` plus `engaged_seconds`,
 * for as long as `params` is non-null. A change in params closes the current
 * stretch (reported under the old params) and opens a new one.
 *
 * Summing `engaged_seconds` per param value in GA4 gives total time on it.
 */
export function useEngagementEvent(eventName: string, params: EventParams | null) {
  // Serialized so callers can pass a fresh object literal every render.
  const key = params ? JSON.stringify(params) : null

  useEffect(() => {
    if (key === null) return
    const stretchParams = JSON.parse(key) as EventParams
    return startEngagementTimer((seconds) =>
      trackEvent(eventName, { ...stretchParams, engaged_seconds: seconds }),
    )
  }, [eventName, key])
}
