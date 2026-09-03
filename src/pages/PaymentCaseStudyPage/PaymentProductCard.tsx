import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import importantDuesShot from '../../assets/screenshots/payment-important-dues.png'
import amountPayableShot from '../../assets/screenshots/payment-amount-payable.png'
import gatewayOptionsShot from '../../assets/screenshots/payment-gateway-options.png'
import additionalDuesShot from '../../assets/screenshots/payment-additional-dues.png'
import historyShot from '../../assets/screenshots/payment-history.png'
import ScreenshotLightbox from '../FlutterCaseStudyPage/ScreenshotLightbox'
import styles from './PaymentProductCard.module.css'

const screenshots = [
  { src: importantDuesShot, alt: 'Important Dues: overall dues status and fee cards a student must clear' },
  { src: amountPayableShot, alt: 'Amount Payable breakdown for the academic fee' },
  { src: gatewayOptionsShot, alt: 'Gateway options popup, only the methods this student can use' },
  { src: additionalDuesShot, alt: 'Additional dues owed outside the academic fee plan' },
  { src: historyShot, alt: 'Payment history, past orders and their status' },
]

const count = screenshots.length
const defaultIndex = 0

export default function PaymentProductCard() {
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
