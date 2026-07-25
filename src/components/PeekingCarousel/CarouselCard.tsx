import { memo } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { CarouselItem } from './peekingCarousel.types'
import styles from './CarouselCard.module.css'

interface CarouselCardProps {
  item: CarouselItem
  position: -1 | 0 | 1
  step: number
  dragX: MotionValue<number>
  reducedMotion: boolean
  onSelect: () => void
  measureRef?: React.RefObject<HTMLDivElement | null>
}

function CarouselCard({ item, position, step, dragX, reducedMotion, onSelect, measureRef }: CarouselCardProps) {
  const isActive = position === 0

  // `offset` is this card's live on-screen x — its resting slot plus
  // whatever the shared drag is currently doing. `progress` (0 = centered,
  // 1 = a full step away) drives a continuous fade/scale/blur as it slides,
  // instead of the two states just snapping at the moment the index commits.
  const offset = useTransform(dragX, (v) => position * step + v)
  const progress = useTransform(offset, (v) => (step === 0 ? (isActive ? 0 : 1) : clamp01(Math.abs(v) / step)))

  const scale = useTransform(progress, [0, 1], [1, 0.92])
  const opacity = useTransform(progress, [0, 1], [1, 0.4])
  const blur = useTransform(progress, [0, 1], [0, 2])
  const brightness = useTransform(progress, [0, 1], [1, 0.75])
  const filter = useTransform([blur, brightness], (values) => {
    const [b, br] = values as number[]
    return `blur(${b}px) brightness(${br})`
  })

  return (
    <motion.div
      ref={measureRef}
      className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
      style={{
        x: offset,
        scale: reducedMotion ? (isActive ? 1 : 0.92) : scale,
        opacity: reducedMotion ? (isActive ? 1 : 0.4) : opacity,
        filter: reducedMotion ? undefined : filter,
        zIndex: isActive ? 2 : 1,
      }}
      role="group"
      aria-roledescription="slide"
      aria-label={item.alt}
      aria-current={isActive}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
    >
      <img src={item.src} alt={item.alt} className={styles.image} loading="lazy" decoding="async" />
    </motion.div>
  )
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

export default memo(CarouselCard)
