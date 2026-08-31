import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../GlassBadge'
import styles from './PanelIndex.module.css'

export interface PanelIndexItem {
  id: string
  index: string
  eyebrow: string
  icon: LucideIcon
}

interface PanelIndexProps {
  items: PanelIndexItem[]
  activeId: string
  onSelect: (id: string) => void
}

/** A vertical selector list standing in for the lifecycle-map diagram, for
 *  case studies whose deep-dive panels are independent concerns rather than
 *  steps in one linear flow (nothing here to draw connectors between). */
export default function PanelIndex({ items, activeId, onSelect }: PanelIndexProps) {
  return (
    <nav className={styles.list} aria-label="Optimization areas">
      {items.map((item) => {
        const active = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.item} ${active ? styles.itemActive : ''}`}
            aria-current={active ? 'true' : undefined}
            onClick={() => onSelect(item.id)}
          >
            <GlassBadge
              icon={item.icon}
              size={44}
              color={active ? 'var(--color-primary)' : 'var(--color-white-a40)'}
            />
            <span className={styles.text}>
              <span className={styles.index}>{item.index}</span>
              <span className={styles.eyebrow}>{item.eyebrow}</span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}
