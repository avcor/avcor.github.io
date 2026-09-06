import { Binary, KeyRound, Network, ScrollText } from 'lucide-react'
import { SiKotlin } from 'react-icons/si'
import CaseStudyIntro, { type CaseStudyIntroTag } from '../../components/CaseStudyIntro'

// Only technologies the app actually uses are listed (Frida/RootBeer removed,
// they are detection targets, not dependencies).
const tags: CaseStudyIntroTag[] = [
  { icon: <SiKotlin size={13} color="var(--color-brand-kotlin)" />, label: 'Kotlin' },
  { icon: <Network size={13} color="var(--color-tag-okhttp)" />, label: 'OkHttp' },
  { icon: <Binary size={13} color="var(--color-tag-cjni)" />, label: 'C / JNI' },
  { icon: <KeyRound size={13} color="var(--color-tag-keystore)" />, label: 'Android Keystore' },
  { icon: <ScrollText size={13} color="var(--color-tag-proguard)" />, label: 'ProGuard / R8' },
]

export default function SecurityIntro() {
  return (
    <CaseStudyIntro
      eyebrow="App Security Hardening"
      headingLines={["The device isn't trusted,", "the network isn't trusted,", "the binary isn't trusted."]}
      description="Digiicampus handles payments and student records on devices we don't control. Pinning, a Keystore-backed token store, and a from-scratch tamper-detection engine make the binary itself trustworthy, not just the app."
      descriptionMaxWidth="46ch"
      tags={tags}
    />
  )
}
