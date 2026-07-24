import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, ArrowUpRight } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import PhoneMockup from './PhoneMockup'
import PhoneFullScreenOverlay from './PhoneFullScreenOverlay'
import styles from './ProductDeliveredCard.module.css'

export default function ProductDeliveredCard() {
  const [isFullScreen, setIsFullScreen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <GlassBadge icon={Package} size={44} />
          <div>
            <div className={styles.title}>Product Delivered</div>
            <div className={styles.description}>
              Production screens built on top of the Flutter platform.
            </div>
          </div>
        </div>

        <div className={styles.phoneStage}>
          <div className={styles.phoneGlow} aria-hidden="true" />
          <div className={styles.phoneCrop}>
            <PhoneMockup />
            <div className={styles.phoneFade} />
          </div>
        </div>

        <button type="button" className={styles.link} onClick={() => setIsFullScreen(true)}>
          View full screen
          <ArrowUpRight size={15} strokeWidth={2} />
        </button>
      </div>

      <PhoneFullScreenOverlay open={isFullScreen} onClose={() => setIsFullScreen(false)} />
    </motion.div>
  )
}
