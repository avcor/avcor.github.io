import SecurityIntro from './SecurityIntro'
import SecurityProductCard from './SecurityProductCard'
import SecurityBusinessProblemCard from './SecurityBusinessProblemCard'
import SecurityOwnershipCard from './SecurityOwnershipCard'
import SecurityImpactBar from './SecurityImpactBar'
import styles from './SecurityCaseStudyPage.module.css'

export default function SecurityCaseStudyPage() {
  return (
    <div className={styles.content}>
      <div className={styles.topRow}>
        <div className={styles.intro}>
          <SecurityIntro />
        </div>

        <div className={styles.product}>
          <SecurityProductCard />
        </div>
      </div>

      <div className={styles.middleRow}>
        <div className={styles.problem}>
          <SecurityBusinessProblemCard />
        </div>

        <div className={styles.middleDivider} />

        <div className={styles.ownership}>
          <SecurityOwnershipCard />
        </div>
      </div>

      <div className={styles.impact}>
        <SecurityImpactBar />
      </div>
    </div>
  )
}
