import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import screenshot1 from '../../assets/screenshots/access-management-dashboard.png'
import screenshot2 from '../../assets/screenshots/access-management-dashboard-detail.png'
import screenshot3 from '../../assets/screenshots/pass-console.png'
import ScreenshotLightbox from './ScreenshotLightbox'
import styles from './ProductDeliveredCard.module.css'

const screenshots = [
  { src: screenshot1, alt: 'Access Management Dashboard — hosteller list' },
  { src: screenshot2, alt: 'Access Management Dashboard — student detail sheet' },
  { src: screenshot3, alt: 'Pass Console — pass request history' },
]

const count = screenshots.length
const defaultIndex = 0

export default function ProductDeliveredCard() {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  const go = useCallback((dir: number) => {
    setActiveIndex((i) => (i + dir + count) % count)
  }, [])

  const openLightbox = useCallback(() => {
    setActiveIndex(defaultIndex)
    setIsZoomOpen(true)
  }, [])

  useEffect(() => {
    if (!isZoomOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isZoomOpen, go])

  const cover = screenshots[defaultIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <div className={styles.stage}>
        <div className={styles.imageGroup}>
          <div className={`${styles.frameSide} ${styles.frameLeft}`} aria-hidden="true">
            <img src={screenshots[1].src} alt="" draggable={false} />
          </div>
          <div className={`${styles.frameSide} ${styles.frameRight}`} aria-hidden="true">
            <img src={screenshots[2].src} alt="" draggable={false} />
          </div>

          <button
            type="button"
            className={styles.frame}
            onClick={openLightbox}
            aria-label={`View all screenshots, starting with: ${cover.alt}`}
          >
            <img src={cover.src} alt={cover.alt} draggable={false} />
          </button>
        </div>
      </div>

      {isZoomOpen && (
        <ScreenshotLightbox
          src={screenshots[activeIndex].src}
          alt={screenshots[activeIndex].alt}
          onClose={() => setIsZoomOpen(false)}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
        />
      )}
    </motion.div>
  )
}
