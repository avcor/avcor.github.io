import { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, ChevronLeft, ChevronRight } from 'lucide-react'
import screenshot1 from '../../assets/screenshots/access-management-dashboard.jpg'
import screenshot2 from '../../assets/screenshots/access-management-dashboard-2.jpg'
import screenshot3 from '../../assets/screenshots/pass-console.jpg'
import styles from './ProductDeliveredCard.module.css'

const screenshots = [
  { src: screenshot1, alt: 'Access Management Dashboard — hosteller list' },
  { src: screenshot2, alt: 'Access Management Dashboard — student detail sheet' },
  { src: screenshot3, alt: 'Pass Console — pass request history' },
]

export default function ProductDeliveredCard() {
  const [activeIndex, setActiveIndex] = useState(0)

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
            <Box size={24} strokeWidth={1.75} />
          </div>

          <h1 className={styles.title}>Product Delivered</h1>
          <div className={styles.rule} />

          <p className={styles.description}>
            Production screens built on top of the Flutter platform.
          </p>
        </div>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.navButton}
            onClick={goToPrev}
            aria-label="Show previous screenshot"
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>

          <div className={styles.stack}>
            {screenshots.map((shot, index) => {
              const offset = (index - activeIndex + screenshots.length) % screenshots.length
              const positionClass =
                offset === 0
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
      </div>
    </motion.div>
  )
}
