import { motion } from 'framer-motion'
import { ImageOff } from 'lucide-react'
import styles from './SecurityProductCard.module.css'

/**
 * Placeholder product card. Most of the security work is invisible by design,
 * and no real screenshots have been shared yet, so this renders the three
 * intended captures as empty frames instead of shipping misleading imagery.
 * Swap for the screenshot fan (see AttendanceProductCard) once shots exist.
 */
const placeholders = [
  'Security Notice dialog, tamper detected, Sign Out prompt',
  'Digital ID card, screenshot and screen-recording blocked',
  'MFA / OTP verification screen',
]

export default function SecurityProductCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <div className={styles.frames}>
        {placeholders.map((caption) => (
          <div key={caption} className={styles.frame}>
            <ImageOff size={18} strokeWidth={1.75} className={styles.frameIcon} />
            <span className={styles.frameCaption}>{caption}</span>
          </div>
        ))}
      </div>
      <span className={styles.note}>Screenshots pending</span>
    </motion.div>
  )
}
