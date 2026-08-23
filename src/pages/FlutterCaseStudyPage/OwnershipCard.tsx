import InfoCard from './InfoCard'
import styles from './OwnershipCard.module.css'

const ownershipPoints = [
  'Evaluated Flutter and React Native through production-focused POCs',
  'Selected Flutter as the platform strategy',
  'Designed the Android ↔ Flutter integration architecture',
  'Built the communication layer between Android and Flutter',
  'Established an independent Android & Flutter release pipeline',
]

export default function OwnershipCard() {
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
