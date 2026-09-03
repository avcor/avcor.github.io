import { useRef } from 'react'
import EcgCaseStudyPage from '../EcgCaseStudyPage'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import SpyBar, { type SpySection } from '../CaseStudyGallery/SpyBar'
import styles from '../CaseStudyGallery/CaseStudyGallery.module.css'

const SPY_ITEMS: SpySection[] = [{ id: 'overview', label: 'Overview' }]

const SCROLL_IDS = SPY_ITEMS.map((s) => s.id)

export default function EcgCaseStudyGallery() {
  const scrollRef = useRef<HTMLElement>(null)
  const scrollActive = useScrollSpy(SCROLL_IDS, scrollRef)

  const onJump = (id: string) => {
    const container = scrollRef.current
    const el = container?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    if (container && el) container.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
  }

  return (
    <section id="ecg-background-sync" className={styles.page} ref={scrollRef}>
      <div className={styles.layout}>
        <aside className={styles.spyCol}>
          <SpyBar sections={SPY_ITEMS} activeId={scrollActive} onJump={onJump} compact />
        </aside>

        <div className={styles.sections}>
          <section id="overview" className={styles.section}>
            <EcgCaseStudyPage />
          </section>
        </div>

        <aside className={styles.labelCol}>
          <span className={styles.verticalLabel}>ECG Background Sync</span>
        </aside>
      </div>
    </section>
  )
}
