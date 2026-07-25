import { useMemo } from 'react'
import { motion, useReducedMotion, type TapInfo } from 'framer-motion'
import CarouselCard from './CarouselCard'
import CarouselDots from './CarouselDots'
import CarouselNavButton from './CarouselNavButton'
import { usePeekingCarousel } from '../../hooks/usePeekingCarousel'
import type { CarouselItem } from './peekingCarousel.types'
import styles from './PeekingCarousel.module.css'

interface PeekingCarouselProps {
  items: CarouselItem[]
  onActiveSelect?: (index: number) => void
}

/** Fraction of the viewport width, either side of center, treated as a tap on the active card. */
const CENTER_HIT_ZONE = 0.3

export default function PeekingCarousel({ items, onActiveSelect }: PeekingCarouselProps) {
  const reducedMotion = useReducedMotion()
  const {
    activeIndex, step, hasPrev, hasNext, dragX,
    activeCardRef, viewportRef, goTo, goPrev, goNext, onDragEnd, onKeyDown,
  } = usePeekingCarousel(items.length, reducedMotion ?? false)

  const visible = useMemo(() => (
    [activeIndex - 1, activeIndex, activeIndex + 1]
      .filter((i) => i >= 0 && i < items.length)
      .map((i) => ({ index: i, position: (i - activeIndex) as -1 | 0 | 1 }))
  ), [activeIndex, items.length])

  const handleTap = (_: PointerEvent, info: TapInfo) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const rect = viewport.getBoundingClientRect()
    const relativeX = (info.point.x - rect.left) / rect.width - 0.5

    if (relativeX < -CENTER_HIT_ZONE && hasPrev) goPrev()
    else if (relativeX > CENTER_HIT_ZONE && hasNext) goNext()
    else onActiveSelect?.(activeIndex)
  }

  return (
    <div className={styles.wrapper}>
      <div
        ref={viewportRef}
        className={styles.viewport}
        role="group"
        aria-roledescription="carousel"
        aria-label="Product screenshots"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {visible.map(({ index, position }) => (
          <CarouselCard
            key={items[index].src}
            item={items[index]}
            position={position}
            step={step}
            dragX={dragX}
            reducedMotion={reducedMotion ?? false}
            onSelect={() => (position === 0 ? onActiveSelect?.(index) : goTo(index))}
            measureRef={position === 0 ? activeCardRef : undefined}
          />
        ))}

        <motion.div
          className={styles.dragLayer}
          drag="x"
          dragElastic={0.12}
          dragMomentum={false}
          dragConstraints={{ left: hasNext ? -Infinity : 0, right: hasPrev ? Infinity : 0 }}
          style={{ x: dragX, touchAction: 'pan-y' }}
          onDragEnd={onDragEnd}
          onTap={handleTap}
          aria-hidden="true"
        />
      </div>

      <div className={styles.controls}>
        <CarouselNavButton direction="prev" onClick={goPrev} disabled={!hasPrev} />
        <CarouselDots count={items.length} activeIndex={activeIndex} onSelect={goTo} />
        <CarouselNavButton direction="next" onClick={goNext} disabled={!hasNext} />
      </div>
    </div>
  )
}
