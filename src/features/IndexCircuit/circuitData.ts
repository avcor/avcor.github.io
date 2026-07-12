import { CloudOff, Gauge, Layers, Package, Rocket, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * Geometry extracted 1:1 from the blueprint SVG (Frame 2.svg, viewBox 0 0 758 462).
 * Coordinates are the single source of truth — do not reposition or resize.
 */

export interface CircuitCaseStudy {
  id: string
  label: string
  /** Rounded-rect outline path, verbatim from the blueprint */
  pillPath: string
  /** Text anchor: pill center (rendered with text-anchor middle / central baseline) */
  text: { x: number; y: number }
  /** Connector endpoint dot on the pill edge */
  dot: { cx: number; cy: number }
  /** Optional vertical accent line rendered to the left of the pill, with a gap before it */
  accentLine?: { x: number; y1: number; y2: number }
}

export interface CircuitDomain {
  id: string
  /** Label lines, e.g. ['01', 'Platform', 'Engineering'] */
  lines: string[]
  /** Chip region rect, verbatim from the blueprint — label anchors flush-left to rect.x */
  rect: { x: number; y: number; width: number; height: number; rx: number }
  /** Icon representing the domain, rendered centered inside the chip's rect */
  icon: LucideIcon
}

export const CIRCUIT_VIEWBOX = '0 0 758 462'
export const LABEL_LINE_HEIGHT = 10
/** Vertical gap between the last label line's baseline and the chip's top edge */
export const LABEL_CHIP_GAP = 20

/** All connector lines, verbatim from the blueprint */
export const CIRCUIT_WIRING_PATH =
  'M200.5 74.5H215L232.5 92V108.5L241.5 117.5H259.5M200.5 104.5H219L237 122.5H259.5M186 254.5L194 262.5M227.5 398H241.5L247.5 404H254M317.5 132.5H323.5L342 151V189M250.5 266H265.5L290 241.5H313M311.5 399H324.5L331 392.5V384.5L351.5 364V318L349.768 317V307M378 189V170L379.5 168.5V135.5L397.5 117.5H422M479 122.5H491L509 104.5H524.5M421.5 248H456.5L474.5 266M530 267L544 253V248.5L555.5 237H561M530 282H541L551 272H561.5M378 307V369L425.5 416.5H438.5M494.5 408.5H503L513 398.5H533'

export const CIRCUIT_CASE_STUDIES: CircuitCaseStudy[] = [
  {
    id: 'flutter-integration',
    label: 'Flutter Integration',
    pillPath:
      'M116 62.5H190C193.59 62.5 196.5 65.4101 196.5 69V80C196.5 83.5899 193.59 86.5 190 86.5H116C112.41 86.5 109.5 83.5898 109.5 80V69C109.5 65.4101 112.41 62.5 116 62.5Z',
    text: { x: 153, y: 74.5 },
    dot: { cx: 109, cy: 75 },
  },
  {
    id: 'logging-system',
    label: 'Logging System',
    pillPath:
      'M116 92.5H190C193.59 92.5 196.5 95.4101 196.5 99V110C196.5 113.59 193.59 116.5 190 116.5H116C112.41 116.5 109.5 113.59 109.5 110V99C109.5 95.4101 112.41 92.5 116 92.5Z',
    text: { x: 153, y: 104.5 },
    dot: { cx: 109, cy: 105 },
  },
  {
    id: 'android-14-migration',
    label: 'Android 14 Migration',
    pillPath:
      'M97 242.5H175C178.59 242.5 181.5 245.41 181.5 249V259C181.5 262.59 178.59 265.5 175 265.5H97C93.4101 265.5 90.5 262.59 90.5 259V249C90.5 245.41 93.4101 242.5 97 242.5Z',
    text: { x: 136, y: 254 },
    dot: { cx: 90, cy: 254 },
    accentLine: { x: 82.5, y1: 242.5, y2: 265.5 },
  },
  {
    id: 'medical-chart-optimization',
    label: 'Medical Chart Optimization',
    pillPath:
      'M113 386.5H217C220.59 386.5 223.5 389.41 223.5 393V404C223.5 407.59 220.59 410.5 217 410.5H113C109.41 410.5 106.5 407.59 106.5 404V393C106.5 389.41 109.41 386.5 113 386.5Z',
    text: { x: 165, y: 398.5 },
    dot: { cx: 105, cy: 398 },
  },
  {
    id: 'attendance-fraud-prevention',
    label: 'Attendance Fraud Prevention',
    pillPath:
      'M536 93.5H645C648.59 93.5 651.5 96.4101 651.5 100V110C651.5 113.59 648.59 116.5 645 116.5H536C532.41 116.5 529.5 113.59 529.5 110V100C529.5 96.5225 532.231 93.6831 535.665 93.5088L536 93.5Z',
    text: { x: 590.5, y: 105 },
    dot: { cx: 652, cy: 104 },
  },
  {
    id: 'payment-experience',
    label: 'Payment Experience',
    pillPath:
      'M572 225.5H648C651.59 225.5 654.5 228.41 654.5 232V242C654.5 245.59 651.59 248.5 648 248.5H572C568.41 248.5 565.5 245.59 565.5 242V232C565.5 228.41 568.41 225.5 572 225.5Z',
    text: { x: 610, y: 237 },
    dot: { cx: 655, cy: 237 },
  },
  {
    id: 'multi-account-architecture',
    label: 'Multi-Account Architecture',
    pillPath:
      'M573 259.5H677C680.59 259.5 683.5 262.41 683.5 266V276C683.5 279.59 680.59 282.5 677 282.5H573C569.41 282.5 566.5 279.59 566.5 276V266C566.5 262.41 569.41 259.5 573 259.5Z',
    text: { x: 625, y: 271 },
    dot: { cx: 684, cy: 272 },
    accentLine: { x: 691.5, y1: 259.5, y2: 282.5 },
  },
  {
    id: 'ecg-background-sync',
    label: 'Ecg background Sync',
    pillPath:
      'M544 386.5H633C636.59 386.5 639.5 389.41 639.5 393V404C639.5 407.59 636.59 410.5 633 410.5H544C540.41 410.5 537.5 407.59 537.5 404V393C537.5 389.41 540.41 386.5 544 386.5Z',
    text: { x: 588.5, y: 398.5 },
    dot: { cx: 640, cy: 398 },
  },
]

/**
 * Horizontal position of the "Android 14 Migration" accent line, as a fraction
 * of the circuit's viewBox width. Used to align the left-bleed pcb image so it
 * never renders that pill's label underneath the left panel's text.
 */
export const LEFT_BLEED_MARKER_FRACTION = (() => {
  const marker = CIRCUIT_CASE_STUDIES.find((s) => s.id === 'android-14-migration')?.accentLine
  const viewBoxWidth = Number(CIRCUIT_VIEWBOX.split(' ')[2])
  return marker ? marker.x / viewBoxWidth : 0
})()

/**
 * Horizontal position of the "Multi-Account Architecture" accent line, as a
 * fraction of the circuit's viewBox width. Used to cap how far the board's
 * right-bleed growth can shift content before that label crosses the
 * viewport's right edge.
 */
export const RIGHT_BLEED_MARKER_FRACTION = (() => {
  const marker = CIRCUIT_CASE_STUDIES.find((s) => s.id === 'multi-account-architecture')?.accentLine
  const viewBoxWidth = Number(CIRCUIT_VIEWBOX.split(' ')[2])
  return marker ? marker.x / viewBoxWidth : 1
})()

export const CIRCUIT_DOMAINS: CircuitDomain[] = [
  {
    id: 'platform-engineering',
    lines: ['01', 'Platform', 'Engineering'],
    rect: { x: 268.5, y: 100.5, width: 40, height: 41, rx: 4.5 },
    icon: Layers,
  },
  {
    id: 'security-engineering',
    lines: ['02', 'Security', 'Engineering'],
    rect: { x: 431.5, y: 104.5, width: 38, height: 40, rx: 4.5 },
    icon: Shield,
  },
  {
    id: 'platform-modernization',
    lines: ['03', 'Platform', 'Modernization'],
    rect: { x: 203.5, y: 257.5, width: 37, height: 40, rx: 4.5 },
    icon: Rocket,
  },
  {
    id: 'product-engineering',
    lines: ['04', 'Product', 'Engineering'],
    rect: { x: 483.5, y: 264.5, width: 38, height: 41, rx: 4.5 },
    icon: Package,
  },
  {
    id: 'performance-engineering',
    lines: ['05', 'Performance', 'Engineering'],
    rect: { x: 263.5, y: 382.5, width: 41, height: 42, rx: 4.5 },
    icon: Gauge,
  },
  {
    id: 'offline-first-architecture',
    lines: ['06', 'Offline-first', 'Architecture'],
    rect: { x: 446.5, y: 382.5, width: 40, height: 42, rx: 4.5 },
    icon: CloudOff,
  },
]
