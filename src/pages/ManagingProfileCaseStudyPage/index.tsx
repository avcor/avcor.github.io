import ManagingProfileIntro from './ManagingProfileIntro'
import ManagingProfileProductCard from './ManagingProfileProductCard'
import ManagingProfileBusinessProblemCard from './ManagingProfileBusinessProblemCard'
import ManagingProfileOwnershipCard from './ManagingProfileOwnershipCard'
import ManagingProfileImpactBar from './ManagingProfileImpactBar'
import styles from './ManagingProfileCaseStudyPage.module.css'

export default function ManagingProfileCaseStudyPage() {
  return (
    <div className={styles.content}>
      <div className={styles.topRow}>
        <div className={styles.intro}>
          <ManagingProfileIntro />
        </div>

        <div className={styles.product}>
          <ManagingProfileProductCard />
        </div>
      </div>

      <div className={styles.middleRow}>
        <div className={styles.problem}>
          <ManagingProfileBusinessProblemCard />
        </div>

        <div className={styles.middleDivider} />

        <div className={styles.ownership}>
          <ManagingProfileOwnershipCard />
        </div>
      </div>

      <div className={styles.impact}>
        <ManagingProfileImpactBar />
      </div>
    </div>
  )
}
