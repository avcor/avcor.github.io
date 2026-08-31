import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import styles from '../FlutterCaseStudyPage/OwnershipCard.module.css'

const ownershipPoints = [
  'Fixed a 45 GB storage incident: moved uploads to the cache directory, capped Glide/ExoPlayer/OkHttp cache sizes, and cleaned up existing installs',
  'Consolidated cold-start threading into a single coordinated thread and moved Keystore, Firebase, and security-probe work off the main thread',
  'Removed nested-scroll RecyclerView anti-patterns and moved list updates to DiffUtil',
  'Traced a Flutter-driven size regression to a silent native-library stripping failure and pinned the build config to fix it',
]

export default function PlatformOptimizationOwnershipCard() {
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
