import { Activity } from 'lucide-react'
import styles from './IndexImpactCard.module.css'

export default function IndexImpactCard() {
  return (
    <div className={styles.card}>
      <div className={styles.inner}>

        <div className={styles.iconCircle}>
          <Activity size={16} strokeWidth={1.5} className={styles.icon} />
        </div>

        <p className={styles.body}>
          Every connection represents a problem solved.
          <br /><br />
          Every signal represents impact delivered.
        </p>

      </div>
    </div>
  )
}
