import { useId } from 'react'
import type { LucideIcon } from 'lucide-react'
import styles from './GlassBadge.module.css'

interface GlassBadgeProps {
  icon: LucideIcon
  size?: number
  color?: string
}

/**
 * Wraps any Lucide icon with the premium SVG glassmorphism ring treatment:
 * outer gradient ring + inner ring + radial glow + top-left specular highlight.
 * The Lucide icon is overlaid in the centre via HTML so it stays crisp.
 */
export default function GlassBadge({ icon: Icon, size = 52, color = 'var(--color-primary)' }: GlassBadgeProps) {
  const uid = useId().replace(/:/g, '')

  const ids = {
    bgGlow:   `${uid}bg`,
    ringGrad: `${uid}rg`,
    bgBlur:   `${uid}bb`,
    ringGlow: `${uid}gl`,
    hlBlur:   `${uid}hl`,
  }

  // All geometry is expressed in the 120×120 viewBox, then scaled via size prop
  const C       = 60
  const outerR  = 54
  const innerR  = 46

  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      {/* SVG layer — rings, glow, glass background */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
      >
        <defs>
          <radialGradient id={ids.bgGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
            <stop offset="55%"  stopColor={color} stopOpacity="0.06" />
            <stop offset="100%" stopColor={color} stopOpacity="0"    />
          </radialGradient>

          <linearGradient
            id={ids.ringGrad}
            x1="108" y1="12"
            x2="12"  y2="108"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor={color} stopOpacity="1"    />
            <stop offset="50%"  stopColor={color} stopOpacity="0.6"  />
            <stop offset="100%" stopColor={color} stopOpacity="0.04" />
          </linearGradient>

          <filter id={ids.bgBlur} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="14" />
          </filter>

          <filter id={ids.ringGlow} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={ids.hlBlur} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Soft radial glow blob */}
        <circle
          cx={C} cy={C} r={outerR + 8}
          fill={`url(#${ids.bgGlow})`}
          filter={`url(#${ids.bgBlur})`}
        />

        {/* Dark glass fill */}
        <circle cx={C} cy={C} r={outerR} className={styles.glassFill} fillOpacity="0.93" />

        {/* Outer ring — gradient stroke + glow */}
        <circle
          cx={C} cy={C} r={outerR}
          stroke={`url(#${ids.ringGrad})`}
          strokeWidth="1.2"
          filter={`url(#${ids.ringGlow})`}
        />

        {/* Inner ring — thinner, very low opacity */}
        <circle
          cx={C} cy={C} r={innerR}
          stroke={color}
          strokeWidth="0.6"
          strokeOpacity="0.18"
        />

        {/* Top-left specular highlight (10–11 o'clock shine) */}
        <circle
          cx={26} cy={21} r={11}
          fill={color}
          fillOpacity="0.2"
          filter={`url(#${ids.hlBlur})`}
        />
      </svg>

      {/* Lucide icon — centred on top of the SVG layer */}
      <div className={styles.iconLayer}>
        <Icon
          size={Math.round(size * 0.38)}
          color={color}
          strokeWidth={1.5}
          style={{ filter: `drop-shadow(0 0 4px ${color}cc)` }}
        />
      </div>
    </div>
  )
}
