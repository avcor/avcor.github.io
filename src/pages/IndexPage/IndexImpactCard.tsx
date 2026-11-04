import { MousePointerClick } from 'lucide-react'
import { useCanHover } from '../../hooks/useCanHover'
import styles from './IndexImpactCard.module.css'

/** How to use the circuit board. Stays on screen after the one-time click
 *  demo has played, and is the only hint on touch screens. */
export default function IndexImpactCard() {
  const canHover = useCanHover()

  return (
    <div className={styles.card}>
      <div className={styles.inner}>

        <div className={styles.iconCircle}>
          <MousePointerClick size={16} strokeWidth={1.5} className={styles.icon} />
        </div>

        <p className={styles.body}>
          {canHover && (
            <>
              Hover a chip to trace its wiring.
              <br />
            </>
          )}
          {canHover ? 'Click' : 'Tap'} a case study to{' '}
          <span className={styles.emphasis}>open it.</span>
        </p>

      </div>
    </div>
  )
}
