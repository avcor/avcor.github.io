import { Compass, Component, Puzzle, Infinity as InfinityIcon } from 'lucide-react'
import { SiFlutter, SiAndroid, SiGithubactions } from 'react-icons/si'
import SharedCaseStudyIntro, { type CaseStudyIntroTag } from '../../components/CaseStudyIntro'

const tags: CaseStudyIntroTag[] = [
  { icon: <SiFlutter size={13} color="var(--color-brand-flutter)" />, label: 'Flutter' },
  { icon: <SiAndroid size={13} color="var(--color-brand-android)" />, label: 'Android' },
  { icon: <Component size={13} color="var(--color-tag-architecture)" />, label: 'Architecture' },
  { icon: <Puzzle size={13} color="var(--color-tag-modular)" />, label: 'Modular' },
  { icon: <InfinityIcon size={13} color="var(--color-tag-cicd)" />, label: 'CI/CD' },
  { icon: <SiGithubactions size={13} color="var(--color-brand-githubactions)" />, label: 'GitHub Actions' },
  { icon: <Compass size={13} color="var(--color-tag-tech-evaluation)" />, label: 'Technology Evaluation' },
]

export default function CaseStudyIntro() {
  return (
    <SharedCaseStudyIntro
      eyebrow="Platform Engineering"
      headingLines={['Building a Modular', 'Flutter Platform', 'for Android']}
      description="Built the platform that runs Flutter features inside the existing Android app. Android and Flutter ship and evolve independently."
      tags={tags}
    />
  )
}
