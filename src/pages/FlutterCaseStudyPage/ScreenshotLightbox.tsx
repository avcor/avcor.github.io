import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import styles from './ScreenshotLightbox.module.css'

interface ScreenshotLightboxProps {
  src: string
  alt: string
  onClose: () => void
}

export default function ScreenshotLightbox({ src, alt, onClose }: ScreenshotLightboxProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

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
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
