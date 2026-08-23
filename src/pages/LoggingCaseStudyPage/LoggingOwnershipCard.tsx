import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import styles from '../FlutterCaseStudyPage/OwnershipCard.module.css'

const ownershipPoints = [
  'Designed and built the end-to-end logging module (capture, masking, persistence, delivery) as a self-contained package',
  'Implemented the producer/consumer pipeline on Kotlin Channels so logging never blocks the UI thread',
  'Built the GDPR masking layer that sanitizes credentials, PII, and payment data before any log is stored or sent',
  'Wired Firebase Remote Config as the runtime control plane for the whole pipeline',
]

export default function LoggingOwnershipCard() {
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
