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

import type { MapConnector, MapNode } from '../../components/ArchitectureDiagram/types'

export const MAP_VIEWBOX = '0 0 500 510'

export const MAP_TITLE = { panelId: 'scaffold-regen', label: 'Flutter -> Android release pipeline', x: 220, y: 20 }

export const MAP_NODES: MapNode[] = [
  { id: 'regen', panelId: 'scaffold-regen', label: 'Scaffold regen', sub: 'pub get wipes host', rect: { x: 160, y: 40, w: 130, h: 44 } },
  { id: 'boundary', panelId: 'artifact-boundary', label: 'Artifact boundary', sub: 'flutter build aar', rect: { x: 156, y: 120, w: 138, h: 44 } },
  { id: 'ci', panelId: 'artifact-boundary', label: 'CI', sub: 'prebuilt AAR', rect: { x: 40, y: 204, w: 108, h: 42 } },
  { id: 'local', panelId: 'artifact-boundary', label: 'Local', sub: 'source module', rect: { x: 306, y: 204, w: 118, h: 42 } },
  { id: 'ndk', panelId: 'ndk-lock', label: 'NDK lock', sub: 'stripping', rect: { x: 160, y: 282, w: 130, h: 44 } },
  { id: 'variant', panelId: 'variant-wiring', label: 'Variant config', sub: 'google-services.json', rect: { x: 154, y: 362, w: 142, h: 44 } },
  { id: 'symbol', panelId: 'symbol-signing', label: 'Symbol & signing', sub: 'release output', rect: { x: 150, y: 442, w: 150, h: 44 } },
]

export const MAP_CONNECTORS: MapConnector[] = [
  // ── Forward spine, straight down the centre (x=220) ──
  { id: 'regen-boundary', d: 'M220 84 V120', endMarker: 'dot' },
  { id: 'ndk-variant', d: 'M220 326 V362', endMarker: 'dot' },
  { id: 'variant-symbol', d: 'M220 406 V442', endMarker: 'dot' },

  // ── Boundary's fan-out, diagonals from distinct points on boundary's
  //    bottom edge, so they diverge instead of crossing ──
  { id: 'boundary-ci', d: 'M195 164 L110 204' },
  { id: 'boundary-local', d: 'M245 164 L365 204' },

  // ── Reconverge onto ndk's top edge from two more diagonals. Labels sit
  //    under each node's own centre (CI's / Local's), pushed out to that
  //    side rather than crowding the shared funnel between the diagonals,
  //    same idea as the loop-back's "next release" sitting in its own lane,
  //    but pulled in just enough to stay inside the canvas (unlike a true
  //    edge position, which clips against the sheet at this label length) ──
  { id: 'ci-ndk', d: 'M116 246 L195 282', label: 'no Flutter checkout', labelX: 150, labelY: 264 },
  { id: 'local-ndk', d: 'M358 246 L245 282', label: 'hot reload', labelX: 300, labelY: 264 },

  // ── Loop-back, routed outside the cluster in its own channel, closing
  //    the release cycle back at scaffold regen ──
  { id: 'symbol-regen', d: 'M150 464 H24 Q16 464 16 456 V56 Q16 48 24 48 H160', label: 'next release', labelX: 16, labelY: 260 },
]
