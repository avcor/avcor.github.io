import { Layers, BookOpen, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './IndexMetricsCard.module.css'

interface Metric {
  icon: LucideIcon
  value: string
  label: string
}

const metrics: Metric[] = [
  { icon: Layers,   value: '6',        label: 'Domains'        },
  { icon: BookOpen, value: '10',       label: 'Case Studies'   },
  { icon: Users,    value: 'Millions', label: 'Users Impacted' },
]

export default function IndexMetricsCard() {
  return (
    <div className={styles.card}>
      <div className={styles.inner}>
        {metrics.map(({ icon: Icon, value, label }) => (
          <div key={label} className={styles.metric}>
            <Icon className={styles.icon} size={13} strokeWidth={1.8} />
            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
