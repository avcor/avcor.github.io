import PlatformOptimizationIntro from './PlatformOptimizationIntro'
import PlatformOptimizationProductCard from './PlatformOptimizationProductCard'
import PlatformOptimizationBusinessProblemCard from './PlatformOptimizationBusinessProblemCard'
import PlatformOptimizationOwnershipCard from './PlatformOptimizationOwnershipCard'
import PlatformOptimizationImpactBar from './PlatformOptimizationImpactBar'
import styles from './PlatformOptimizationCaseStudyPage.module.css'

export default function PlatformOptimizationCaseStudyPage() {
  return (
    <div className={styles.content}>
      <div className={styles.topRow}>
        <div className={styles.intro}>
          <PlatformOptimizationIntro />
        </div>

        <div className={styles.product}>
          <PlatformOptimizationProductCard />
        </div>
      </div>

      <div className={styles.middleRow}>
        <div className={styles.problem}>
          <PlatformOptimizationBusinessProblemCard />
        </div>

        <div className={styles.middleDivider} />

        <div className={styles.ownership}>
          <PlatformOptimizationOwnershipCard />
        </div>
      </div>

      <div className={styles.impact}>
        <PlatformOptimizationImpactBar />
      </div>
    </div>
  )
}
