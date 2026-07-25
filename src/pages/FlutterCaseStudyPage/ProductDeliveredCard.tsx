import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import PeekingCarousel from '../../components/PeekingCarousel'
import ScreenshotLightbox from './ScreenshotLightbox'
import { PRODUCT_SCREENSHOTS } from './screenshotsData'
import styles from './ProductDeliveredCard.module.css'

export default function ProductDeliveredCard() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

        <div className={styles.galleryStage}>
          <PeekingCarousel items={PRODUCT_SCREENSHOTS} onActiveSelect={setOpenIndex} />
        </div>
      </div>

      <ScreenshotLightbox screenshots={PRODUCT_SCREENSHOTS} openIndex={openIndex} onClose={() => setOpenIndex(null)} />
    </motion.div>
  )
}
