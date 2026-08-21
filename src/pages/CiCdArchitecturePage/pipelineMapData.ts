/**
 * Excalidraw-style hand-drawn flow of the Flutter <-> Android release pipeline.
 * Nodes are rounded boxes; connectors are STRAIGHT segments so no two lines
 * cross. A roughen filter + hand-drawn font (applied in LifecycleMap) keep
 * the sketched look. Each interactive node maps to a deep-dive concern
 * (panelId in deepDiveData.ts).
 *
 * Flow: scaffold regeneration feeds the artifact boundary, which fans out
 * into a CI/local dependency-resolution branch that reconverges before the
 * NDK lock, then continues straight down the spine through variant config
 * wiring to symbol & signing hygiene. A loop-back closes the cycle: every
 * release starts with `pub get` again.
 *
 * Routing (verified crossing-free): the regen->boundary->ndk->variant->symbol
 * spine runs straight down the centre; the boundary's CI/local fan-out is two
 * diagonals from distinct points on its bottom edge, reconverging onto ndk's
 * top edge from two more diagonals so they diverge rather than cross; the
 * loop-back from symbol runs OUTSIDE the cluster in its own vertical channel,
 * landing on a different point of regen's edge than the forward spine.
 */

export interface MapNode {
  id: string
  /** Which deep-dive concern this node selects; omitted = decorative only. */
  panelId?: string
  label: string
  sub?: string
  rect: { x: number; y: number; w: number; h: number }
}

export interface MapConnector {
  id: string
  /** Path from one node edge to the next. */
  d: string
  /** Optional hand-drawn label on the arrow. */
  label?: string
  labelX?: number
  labelY?: number
  /** End marker: an arrowhead for state transitions, a dot for the plain
   *  pipeline continuation. Defaults to 'arrow'. */
  endMarker?: 'arrow' | 'dot'
}

export const MAP_VIEWBOX = '0 0 500 640'

export const MAP_TITLE = { panelId: 'scaffold-regen', label: 'Flutter -> Android release pipeline', x: 220, y: 24 }

export const MAP_NODES: MapNode[] = [
  { id: 'regen', panelId: 'scaffold-regen', label: 'Scaffold regen', sub: 'pub get wipes host', rect: { x: 160, y: 44, w: 130, h: 46 } },
  { id: 'boundary', panelId: 'artifact-boundary', label: 'Artifact boundary', sub: 'flutter build aar', rect: { x: 156, y: 148, w: 138, h: 46 } },
  { id: 'ci', panelId: 'artifact-boundary', label: 'CI', sub: 'prebuilt AAR', rect: { x: 40, y: 254, w: 108, h: 44 } },
  { id: 'local', panelId: 'artifact-boundary', label: 'Local', sub: 'source module', rect: { x: 306, y: 254, w: 118, h: 44 } },
  { id: 'ndk', panelId: 'ndk-lock', label: 'NDK lock', sub: 'stripping', rect: { x: 160, y: 358, w: 130, h: 46 } },
  { id: 'variant', panelId: 'variant-wiring', label: 'Variant config', sub: 'google-services.json', rect: { x: 154, y: 462, w: 142, h: 46 } },
  { id: 'symbol', panelId: 'symbol-signing', label: 'Symbol & signing', sub: 'release output', rect: { x: 150, y: 566, w: 150, h: 46 } },
]

export const MAP_CONNECTORS: MapConnector[] = [
  // ── Forward spine — straight down the centre (x=220) ──
  { id: 'regen-boundary', d: 'M220 90 V148', endMarker: 'dot' },
  { id: 'ndk-variant', d: 'M220 404 V462', endMarker: 'dot' },
  { id: 'variant-symbol', d: 'M220 508 V566', endMarker: 'dot' },

  // ── Boundary's fan-out — diagonals from distinct points on boundary's
  //    bottom edge, so they diverge instead of crossing ──
  { id: 'boundary-ci', d: 'M195 194 L110 254' },
  { id: 'boundary-local', d: 'M245 194 L365 254' },

  // ── Reconverge onto ndk's top edge from two more diagonals ──
  { id: 'ci-ndk', d: 'M116 298 L195 358', label: 'no Flutter checkout', labelX: 108, labelY: 330 },
  { id: 'local-ndk', d: 'M358 298 L245 358', label: 'hot reload', labelX: 372, labelY: 330 },

  // ── Loop-back — routed outside the cluster in its own channel, closing
  //    the release cycle back at scaffold regen ──
  { id: 'symbol-regen', d: 'M150 589 H24 Q16 589 16 581 V60 Q16 52 24 52 H160', label: 'next release', labelX: 16, labelY: 320 },
]
