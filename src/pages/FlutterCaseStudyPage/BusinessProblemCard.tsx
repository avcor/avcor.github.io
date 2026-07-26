import { Target } from 'lucide-react'
import InfoCard from './InfoCard'
import styles from './BusinessProblemCard.module.css'

export default function BusinessProblemCard() {
  return (
    <InfoCard icon={Target} tone="primary" iconVariant="glass" title="Business Problem" delay={0.15}>
      <p>Digii was developing the same mobile workflows in Flutter for another product.</p>
      <div className={styles.divider} />
      <p>
        Rebuilding them natively for Android would increase engineering effort, slow
        releases, and create long-term maintenance overhead.
      </p>
    </InfoCard>
  )
}
