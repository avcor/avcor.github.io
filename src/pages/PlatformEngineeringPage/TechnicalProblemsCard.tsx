import { AlertTriangle } from 'lucide-react'
import DetailInfoCard from './DetailInfoCard'

const problems = [
  {
    title: 'Embed Flutter screens in existing Android app',
    description: 'Pass user data, tokens, base URL, screen name, etc.',
  },
  {
    title: 'Support multiple Android build flavors',
    description: 'Debug, QA, Release with different configurations.',
  },
  {
    title: 'Flutter engine startup time',
    description: 'Impacts app performance and user experience.',
  },
  {
    title: 'Long Android CI pipeline',
    description: '~90 minutes for a single end-to-end build.',
  },
]

export default function TechnicalProblemsCard() {
  return <DetailInfoCard icon={AlertTriangle} tone="warning" title="Technical Problems" items={problems} delay={0.15} />
}
