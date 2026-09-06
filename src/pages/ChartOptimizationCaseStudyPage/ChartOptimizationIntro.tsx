import { SiChartdotjs, SiReact, SiTypescript } from 'react-icons/si'
import { Database, Gauge, Zap } from 'lucide-react'
import CaseStudyIntro, { type CaseStudyIntroTag } from '../../components/CaseStudyIntro'

const tags: CaseStudyIntroTag[] = [
  { icon: <SiReact size={13} color="var(--color-brand-react)" />, label: 'React Native' },
  { icon: <SiTypescript size={13} color="var(--color-brand-typescript)" />, label: 'TypeScript' },
  { icon: <SiChartdotjs size={13} color="var(--color-brand-chartjs)" />, label: 'Chart.js' },
  { icon: <Database size={13} color="var(--color-tag-watermelondb)" />, label: 'WatermelonDB' },
  { icon: <Gauge size={13} color="var(--color-tag-optimization)" />, label: 'Optimization' },
  { icon: <Zap size={13} color="var(--color-tag-performance)" />, label: 'Performance' },
]

export default function ChartOptimizationIntro() {
  return (
    <CaseStudyIntro
      eyebrow="Dozee Home"
      headingLines={['9,000 points a night,', 'drawn in under 2 seconds,', 'on any screen.']}
      description="A chart that takes 5 seconds to draw, or mislabels its own axis, does not read as accurate, even when the underlying data is."
      tags={tags}
    />
  )
}
