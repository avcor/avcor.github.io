import type { MapConnector, MapNode } from '../../components/ArchitectureDiagram/types'

/**
 * Excalidraw-style hand-drawn flow, split into the two arcs of this case
 * study: how the screen was agreed (collaboration), and how a payment
 * actually moves once it's built (mobile + backend). Each is a simple
 * top-to-bottom spine, mirroring the later half of the Attendance map.
 */

export const COLLAB_MAP_VIEWBOX = '0 0 500 260'

export const COLLAB_MAP_TITLE = {
  panelId: 'requirements-alignment',
  label: 'From a vague ask to a shipped screen',
  x: 250,
  y: 20,
}

export const COLLAB_MAP_NODES: MapNode[] = [
  {
    id: 'spec',
    panelId: 'requirements-alignment',
    label: 'Requirements',
    sub: 'Product Manager sync',
    rect: { x: 170, y: 54, w: 160, h: 46 },
  },
  {
    id: 'align',
    panelId: 'cross-team-alignment',
    label: 'Cross-Team Align',
    sub: 'Mobile + Backend + Product',
    rect: { x: 170, y: 154, w: 160, h: 46 },
  },
]

export const COLLAB_MAP_CONNECTORS: MapConnector[] = [
  { id: 'spec-align', d: 'M250 100 V154', endMarker: 'dot' },
]

export const FLOW_MAP_VIEWBOX = '0 0 500 360'

export const FLOW_MAP_TITLE = {
  panelId: 'order-and-gateway',
  label: 'Payment flow, mobile and backend',
  x: 250,
  y: 20,
}

export const FLOW_MAP_NODES: MapNode[] = [
  {
    id: 'order',
    panelId: 'order-and-gateway',
    label: 'Order & Gateway',
    sub: 'orderId + gateway list',
    rect: { x: 170, y: 54, w: 160, h: 46 },
  },
  {
    id: 'checkout',
    panelId: 'render-checkout',
    label: 'Render Checkout',
    sub: 'WebView or native SDK',
    rect: { x: 170, y: 154, w: 160, h: 46 },
  },
  {
    id: 'verify',
    panelId: 'server-verifies',
    label: 'Server Verifies',
    sub: 'gateway status, not the URL',
    rect: { x: 170, y: 254, w: 160, h: 46 },
  },
]

export const FLOW_MAP_CONNECTORS: MapConnector[] = [
  { id: 'order-checkout', d: 'M250 100 V154', endMarker: 'dot' },
  { id: 'checkout-verify', d: 'M250 200 V254', endMarker: 'dot' },
]
