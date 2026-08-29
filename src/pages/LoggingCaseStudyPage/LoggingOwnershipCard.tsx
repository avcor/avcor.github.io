import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import styles from '../FlutterCaseStudyPage/OwnershipCard.module.css'

const ownershipPoints = [
  'Built the end-to-end logging module: capture, masking, persistence, delivery',
  'Implemented the producer/consumer pipeline on Kotlin Channels so logging never blocks the UI thread',
  'GDPR masking layer for credentials, PII, and payment data',
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
