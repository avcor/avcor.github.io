/**
 * Geometry for the Flutter engine lifecycle map — a state-flow the engineer
 * navigates by. Mirrors the mental model in flutter-engine-lifecycle-diagram.html
 * (warm path · failure/risk · decision · safe terminal). Each interactive node
 * and wire maps to one deep-dive concern (panelId in deepDiveData.ts).
 *
 * The runtime lifecycle runs as a vertical spine (centre x≈155). The MethodChannel
 * is cross-cutting — active across every state — so it's drawn as a parallel bus
 * rail on the right, tapped by each state rather than sitting after teardown.
 *
 * Coordinates live in a private 360×520 viewBox; wires are authored to meet node
 * edges. Reused verbatim by CircuitWireGlow / CircuitWirePulse.
 */

export type NodeTone = 'idle' | 'warm' | 'risk' | 'decision' | 'terminal'

export interface MapNode {
  id: string
  /** Which deep-dive concern this node selects; omitted = decorative only. */
  panelId?: string
  label: string
  sub?: string
  tone: NodeTone
  shape?: 'bus'
  rect: { x: number; y: number; w: number; h: number }
}

export interface MapWire {
  id: string
  d: string
  /** Concerns this wire belongs to — lit when one of them is active. */
  panelIds: string[]
}

export const MAP_VIEWBOX = '0 0 360 520'

/** Title acts as the "whole system" target → the Seam overview. */
export const MAP_TITLE = { panelId: 'seam', label: 'Flutter Module Lifecycle', x: 155, y: 22 }

export const MAP_NODES: MapNode[] = [
  { id: 'cold', label: 'Cold start', sub: 'no engine', tone: 'idle', rect: { x: 100, y: 36, w: 110, h: 32 } },
  { id: 'engine', panelId: 'engine', label: 'Cached engine', sub: 'warm-up runs once', tone: 'warm', rect: { x: 73, y: 112, w: 164, h: 44 } },
  { id: 'route', panelId: 'routing', label: 'Route', sub: 'intent-driven', tone: 'warm', rect: { x: 73, y: 206, w: 164, h: 44 } },
  { id: 'death', panelId: 'process-death', label: 'Process death', sub: 're-warm before onCreate', tone: 'risk', rect: { x: 20, y: 326, w: 140, h: 48 } },
  { id: 'config', panelId: 'routing', label: 'Config change', sub: 'keep · don’t re-apply', tone: 'decision', rect: { x: 172, y: 328, w: 120, h: 44 } },
  { id: 'teardown', panelId: 'teardown', label: 'Teardown → dispose', sub: 'only when detached', tone: 'terminal', rect: { x: 71, y: 440, w: 168, h: 46 } },
  // Cross-cutting bus rail — parallels the whole lifecycle on the right.
  { id: 'bus', panelId: 'bridge', label: 'MethodChannel · 6 handlers', tone: 'warm', shape: 'bus', rect: { x: 320, y: 112, w: 28, h: 374 } },
]

export const MAP_WIRES: MapWire[] = [
  // ── Runtime spine ──
  { id: 'cold-engine', d: 'M155 68 V112', panelIds: ['engine'] },
  { id: 'engine-route', d: 'M155 156 V206', panelIds: ['routing'] },
  { id: 'route-death', d: 'M140 250 V288 H90 V326', panelIds: ['process-death'] },
  { id: 'route-config', d: 'M170 250 V288 H232 V328', panelIds: ['routing'] },
  { id: 'death-teardown', d: 'M90 374 V408 H155 V440', panelIds: ['teardown'] },
  { id: 'config-teardown', d: 'M232 372 V408 H155', panelIds: ['teardown'] },
  // ── Bridge taps: every state talks over the same channel ──
  { id: 'tap-engine', d: 'M237 134 H320', panelIds: ['bridge'] },
  { id: 'tap-route', d: 'M237 228 H320', panelIds: ['bridge'] },
  { id: 'tap-config', d: 'M292 350 H320', panelIds: ['bridge'] },
  { id: 'tap-teardown', d: 'M239 463 H320', panelIds: ['bridge'] },
]

export const MAP_LEGEND: { tone: NodeTone; label: string }[] = [
  { tone: 'warm', label: 'Warm path' },
  { tone: 'risk', label: 'Failure / risk' },
  { tone: 'decision', label: 'Decision' },
  { tone: 'terminal', label: 'Safe terminal' },
]
