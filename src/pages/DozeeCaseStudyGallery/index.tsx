import DozeeCaseStudyPage from '../DozeeCaseStudyPage'
import styles from '../CaseStudyGallery/CaseStudyGallery.module.css'

/**
 * Overview-only gallery: no architecture deep dive, so no SpyBar and no
 * locked/scroll-spy sections. The empty spyCol aside is kept only so the
 * shared 3-column grid (spyCol / sections / labelCol) stays symmetric with
 * every other case study's overlay.
 */
export default function DozeeCaseStudyGallery() {
  return (
    <section id="dozee-home" className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.spyCol} />

        <div className={styles.sections}>
          <section id="overview" className={styles.section}>
            <DozeeCaseStudyPage />
          </section>
        </div>

        <aside className={styles.labelCol}>
          <span className={styles.verticalLabel}>Dozee Home</span>
        </aside>
      </div>
    </section>
  )
}
