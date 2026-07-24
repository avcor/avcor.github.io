import { Code2 } from 'lucide-react'
import DetailInfoCard from './DetailInfoCard'

const decisions = [
  {
    title: 'Choose Flutter over React Native',
    description: 'Better performance and developer experience.',
  },
  {
    title: 'AAR Distribution',
    description: 'Built Flutter module as AAR for seamless Android integration.',
  },
  {
    title: 'Method Channels',
    description: 'Secure communication between Android and Flutter.',
  },
  {
    title: 'Flavor-aware Config',
    description: 'Handled multiple flavors for both Flutter and Android builds.',
  },
  {
    title: 'Independent CI Pipelines',
    description: 'Faster builds, isolated failures, parallel development.',
  },
]

export default function EngineeringDecisionsCard() {
  return <DetailInfoCard icon={Code2} tone="primary" title="Engineering Decisions" items={decisions} delay={0.22} />
}
