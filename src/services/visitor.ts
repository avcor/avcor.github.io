/**
 * Anonymous visitor identity, kept in localStorage. GA4's own client id lives
 * in a cookie that browsers expire or clear aggressively (Safari ITP caps it
 * at 7 days), which splits one person into several "users". A random id that
 * persists in storage and is sent as GA4's `user_id` keeps them as one.
 * No personal data is involved: the id is random and never leaves analytics.
 */

const VISITOR_KEY = 'av_visitor_id'
const FIRST_SEEN_KEY = 'av_first_seen'
const VISIT_COUNT_KEY = 'av_visit_count'
const LAST_SEEN_KEY = 'av_last_seen'
const MODE_KEY = 'av_analytics_mode'

/** A gap longer than this starts a new visit (GA4's default session timeout). */
const VISIT_GAP_MS = 30 * 60 * 1000

export interface VisitorInfo {
  id: string
  visitCount: number
  /** YYYY-MM-DD of the first visit from this browser. */
  firstSeen: string
}

/** `off`: this browser never reports (your own devices).
 *  `debug`: reports even from the dev server, flagged for GA4 DebugView. */
export type AnalyticsMode = 'normal' | 'off' | 'debug'

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage blocked (private mode, policy): the id lives for this page only.
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Nothing stored to remove.
  }
}

function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

/**
 * Reads `?analytics=off|debug|on` from the URL and persists it, so opening the
 * site once with `?analytics=off` excludes that browser for good.
 * `?analytics=on` clears the flag.
 */
export function resolveAnalyticsMode(): AnalyticsMode {
  const flag = new URLSearchParams(window.location.search).get('analytics')
  if (flag === 'off' || flag === 'debug') write(MODE_KEY, flag)
  if (flag === 'on') remove(MODE_KEY)

  const stored = read(MODE_KEY)
  return stored === 'off' || stored === 'debug' ? stored : 'normal'
}

/** Loads (or creates) this browser's visitor record and counts a new visit
 *  when the last activity was more than `VISIT_GAP_MS` ago. */
export function resolveVisitor(now = Date.now()): VisitorInfo {
  let id = read(VISITOR_KEY)
  if (!id) {
    id = newId()
    write(VISITOR_KEY, id)
  }

  const firstSeen = read(FIRST_SEEN_KEY) ?? new Date(now).toISOString().slice(0, 10)
  write(FIRST_SEEN_KEY, firstSeen)

  const lastSeen = Number(read(LAST_SEEN_KEY) ?? 0)
  const previousCount = Number(read(VISIT_COUNT_KEY) ?? 0)
  const visitCount = now - lastSeen > VISIT_GAP_MS ? previousCount + 1 : Math.max(previousCount, 1)
  write(VISIT_COUNT_KEY, String(visitCount))
  write(LAST_SEEN_KEY, String(now))

  return { id, visitCount, firstSeen }
}

/** Marks the visitor active, so a long continuous visit isn't split in two. */
export function touchVisitor(now = Date.now()) {
  write(LAST_SEEN_KEY, String(now))
}
