import type { MapConnector, MapNode } from '../../components/ArchitectureDiagram/types'

/**
 * Section C map: Runtime Integrity & Tamper Defense. A straight vertical spine
 * running detection engine -> native mirror -> signature check -> detection policy.
 */

export const MAP_VIEWBOX = '0 0 500 500'

export const MAP_TITLE = { panelId: 'root-hook-detection', label: 'Runtime integrity & tamper defense', x: 250, y: 24 }

export const MAP_NODES: MapNode[] = [
  { id: 'detection', panelId: 'root-hook-detection', label: 'Detection Engine', sub: 'Root + hook + Frida', rect: { x: 170, y: 64, w: 160, h: 48 } },
  { id: 'native', panelId: 'native-integrity-mirror', label: 'Native Mirror', sub: 'JNI hook-detection.c', rect: { x: 170, y: 184, w: 160, h: 48 } },
  { id: 'signature', panelId: 'signature-verification', label: 'Signature Check', sub: 'Closes the re-sign threat', rect: { x: 170, y: 304, w: 160, h: 48 } },
  { id: 'policy', panelId: 'fail-open-policy', label: 'Detection Policy', sub: 'Fail-open, affirmative only', rect: { x: 170, y: 424, w: 160, h: 48 } },
]

export const MAP_CONNECTORS: MapConnector[] = [
  { id: 'detection-native', d: 'M250 112 V184', endMarker: 'dot' },
  { id: 'native-signature', d: 'M250 232 V304', endMarker: 'dot' },
  { id: 'signature-policy', d: 'M250 352 V424', endMarker: 'dot' },
]
