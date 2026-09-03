import styles from './LifecycleMap.module.css'

interface LifecycleMapDefsProps {
  roughId: string
  arrowId: string
  dotId: string
  filterRect: { x: number; y: number; width: number; height: number }
}

/** SVG filter (hand-drawn roughen) and the arrow/dot markers for a lifecycle
 *  map. Ids are passed in so each map instance keeps its own, non-colliding
 *  set when several render at once. */
export default function LifecycleMapDefs({
  roughId,
  arrowId,
  dotId,
  filterRect,
}: LifecycleMapDefsProps) {
  return (
    <defs>
      {/* Roughen: displace edges with fractal noise for a hand-drawn wobble. */}
      <filter
        id={roughId}
        filterUnits="userSpaceOnUse"
        x={filterRect.x}
        y={filterRect.y}
        width={filterRect.width}
        height={filterRect.height}
      >
        <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      {/* Sketchy open arrowhead, rotated along each connector. */}
      <marker id={arrowId} viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M1.5 1.5 L8 5 L1.5 8.5" className={styles.arrow} />
      </marker>

      {/* Plain dot terminator, pipeline continuation / always-on links
       *  that aren't a state transition, so no directional arrowhead. */}
      <marker id={dotId} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4.5" markerHeight="4.5">
        <circle cx="5" cy="5" r="3.4" className={styles.dot} />
      </marker>
    </defs>
  )
}
