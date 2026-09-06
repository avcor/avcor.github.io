import { Network, ShieldCheck, Workflow } from 'lucide-react'
import { SiAndroid, SiFirebase, SiGrafana, SiKotlin, SiSqlite } from 'react-icons/si'
import CaseStudyIntro, { type CaseStudyIntroTag } from '../../components/CaseStudyIntro'

const tags: CaseStudyIntroTag[] = [
  { icon: <SiKotlin size={13} color="var(--color-brand-kotlin)" />, label: 'Kotlin' },
  { icon: <Workflow size={13} color="var(--color-tag-channels)" />, label: 'Channels' },
  { icon: <SiSqlite size={13} color="var(--color-brand-sqlite)" />, label: 'Room' },
  { icon: <SiAndroid size={13} color="var(--color-brand-android)" />, label: 'WorkManager' },
  { icon: <Network size={13} color="var(--color-tag-okhttp)" />, label: 'OkHttp' },
  { icon: <SiGrafana size={13} color="var(--color-brand-grafana)" />, label: 'Grafana Loki' },
  { icon: <SiFirebase size={13} color="var(--color-brand-firebase)" />, label: 'Remote Config' },
  { icon: <ShieldCheck size={13} color="var(--color-tag-privacy)" />, label: 'Data Privacy' },
]

export default function LoggingIntro() {
  return (
    <CaseStudyIntro
      eyebrow="Production Observability"
      headingLines={['Diagnose production', 'from structured logs,', 'not user reports.']}
      description="Structured logs streamed from production Android devices to Grafana Loki. Privacy-first, offline-durable, never blocks the UI thread."
      tags={tags}
    />
  )
}
