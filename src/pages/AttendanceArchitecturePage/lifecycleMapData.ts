import type { MapConnector, MapNode } from '../../components/ArchitectureDiagram/types'

/**
 * Excalidraw-style hand-drawn flow of the staff punch-in pipeline. Both gates
 * (location, network) must pass before the camera opens, converging into the
 * single live-capture session that runs liveness and identity checks on the
 * same frame loop, then hands off to upload.
 *
 * Routing (crossing-free): the two gates sit side by side at the top and
 * each drop one diagonal into capture's top corners. From there the spine
 * runs straight down the centre: capture -> liveness -> identity -> upload.
 */

export const MAP_VIEWBOX = '0 0 500 500'

export const MAP_TITLE = { panelId: 'geofence-validation', label: 'Staff punch-in verification pipeline', x: 250, y: 20 }

export const MAP_NODES: MapNode[] = [
  { id: 'location-gate', panelId: 'geofence-validation', label: 'Location Gate', sub: 'GPS + geofence API', rect: { x: 30, y: 44, w: 160, h: 46 } },
  { id: 'network-gate', panelId: 'ip-validation', label: 'Network Gate', sub: 'Wi-Fi IP validation', rect: { x: 310, y: 44, w: 160, h: 46 } },
  { id: 'capture', panelId: 'live-capture-only', label: 'Live Capture', sub: 'CircleCameraCaptureActivity', rect: { x: 170, y: 154, w: 160, h: 46 } },
  { id: 'liveness', panelId: 'liveness-challenge', label: 'Liveness', sub: 'ML Kit face detector', rect: { x: 170, y: 254, w: 160, h: 46 } },
  { id: 'identity', panelId: 'identity-continuity', label: 'Identity Check', sub: 'trackingId + landmarks', rect: { x: 170, y: 354, w: 160, h: 46 } },
  { id: 'upload', panelId: 'upload-and-registration', label: 'Upload & Punch', sub: 'PunchImageRepo', rect: { x: 170, y: 434, w: 160, h: 46 } },
]

export const MAP_CONNECTORS: MapConnector[] = [
  // ── Both gates converge into the top corners of the live-capture session ──
  { id: 'location-gate-capture', d: 'M110 90 L170 154', endMarker: 'dot' },
  { id: 'network-gate-capture', d: 'M390 90 L330 154', endMarker: 'dot' },

  // ── Forward spine, straight down the centre (x=250) ──
  { id: 'capture-liveness', d: 'M250 200 V254', endMarker: 'dot' },
  { id: 'liveness-identity', d: 'M250 300 V354', endMarker: 'dot' },
  { id: 'identity-upload', d: 'M250 400 V434', endMarker: 'dot' },
]
