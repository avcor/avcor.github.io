import { useCallback, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import screenshot1 from '../../assets/screenshots/access-management-dashboard.png'
import screenshot2 from '../../assets/screenshots/access-management-dashboard-detail.png'
import screenshot3 from '../../assets/screenshots/pass-console.png'
import ScreenshotLightbox from './ScreenshotLightbox'
import styles from './ProductDeliveredCard.module.css'

const screenshots = [
  { src: screenshot1, alt: 'Access Management Dashboard — hosteller list' },
  { src: screenshot2, alt: 'Access Management Dashboard — student detail sheet' },
  { src: screenshot3, alt: 'Pass Console — pass request history' },
]

const count = screenshots.length

function slotOf(index: number, active: number) {
  let diff = (index - active + count) % count
  if (diff > count / 2) diff -= count
  return diff
}

function styleForSlot(slot: number): CSSProperties {
  if (slot === 0) {
    return {
      transform: 'translateX(-50%) scale(1)',
      zIndex: 3,
      opacity: 1,
      filter: 'none',
    }
  }

  const dir = slot > 0 ? 1 : -1
  return {
    transform: `translateX(calc(-50% + ${dir * 62}%)) scale(0.8)`,
    zIndex: 2,
    opacity: 0.65,
    filter: 'brightness(0.62) saturate(0.9)',
  }
}

export default function ProductDeliveredCard() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  const go = useCallback((dir: number) => {
    setActiveIndex((i) => (i + dir + count) % count)
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <div className={styles.stage}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => go(-1)}
          aria-label="Show previous screenshot"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        <div className={styles.phones}>
          {screenshots.map((shot, index) => {
            const slot = slotOf(index, activeIndex)
            const isActive = slot === 0

            return (
              <button
                key={shot.src}
                type="button"
                className={styles.phone}
                style={styleForSlot(slot)}
                onClick={() => (isActive ? setIsZoomOpen(true) : setActiveIndex(index))}
                aria-label={isActive ? `Enlarge screenshot: ${shot.alt}` : `Show screenshot: ${shot.alt}`}
                tabIndex={isActive ? 0 : -1}
              >
                <img src={shot.src} alt={shot.alt} draggable={false} />
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => go(1)}
          aria-label="Show next screenshot"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>

        <button
          type="button"
          className={styles.enlarge}
          onClick={() => setIsZoomOpen(true)}
          aria-label="Enlarge current screenshot"
        >
          <Maximize2 size={15} strokeWidth={2} />
        </button>
      </div>

      <div className={styles.foot}>
        {screenshots.map((shot, index) => (
          <button
            key={shot.src}
            type="button"
            className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to screenshot ${index + 1} of ${count}`}
            aria-current={index === activeIndex}
          />
        ))}
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
