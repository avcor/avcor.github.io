import type { CSSProperties } from 'react'
import { Signal, Wifi, BatteryFull, Search, MessageSquare, Layers, FileText, ClipboardList, BarChart3 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './PhoneMockup.module.css'

interface AppTile {
  icon: LucideIcon
  label: string
  tint: string
}

const apps: AppTile[] = [
  { icon: MessageSquare, label: 'Attendance', tint: 'var(--color-info)' },
  { icon: Layers, label: 'Classes', tint: 'var(--color-accent-purple)' },
  { icon: FileText, label: 'Exams', tint: 'var(--color-warning)' },
  { icon: ClipboardList, label: 'Assignments', tint: 'var(--color-accent-teal)' },
  { icon: BarChart3, label: 'Performance', tint: 'var(--color-error)' },
]

const sparklinePoints = '0,22 12,18 24,20 36,12 48,14 60,6 72,9 84,2'

interface PhoneMockupProps {
  large?: boolean
}

export default function PhoneMockup({ large = false }: PhoneMockupProps) {
  return (
    <div className={`${styles.phoneWrap} ${large ? styles.phoneWrapLarge : ''}`}>
      <div className={styles.buttonMute} aria-hidden="true" />
      <div className={styles.buttonVolumeUp} aria-hidden="true" />
      <div className={styles.buttonVolumeDown} aria-hidden="true" />
      <div className={styles.buttonPower} aria-hidden="true" />

      <div className={styles.frame}>
        <div className={styles.phone}>
          <div className={styles.gloss} aria-hidden="true" />
          <div className={styles.dynamicIsland} aria-hidden="true" />

          <div className={styles.statusBar}>
            <span className={styles.time}>9:41</span>
            <div className={styles.statusIcons}>
              <Signal size={13} strokeWidth={2} />
              <Wifi size={13} strokeWidth={2} />
              <BatteryFull size={15} strokeWidth={2} />
            </div>
          </div>

          <div className={styles.screen}>
            <div className={styles.greetingRow}>
              <span className={styles.greeting}>Hi, John 👋</span>
              <Search size={16} strokeWidth={2} className={styles.searchIcon} />
            </div>

            <div className={styles.appGrid}>
              {apps.map(({ icon: Icon, label, tint }) => (
                <div key={label} className={styles.appTile}>
                  <div className={styles.appIconBox} style={{ '--tint': tint } as CSSProperties}>
                    <Icon size={16} strokeWidth={1.75} />
                  </div>
                  <span className={styles.appLabel}>{label}</span>
                </div>
              ))}
            </div>

            <div className={styles.sectionLabel}>Today&apos;s Schedule</div>
            <div className={styles.scheduleCard}>
              <div className={styles.scheduleBar} />
              <div className={styles.scheduleText}>
                <div className={styles.scheduleSubject}>Mathematics</div>
                <div className={styles.scheduleMeta}>10:00 AM – 11:00 AM · Room 204</div>
              </div>
            </div>

            <div className={styles.progressCard}>
              <div>
                <div className={styles.progressValue}>87%</div>
                <div className={styles.progressLabel}>Overall Progress</div>
              </div>
              <svg viewBox="0 0 84 24" className={styles.sparkline} fill="none">
                <polyline points={sparklinePoints} className={styles.sparklineStroke} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
