import { useMemo, useState } from 'react'
import type { MapConnector, MapNode, MapTitle } from './types'
import { usePanZoom } from '../../hooks/usePanZoom'
import LifecycleMapDefs from './LifecycleMapDefs'
import LifecycleMapControls from './LifecycleMapControls'
import MapNodeShape from './MapNodeShape'
import styles from './LifecycleMap.module.css'

interface LifecycleMapProps {
  nodes: MapNode[]
  connectors: MapConnector[]
  title: MapTitle
  viewBox: string
  activePanelId: string
  onSelect: (panelId: string) => void
  /** Unique suffix for this instance's SVG filter/marker ids, several maps
   *  (Platform, CI/CD, Logging) can render in the same DOM at once inside
   *  the case-study overlay, and unqualified ids would collide. */
  idSuffix: string
}

export default function LifecycleMap({
  nodes,
  connectors,
  title,
  viewBox,
  activePanelId,
  onSelect,
  idSuffix,
}: LifecycleMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const lit = hovered ?? activePanelId
  const { containerRef, transform, isDragging, isZoomed, reset, zoomIn, zoomOut, canZoomIn, canZoomOut, handlers } =
    usePanZoom()

  const roughId = `rough-${idSuffix}`
  const arrowId = `arrow-${idSuffix}`
  const dotId = `dot-${idSuffix}`

  /** The roughen filter needs a fixed userSpaceOnUse region covering the
   *  canvas (a percentage of each path's own bbox would clip perfectly
   *  vertical/horizontal connectors to nothing). Derived from viewBox so
   *  every instance gets a correctly sized region instead of a hardcoded one. */
  const filterRect = useMemo(() => {
    const parts = viewBox.split(' ').map(Number)
    const w = parts[2] ?? 500
    const h = parts[3] ?? 500
    return { x: -20, y: -20, width: w + 40, height: h + 40 }
  }, [viewBox])

  return (
    <div className={styles.map}>
      <div
        ref={containerRef}
        className={`${styles.viewport} ${isDragging ? styles.dragging : ''}`}
        {...handlers}
      >
        <div
          className={styles.canvas}
          style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
        >
          <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className={styles.svg}>
            <LifecycleMapDefs roughId={roughId} arrowId={arrowId} dotId={dotId} filterRect={filterRect} />

            {/* ── Connectors ── */}
            {connectors.map((c) => (
              <g key={c.id}>
                <path
                  d={c.d}
                  className={styles.connector}
                  markerEnd={c.endMarker === 'dot' ? `url(#${dotId})` : `url(#${arrowId})`}
                  filter={`url(#${roughId})`}
                />
                {c.label && c.labelX != null && c.labelY != null && (
                  <text x={c.labelX} y={c.labelY} className={styles.connectorLabel}>
                    {c.label}
                  </text>
                )}
              </g>
            ))}

            {/* ── Nodes ── */}
            {nodes.map((node) => (
              <MapNodeShape
                key={node.id}
                node={node}
                roughId={roughId}
                isActive={node.panelId === activePanelId}
                isLit={node.panelId != null && node.panelId === lit}
                onSelect={onSelect}
                onHover={setHovered}
              />
            ))}

            {/* ── Title = the diagram's overview trigger ── */}
            <text
              x={title.x}
              y={title.y}
              className={`${styles.title} ${activePanelId === title.panelId ? styles.titleActive : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`${title.label}: open overview`}
              onClick={() => onSelect(title.panelId)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(title.panelId)
                }
              }}
            >
              {title.label}
            </text>
          </svg>
        </div>
      </div>

      <LifecycleMapControls
        isZoomed={isZoomed}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        reset={reset}
      />
    </div>
  )
}
