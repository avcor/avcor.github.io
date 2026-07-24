import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import PhoneMockup from './PhoneMockup'
import styles from './PhoneFullScreenOverlay.module.css'

interface PhoneFullScreenOverlayProps {
  open: boolean
  onClose: () => void
}

export default function PhoneFullScreenOverlay({ open, onClose }: PhoneFullScreenOverlayProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={styles.backdrop}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Product screen preview"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={styles.stage}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close preview">
              <X size={18} strokeWidth={2} />
            </button>
            <PhoneMockup large />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
