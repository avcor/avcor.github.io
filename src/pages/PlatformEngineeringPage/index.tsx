import PlatformEngineeringIntro from './PlatformEngineeringIntro'
import CICDPipelineCard from './CICDPipelineCard'
import TechnicalProblemsCard from './TechnicalProblemsCard'
import EngineeringDecisionsCard from './EngineeringDecisionsCard'
import ResultsImpactSection from './ResultsImpactSection'
import styles from './PlatformEngineeringPage.module.css'

export default function PlatformEngineeringPage() {
  return (
    <div className={styles.content}>
      <div className={styles.intro}>
        <PlatformEngineeringIntro />
      </div>

      <div className={styles.pipeline}>
        <CICDPipelineCard />
      </div>

      <div className={styles.problems}>
        <TechnicalProblemsCard />
      </div>

      <div className={styles.decisions}>
        <EngineeringDecisionsCard />
      </div>

      <div className={styles.results}>
        <ResultsImpactSection />
      </div>
    </div>
  )
}
