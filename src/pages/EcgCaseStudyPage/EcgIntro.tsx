import { SiAndroid, SiKotlin } from 'react-icons/si'
import { Cpu, FileText, HeartPulse, Usb, WifiOff, Workflow } from 'lucide-react'
import CaseStudyIntro, { type CaseStudyIntroTag } from '../../components/CaseStudyIntro'

const tags: CaseStudyIntroTag[] = [
  { icon: <HeartPulse size={13} color="var(--color-tag-ecg)" />, label: 'ECG' },
  { icon: <SiKotlin size={13} color="var(--color-brand-kotlin)" />, label: 'Kotlin' },
  { icon: <SiAndroid size={13} color="var(--color-brand-android)" />, label: 'WorkManager' },
  { icon: <Workflow size={13} color="var(--color-tag-coroutines)" />, label: 'Coroutines' },
  { icon: <Usb size={13} color="var(--color-tag-wiredconn)" />, label: 'Wired Connection' },
  { icon: <WifiOff size={13} color="var(--color-tag-offline)" />, label: 'Offline-First' },
  { icon: <FileText size={13} color="var(--color-tag-pdf)" />, label: 'PDF Generation' },
  { icon: <Cpu size={13} color="var(--color-tag-hardware)" />, label: 'Hardware Integration' },
]

export default function EcgIntro() {
  return (
    <CaseStudyIntro
      eyebrow="Background ECG Sync"
      headingLines={['A doctor takes an ECG.', 'The record uploads on its own.', 'It stays reviewable either way.']}
      description="A wired ECG device connects to the phone and captures the reading. It turns into a PDF the doctor can review now or later. Upload runs in the background, so it never blocks the doctor's flow. The report stays available locally even without network."
      tags={tags}
    />
  )
}
