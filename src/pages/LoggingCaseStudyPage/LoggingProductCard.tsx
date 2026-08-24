import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import fieldsShot from '../../assets/screenshots/grafana-fields.png'
import logsShot from '../../assets/screenshots/grafana-logs-detail.png'
import labelsShot from '../../assets/screenshots/grafana-labels.png'
import ScreenshotLightbox from '../FlutterCaseStudyPage/ScreenshotLightbox'
import styles from './LoggingProductCard.module.css'

const screenshots = [
  { src: fieldsShot, alt: 'Grafana Loki Explore, Logs Fields tab: 44 structured fields' },
  { src: logsShot, alt: 'Grafana Loki Explore, expanded log line with every structured field' },
  { src: labelsShot, alt: 'Grafana Loki Explore, Labels tab: detected_level, service_name, env' },
]

const count = screenshots.length
const defaultIndex = 0

/** A single mac-window screenshot: title bar + traffic lights + image. */
function MiniWindow({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={styles.miniWindow}>
      <div className={styles.miniTitleBar} aria-hidden="true">
        <span className={`${styles.trafficDot} ${styles.trafficRed}`} />
        <span className={`${styles.trafficDot} ${styles.trafficYellow}`} />
        <span className={`${styles.trafficDot} ${styles.trafficGreen}`} />
      </div>
      <img src={src} alt={alt} draggable={false} className={styles.miniImage} />
    </div>
  )
}

/**
 * Three Grafana screenshots stacked exactly like Flutter's
 * ProductDeliveredCard: a full-stage mask fades the whole group's bottom
 * edge into the page, the front frame is top-anchored, and the two back
 * frames are bottom-anchored and dimmed, peeking out from either side via a
 * pure horizontal offset (no rotation).
 */
export default function LoggingProductCard() {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  // Chrome can't composite the button's backdrop-filter while an ancestor is
  // mid-transform (the overlay slide-up + this card's own entry animation),
  // which paints the glass flat until the transform settles. Mount the button
  // only after the entry animation finishes so the blur is correct on first paint.
  const [isEntered, setIsEntered] = useState(false)

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

  const front = screenshots[defaultIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => setIsEntered(true)}
      className={styles.wrapper}
    >
      <div className={styles.stage}>
        <div className={styles.imageGroup}>
          <div className={`${styles.card} ${styles.cardBackLeft}`} aria-hidden="true">
            <MiniWindow src={screenshots[1].src} alt="" />
          </div>
          <div className={`${styles.card} ${styles.cardBackRight}`} aria-hidden="true">
            <MiniWindow src={screenshots[2].src} alt="" />
          </div>

          <button
            type="button"
            className={`${styles.card} ${styles.cardFront}`}
            onClick={openLightbox}
            aria-label={`View all screenshots, starting with: ${front.alt}`}
          >
            <MiniWindow src={front.src} alt={front.alt} />
          </button>
        </div>

        {isEntered && (
          <motion.button
            type="button"
            className={styles.enlargeButton}
            onClick={openLightbox}
            aria-label="Enlarge screenshots"
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
        <ScreenshotLightbox
          src={screenshots[activeIndex].src}
          alt={screenshots[activeIndex].alt}
          onClose={() => setIsZoomOpen(false)}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          windowChrome
        />
      )}
    </motion.div>
  )
}
