import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import styles from './FitToViewport.module.css'

const DESKTOP_QUERY = '(min-width: 1025px)'

function subscribe(callback: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  )
}

interface FitToViewportProps {
  designHeight: number
  children: ReactNode
}

export default function FitToViewport({ designHeight, children }: FitToViewportProps) {
  const isDesktop = useIsDesktop()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    if (!isDesktop) return
    const viewport = viewportRef.current
    if (!viewport) return

    const recalc = () => {
      setScale(Math.min(1, viewport.clientHeight / designHeight))
    }

    recalc()

    const resizeObserver = new ResizeObserver(recalc)
    resizeObserver.observe(viewport)
    return () => resizeObserver.disconnect()
  }, [designHeight, isDesktop])

  // Below 1024px the page switches to a natural stacked, scrollable layout
  // (see FlutterCaseStudyPage/PlatformEngineeringPage responsive rules) —
  // the fixed-canvas scale-to-fit trick is a desktop-only "locked screen" concern.
  if (!isDesktop) return <>{children}</>

  return (
    <div ref={viewportRef} className={styles.viewport}>
      {/* Widen the canvas by 1/scale so that after scale-to-fit-height it lands
          exactly on the viewport width — content fills both gutters, not just the
          left. Fixed-px elements render identically; fluid ones fill the extra. */}
      <div
        className={styles.canvas}
        style={{ height: designHeight, width: `${100 / scale}%`, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}
