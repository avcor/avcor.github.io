import { useEffect, useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Share2 } from 'lucide-react'
import CaseStudyGallery from '../../pages/CaseStudyGallery'
import LoggingCaseStudyGallery from '../../pages/LoggingCaseStudyGallery'
import AttendanceCaseStudyGallery from '../../pages/AttendanceCaseStudyGallery'
import SecurityCaseStudyGallery from '../../pages/SecurityCaseStudyGallery'
import PlatformOptimizationCaseStudyGallery from '../../pages/PlatformOptimizationCaseStudyGallery'
import PaymentCaseStudyGallery from '../../pages/PaymentCaseStudyGallery'
import { useCaseStudyOverlay } from '../../context/CaseStudyOverlayContext'
import styles from './CaseStudyOverlay.module.css'

const ease = [0.16, 1, 0.3, 1] as const

/** Maps an openable circuit-node id to the gallery it opens. */
const GALLERIES: Record<string, ComponentType> = {
  'flutter-integration': CaseStudyGallery,
  'logging-system': LoggingCaseStudyGallery,
  'ml-kit-liveness': AttendanceCaseStudyGallery,
  'app-security': SecurityCaseStudyGallery,
  'android-optimization': PlatformOptimizationCaseStudyGallery,
  'payment-experience': PaymentCaseStudyGallery,
}

/**
 * The case-study details sheet. Slides up from the bottom over the page when a
 * leaf node is selected on the index circuit, and slides back down on close.
 * Renders the gallery registered for `openId` in GALLERIES.
 */
export default function CaseStudyOverlay() {
  const { openId, close } = useCaseStudyOverlay()
  const isOpen = openId !== null
  const Gallery = openId ? GALLERIES[openId] : null
  const [copied, setCopied] = useState(false)

  // Escape to close + lock the page behind the sheet while it's open.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, close])

  // Reset the "copied" affordance whenever a fresh sheet opens.
  useEffect(() => {
    setCopied(false)
  }, [openId])

  const onShare = async () => {
    if (!openId) return
    const url = `${window.location.origin}${window.location.pathname}#case-study/${openId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease }}
          onClick={close}
        >
          <motion.div
            className={styles.sheet}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.55, ease }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Case study details"
          >
            <button type="button" className={styles.close} onClick={close} aria-label="Close details">
              <ChevronDown size={18} strokeWidth={2} />
            </button>

            <button
              type="button"
              className={styles.share}
              onClick={onShare}
              aria-label="Copy link to this case study"
            >
              {copied ? <Check size={16} strokeWidth={2} /> : <Share2 size={16} strokeWidth={2} />}
              <span>{copied ? 'Link copied' : 'Share'}</span>
            </button>

            {Gallery && <Gallery />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
