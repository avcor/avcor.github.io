import { motion } from 'framer-motion'
import { Hand, MousePointerClick, Minus, Plus, RotateCcw } from 'lucide-react'
import { useCanHover } from '../../hooks/useCanHover'
import GlassSurface from '../GlassSurface'
import styles from './LifecycleMap.module.css'

interface LifecycleMapControlsProps {
  isZoomed: boolean
  canZoomIn: boolean
  canZoomOut: boolean
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
}

const easeOut = [0.16, 1, 0.3, 1] as const

/** Zoom buttons plus the "click a node / drag to pan" hint overlaid on a
 *  lifecycle map. */
export default function LifecycleMapControls({
  isZoomed,
  canZoomIn,
  canZoomOut,
  zoomIn,
  zoomOut,
  reset,
}: LifecycleMapControlsProps) {
  const canHover = useCanHover()

  return (
    <>
      <motion.div
        className={styles.zoomSlot}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        <GlassSurface padding="4px">
          <div className={styles.zoomControls}>
            <button
              type="button"
              className={styles.zoomButton}
              onClick={zoomOut}
              disabled={!canZoomOut}
              aria-label="Zoom out"
            >
              <Minus size={16} strokeWidth={2} />
            </button>
            {isZoomed && (
              <button
                type="button"
                className={styles.zoomButton}
                onClick={reset}
                aria-label="Reset view"
              >
                <RotateCcw size={15} strokeWidth={2} />
              </button>
            )}
            <button
              type="button"
              className={styles.zoomButton}
              onClick={zoomIn}
              disabled={!canZoomIn}
              aria-label="Zoom in"
            >
              <Plus size={16} strokeWidth={2} />
            </button>
          </div>
        </GlassSurface>
      </motion.div>

      <motion.div
        className={styles.hintSlot}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: 0.1, ease: easeOut }}
      >
        <GlassSurface>
          <div className={styles.hint}>
            <MousePointerClick size={16} strokeWidth={2} className={styles.hintIcon} />
            {canHover ? 'Click' : 'Tap'} a node for details
            <span className={styles.hintSeparator} aria-hidden="true">·</span>
            <Hand size={16} strokeWidth={2} className={styles.hintIcon} />
            Drag to pan
          </div>
        </GlassSurface>
      </motion.div>
    </>
  )
}
