import AttendanceIntro from './AttendanceIntro'
import AttendanceProductCard from './AttendanceProductCard'
import AttendanceBusinessProblemCard from './AttendanceBusinessProblemCard'
import AttendanceOwnershipCard from './AttendanceOwnershipCard'
import AttendanceImpactBar from './AttendanceImpactBar'
import styles from './AttendanceCaseStudyPage.module.css'

export default function AttendanceCaseStudyPage() {
  return (
    <div className={styles.content}>
      <div className={styles.topRow}>
        <div className={styles.intro}>
          <AttendanceIntro />
        </div>

        <div className={styles.product}>
          <AttendanceProductCard />
        </div>
      </div>

      <div className={styles.middleRow}>
        <div className={styles.problem}>
          <AttendanceBusinessProblemCard />
        </div>

        <div className={styles.middleDivider} />

        <div className={styles.ownership}>
          <AttendanceOwnershipCard />
        </div>
      </div>

      <div className={styles.impact}>
        <AttendanceImpactBar />
      </div>
    </div>
  )
}
