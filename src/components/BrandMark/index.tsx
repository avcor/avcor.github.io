import { useId } from 'react'

interface BrandMarkProps {
  size?: number
  className?: string
}

/**
 * Abstract mark: two interlocking angular strokes, an ascending peak and a
 * descending valley, standing in for "AV" without literal letterforms. The
 * ascent sits behind at the idle wire tone, the descent glows in front at
 * the primary accent, the same idle-vs-lit duality used throughout the
 * circuit board (see CircuitCenterCard).
 */
export default function BrandMark({ size = 28, className }: BrandMarkProps) {
  const uid = useId().replace(/:/g, '')
  const glowId = `${uid}glow`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ascending stroke: idle tone, behind */}
      <path
        d="M6 24 L16 8 L26 24"
        stroke="var(--color-idle-glow)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.55"
      />

      {/* Descending stroke: primary accent, in front, glowing */}
      <path
        d="M6 8 L16 24 L26 8"
        stroke="var(--color-primary)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />
    </svg>
  )
}
