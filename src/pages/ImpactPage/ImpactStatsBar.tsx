import { motion } from 'framer-motion'
import { Users, Rocket, Smartphone, CalendarDays, Sparkles } from 'lucide-react'
import styles from './ImpactStatsBar.module.css'

const stats = [
  { icon: Users,        value: '500K+', label: 'Users Impacted' },
  { icon: Rocket,       value: '25+',   label: 'Features Delivered' },
  { icon: Smartphone,   value: '2',     label: 'Platforms Optimized' },
  { icon: CalendarDays, value: '5+',    label: 'Years of Engineering' },
]

export default function ImpactStatsBar() {
  return (
    <div className={styles.wrapper}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className={styles.panel}
      >
        {/* Left: sparkle + heading + description */}
        <div className={styles.left}>
          <Sparkles size={28} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div className={styles.title}>Impact that scales</div>
            <div className={styles.description}>
              Every metric here represents a problem solved for thousands of users, with
              reliability, speed and trust.
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Stat items */}
        <div className={styles.statsGroup}>
          {stats.map(({ icon: StatIcon, value, label }, i) => (
            <div key={label} className={styles.statItem}>
              {i > 0 && <div className={styles.statDivider} />}
              <div className={styles.statInner}>
                <StatIcon size={30} color="var(--color-text-muted)" strokeWidth={1.5} />
                <div>
                  <div className={styles.statValue}>{value}</div>
                  <div className={styles.statLabel}>{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
