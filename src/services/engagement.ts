/**
 * Engaged-time accounting. A timer only counts while the tab is in the
 * foreground and the visitor has touched the page recently, so a sheet left
 * open in a background tab overnight reports seconds, not hours.
 *
 * Time is flushed whenever the tab is hidden, not only when a timer stops:
 * closing the tab never runs React cleanup, but it always fires
 * `visibilitychange`, so that is the last reliable moment to report.
 */

/** No input for this long and the visitor counts as away until the next input. */
const IDLE_AFTER_MS = 60_000
/** Stretches shorter than this are scroll-throughs, not reads. */
const MIN_REPORT_MS = 1000
/** Activity events re-arm the idle timer at most this often. */
const ACTIVITY_THROTTLE_MS = 1000

const ACTIVITY_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll']

type Flush = (seconds: number) => void

interface Timer {
  since: number | null
  accumulatedMs: number
  flush: Flush
}

const timers = new Set<Timer>()
let hidden = typeof document !== 'undefined' && document.visibilityState === 'hidden'
let idle = false
let idleTimeout: number | undefined
let lastArmedAt = 0
let listening = false

function pause(timer: Timer, now: number) {
  if (timer.since === null) return
  timer.accumulatedMs += now - timer.since
  timer.since = null
}

function report(timer: Timer) {
  if (timer.accumulatedMs >= MIN_REPORT_MS) timer.flush(Math.round(timer.accumulatedMs / 1000))
  timer.accumulatedMs = 0
}

function sync(flush: boolean) {
  const now = performance.now()
  const counting = !hidden && !idle
  timers.forEach((timer) => {
    if (counting) {
      if (timer.since === null) timer.since = now
      return
    }
    pause(timer, now)
    if (flush) report(timer)
  })
}

function armIdle() {
  window.clearTimeout(idleTimeout)
  idleTimeout = window.setTimeout(() => {
    idle = true
    sync(false)
  }, IDLE_AFTER_MS)
}

function onActivity() {
  if (idle) {
    idle = false
    sync(false)
  }
  const now = performance.now()
  if (now - lastArmedAt > ACTIVITY_THROTTLE_MS) {
    lastArmedAt = now
    armIdle()
  }
}

function onVisibilityChange() {
  hidden = document.visibilityState === 'hidden'
  sync(hidden)
  if (!hidden) onActivity()
}

function listen() {
  if (listening) return
  listening = true
  document.addEventListener('visibilitychange', onVisibilityChange)
  // Capture phase: `scroll` doesn't bubble, and the case study sheet scrolls
  // its own container, not the window.
  ACTIVITY_EVENTS.forEach((type) =>
    document.addEventListener(type, onActivity, { capture: true, passive: true }),
  )
  armIdle()
}

/** Starts counting engaged time. Returns a stop function that reports
 *  whatever has accumulated since the last flush. */
export function startEngagementTimer(flush: Flush): () => void {
  listen()
  const timer: Timer = {
    since: !hidden && !idle ? performance.now() : null,
    accumulatedMs: 0,
    flush,
  }
  timers.add(timer)

  return () => {
    if (!timers.delete(timer)) return
    pause(timer, performance.now())
    report(timer)
  }
}
