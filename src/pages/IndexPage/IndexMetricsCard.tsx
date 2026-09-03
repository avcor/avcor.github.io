import { Cpu, FileText, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './IndexMetricsCard.module.css'

interface Metric {
  icon: LucideIcon
  value: string
  label: string
}

const metrics: Metric[] = [
  { icon: Cpu,      value: '6',        label: 'Domains'        },
  { icon: FileText, value: '9',        label: 'Case Studies'   },
  { icon: Users,    value: '500K+',    label: 'Users Impacted' },
]

export default function IndexMetricsCard() {
  return (
    <div className={styles.card}>
      <div className={styles.grid}>
        {metrics.map(({ icon: Icon, value, label }, i) => (
          <div key={label} className={styles.metric}>
            <div className={styles.iconContainer}>
              <Icon size={26} strokeWidth={1.5} className={styles.icon} />
            </div>
            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>
            {i < metrics.length - 1 && <div className={styles.divider} />}
          </div>
        ))}
      </div>
    </div>
  )
}
