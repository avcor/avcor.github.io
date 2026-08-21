import { useState } from 'react'
import { MousePointerClick } from 'lucide-react'
import {
  MAP_CONNECTORS,
  MAP_NODES,
  MAP_TITLE,
  MAP_VIEWBOX,
  type MapNode,
} from './lifecycleMapData'
import styles from './LifecycleMap.module.css'

interface LifecycleMapProps {
  activePanelId: string
  onSelect: (panelId: string) => void
}

export default function LifecycleMap({ activePanelId, onSelect }: LifecycleMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const lit = hovered ?? activePanelId

  return (
    <div className={styles.map}>
      <svg viewBox={MAP_VIEWBOX} preserveAspectRatio="xMidYMid meet" className={styles.svg}>
        <defs>
          {/* Roughen: displace edges with fractal noise for a hand-drawn wobble.
           *  Uses an absolute (userSpaceOnUse) region covering the canvas
           *  rather than a percentage of each path's own bounding box —
           *  perfectly vertical/horizontal connectors have a zero-width or
           *  zero-height bbox, which would otherwise clip the filter to
           *  nothing and make the line disappear entirely. */}
          <filter id="rough" filterUnits="userSpaceOnUse" x="-20" y="-20" width="540" height="640">
            <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Sketchy open arrowhead, rotated along each connector. */}
          <marker id="arrow" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1.5 1.5 L8 5 L1.5 8.5" className={styles.arrow} />
          </marker>

          {/* Plain dot terminator — pipeline continuation / always-on links
           *  that aren't a state transition, so no directional arrowhead. */}
          <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4.5" markerHeight="4.5">
            <circle cx="5" cy="5" r="3.4" className={styles.dot} />
          </marker>
        </defs>

        {/* ── Connectors ── */}
        {MAP_CONNECTORS.map((c) => (
          <g key={c.id}>
            <path
              d={c.d}
              className={styles.connector}
              markerEnd={c.endMarker === 'dot' ? 'url(#dot)' : 'url(#arrow)'}
              filter="url(#rough)"
            />
            {c.label && c.labelX != null && c.labelY != null && (
              <text x={c.labelX} y={c.labelY} className={styles.connectorLabel}>
                {c.label}
              </text>
            )}
          </g>
        ))}

        {/* ── Nodes ── */}
        {MAP_NODES.map((node) => (
          <MapNodeShape
            key={node.id}
            node={node}
            isActive={node.panelId === activePanelId}
            isLit={node.panelId != null && node.panelId === lit}
            onSelect={onSelect}
            onHover={setHovered}
          />
        ))}

        {/* ── Title = the seam framing ── */}
        <text
          x={MAP_TITLE.x}
          y={MAP_TITLE.y}
          className={`${styles.title} ${activePanelId === MAP_TITLE.panelId ? styles.titleActive : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`${MAP_TITLE.label} — open overview`}
          onClick={() => onSelect(MAP_TITLE.panelId)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelect(MAP_TITLE.panelId)
            }
          }}
        >
          {MAP_TITLE.label}
        </text>
      </svg>

      <div className={styles.hint}>
        <MousePointerClick size={12} strokeWidth={2} />
        Click a node to explore
      </div>
    </div>
  )
}

interface MapNodeShapeProps {
  node: MapNode
  isActive: boolean
  isLit: boolean
  onSelect: (panelId: string) => void
  onHover: (panelId: string | null) => void
}

function MapNodeShape({ node, isActive, isLit, onSelect, onHover }: MapNodeShapeProps) {
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
        filter="url(#rough)"
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
