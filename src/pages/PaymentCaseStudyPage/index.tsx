import PaymentIntro from './PaymentIntro'
import PaymentProductCard from './PaymentProductCard'
import PaymentBusinessProblemCard from './PaymentBusinessProblemCard'
import PaymentOwnershipCard from './PaymentOwnershipCard'
import PaymentImpactBar from './PaymentImpactBar'
import styles from './PaymentCaseStudyPage.module.css'

export default function PaymentCaseStudyPage() {
  return (
    <div className={styles.content}>
      <div className={styles.topRow}>
        <div className={styles.intro}>
          <PaymentIntro />
        </div>

        <div className={styles.product}>
          <PaymentProductCard />
        </div>
      </div>

      <div className={styles.middleRow}>
        <div className={styles.problem}>
          <PaymentBusinessProblemCard />
        </div>

        <div className={styles.middleDivider} />

        <div className={styles.ownership}>
          <PaymentOwnershipCard />
        </div>
      </div>

      <div className={styles.impact}>
        <PaymentImpactBar />
      </div>
    </div>
  )
}
