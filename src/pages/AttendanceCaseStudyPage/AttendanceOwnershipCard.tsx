import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import styles from '../FlutterCaseStudyPage/OwnershipCard.module.css'

const ownershipPoints = [
  'Built the punch-in flow end-to-end: permission gating, location/IP checks, live capture, upload, registration',
  'Implemented on-device ML Kit liveness detection: randomized head-turn and two-blink challenge, camera-only, no gallery path',
  'Added real-time rejection for multiple faces, identity swaps, obstructed landmarks, and low light from one ML Kit detector pass',
  'Wired server-side geofence and static-IP validation before the camera opens',
]

export default function AttendanceOwnershipCard() {
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
