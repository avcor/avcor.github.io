import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MousePointerClick, Minus, Plus, RotateCcw } from 'lucide-react'
import type { MapConnector, MapNode, MapTitle } from './types'
import { usePanZoom } from '../../hooks/usePanZoom'
import styles from './LifecycleMap.module.css'

interface LifecycleMapProps {
  nodes: MapNode[]
  connectors: MapConnector[]
  title: MapTitle
  viewBox: string
  activePanelId: string
  onSelect: (panelId: string) => void
  /** Unique suffix for this instance's SVG filter/marker ids — several maps
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
            <defs>
              {/* Roughen: displace edges with fractal noise for a hand-drawn wobble. */}
              <filter
                id={roughId}
                filterUnits="userSpaceOnUse"
                x={filterRect.x}
                y={filterRect.y}
                width={filterRect.width}
                height={filterRect.height}
              >
                <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
              </filter>

              {/* Sketchy open arrowhead, rotated along each connector. */}
              <marker id={arrowId} viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M1.5 1.5 L8 5 L1.5 8.5" className={styles.arrow} />
              </marker>

              {/* Plain dot terminator — pipeline continuation / always-on links
               *  that aren't a state transition, so no directional arrowhead. */}
              <marker id={dotId} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4.5" markerHeight="4.5">
                <circle cx="5" cy="5" r="3.4" className={styles.dot} />
              </marker>
            </defs>

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
              aria-label={`${title.label} — open overview`}
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

      <motion.div
        className={styles.zoomControls}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          className={styles.zoomButton}
          onClick={zoomOut}
          disabled={!canZoomOut}
          aria-label="Zoom out"
        >
          <Minus size={16} strokeWidth={2} />
        </button>
        {isZoomed && (
          <button type="button" className={styles.zoomButton} onClick={reset} aria-label="Reset view">
            <RotateCcw size={15} strokeWidth={2} />
          </button>
        )}
        <button
          type="button"
          className={styles.zoomButton}
          onClick={zoomIn}
          disabled={!canZoomIn}
          aria-label="Zoom in"
        >
          <Plus size={16} strokeWidth={2} />
        </button>
      </motion.div>

      <motion.div
        className={styles.hint}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <MousePointerClick size={16} strokeWidth={2} />
        Drag to pan
      </motion.div>
    </div>
  )
}

interface MapNodeShapeProps {
  node: MapNode
  roughId: string
  isActive: boolean
  isLit: boolean
  onSelect: (panelId: string) => void
  onHover: (panelId: string | null) => void
}

function MapNodeShape({ node, roughId, isActive, isLit, onSelect, onHover }: MapNodeShapeProps) {
  const { rect, label, sub, panelId } = node
  const interactive = panelId != null
  const cx = rect.x + rect.w / 2

  return (
    <g
      className={`${styles.node} ${interactive ? styles.interactive : ''} ${isLit ? styles.nodeLit : ''} ${!interactive ? styles.decorative : ''}`}
      data-active={isActive || undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `${label} — open detail` : undefined}
      onClick={interactive ? () => onSelect(panelId) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(panelId)
              }
            }
          : undefined
      }
      onMouseEnter={interactive ? () => onHover(panelId) : undefined}
      onMouseLeave={interactive ? () => onHover(null) : undefined}
    >
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.w}
        height={rect.h}
        rx={13}
        className={styles.nodeBox}
        filter={`url(#${roughId})`}
      />
      <text x={cx} y={sub ? rect.y + rect.h / 2 - 5 : rect.y + rect.h / 2} className={styles.nodeLabel}>
        {label}
      </text>
      {sub && (
        <text x={cx} y={rect.y + rect.h / 2 + 12} className={styles.nodeSub}>
          {sub}
        </text>
      )}
    </g>
  )
}
