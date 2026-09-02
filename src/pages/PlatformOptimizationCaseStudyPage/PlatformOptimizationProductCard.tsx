import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import coldStartShot from '../../assets/screenshots/play-console-cold-start.png'
import appSizeShot from '../../assets/screenshots/play-console-app-size.png'
import crashFreeShot from '../../assets/screenshots/crashlytics-crash-free.png'
import ScreenshotLightbox from '../FlutterCaseStudyPage/ScreenshotLightbox'
import styles from './PlatformOptimizationProductCard.module.css'

const screenshots = [
  { src: coldStartShot, alt: 'Play Console Android vitals, slow cold start over time, down to 0.78%' },
  { src: appSizeShot, alt: 'Play Console Android vitals, app download size over time, 54.8MB reference device' },
  { src: crashFreeShot, alt: 'Firebase Crashlytics, 99.99% crash-free users, latest release' },
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

/** Three production dashboards, not app screens: cold start, app size, and
 *  crash-free rate, stacked exactly like Logging's Grafana screenshots. */
export default function PlatformOptimizationProductCard() {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
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
            <img src={screenshots[1].src} alt="" draggable={false} className={styles.backImage} />
          </div>
          <div className={`${styles.card} ${styles.cardBackRight}`} aria-hidden="true">
            <img src={screenshots[2].src} alt="" draggable={false} className={styles.backImage} />
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
