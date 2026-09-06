import { ShieldAlert } from 'lucide-react'
import { SiAndroid, SiGoogle, SiGooglemaps, SiGoogleplay, SiKotlin } from 'react-icons/si'
import CaseStudyIntro, { type CaseStudyIntroTag } from '../../components/CaseStudyIntro'

const tags: CaseStudyIntroTag[] = [
  { icon: <SiKotlin size={13} color="var(--color-brand-kotlin)" />, label: 'Kotlin' },
  { icon: <SiGoogle size={13} color="var(--color-brand-google)" />, label: 'ML Kit' },
  { icon: <SiAndroid size={13} color="var(--color-brand-android)" />, label: 'CameraX' },
  { icon: <SiGooglemaps size={13} color="var(--color-brand-googlemaps)" />, label: 'Geofencing' },
  { icon: <SiGoogleplay size={13} color="var(--color-brand-googleplay)" />, label: 'FusedLocationProvider' },
  { icon: <ShieldAlert size={13} color="var(--color-tag-fraud)" />, label: 'Fraud Prevention' },
]

export default function AttendanceIntro() {
  return (
    <CaseStudyIntro
      eyebrow="Attendance Integrity"
      headingLines={['Every punch is a live face,', 'not a photo, not a proxy,', 'verified before it counts.']}
      description="On-device liveness detection and server-side location checks close the ways staff attendance used to be faked: gallery photos, someone else punching in for you, and punching in from off-site."
      tags={tags}
    />
  )
}
