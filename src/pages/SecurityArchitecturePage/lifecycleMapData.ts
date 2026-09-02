import type { MapConnector, MapNode } from '../../components/ArchitectureDiagram/types'

/**
 * Section B map: Data & Transport Security. A straight vertical spine, transport
 * controls first (pinning, network lockdown), then the at-rest token store, then
 * the narrow payment-WebView surface.
 */

export const MAP_VIEWBOX = '0 0 500 500'

export const MAP_TITLE = { panelId: 'obfuscated-cert-pinning', label: 'Data & transport security', x: 250, y: 24 }

export const MAP_NODES: MapNode[] = [
  { id: 'cert-pinning', panelId: 'obfuscated-cert-pinning', label: 'Certificate Pinning', sub: 'Dual-layer, obfuscated', rect: { x: 170, y: 64, w: 160, h: 48 } },
  { id: 'network-lockdown', panelId: 'network-security-config', label: 'Network Lockdown', sub: 'No cleartext, pin-set', rect: { x: 170, y: 184, w: 160, h: 48 } },
  { id: 'token-store', panelId: 'keystore-token-store', label: 'Token Store', sub: 'Keystore AES-256', rect: { x: 170, y: 304, w: 160, h: 48 } },
  { id: 'webview', panelId: 'webview-hardening', label: 'Payment Bridge', sub: 'Minimal JS surface', rect: { x: 170, y: 424, w: 160, h: 48 } },
]

export const MAP_CONNECTORS: MapConnector[] = [
  { id: 'pinning-network', d: 'M250 112 V184', endMarker: 'dot' },
  { id: 'network-token', d: 'M250 232 V304', endMarker: 'dot' },
  { id: 'token-webview', d: 'M250 352 V424', endMarker: 'dot' },
]
