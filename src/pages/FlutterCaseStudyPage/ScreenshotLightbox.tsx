import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import styles from './ScreenshotLightbox.module.css'

interface ScreenshotLightboxProps {
  src: string
  alt: string
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  /** Wraps the enlarged image in a macOS-style window frame (title bar +
   *  traffic lights), for screenshots of an actual desktop app window,
   *  rather than a mobile app screen. */
  windowChrome?: boolean
}

export default function ScreenshotLightbox({
  src,
  alt,
  onClose,
  onPrev,
  onNext,
  windowChrome = false,
}: ScreenshotLightboxProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev?.()
      else if (e.key === 'ArrowRight') onNext?.()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, onPrev, onNext])

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={styles.backdrop}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={alt}
      >
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close enlarged view">
          <X size={20} strokeWidth={2} />
        </button>

        {onPrev && (
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonLeft}`}
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            aria-label="Show previous screenshot"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
        )}

        {onNext && (
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonRight}`}
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Show next screenshot"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        )}

        {windowChrome ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={styles.windowFrame}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.windowTitleBar} aria-hidden="true">
              <span className={`${styles.trafficDot} ${styles.trafficRed}`} />
              <span className={`${styles.trafficDot} ${styles.trafficYellow}`} />
              <span className={`${styles.trafficDot} ${styles.trafficGreen}`} />
            </div>
            <img src={src} alt={alt} className={styles.windowImage} />
          </motion.div>
        ) : (
          <motion.img
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            src={src}
            alt={alt}
            className={styles.image}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
