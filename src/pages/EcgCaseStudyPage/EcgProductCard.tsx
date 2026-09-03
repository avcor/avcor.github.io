import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import uploadQueueShot from '../../assets/screenshots/ecg-upload-queue.png'
import homeShot from '../../assets/screenshots/ecg-home.png'
import devicePairingShot from '../../assets/screenshots/ecg-device-pairing.png'
import liveCaptureShot from '../../assets/screenshots/ecg-live-capture.png'
import reportPreviewShot from '../../assets/screenshots/ecg-report-preview.png'
import ScreenshotLightbox from '../FlutterCaseStudyPage/ScreenshotLightbox'
import styles from './EcgProductCard.module.css'

/** First 3 are portrait and drive the frame + side-peeks (indices 0-2 are
 *  load-bearing for that layout). The rest are landscape, capture-mode
 *  screens that only ever appear once the lightbox carousel is open. */
const screenshots = [
  { src: uploadQueueShot, alt: 'ECG Records list, two recordings marked Upload pending, uploaded automatically once the network is back' },
  { src: homeShot, alt: 'Home screen, Take ECG and ECG Records entry points' },
  { src: devicePairingShot, alt: 'Take ECG screen, QR pairing to the wired Dozee device or manual patient/device lookup' },
  { src: liveCaptureShot, alt: 'Live 12-lead ECG capture, waveforms streaming in from the wired Dozee device' },
  { src: reportPreviewShot, alt: 'Generated ECG PDF report with patient details, diagnosis, and a share action' },
]

const count = screenshots.length
const defaultIndex = 0

export default function EcgProductCard() {
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

  const cover = screenshots[defaultIndex]

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

        {isEntered && (
          <motion.button
            type="button"
            className={styles.enlargeButton}
            onClick={openLightbox}
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
