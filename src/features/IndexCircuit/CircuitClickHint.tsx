import { AnimatePresence, motion } from 'framer-motion'
import type { ClickHintStep } from '../../hooks/useCircuitClickHint'
import { CIRCUIT_VIEWBOX } from './circuitData'
import styles from './CircuitClickHint.module.css'

interface Point {
  x: number
  y: number
}

interface CircuitClickHintProps {
  step: ClickHintStep
  /** Ripple center on the target leaf, in viewBox units */
  clickAt: Point
  /** Bottom-center anchor for the label, in viewBox units */
  labelAt: Point
  label: string
}

const [, , VIEWBOX_WIDTH, VIEWBOX_HEIGHT] = CIRCUIT_VIEWBOX.split(' ').map(Number)
const ease = [0.16, 1, 0.3, 1] as const

/** Maps a viewBox point onto the board as percentages. Rendered in HTML
 *  rather than inside the stretched SVG, so the ripple stays circular. */
function placeAt({ x, y }: Point): { left: string; top: string } {
  return { left: `${(x / VIEWBOX_WIDTH) * 100}%`, top: `${(y / VIEWBOX_HEIGHT) * 100}%` }
}

/** Click ripple and label on a real leaf pill, played while the demo
 *  lights that leaf's route, teaching visitors the leaves are clickable.
 *  Decorative only, never intercepts input. */
export default function CircuitClickHint({ step, clickAt, labelAt, label }: CircuitClickHintProps) {
  const pressing = step === 'press'

  return (
    <div className={styles.layer} aria-hidden="true">
      <AnimatePresence>
        {pressing && (
          <div key="ripple" className={styles.anchor} style={placeAt(clickAt)}>
            <motion.span
              className={styles.ripple}
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', repeat: 1, repeatDelay: 0.3 }}
            />
          </div>
        )}

        {pressing && (
          <div key="label" className={styles.labelAnchor} style={placeAt(labelAt)}>
            <motion.span
              className={styles.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease }}
            >
              {label}
            </motion.span>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
