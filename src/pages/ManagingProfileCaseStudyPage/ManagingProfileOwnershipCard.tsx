import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import styles from '../FlutterCaseStudyPage/OwnershipCard.module.css'

const ownershipPoints = [
  'Traced the Redux update path and found multiple intermediate reads between the API call and the final state',
  'Collapsed those reads into a single state transition, removing the render cascade that caused the flicker',
  "Swapped the session token and medical data for the new profile while preserving the original owner's account details",
  'Added automatic BLE reconnection when the pod comes back in range after a profile switch, with a retry mechanism for drops mid-connection',
]

export default function ManagingProfileOwnershipCard() {
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
