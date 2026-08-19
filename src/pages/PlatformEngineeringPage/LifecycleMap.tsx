import { useState } from 'react'
import CircuitWireGlow from '../../features/IndexCircuit/CircuitWireGlow'
import CircuitWirePulse from '../../features/IndexCircuit/CircuitWirePulse'
import {
  MAP_LEGEND,
  MAP_NODES,
  MAP_TITLE,
  MAP_VIEWBOX,
  MAP_WIRES,
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
      <svg viewBox={MAP_VIEWBOX} className={styles.svg} role="group" aria-label="Engine lifecycle map">
        {/* ── Wires (idle by default; active concern lights up + pulses) ── */}
        {MAP_WIRES.map((wire) => {
          const isLit = wire.panelIds.includes(lit)
          return (
            <g key={wire.id}>
              <CircuitWireGlow d={wire.d} tone={isLit ? 'active' : 'idle'} />
              {isLit && <CircuitWirePulse d={wire.d} pulseKey={`${wire.id}-${lit}`} />}
            </g>
          )
        })}

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

        {/* ── Title = whole-system target (Seam) ── */}
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
          onMouseEnter={() => setHovered(MAP_TITLE.panelId)}
          onMouseLeave={() => setHovered(null)}
        >
          {MAP_TITLE.label.toUpperCase()}
        </text>
      </svg>

      <ul className={styles.legend}>
        {MAP_LEGEND.map(({ tone, label }) => (
          <li key={tone} className={styles.legendItem}>
            <span className={styles.legendDot} data-tone={tone} />
            {label}
          </li>
        ))}
      </ul>
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
  const { rect, tone, label, sub, panelId, shape } = node
  const interactive = panelId != null
  const cx = rect.x + rect.w / 2

  return (
    <g
      className={`${styles.node} ${interactive ? styles.interactive : ''} ${isLit ? styles.nodeLit : ''}`}
      data-tone={tone}
      data-active={isActive || undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `${label} — open detail` : undefined}
      onClick={interactive ? () => onSelect(panelId) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              // Enter/Space select; arrows and digits bubble to the container's handler.
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
      <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={shape === 'bus' ? 8 : 9} className={styles.nodeBox} />

      {shape === 'bus' ? (
        <text
          x={cx}
          y={rect.y + rect.h / 2}
          transform={`rotate(-90 ${cx} ${rect.y + rect.h / 2})`}
          className={styles.busLabel}
        >
          {label}
        </text>
      ) : (
        <>
          <rect x={rect.x} y={rect.y} width={3.5} height={rect.h} rx={2} className={styles.nodeAccent} />
          <text x={rect.x + 14} y={sub ? rect.y + rect.h / 2 - 4 : rect.y + rect.h / 2 + 4} className={styles.nodeLabel}>
            {label}
          </text>
          {sub && (
            <text x={rect.x + 14} y={rect.y + rect.h / 2 + 12} className={styles.nodeSub}>
              {sub}
            </text>
          )}
        </>
      )}
    </g>
  )
}
