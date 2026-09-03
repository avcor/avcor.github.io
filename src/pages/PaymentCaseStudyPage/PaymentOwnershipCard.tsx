import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import styles from '../FlutterCaseStudyPage/OwnershipCard.module.css'

const ownershipPoints = [
  'Turned a vague ask into a spec: users, priorities, and edge cases (carry over, scholarships, waivers, excess, instalments)',
  'Iterated the UI until due, cleared status, and next action read at a glance',
  'Aligned mobile, backend, and product on one screen model before writing code',
  'Decided with backend which APIs to reuse vs. build new, instead of one endpoint per screen',
  'Built the Important Dues summary, fee breakdown, and pay-options screens',
  'Cut redundant calls by caching shared settings once per session',
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
