import type { MapConnector, MapNode } from '../../components/ArchitectureDiagram/types'

/**
 * Excalidraw-style hand-drawn flow of the Android -> Grafana Loki log
 * pipeline. Nodes are rounded boxes; connectors are STRAIGHT segments so no
 * two lines cross. A roughen filter + hand-drawn font (applied in
 * LifecycleMap) keep the sketched look. Each interactive node maps to a
 * deep-dive concern (panelId in deepDiveData.ts).
 *
 * Flow: capture feeds the non-blocking dispatch channel, governed by a
 * dashed control line from Remote Config. Dispatch feeds the GDPR mask,
 * which fans out into batch (left channel: Room -> WorkManager) and
 * immediate (right channel: LokiNow) delivery. Both channels reconverge
 * diagonally at the Loki push terminal.
 *
 * Routing (crossing-free): the capture->dispatch->mask spine runs straight
 * down the centre; Remote Config hangs top-right and drops one dashed
 * control line onto dispatch; mask's batch/immediate fan-out is two
 * diagonals from distinct points on its bottom edge; each channel then runs
 * straight down its own side (batch->room->workManager on the left,
 * immediate->lokiNow on the right); both reconverge onto the Loki push node
 * from two more diagonals, mirroring the CI/CD pipeline map's fan-in.
 */

export const MAP_VIEWBOX = '0 0 500 580'

export const MAP_TITLE = { panelId: 'log-capture', label: 'Android -> Grafana Loki log pipeline', x: 250, y: 20 }

export const MAP_NODES: MapNode[] = [
  { id: 'capture', panelId: 'log-capture', label: 'Capture', sub: 'interceptor + RegisterLog', rect: { x: 160, y: 40, w: 130, h: 44 } },
  { id: 'dispatch', panelId: 'non-blocking', label: 'Dispatch', sub: 'non-blocking channel', rect: { x: 158, y: 120, w: 134, h: 46 } },
  { id: 'remote-config', panelId: 'remote-config', label: 'Remote Config', sub: 'Firebase', rect: { x: 340, y: 58, w: 130, h: 46 } },
  { id: 'mask', panelId: 'masking', label: 'Mask', sub: 'GDPR, fail-closed', rect: { x: 160, y: 204, w: 130, h: 44 } },
  { id: 'batch', panelId: 'delivery-modes', label: 'Batch', sub: 'default', rect: { x: 60, y: 288, w: 120, h: 44 } },
  { id: 'immediate', panelId: 'delivery-modes', label: 'Immediate', sub: 'critical', rect: { x: 300, y: 288, w: 130, h: 44 } },
  { id: 'room', label: 'Room', sub: 'SQLite', rect: { x: 44, y: 368, w: 110, h: 40 } },
  { id: 'work-manager', label: 'WorkManager', sub: 'connected', rect: { x: 44, y: 442, w: 110, h: 40 } },
  { id: 'loki-now', label: 'LokiNow', sub: 'Semaphore 4', rect: { x: 306, y: 368, w: 118, h: 40 } },
  { id: 'loki-push', panelId: 'bounded-resources', label: 'Loki push', sub: '/loki/api/v1/push', rect: { x: 160, y: 500, w: 130, h: 44 } },
]

export const MAP_CONNECTORS: MapConnector[] = [
  // ── Forward spine — straight down the centre (x=225) ──
  { id: 'capture-dispatch', d: 'M225 84 V120', endMarker: 'dot' },
  { id: 'dispatch-mask', d: 'M225 166 V204', endMarker: 'dot' },

  // ── Remote Config governs dispatch — a control line, not data flow ──
  { id: 'remote-config-dispatch', d: 'M350 104 L292 143', label: 'governs', labelX: 336, labelY: 118 },

  // ── Mask's fan-out — diagonals from distinct points on mask's bottom edge ──
  { id: 'mask-batch', d: 'M200 248 L120 288', label: 'default', labelX: 145, labelY: 266 },
  { id: 'mask-immediate', d: 'M250 248 L365 288', label: 'critical', labelX: 320, labelY: 266 },

  // ── Batch channel, straight down the left ──
  { id: 'batch-room', d: 'M120 332 L99 368', endMarker: 'dot' },
  { id: 'room-work-manager', d: 'M99 408 V442', endMarker: 'dot' },

  // ── Immediate channel, straight down the right ──
  { id: 'immediate-loki-now', d: 'M365 332 V368', endMarker: 'dot' },

  // ── Reconverge onto Loki push from two more diagonals ──
  { id: 'work-manager-loki-push', d: 'M99 482 L160 500', label: 'when connected', labelX: 100, labelY: 500 },
  { id: 'loki-now-loki-push', d: 'M365 408 L290 500', label: 'direct POST', labelX: 355, labelY: 460 },
]
