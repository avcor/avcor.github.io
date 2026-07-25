import CaseStudyIntro from './CaseStudyIntro'
import ProductDeliveredCard from './ProductDeliveredCard'
import EngineerDeepDivePanel from './EngineerDeepDivePanel'
import BusinessProblemCard from './BusinessProblemCard'
import OwnershipCard from './OwnershipCard'
import ImpactBar from './ImpactBar'
import styles from './FlutterCaseStudyPage.module.css'

interface FlutterCaseStudyPageProps {
  onAdvance?: () => void
}

export default function FlutterCaseStudyPage({ onAdvance }: FlutterCaseStudyPageProps) {
  return (
    <div className={styles.content}>
      <div className={styles.intro}>
        <CaseStudyIntro />
      </div>

      <div className={styles.product}>
        <ProductDeliveredCard />
      </div>

      <div className={styles.sidebar}>
        <EngineerDeepDivePanel onAdvance={onAdvance} />
      </div>

      <div className={styles.problem}>
        <BusinessProblemCard />
      </div>

      <div className={styles.ownership}>
        <OwnershipCard />
      </div>

      <div className={styles.impact}>
        <ImpactBar />
      </div>
    </div>
  )
}
