import { Children } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import styles from './SlidesViewport.module.css'

interface SlidesViewportProps {
  activeIndex: number
  onChange: (index: number) => void
  children: ReactNode
}

const SWIPE_THRESHOLD = 60

export default function SlidesViewport({ activeIndex, onChange, children }: SlidesViewportProps) {
  const slides = Children.toArray(children)

  return (
    <div className={styles.viewport}>
      <motion.div
        className={styles.track}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        animate={{ x: `${-activeIndex * 100}%` }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -SWIPE_THRESHOLD && activeIndex < slides.length - 1) {
            onChange(activeIndex + 1)
          } else if (info.offset.x > SWIPE_THRESHOLD && activeIndex > 0) {
            onChange(activeIndex - 1)
          }
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} className={styles.slide}>
            {slide}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
