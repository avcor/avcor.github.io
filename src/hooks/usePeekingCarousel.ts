import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, useMotionValue, type PanInfo, type Transition } from 'framer-motion'

const GAP_PX = 24
const DRAG_COMMIT_RATIO = 0.25
const VELOCITY_THRESHOLD = 500
const WHEEL_COMMIT_PX = 60
const SPRING: Transition = { type: 'spring', stiffness: 280, damping: 32, mass: 0.9 }
const INSTANT: Transition = { duration: 0 }

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function usePeekingCarousel(itemCount: number, reducedMotion: boolean) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [step, setStep] = useState(0)
  const dragX = useMotionValue(0)
  const activeCardRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const wheelAccum = useRef(0)
  const transition = reducedMotion ? INSTANT : SPRING

  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < itemCount - 1

  // Measure the active card so a step maps to its real rendered width —
  // the card width is a responsive percentage, so px must come from the DOM.
  useLayoutEffect(() => {
    const el = activeCardRef.current
    if (!el) return

    // Reading the width right as this card's ref is handed over from the
    // previous active card can occasionally observe a stale pre-layout 0 —
    // ignore that and let the rAF fallback (or the ResizeObserver, once the
    // real size lands) settle it instead of latching a degenerate step.
    const update = () => {
      const width = el.offsetWidth
      if (width > 0) setStep(width + GAP_PX)
    }
    update()
    const raf = requestAnimationFrame(update)
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [activeIndex])

  const goTo = useCallback((target: number) => {
    const clamped = clamp(target, 0, itemCount - 1)
    const delta = clamped - activeIndex
    if (delta === 0) return

    // A single-step move slides through the drag offset so the incoming/
    // outgoing cards animate continuously; a distant jump (e.g. a far dot)
    // would need to render cards we virtualize away, so it cuts instantly.
    if (Math.abs(delta) === 1 && !reducedMotion) {
      animate(dragX, -delta * step, transition).then(() => {
        setActiveIndex(clamped)
        dragX.set(0)
      })
    } else {
      setActiveIndex(clamped)
      dragX.set(0)
    }
  }, [activeIndex, itemCount, step, dragX, transition, reducedMotion])

  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex])
  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex])

  const onDragEnd = useCallback((_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const offset = dragX.get()
    const velocity = info.velocity.x

    if ((offset < -step * DRAG_COMMIT_RATIO || velocity < -VELOCITY_THRESHOLD) && hasNext) {
      goTo(activeIndex + 1)
    } else if ((offset > step * DRAG_COMMIT_RATIO || velocity > VELOCITY_THRESHOLD) && hasPrev) {
      goTo(activeIndex - 1)
    } else {
      animate(dragX, 0, transition)
    }
  }, [dragX, step, hasNext, hasPrev, activeIndex, goTo, transition])

  // Trackpad / wheel horizontal navigation — only intercept clearly
  // horizontal intent so vertical page scroll over the carousel still works.
  // React's onWheel is passive, so preventDefault needs a native listener.
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      wheelAccum.current += e.deltaX
      if (wheelAccum.current > WHEEL_COMMIT_PX) {
        wheelAccum.current = 0
        goNext()
      } else if (wheelAccum.current < -WHEEL_COMMIT_PX) {
        wheelAccum.current = 0
        goPrev()
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [goNext, goPrev])

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    }
  }, [goPrev, goNext])

  return {
    activeIndex,
    step,
    hasPrev,
    hasNext,
    dragX,
    activeCardRef,
    viewportRef,
    goTo,
    goPrev,
    goNext,
    onDragEnd,
    onKeyDown,
  }
}
