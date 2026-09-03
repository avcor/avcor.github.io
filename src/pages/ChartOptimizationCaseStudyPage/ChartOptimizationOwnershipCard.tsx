import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import styles from '../FlutterCaseStudyPage/OwnershipCard.module.css'

const ownershipPoints = [
  "Prefetched the day's sleep data in the background and ran invalid-point detection ahead of time, so it was ready before the screen opened",
  'Built a smoothing algorithm that scales curve smoothness to screen width, so the chart line never renders spiky',
  'Built a label-density algorithm that derives axis label count from font size, screen width, and point count, so labels stop overlapping',
  'Found redundant recomputation from unoptimized useEffects; consolidated the heavy pass into one run, cached in useMemo',
  'Persisted computed labels, smoothed points, and averages to WatermelonDB, so repeat opens draw instantly',
]

export default function ChartOptimizationOwnershipCard() {
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
