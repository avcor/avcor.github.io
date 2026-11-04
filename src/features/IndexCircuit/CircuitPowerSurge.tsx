import { AnimatePresence, motion } from 'framer-motion'
import CircuitWirePulse from './CircuitWirePulse'
import { CIRCUIT_WIRES } from './circuitData'
import { cubicBezier } from './cubicBezier'
import { DOMAIN_ARRIVAL_S, POWER_ON, isTrunkWire } from './circuitPowerOn'
import styles from './IndexCircuit.module.css'

interface CircuitPowerSurgeProps {
  surging: boolean
}

const SURGE_LAYERS = ['surgeHalo', 'surgeCore'] as const

/** framer-motion's 'easeInOut', so the pulse head rides exactly on the
 *  trail's leading edge */
const EASE_IN_OUT = cubicBezier(0.42, 0, 0.58, 1)

/** Every wire is drawn leaf → chip → center, so revealing each one from
 *  its end (pathOffset 1 → 0 while pathLength 0 → 1) reads as current
 *  flowing outward from the center chip. */
const DRAW_FROM_END = {
  initial: { pathLength: 0, pathOffset: 1 },
  animate: { pathLength: 1, pathOffset: 0 },
}

/** The board's power-on current: green trails that draw out from the
 *  center chip along every trunk, then on along every branch to its leaf,
 *  then fade back to the idle board. The hover pulse head leads each
 *  trail, splitting at the domain chips onto their branches. */
export default function CircuitPowerSurge({ surging }: CircuitPowerSurgeProps) {
  return (
    <AnimatePresence>
      {surging && (
        <motion.g
          key="surge"
          className={styles.activeWire}
          aria-hidden="true"
          pointerEvents="none"
          /* Explicit enter values give the exit fade a tracked opacity to
           * animate from; without them it snaps straight to 0 */
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: POWER_ON.fadeOut } }}
        >
          {CIRCUIT_WIRES.map((wire) => {
            const trunk = isTrunkWire(wire)
            const transition = {
              delay: trunk ? POWER_ON.trunkDelay : DOMAIN_ARRIVAL_S,
              duration: trunk ? POWER_ON.trunkDuration : POWER_ON.branchDuration,
              ease: 'easeInOut' as const,
            }
            return (
              <g key={wire.id}>
                {SURGE_LAYERS.map((layer) => (
                  <motion.path
                    key={layer}
                    d={wire.d}
                    className={styles[layer]}
                    {...DRAW_FROM_END}
                    transition={transition}
                  />
                ))}
                <CircuitWirePulse
                  d={wire.d}
                  pulseKey={`surge-${wire.id}`}
                  reverse
                  repeat={false}
                  delay={transition.delay * 1000}
                  duration={transition.duration * 1000}
                  ease={EASE_IN_OUT}
                />
              </g>
            )
          })}
        </motion.g>
      )}
    </AnimatePresence>
  )
}
