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
  {                         metric: '~50x Fewer',        title: 'Batched Log Delivery',     description: 'Writes batched instead of per-event; the pipeline never blocks the UI thread.' },
  {                         metric: 'Zero Pins',        title: 'Layered Security',         description: 'Certificate pinning, binary tamper detection, and a keystore-backed token store resilient to corruption.' },
  { metricPrefix: '45GB →', metric: '200MB',             title: 'Storage Reclaimed',        description: 'Eliminated unlimited caches and un-evicted uploads, driven by production telemetry.' },
  { metricPrefix: '5 Calls →', metric: '1 Load',        title: 'API Calls Reduced',        description: 'Shared settings cached once per session instead of re-fetched per tab.' },
  {                         metric: 'Zero Fraud',       title: 'Attendance Verification',  description: 'Liveness verification blocks proxy punching from a photo, video, or off-site location.' },
  { metricPrefix: '5s →',   metric: '<2s',               title: 'Chart Draw Time',          description: 'Optimized processing and rendering of 9,000+ data points per session.' },
  {                         metric: 'Zero Flicker',     title: 'Profile Switching',        description: 'One state transition updates the UI once, not per intermediate Redux read.' },
  {                         metric: 'No Upload Wait',   title: 'Background ECG Upload',    description: 'WorkManager retries a failed or pending upload; the report stays reviewable offline.' },
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
