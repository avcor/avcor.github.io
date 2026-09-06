import { SiBluetooth, SiReact, SiRedux, SiTypescript } from 'react-icons/si'
import { Cpu, Wifi } from 'lucide-react'
import CaseStudyIntro, { type CaseStudyIntroTag } from '../../components/CaseStudyIntro'

const tags: CaseStudyIntroTag[] = [
  { icon: <SiReact size={13} color="var(--color-brand-react)" />, label: 'React Native' },
  { icon: <SiTypescript size={13} color="var(--color-brand-typescript)" />, label: 'TypeScript' },
  { icon: <SiRedux size={13} color="var(--color-brand-redux)" />, label: 'Redux' },
  { icon: <SiBluetooth size={13} color="var(--color-brand-bluetooth)" />, label: 'Bluetooth' },
  { icon: <Wifi size={13} color="var(--color-tag-wifi)" />, label: 'Wi-Fi' },
  { icon: <Cpu size={13} color="var(--color-tag-hardware)" />, label: 'Hardware Integration' },
]

export default function ManagingProfileIntro() {
  return (
    <CaseStudyIntro
      eyebrow="Dozee Home"
      headingLines={['Switching a profile', 'should feel instant,', 'not flicker into place.']}
      description="A caregiver managing someone else's health data should never wonder whose account they're looking at, or whether the shared pod is still listening."
      tags={tags}
    />
  )
}
