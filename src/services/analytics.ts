import { initializeApp } from 'firebase/app'
import {
  initializeAnalytics,
  isSupported,
  logEvent,
  setUserId,
  setUserProperties,
  type Analytics,
} from 'firebase/analytics'
import { resolveAnalyticsMode, resolveVisitor, touchVisitor } from './visitor'

export type EventParams = Record<string, string | number | boolean>

const firebaseConfig = {
  apiKey: 'AIzaSyAwh8_LnZBI01DxQvLUDU8n1wIdb5R4V0c',
  authDomain: 'portfolio-92b08.firebaseapp.com',
  projectId: 'portfolio-92b08',
  storageBucket: 'portfolio-92b08.firebasestorage.app',
  messagingSenderId: '373249193203',
  appId: '1:373249193203:web:f4ad08a79bb080646af386',
  measurementId: 'G-EN8F4TBMC4',
}

/** The same event with the same params inside this window is a double fire
 *  (React StrictMode effects, a double click), not a second action. */
const DEDUPE_WINDOW_MS = 1000

type QueuedEvent = [name: string, params: EventParams | undefined]

let analytics: Analytics | null = null
let disabled = false
let debugMode = false
const queue: QueuedEvent[] = []
let lastEventKey = ''
let lastEventAt = 0

function send(name: string, params?: EventParams) {
  if (!analytics) return
  touchVisitor()
  logEvent(analytics, name, debugMode ? { ...params, debug_mode: true } : params)
}

function discard() {
  disabled = true
  queue.length = 0
}

async function init() {
  const mode = resolveAnalyticsMode()
  // Dev servers, browsers opted out with `?analytics=off` and automation
  // (headless crawlers, test runners) never report, so the numbers are people.
  if (mode === 'off' || (import.meta.env.DEV && mode !== 'debug') || navigator.webdriver) {
    return discard()
  }
  if (!(await isSupported())) return discard()

  const visitor = resolveVisitor()
  // Page views are sent by hand: the site is one page with hash deep links, so
  // the automatic one would double-count the landing view.
  const instance = initializeAnalytics(initializeApp(firebaseConfig), {
    config: { send_page_view: false },
  })
  setUserId(instance, visitor.id)
  setUserProperties(instance, {
    visitor_type: visitor.visitCount > 1 ? 'returning' : 'new',
    visit_count: String(visitor.visitCount),
    first_seen: visitor.firstSeen,
  })

  analytics = instance
  debugMode = mode === 'debug'
  queue.splice(0).forEach(([name, params]) => send(name, params))
}

void init().catch(discard)

export function trackEvent(name: string, params?: EventParams) {
  if (disabled) return

  const key = `${name}|${JSON.stringify(params ?? {})}`
  const now = Date.now()
  if (key === lastEventKey && now - lastEventAt < DEDUPE_WINDOW_MS) return
  lastEventKey = key
  lastEventAt = now

  if (analytics) send(name, params)
  else queue.push([name, params])
}

/** The site is a single page, so a "page" is either the main scroll page
 *  (`/`) or an open case study sheet (`/case-study/<id>`). The query string is
 *  kept on `page_location` because GA4 reads `utm_*` campaign tags from it. */
export function trackPageView(path: string, title: string) {
  trackEvent('page_view', {
    page_path: path,
    page_title: title,
    page_location: `${window.location.origin}${path}${window.location.search}`,
  })
}
