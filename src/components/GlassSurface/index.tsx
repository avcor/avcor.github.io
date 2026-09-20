import { useEffect, useRef, type ReactNode } from 'react'
import LiquidGlass from 'liquid-glass-react'
import { GLASS } from '../../config/glass'
import styles from './GlassSurface.module.css'

/**
 * Pins the cursor input the library reacts to. Passing both mouse props stops
 * it attaching a mousemove listener per surface, so the glass never leans,
 * stretches or shifts its rim highlight toward the pointer: it stays where it
 * is drawn. `elasticity` is held at 0 to match, since a non-zero value would
 * turn this fixed position into a constant offset instead of movement.
 */
const STATIC_CURSOR = { x: 0, y: 0 }

interface GlassSurfaceProps {
  children: ReactNode
  /** Matches the radius of whatever sits inside, in pixels. */
  cornerRadius?: number
  /** Inset around the child. Defaults to none: the child keeps its own. */
  padding?: string
  className?: string
}

/**
 * Wraps any element in a liquid glass surface, with the look taken from
 * `config/glass.ts`. This is the only place `liquid-glass-react` is mounted,
 * so its two rendering quirks are handled once here rather than per button:
 * the five layers it emits are stacked into one grid cell, and its blended
 * rim spans are forced back to normal blending (see the CSS for why).
 *
 * The glass sizes itself to its child, so the child keeps its own padding,
 * height and typography and only drops its background, border and blur.
 *
 * One constraint on callers: do not run a `scale` animation on anything that
 * wraps a surface. The library sizes its layers from `getBoundingClientRect`,
 * which is a scaled measurement, so a surface that mounts mid-scale fits its
 * rim and refraction to the scaled size and keeps that size afterwards. Fade
 * a glass surface in, or move it, but do not scale it.
 */
export default function GlassSurface({
  children,
  cornerRadius = 9999,
  padding = '0',
  className = '',
}: GlassSurfaceProps) {
  const shellRef = useRef<HTMLDivElement>(null)

  // The library measures the glass once on mount and then only on a window
  // resize, so a surface whose content changes size (the zoom bar gaining its
  // reset button, Share becoming "Link copied") keeps drawing its rim and its
  // refraction at the old width. Watching the shell and firing the event the
  // library already listens for is what keeps the surface fitted to its
  // content.
  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    let lastWidth = shell.offsetWidth
    let lastHeight = shell.offsetHeight
    let frame = 0

    const observer = new ResizeObserver(() => {
      const { offsetWidth, offsetHeight } = shell
      if (offsetWidth === lastWidth && offsetHeight === lastHeight) return
      lastWidth = offsetWidth
      lastHeight = offsetHeight
      // Deferred to the next frame, so the re-measure it triggers is never
      // delivered inside this observer's own callback.
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
    })

    observer.observe(shell)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={shellRef} className={`${styles.shell} ${className}`}>
      <LiquidGlass
        className={styles.glass}
        cornerRadius={cornerRadius}
        padding={padding}
        elasticity={0}
        globalMousePos={STATIC_CURSOR}
        mouseOffset={STATIC_CURSOR}
        {...GLASS}
      >
        {children}
      </LiquidGlass>
    </div>
  )
}
