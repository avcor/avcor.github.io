import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import homeShot from '../../assets/screenshots/ecg-home.png'
import patientQrShot from '../../assets/screenshots/ecg-patient-qr.png'
import patientFormShot from '../../assets/screenshots/ecg-patient-form.png'
import liveCaptureShot from '../../assets/screenshots/ecg-live-capture.png'
import recordsListShot from '../../assets/screenshots/ecg-records-list.png'
import reportPreviewShot from '../../assets/screenshots/ecg-report-preview.png'
import recordDetailShot from '../../assets/screenshots/ecg-record-detail.png'
import ScreenshotLightbox from '../FlutterCaseStudyPage/ScreenshotLightbox'
import styles from './EcgProductCard.module.css'

/** Ordered to match the user flow. The cover (defaultIndex) is the live
 *  capture screen since it's the only one showing the ECG graph itself. */
const screenshots = [
  { src: homeShot, alt: 'Home screen, Take ECG and ECG Records entry points' },
  { src: patientQrShot, alt: 'Take ECG screen, QR pairing to the wired Dozee device' },
  { src: patientFormShot, alt: 'Take ECG screen, manual patient details entry for a non-Dozee device' },
  { src: liveCaptureShot, alt: 'Live 12-lead ECG capture, waveforms streaming in from the wired Dozee device' },
  { src: recordsListShot, alt: 'ECG Records list, two recordings marked Upload pending, uploaded automatically once the network is back' },
  { src: reportPreviewShot, alt: 'Generated ECG PDF report with patient details and a share action' },
  { src: recordDetailShot, alt: 'ECG report detail view with diagnosis notes and a Done action' },
]

const count = screenshots.length
const defaultIndex = 3

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
