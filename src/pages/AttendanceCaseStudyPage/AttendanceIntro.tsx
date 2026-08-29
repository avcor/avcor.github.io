import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { SiAndroid, SiGoogle, SiGooglemaps, SiGoogleplay, SiKotlin } from 'react-icons/si'
import styles from './AttendanceIntro.module.css'

const ease = [0.16, 1, 0.3, 1] as const

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease },
  }
}

interface Tag {
  icon: ReactNode
  label: string
}

const tags: Tag[] = [
  { icon: <SiKotlin size={13} color="var(--color-brand-kotlin)" />, label: 'Kotlin' },
  { icon: <SiGoogle size={13} color="var(--color-brand-google)" />, label: 'ML Kit' },
  { icon: <SiAndroid size={13} color="var(--color-brand-android)" />, label: 'CameraX' },
  { icon: <SiGooglemaps size={13} color="var(--color-brand-googlemaps)" />, label: 'Geofencing' },
  { icon: <SiGoogleplay size={13} color="var(--color-brand-googleplay)" />, label: 'FusedLocationProvider' },
]

export default function AttendanceIntro() {
  return (
    <div className={styles.column}>
      <div className={styles.textLayer}>
        <motion.div {...fadeUp(0.05)} className={styles.eyebrow}>
          <span className={styles.eyebrowDash} />
          <span>Attendance Integrity</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.15)} className={styles.heading}>
          <span className={styles.headingLine}>Every punch is a live face,</span>
          <span className={styles.headingLineAccent}>not a photo, not a proxy,</span>
          <span className={styles.headingLine}>verified before it counts.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.3)} className={styles.description}>
          On-device liveness detection and server-side location checks close the ways
          staff attendance used to be faked: gallery photos, someone else punching in
          for you, and punching in from off-site.
        </motion.p>

        <motion.div {...fadeUp(0.42)} className={styles.tags}>
          {tags.map(({ icon, label }) => (
            <span key={label} className={styles.tag}>
              {icon}
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
