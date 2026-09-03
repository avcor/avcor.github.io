import ChartOptimizationIntro from './ChartOptimizationIntro'
import ChartOptimizationProductCard from './ChartOptimizationProductCard'
import ChartOptimizationBusinessProblemCard from './ChartOptimizationBusinessProblemCard'
import ChartOptimizationOwnershipCard from './ChartOptimizationOwnershipCard'
import ChartOptimizationImpactBar from './ChartOptimizationImpactBar'
import styles from './ChartOptimizationCaseStudyPage.module.css'

export default function ChartOptimizationCaseStudyPage() {
  return (
    <div className={styles.content}>
      <div className={styles.topRow}>
        <div className={styles.intro}>
          <ChartOptimizationIntro />
        </div>

        <div className={styles.product}>
          <ChartOptimizationProductCard />
        </div>
      </div>

      <div className={styles.middleRow}>
        <div className={styles.problem}>
          <ChartOptimizationBusinessProblemCard />
        </div>

        <div className={styles.middleDivider} />

        <div className={styles.ownership}>
          <ChartOptimizationOwnershipCard />
        </div>
      </div>

      <div className={styles.impact}>
        <ChartOptimizationImpactBar />
      </div>
    </div>
  )
}
