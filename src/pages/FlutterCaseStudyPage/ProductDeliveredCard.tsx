import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Box, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import screenshot1 from '../../assets/screenshots/access-management-dashboard.jpg'
import screenshot2 from '../../assets/screenshots/access-management-dashboard-2.jpg'
import screenshot3 from '../../assets/screenshots/pass-console.jpg'
import ScreenshotLightbox from './ScreenshotLightbox'
import styles from './ProductDeliveredCard.module.css'

const screenshots = [
  { src: screenshot1, alt: 'Access Management Dashboard — hosteller list' },
  { src: screenshot2, alt: 'Access Management Dashboard — student detail sheet' },
  { src: screenshot3, alt: 'Pass Console — pass request history' },
]

export default function ProductDeliveredCard() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const goToPrev = () => {
    setActiveIndex((i) => (i - 1 + screenshots.length) % screenshots.length)
  }

  const goToNext = () => {
    setActiveIndex((i) => (i + 1) % screenshots.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.badge}>
            <GlassBadge icon={Box} size={52} />
          </div>

          <h1 className={styles.title}>Product Delivered</h1>
          <div className={styles.rule} />

          <p className={styles.description}>
            Production screens built on top of the Flutter platform.
          </p>

          <button
            type="button"
            className={styles.hint}
            onClick={() => setIsLightboxOpen(true)}
          >
            <Maximize2 size={11} strokeWidth={2} />
            Click to enlarge
          </button>
        </div>

        <div className={styles.right}>
          <div className={styles.galleryRow}>
            <button
              type="button"
              className={styles.navButton}
              onClick={goToPrev}
              aria-label="Show previous screenshot"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>

            <div className={styles.stack}>
              <div className={styles.activeGlow} />

              {screenshots.map((shot, index) => {
                const offset = (index - activeIndex + screenshots.length) % screenshots.length
                const isActive = offset === 0
                const positionClass = isActive
                  ? styles.stackCenter
                  : offset === 1
                    ? styles.stackRight
                    : styles.stackLeft

                return (
                  <img
                    key={shot.src}
                    src={shot.src}
                    alt={shot.alt}
                    className={`${styles.screenshot} ${positionClass}`}
                    {...(isActive
                      ? {
                          role: 'button',
                          tabIndex: 0,
                          onClick: () => setIsLightboxOpen(true),
                          onKeyDown: (e: KeyboardEvent<HTMLImageElement>) => {
                            if (e.key === 'Enter' || e.key === ' ') setIsLightboxOpen(true)
                          },
                          'aria-label': `Enlarge screenshot: ${shot.alt}`,
                        }
                      : {})}
                  />
                )
              })}
            </div>

            <button
              type="button"
              className={styles.navButton}
              onClick={goToNext}
              aria-label="Show next screenshot"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>

          <div className={styles.dots}>
            {screenshots.map((shot, index) => (
              <button
                key={shot.src}
                type="button"
                className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show screenshot ${index + 1} of ${screenshots.length}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <ScreenshotLightbox
          src={screenshots[activeIndex].src}
          alt={screenshots[activeIndex].alt}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </motion.div>
  )
}
