import { Zap, Clock, Code2, Shield, TrendingUp, LayoutGrid, Users, Database, Cloud } from 'lucide-react'
import Nav from '../../components/Nav'
import MetricCard from '../../components/MetricCard'
import ImpactLeftColumn from './ImpactLeftColumn'
import ImpactStatsBar from './ImpactStatsBar'
import styles from './ImpactPage.module.css'

// ─── Card data ────────────────────────────────────────────────────────────────

const cards = [
  { icon: Zap,        metricPrefix: '4s →',  metric: 'Instant',         title: 'Flutter Engine Startup',    description: 'Optimized engine initialization and warmup to make Flutter screens load instantly.' },
  { icon: Clock,      metricPrefix: '90m →', metric: '18m',             title: 'CI/CD Pipeline',            description: 'Reduced build and deploy time to Firebase App Distribution from 90 minutes to 18.' },
  { icon: Code2,                             metric: '100+',            title: 'Files Modernized',          description: 'Migrated legacy codebase, removed outdated libraries and enabled modern Android stack.' },
  { icon: Shield,                            metric: 'Fraud Prevented', title: 'Attendance Verification',   description: 'Implemented liveness verification to prevent proxy attendance using images or videos.' },
  { icon: TrendingUp,                        metric: '20%',             title: 'Faster Development',        description: 'Adoption of Kotlin, Coroutines, Flow and Jetpack libraries improved team velocity.' },
  { icon: LayoutGrid,                        metric: '15%',             title: 'Reduced UI Testing Time',   description: 'Architecture and state improvements reduced UI test cycles significantly.' },
  { icon: Users,                             metric: 'Seamless',        title: 'Multi-Tenant Switching',    description: 'Designed secure and reliable account switching across roles and tenants.' },
  { icon: Database,                          metric: '9000+',           title: 'Data Points Processed',     description: 'Optimized chart processing and rendering from 5 seconds to under 2 seconds.' },
  { icon: Cloud,                             metric: 'Offline',         title: 'Reliable Data Sync',        description: 'Background uploads with WorkManager ensure no data loss even offline.' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function ImpactPage() {
  return (
    <section id="work" className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>AV</span>
        <Nav activeLink="Work" />
      </header>

      <div className={styles.content}>
        <ImpactLeftColumn />

        <div className={styles.rightColumn}>
          {cards.map((card, i) => (
            <MetricCard
              key={card.title}
              icon={card.icon}
              metric={card.metric}
              metricPrefix={card.metricPrefix}
              title={card.title}
              description={card.description}
              delay={i * 0.06}
            />
          ))}
        </div>
      </div>

      <ImpactStatsBar />
    </section>
  )
}
