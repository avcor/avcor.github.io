import styles from './SpyBar.module.css'

export interface SpySection {
  id: string
  label: string
}

interface SpyBarProps {
  sections: SpySection[]
  activeId: string
  onJump: (id: string) => void
  /** Shrinks the vertical band items distribute across — for galleries with
   *  few sections, where the default band spreads them too far apart. */
  compact?: boolean
}

export default function SpyBar({ sections, activeId, onJump, compact = false }: SpyBarProps) {
  return (
    <nav
      className={`${styles.spy} ${compact ? styles.compact : ''}`}
      aria-label="Case study sections"
    >
      <ol className={styles.list}>
        {sections.map((section) => {
          const active = section.id === activeId
          return (
            <li key={section.id}>
              <button
                type="button"
                className={`${styles.item} ${active ? styles.itemActive : ''}`}
                aria-current={active ? 'true' : undefined}
                onClick={() => onJump(section.id)}
              >
                <span className={styles.marker} aria-hidden="true" />
                <span className={styles.label}>{section.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
