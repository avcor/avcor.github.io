import LoggingIntro from './LoggingIntro'
import LoggingProductCard from './LoggingProductCard'
import LoggingBusinessProblemCard from './LoggingBusinessProblemCard'
import LoggingOwnershipCard from './LoggingOwnershipCard'
import LoggingImpactBar from './LoggingImpactBar'
import styles from './LoggingCaseStudyPage.module.css'

/** Overview: kept lean (ownership + impact + product image), no room for the
 *  production-investigation stories — those get their own section so this
 *  screen stays about what was owned and the impact made. */
export default function LoggingCaseStudyPage() {
  return (
    <div className={styles.content}>
      <div className={styles.topRow}>
        <div className={styles.intro}>
          <LoggingIntro />
        </div>

        <div className={styles.product}>
          <LoggingProductCard />
        </div>
      </div>

      <div className={styles.middleRow}>
        <div className={styles.problem}>
          <LoggingBusinessProblemCard />
        </div>

        <div className={styles.middleDivider} />

        <div className={styles.ownership}>
          <LoggingOwnershipCard />
        </div>
      </div>

      <div className={styles.impact}>
        <LoggingImpactBar />
      </div>
    </div>
  )
}
