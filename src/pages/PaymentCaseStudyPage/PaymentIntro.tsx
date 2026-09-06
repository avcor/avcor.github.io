import { SiKotlin } from 'react-icons/si'
import { Blocks, DatabaseZap, GitFork, Layers, MessageSquare, PenTool } from 'lucide-react'
import CaseStudyIntro, { type CaseStudyIntroTag } from '../../components/CaseStudyIntro'

const tags: CaseStudyIntroTag[] = [
  { icon: <SiKotlin size={13} color="var(--color-brand-kotlin)" />, label: 'Kotlin & Coroutines' },
  { icon: <GitFork size={13} color="var(--color-tag-concurrency)" />, label: 'Concurrency' },
  { icon: <DatabaseZap size={13} color="var(--color-tag-caching)" />, label: 'Caching / API Reduction' },
  { icon: <Layers size={13} color="var(--color-tag-mvvm)" />, label: 'MVVM (StateFlow)' },
  { icon: <Blocks size={13} color="var(--color-tag-product-building)" />, label: 'Product Building' },
  { icon: <MessageSquare size={13} color="var(--color-tag-cross-team)" />, label: 'Cross-team Communication' },
  { icon: <PenTool size={13} color="var(--color-tag-ux-iteration)" />, label: 'UX Iteration' },
]

export default function PaymentIntro() {
  return (
    <CaseStudyIntro
      eyebrow="Fee Payments"
      headingLines={['Where a student stands on fees,', 'at a glance,', 'not a wall of numbers.']}
      description="One screen: what's due, what's cleared, what to pay next. Requirements started vague, so this was as much product work as Android."
      tags={tags}
    />
  )
}
