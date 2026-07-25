import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useCenteredCarouselIndex } from '../../hooks/useCenteredCarouselIndex'
import type { ProductScreenshot } from './screenshotsData'
import styles from './ScreenshotLightbox.module.css'

interface ScreenshotLightboxProps {
  screenshots: ProductScreenshot[]
  openIndex: number | null
  onClose: () => void
}

export default function ScreenshotLightbox({ screenshots, openIndex, onClose }: ScreenshotLightboxProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const open = openIndex !== null
  const [centeredIndex, setCenteredIndex] = useCenteredCarouselIndex(trackRef, open)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (openIndex === null || !trackRef.current) return
    setCenteredIndex(openIndex)
    const target = trackRef.current.children[openIndex] as HTMLElement | undefined
    target?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' })
  }, [openIndex, setCenteredIndex])

  const goToSlide = (i: number) => {
    const target = trackRef.current?.children[i] as HTMLElement | undefined
    target?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

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
          aria-label="Screenshot preview"
        >
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close preview">
            <X size={18} strokeWidth={2} />
          </button>

          <div className={styles.track} ref={trackRef} onClick={(e) => e.stopPropagation()}>
            {screenshots.map((shot, i) => (
              <div
                key={shot.src}
                className={`${styles.slide} ${i === centeredIndex ? styles.slideActive : ''}`}
                onClick={() => goToSlide(i)}
              >
                <img src={shot.src} alt={shot.alt} className={styles.image} />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
