import { Database, HardDrive, Network, PlayCircle, Timer } from 'lucide-react'
import { SiFirebase, SiGlide, SiGoogleplay } from 'react-icons/si'
import CaseStudyIntro, { type CaseStudyIntroTag } from '../../components/CaseStudyIntro'

const tags: CaseStudyIntroTag[] = [
  { icon: <Network size={13} color="var(--color-tag-okhttp)" />, label: 'OkHttp' },
  { icon: <SiGlide size={13} color="var(--color-brand-glide)" />, label: 'Glide' },
  { icon: <PlayCircle size={13} color="var(--color-tag-exoplayer)" />, label: 'ExoPlayer' },
  { icon: <SiGoogleplay size={13} color="var(--color-brand-googleplay)" />, label: 'Play Console Vitals' },
  { icon: <SiFirebase size={13} color="var(--color-brand-firebase)" />, label: 'Firebase Crashlytics' },
  { icon: <HardDrive size={13} color="var(--color-tag-storage)" />, label: 'Storage' },
  { icon: <Timer size={13} color="var(--color-tag-coldstart)" />, label: 'Cold Start' },
  { icon: <Database size={13} color="var(--color-tag-buildsize)" />, label: 'Build Size' },
]

export default function PlatformOptimizationIntro() {
  return (
    <CaseStudyIntro
      eyebrow="Platform Optimization"
      headingLines={['Storage, startup, and build size,', 'all traced back', 'to production telemetry.']}
      description="Ten years of engineering debt let storage, cold start, and build size degrade quietly, in ways synthetic testing never caught. Fixed area by area using production telemetry: cache ceilings, startup threading, view recycling, and build shrinking."
      tags={tags}
    />
  )
}
