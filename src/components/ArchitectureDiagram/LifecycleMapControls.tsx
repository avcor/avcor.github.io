import { motion } from 'framer-motion'
import { MousePointerClick, Minus, Plus, RotateCcw } from 'lucide-react'
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

/** Zoom buttons plus the "drag to pan" hint overlaid on a lifecycle map. */
export default function LifecycleMapControls({
  isZoomed,
  canZoomIn,
  canZoomOut,
  zoomIn,
  zoomOut,
  reset,
}: LifecycleMapControlsProps) {
  return (
    <>
      <motion.div
        className={styles.zoomControls}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
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
          <button type="button" className={styles.zoomButton} onClick={reset} aria-label="Reset view">
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
      </motion.div>

      <motion.div
        className={styles.hint}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: 0.1, ease: easeOut }}
      >
        <MousePointerClick size={16} strokeWidth={2} />
        Drag to pan
      </motion.div>
    </>
  )
}
