import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import styles from '../FlutterCaseStudyPage/OwnershipCard.module.css'

const ownershipPoints = [
  'Established the wired connection between the ECG hardware and the phone, validating incoming ECG points and surfacing hardware error states directly to the doctor',
  'Rendered the captured points into a waveform and generated the PDF report with coroutines, gated behind doctor approval before it queues for upload',
  "Queued the approved PDF for background upload with WorkManager, so the upload never blocks the doctor's next action",
  "Persisted the PDF locally and tracked WorkManager's work state end-to-end, so a failed or pending upload retries instead of getting lost",
]

export default function EcgOwnershipCard() {
  return (
    <InfoCard title="My Ownership" delay={0.22}>
      <ul className={styles.list}>
        {ownershipPoints.map((point) => (
          <li key={point} className={styles.item}>
            <span className={styles.bullet} />
            {point}
          </li>
        ))}
      </ul>
    </InfoCard>
  )
}
