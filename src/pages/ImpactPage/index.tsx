import MetricCard from '../../components/MetricCard'
import ImpactLeftColumn from './ImpactLeftColumn'
import ImpactStatsBar from './ImpactStatsBar'
import styles from './ImpactPage.module.css'

/** One card per case study (9 total), each metric pulled from that case
 *  study's own Impact Bar so this page never drifts from what the case
 *  studies actually claim. Ordered to match the circuit's domain order:
 *  Platform, Security, Optimization, Product, Performance, Offline. */
const cards = [
  { metricPrefix: '90m →',  metric: '18m',               title: 'CI/CD Pipeline',           description: 'Reduced build and deploy time to Firebase App Distribution from 90 minutes to 18.' },
  {                         metric: '4.5 Stars',       title: 'Cross-Team UX Delivery',    description: 'Collaborated across remote engineering, design, and product teams to ship UX improvements.' },
  {                         metric: 'Zero Pins',        title: 'Layered Security',         description: 'Certificate pinning, binary tamper detection, and a keystore-backed token store resilient to corruption.' },
  { metricPrefix: '92MB →', metric: '54.8MB',            title: 'Size Regression Fixed',    description: 'Traced and reverted an app size regression with no runtime cost.' },
  { metricPrefix: '45GB →', metric: '200MB',           title: 'Storage Reclaimed',        description: 'Cut device storage by ~99.5% for existing installs and enforced a hard ceiling for new ones.' },
  {                         metric: 'Zero Fraud',       title: 'Attendance Verification',  description: 'Liveness verification blocks proxy punching from a photo, video, or off-site location.' },
  { metricPrefix: '96.23% →', metric: '99.94%',         title: 'Crash-Free Sessions',      description: 'Root-caused memory leaks, race conditions, and lifecycle defects in production.' },
  { metricPrefix: '5s →',   metric: '<2s',               title: 'Chart Draw Time',          description: 'Optimized processing and rendering of 9,000+ data points per session.' },
  {                         metric: 'Zero Loss',        title: 'Delivery Survives Offline', description: 'Logs persist to Room and retry via WorkManager until the network returns, even after process death.' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function ImpactPage() {
  return (
    <section id="work" className={styles.page}>
      <div className={styles.content}>
        <ImpactLeftColumn />

        <div className={styles.rightColumn}>
          {cards.map((card, i) => (
            <MetricCard
              key={card.title}
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
