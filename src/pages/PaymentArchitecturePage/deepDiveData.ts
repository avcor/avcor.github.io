import { ClipboardList, CreditCard, Receipt, ShieldCheck, Users } from 'lucide-react'
import type { DeepDivePanel } from '../../components/ArchitectureDiagram/types'

/** Section 1: how the screen was agreed before any code was written. */
export const COLLABORATION_PANELS: DeepDivePanel[] = [
  {
    id: 'requirements-alignment',
    index: '01',
    eyebrow: 'Product Definition',
    icon: ClipboardList,
    headingLines: ['The hard part was', 'deciding what a student', 'sees first.'],
    accentIndex: 1,
    impact:
      'The screen was scoped before a line of UI was written, so it did not get rebuilt after review',
    problem:
      '"Show the student their fees" is not a spec. Without agreement on the primary user and the first thing they need, the screen drifts into a data dump.',
    decision:
      'Ran the requirement down with the Product Manager: who opens the screen, what they check first, and which edge cases are real (carry over, penalty, scholarship, waiver, excess, instalments). The agreed answer set the row order and what got cut.',
    insight:
      'The tab layout still branches on user type and feature flags at runtime, so the same alignment holds for a parent, a prospective student, and an alumni without three separate screens.',
    watermark: 'Spec',
    proof: {
      kind: 'table',
      columns: ['User type', 'Sees first'],
      emphasizeCol: 1,
      rows: [
        ['Student', 'Am I clear, what is due'],
        ['Prospective student', 'Same, before enrollment'],
        ['Parent', "Their ward's cleared status"],
        ['Alumni', 'Any dues before re-enrollment'],
      ],
    },
  },
  {
    id: 'cross-team-alignment',
    index: '02',
    eyebrow: 'Cross-Team Communication',
    icon: Users,
    headingLines: ['One shared model of', 'the screen, walked past', 'three different teams.'],
    accentIndex: 1,
    impact: 'The screen shipped once, it was not redesigned or re-scoped after review',
    problem:
      'Mobile, backend, and product each see a different slice of a payment screen. Without a shared model up front, a review after building surfaces disagreements too late to fix cheaply.',
    decision:
      'Walked the UI iteration through all three teams before writing code: mobile for feasibility, backend for which data was actually available, product for what students needed to see first. Any new API was a joint call with backend, weighed against reusing an existing endpoint.',
    insight:
      'This is where most of the calendar time went, not in the Kotlin. Getting three teams to agree on one row order up front is what let the build phase move fast and stay unchanged through review.',
    watermark: 'Align',
    proof: {
      kind: 'table',
      columns: ['Team', 'Owned'],
      emphasizeCol: 1,
      rows: [
        ['Mobile', 'Feasibility, screen implementation'],
        ['Backend', 'API shape: new vs. reuse'],
        ['Product', 'Priority: what a student sees first'],
      ],
    },
  },
]

/** Section 2: how a payment actually moves, mobile and backend. */
export const PAYMENT_FLOW_PANELS: DeepDivePanel[] = [
  {
    id: 'order-and-gateway',
    index: '01',
    eyebrow: 'Order & Gateway',
    icon: Receipt,
    headingLines: ['Every payment starts', 'with an orderId,', 'before a gateway is picked.'],
    accentIndex: 1,
    impact: "A double-tap on Pay can't fire two orders, and a broken response never crashes the flow",
    problem:
      'Placing an order and choosing how to pay are different concerns; conflating them risks a duplicate order on a slow tap, or a crash on a non-JSON error page.',
    decision:
      'The app posts the fee and amount to get back an orderId, guarded against double taps. Only after that does it ask the backend which gateways are available for that order, and render them as options.',
    insight:
      "The backend decides which gateways are even offered, filtering out any the student can't use (a missing phone number, for instance) before the list ever reaches the screen.",
    watermark: 'Order',
    proof: {
      kind: 'flow',
      steps: [
        { type: 'node', label: 'Place order', detail: 'amount + mode → orderId' },
        { type: 'node', label: 'Fetch gateways', detail: 'for that orderId' },
        {
          type: 'branch',
          condition: 'Gateway list empty?',
          yes: { label: 'Hide "Pay" button' },
          no: { label: 'Render gateway options' },
        },
      ],
    },
  },
  {
    id: 'render-checkout',
    index: '02',
    eyebrow: 'Gateway Handoff',
    icon: CreditCard,
    headingLines: ['A hosted gateway has', 'to be coaxed into', 'behaving like a browser.'],
    accentIndex: 2,
    impact: "UPI shows up as a payment option, and the gateway form can't be tampered with",
    problem:
      "Payment gateways are built for real browsers. A default in-app WebView gets detected and quietly loses features like UPI, and posting a form without escaping its fields is a request-injection risk.",
    decision:
      "The checkout WebView's user-agent is rewritten to a clean browser string before load, and the gateway's form is submitted as a self-submitting HTML form with every field escaped. A separate native SDK path handles loan-based checkout, no WebView at all.",
    insight:
      'Both checkout paths, hosted and native, are handed the same orderId, so everything downstream, confirmation and history, works identically regardless of which one the student went through.',
    watermark: 'Checkout',
    proof: {
      kind: 'table',
      columns: ['Rail', 'How it renders'],
      emphasizeCol: 1,
      rows: [
        ['Standard gateway', 'WebView, escaped self-submitting form'],
        ['Loan / EMI', 'Native SDK, no WebView'],
      ],
    },
  },
  {
    id: 'server-verifies',
    index: '03',
    eyebrow: 'Payment Truth',
    icon: ShieldCheck,
    headingLines: ['The callback URL says', 'where to go, never', 'whether it worked.'],
    accentIndex: 2,
    impact: 'A spoofed or truncated return URL can never make a failed payment look paid',
    problem:
      "A gateway hands control back to the app through a redirect URL. Trusting that URL's status as proof would let anyone mark a payment successful just by hitting it.",
    decision:
      'The redirect handler only decides where to route the student next. Whether the payment actually succeeded is decided separately, by the backend asking the gateway directly, never by anything the client reports.',
    insight:
      'If the screen loads before that server-side check finishes, the order simply reads as pending until it updates, it is never guessed at.',
    watermark: 'Verify',
    proof: {
      kind: 'flow',
      steps: [
        { type: 'node', label: 'Gateway redirects back', detail: 'client only watches the URL' },
        { type: 'node', label: 'App routes to status screen', detail: 'no status written yet' },
        {
          type: 'branch',
          condition: 'Backend confirms with the gateway directly',
          yes: { label: 'Order marked success' },
          no: { label: 'Order marked failed / stays pending' },
        },
      ],
    },
  },
]
