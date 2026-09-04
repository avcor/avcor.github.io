import CaseStudyLabelCol from '../../components/CaseStudyLabelCol'
import EcgCaseStudyPage from '../EcgCaseStudyPage'
import { useGalleryScroll } from '../../hooks/useGalleryScroll'
import SpyBar, { type SpySection } from '../CaseStudyGallery/SpyBar'
import styles from '../CaseStudyGallery/CaseStudyGallery.module.css'

const SPY_ITEMS: SpySection[] = [{ id: 'overview', label: 'Overview' }]

const SCROLL_IDS = SPY_ITEMS.map((s) => s.id)

export default function EcgCaseStudyGallery() {
  const { scrollRef, activeId: scrollActive, onJump } = useGalleryScroll(SCROLL_IDS)

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

        <CaseStudyLabelCol category="Offline" name="ECG Background Sync" />
      </div>
    </section>
  )
}
