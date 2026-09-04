import CaseStudyLabelCol from '../../components/CaseStudyLabelCol'
import ChartOptimizationCaseStudyPage from '../ChartOptimizationCaseStudyPage'
import ManagingProfileCaseStudyPage from '../ManagingProfileCaseStudyPage'
import { useGalleryScroll } from '../../hooks/useGalleryScroll'
import SpyBar, { type SpySection } from '../CaseStudyGallery/SpyBar'
import styles from '../CaseStudyGallery/CaseStudyGallery.module.css'

/**
 * Two standalone, overview-shaped case studies under one product ("Dozee
 * Home"), reached via a single circuit leaf. No architecture deep dive, so
 * the spy bar's two stops are the case studies themselves, not "Overview" /
 * "Architecture" like the other galleries.
 */
const SPY_ITEMS: SpySection[] = [
  { id: 'chart-optimization', label: 'Chart Optimization' },
  { id: 'managing-profile', label: 'Managing Profile' },
]

const SCROLL_IDS = SPY_ITEMS.map((s) => s.id)

export default function DozeeCaseStudyGallery() {
  const { scrollRef, activeId: scrollActive, onJump } = useGalleryScroll(SCROLL_IDS)

  return (
    <section id="dozee-home" className={styles.page} ref={scrollRef}>
      <div className={styles.layout}>
        <aside className={styles.spyCol}>
          <SpyBar sections={SPY_ITEMS} activeId={scrollActive} onJump={onJump} compact />
        </aside>

        <div className={styles.sections}>
          <section id="chart-optimization" className={styles.section}>
            <ChartOptimizationCaseStudyPage />
          </section>

          <section id="managing-profile" className={styles.section}>
            <ManagingProfileCaseStudyPage />
          </section>
        </div>

        <CaseStudyLabelCol category="Performance" name="Dozee Home" />
      </div>
    </section>
  )
}
