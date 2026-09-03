import EcgIntro from './EcgIntro'
import EcgProductCard from './EcgProductCard'
import EcgBusinessProblemCard from './EcgBusinessProblemCard'
import EcgOwnershipCard from './EcgOwnershipCard'
import EcgImpactBar from './EcgImpactBar'
import styles from './EcgCaseStudyPage.module.css'

export default function EcgCaseStudyPage() {
  return (
    <div className={styles.content}>
      <div className={styles.topRow}>
        <div className={styles.intro}>
          <EcgIntro />
        </div>

        <div className={styles.product}>
          <EcgProductCard />
        </div>
      </div>

      <div className={styles.middleRow}>
        <div className={styles.problem}>
          <EcgBusinessProblemCard />
        </div>

        <div className={styles.middleDivider} />

        <div className={styles.ownership}>
          <EcgOwnershipCard />
        </div>
      </div>

      <div className={styles.impact}>
        <EcgImpactBar />
      </div>
    </div>
  )
}
