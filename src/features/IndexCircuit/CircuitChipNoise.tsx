import { useId } from 'react'
import type { CircuitDomain } from './circuitData'
import styles from './IndexCircuit.module.css'

interface CircuitChipNoiseProps {
  rect: CircuitDomain['rect']
}

/**
 * A static green noise texture over a hovered domain chip's own box, built
 * from a feTurbulence field tinted green and clipped to the chip's shape.
 * Additively blended (screen) like the rest of the neon treatment.
 */
export default function CircuitChipNoise({ rect }: CircuitChipNoiseProps) {
  const filterId = useId()
  const clipId = useId()

  return (
    <g className={styles.chipNoise} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx={rect.rx} />
        </clipPath>
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="2" seed="4" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.24
                    0 0 0 0 0.86
                    0 0 0 0 0.52
                    0 0 0 0.22 0"
          />
        </filter>
      </defs>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        clipPath={`url(#${clipId})`}
        filter={`url(#${filterId})`}
        className={styles.chipNoiseLayer}
      />
    </g>
  )
}
