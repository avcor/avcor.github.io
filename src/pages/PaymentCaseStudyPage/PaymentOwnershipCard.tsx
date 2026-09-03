import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import styles from '../FlutterCaseStudyPage/OwnershipCard.module.css'

const ownershipPoints = [
  'Turned a vague ask into a spec: pinned down who uses the screen, what they check first, and the edge cases (carry over, penalties, scholarships, waivers, excess, instalments)',
  'Iterated the UI until the due, the cleared status, and the next action read at a glance, cutting rows that added noise',
  'Walked the design through mobile, backend, and product so every team shared one model of the screen before code',
  'Worked with backend to decide which APIs were new and which existing ones could be reused, instead of adding endpoints per screen',
  'Built the Android screens: the Important Dues summary, the academic fee breakdown, and the pay-options flow',
  'Cut redundant network calls on return to the screen by fetching shared settings once and reading them from cache',
]

export default function PaymentOwnershipCard() {
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
