import { motion } from 'framer-motion'
import styles from './CarouselDots.module.css'

interface CarouselDotsProps {
  count: number
  activeIndex: number
  onSelect: (index: number) => void
}

export default function CarouselDots({ count, activeIndex, onSelect }: CarouselDotsProps) {
  return (
    <div className={styles.dots} role="tablist" aria-label="Screenshot pagination">
      {Array.from({ length: count }, (_, i) => {
        const isActive = i === activeIndex
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to screenshot ${i + 1}`}
            className={styles.dotButton}
            onClick={() => onSelect(i)}
          >
            <motion.span
              className={styles.dot}
              animate={{ width: isActive ? 8 : 4, height: isActive ? 8 : 4 }}
              transition={{ type: 'spring', stiffness: 280, damping: 32, mass: 0.9 }}
              style={{ backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-white-a22)' }}
            />
          </button>
        )
      })}
    </div>
  )
}
