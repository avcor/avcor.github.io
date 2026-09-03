import type { MapNode } from './types'
import styles from './LifecycleMap.module.css'

interface MapNodeShapeProps {
  node: MapNode
  roughId: string
  isActive: boolean
  isLit: boolean
  onSelect: (panelId: string) => void
  onHover: (panelId: string | null) => void
}

/** One box on a lifecycle/pipeline map. Interactive when the node carries a
 *  panelId (click/enter selects its deep-dive panel), decorative otherwise. */
export default function MapNodeShape({
  node,
  roughId,
  isActive,
  isLit,
  onSelect,
  onHover,
}: MapNodeShapeProps) {
  const { rect, label, sub, panelId } = node
  const interactive = panelId != null
  const cx = rect.x + rect.w / 2

  return (
    <g
      className={`${styles.node} ${interactive ? styles.interactive : ''} ${isLit ? styles.nodeLit : ''} ${!interactive ? styles.decorative : ''}`}
      data-active={isActive || undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `${label}: open detail` : undefined}
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
