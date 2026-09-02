/**
 * Excalidraw-style hand-drawn hub layout: five independent optimization areas
 * wired to a central "Platform" hub, mirroring the source diagram at
 * PortfolioContent/Platform Optimization/Diagram/Platform Optimization.md.
 * Unlike the other case studies, these aren't sequential pipeline steps, so
 * every connector is a plain dot link (not a state-transition arrow) and the
 * hub node itself is decorative, not a selectable panel.
 */

import type { MapConnector, MapNode } from '../../components/ArchitectureDiagram/types'

export const MAP_VIEWBOX = '0 0 600 520'

export const MAP_TITLE = { panelId: 'storage-cache-discipline', label: 'Platform optimization areas', x: 300, y: 24 }

export const MAP_NODES: MapNode[] = [
  { id: 'platform', label: 'Platform', rect: { x: 240, y: 278, w: 120, h: 44 } },
  {
    id: 'storage',
    panelId: 'storage-cache-discipline',
    label: 'Storage Discipline',
    sub: 'cache-dir migration',
    rect: { x: 221, y: 92, w: 170, h: 48 },
  },
  {
    id: 'cold-start',
    panelId: 'cold-start-consolidation',
    label: 'Cold Start',
    sub: 'startup thread coalesce',
    rect: { x: 417, y: 242, w: 130, h: 46 },
  },
  {
    id: 'ui-rendering',
    panelId: 'ui-recycling',
    label: 'UI Rendering',
    sub: 'RecyclerView + DiffUtil',
    rect: { x: 367, y: 395, w: 150, h: 46 },
  },
  {
    id: 'build-apk',
    panelId: 'build-shrinking',
    label: 'Build & APK Size',
    sub: 'NDK strip pin',
    rect: { x: 82, y: 405, w: 170, h: 48 },
  },
  {
    id: 'security',
    panelId: 'security-performance',
    label: 'Security',
    sub: 'root/hook detection',
    rect: { x: 77, y: 201, w: 110, h: 44 },
  },
]

export const MAP_CONNECTORS: MapConnector[] = [
  { id: 'platform-storage', d: 'M301 278 L305 140', endMarker: 'dot' },
  { id: 'platform-cold-start', d: 'M360 288 L417 278', endMarker: 'dot' },
  { id: 'platform-ui-rendering', d: 'M326 322 L414 395', endMarker: 'dot' },
  { id: 'platform-build-apk', d: 'M277 322 L192 405', endMarker: 'dot' },
  { id: 'platform-security', d: 'M252 278 L180 245', endMarker: 'dot' },
]
