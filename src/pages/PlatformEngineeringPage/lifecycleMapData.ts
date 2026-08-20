/**
 * Excalidraw-style hand-drawn flow of the Flutter engine lifecycle. Nodes are
 * rounded boxes, connectors are curved arrows; a roughen filter + hand-drawn
 * font (applied in LifecycleMap) give the sketched look. Each interactive node
 * maps to a deep-dive concern (panelId in deepDiveData.ts).
 *
 * Coordinates live in a private viewBox; the flow runs down the centre spine
 * (x≈150) with the process-death / config-change branch, and the bridge off to
 * the right.
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
  /** Curved (bezier) path from one node edge to the next. */
  d: string
}

export const MAP_VIEWBOX = '0 0 448 560'

export const MAP_TITLE = { panelId: 'seam', label: 'Flutter module lifecycle', x: 150, y: 26 }

export const MAP_NODES: MapNode[] = [
  { id: 'cold', label: 'Cold start', sub: 'no engine', rect: { x: 95, y: 48, w: 110, h: 42 } },
  { id: 'engine', panelId: 'engine', label: 'Cached engine', sub: 'warm-up once', rect: { x: 88, y: 138, w: 124, h: 46 } },
  { id: 'route', panelId: 'routing', label: 'Route', sub: 'intent-driven', rect: { x: 88, y: 230, w: 124, h: 46 } },
  { id: 'death', panelId: 'process-death', label: 'Process death', sub: 're-warm', rect: { x: 18, y: 352, w: 132, h: 48 } },
  { id: 'config', panelId: 'routing', label: 'Config change', sub: 'keep', rect: { x: 172, y: 352, w: 128, h: 48 } },
  { id: 'teardown', panelId: 'teardown', label: 'Teardown', sub: 'dispose', rect: { x: 86, y: 476, w: 128, h: 46 } },
  { id: 'bridge', panelId: 'bridge', label: 'The bridge', sub: '6 handlers', rect: { x: 308, y: 230, w: 120, h: 46 } },
]

export const MAP_CONNECTORS: MapConnector[] = [
  { id: 'cold-engine', d: 'M150 90 C 152 108, 148 122, 150 138' },
  { id: 'engine-route', d: 'M150 184 C 148 202, 152 216, 150 230' },
  { id: 'route-death', d: 'M132 276 C 108 306, 90 326, 84 352' },
  { id: 'route-config', d: 'M168 276 C 196 306, 226 326, 236 352' },
  { id: 'death-teardown', d: 'M92 400 C 102 436, 122 458, 138 476' },
  { id: 'config-teardown', d: 'M228 400 C 208 436, 184 458, 164 476' },
  { id: 'route-bridge', d: 'M212 252 C 252 250, 280 254, 308 252' },
]
