import { useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import screenshot from '../../assets/screenshots/grafana-logging-dashboard.png'
import ScreenshotLightbox from '../FlutterCaseStudyPage/ScreenshotLightbox'
import styles from './LoggingProductCard.module.css'

const alt = 'Grafana Loki Explore, Logs Fields tab, service_name = digii-android'

export default function LoggingProductCard() {
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  // Chrome can't composite the button's backdrop-filter while an ancestor is
  // mid-transform (the overlay slide-up + this card's own entry animation),
  // which paints the glass flat until the transform settles. Mount the button
  // only after the entry animation finishes so the blur is correct on first paint.
  const [isEntered, setIsEntered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => setIsEntered(true)}
      className={styles.wrapper}
    >
      <div className={styles.stage}>
        <button
          type="button"
          className={styles.frame}
          onClick={() => setIsZoomOpen(true)}
          aria-label={`View screenshot: ${alt}`}
        >
          <img src={screenshot} alt={alt} draggable={false} />
        </button>

        {isEntered && (
          <motion.button
            type="button"
            className={styles.enlargeButton}
            onClick={() => setIsZoomOpen(true)}
            aria-label="Enlarge screenshot"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Maximize2 size={16} strokeWidth={2} />
            <span>Click to Enlarge</span>
          </motion.button>
        )}
      </div>

      {isZoomOpen && (
        <ScreenshotLightbox src={screenshot} alt={alt} onClose={() => setIsZoomOpen(false)} />
      )}
    </motion.div>
  )
}
