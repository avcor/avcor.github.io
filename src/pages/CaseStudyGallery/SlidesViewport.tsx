import { Children } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import FitToViewport from '../../components/FitToViewport'
import styles from './SlidesViewport.module.css'

const SLIDE_DESIGN_HEIGHT = 900

interface SlidesViewportProps {
  activeIndex: number
  onChange: (index: number) => void
  children: ReactNode
}

export default function SlidesViewport({ activeIndex, children }: SlidesViewportProps) {
  const slides = Children.toArray(children)

  return (
    <div className={styles.viewport}>
      <motion.div
        className={styles.track}
        animate={{ x: `${-activeIndex * 100}%` }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {slides.map((slide, i) => (
          <div key={i} className={styles.slide}>
            <FitToViewport designHeight={SLIDE_DESIGN_HEIGHT}>{slide}</FitToViewport>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
