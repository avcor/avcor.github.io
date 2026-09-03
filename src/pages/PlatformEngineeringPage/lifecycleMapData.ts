/**
 * Excalidraw-style hand-drawn flow of the Flutter engine lifecycle. Nodes are
 * rounded boxes; connectors are STRAIGHT segments (diagonals for the fan-out,
 * verticals/horizontals for the spine and loop-backs) so no two lines cross.
 * A roughen filter + hand-drawn font (applied in LifecycleMap) keep the
 * sketched look. Each interactive node maps to a deep-dive concern (panelId
 * in deepDiveData.ts).
 *
 * Flow: cold start → cached engine → route, then route fans out to three
 * outcomes that each loop back, config change survives (→ route), process
 * death wipes the in-memory engine (→ cold start / re-warm), and teardown
 * disposes it (→ cold start). The bridge is cross-cutting, off to the right.
 *
 * Routing (verified crossing-free): the cold→engine→route→teardown spine runs
 * straight down the centre; route's three outcomes are simple diagonals
 * fanning from distinct points along route's bottom edge (so they diverge
 * rather than cross); the config→route return is another diagonal offset
 * from the outgoing one; and the two loop-backs (re-warm, dispose) are routed
 * OUTSIDE the cluster in separate vertical channels, re-warm closer in
 * (under route/engine), dispose further out (clearing process death), each
 * landing on a different point of cold start's left edge.
 */

import type { MapConnector, MapNode } from '../../components/ArchitectureDiagram/types'

export const MAP_VIEWBOX = '0 0 500 600'

export const MAP_TITLE = { panelId: 'seam', label: 'Flutter module lifecycle', x: 220, y: 24 }

export const MAP_NODES: MapNode[] = [
  { id: 'cold', label: 'Cold start', sub: 'no engine', rect: { x: 160, y: 44, w: 120, h: 44 } },
  { id: 'engine', panelId: 'engine', label: 'Cached engine', sub: 'warm-up once', rect: { x: 158, y: 136, w: 124, h: 46 } },
  { id: 'route', panelId: 'routing', label: 'Route', sub: 'intent-driven', rect: { x: 158, y: 230, w: 124, h: 46 } },
  { id: 'death', panelId: 'process-death', label: 'Process death', sub: 'engine wiped', rect: { x: 40, y: 350, w: 128, h: 48 } },
  { id: 'config', panelId: 'routing', label: 'Config change', sub: 'engine survives', rect: { x: 286, y: 350, w: 132, h: 48 } },
  { id: 'teardown', panelId: 'teardown', label: 'Teardown', sub: 'dispose', rect: { x: 158, y: 458, w: 124, h: 46 } },
  { id: 'bridge', panelId: 'bridge', label: 'The bridge', sub: '6 handlers', rect: { x: 356, y: 230, w: 120, h: 46 } },
]

export const MAP_CONNECTORS: MapConnector[] = [
  // ── Forward spine, straight down the centre (x=220). Plain pipeline
  //    continuation, so it ends in a dot rather than an arrowhead ──
  { id: 'cold-engine', d: 'M220 88 V136', endMarker: 'dot' },
  { id: 'engine-route', d: 'M220 182 V230', endMarker: 'dot' },
  { id: 'route-teardown', d: 'M220 276 V458', label: 'logout', labelX: 220, labelY: 367 },

  // ── Route's fan-out, straight diagonals from distinct points on route's
  //    bottom edge, so they diverge instead of crossing ──
  { id: 'route-death', d: 'M195 276 L140 350' },
  { id: 'route-config', d: 'M245 276 L310 350' },
  // Always-on cross-cutting link, not a state transition, dot, not arrow.
  { id: 'route-bridge', d: 'M282 253 H356', endMarker: 'dot' },

  // ── Return diagonal, offset from route-config's outgoing line ──
  { id: 'config-route', d: 'M372 350 L263 276', label: 'survives', labelX: 317, labelY: 313 },

  // ── Loop-backs, routed outside the cluster in separate channels ──
  { id: 'death-cold', d: 'M104 350 V86 Q104 78 112 78 H160', label: 're-warm', labelX: 104, labelY: 220 },
  { id: 'teardown-cold', d: 'M158 481 H28 Q20 481 20 473 V62 Q20 54 28 54 H160', label: 'dispose', labelX: 93, labelY: 481 },
]
