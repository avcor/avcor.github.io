import { useId } from 'react'

interface ClockIconProps {
  size?: number
  color?: string
  className?: string
}

export default function ClockIcon({
  size = 120,
  color = 'var(--color-primary)',
  className,
}: ClockIconProps) {
  // Unique prefix so multiple instances don't share filter/gradient IDs
  const uid = useId().replace(/:/g, '')

  const C = 60       // centre of the 120×120 viewBox
  const outerR = 54  // outer ring radius
  const innerR = 46  // inner ring radius
  const clockR = 18  // clock-face radius

  const ids = {
    bgGlow:      `${uid}bg`,
    ringGrad:    `${uid}rg`,
    bgBlur:      `${uid}bb`,
    ringGlow:    `${uid}gl`,
    hlBlur:      `${uid}hl`,
    iconGlow:    `${uid}ig`,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* ── Soft radial glow behind the rings ────────────────────────── */}
        <radialGradient id={ids.bgGlow} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
          <stop offset="55%"  stopColor={color} stopOpacity="0.06" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </radialGradient>

        {/* ── Outer ring stroke gradient (top-right → bottom-left) ─────── */}
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

        {/* ── Background glow blur ──────────────────────────────────────── */}
        <filter id={ids.bgBlur} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>

        {/* ── Ring glow: blur + composite over source ───────────────────── */}
        <filter id={ids.ringGlow} x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ── Top-left highlight blur (10–11 o'clock shine) ─────────────── */}
        <filter id={ids.hlBlur} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" />
        </filter>

        {/* ── Clock icon glow ───────────────────────────────────────────── */}
        <filter id={ids.iconGlow} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Soft background radial glow ──────────────────────────────────── */}
      <circle
        cx={C} cy={C} r={outerR + 8}
        fill={`url(#${ids.bgGlow})`}
        filter={`url(#${ids.bgBlur})`}
      />

      {/* ── Dark glass background circle ─────────────────────────────────── */}
      <circle cx={C} cy={C} r={outerR} fill="var(--color-bg-glass)" fillOpacity="0.93" />

      {/* ── Outer ring — gradient stroke + glow ──────────────────────────── */}
      <circle
        cx={C} cy={C} r={outerR}
        stroke={`url(#${ids.ringGrad})`}
        strokeWidth="1.2"
        filter={`url(#${ids.ringGlow})`}
      />

      {/* ── Inner ring — thinner, very low opacity ────────────────────────── */}
      <circle
        cx={C} cy={C} r={innerR}
        stroke={color}
        strokeWidth="0.6"
        strokeOpacity="0.18"
      />

      {/* ── Top-left specular highlight (≈ 10–11 o'clock) ────────────────── */}
      <circle
        cx={26} cy={21} r={11}
        fill={color}
        fillOpacity="0.2"
        filter={`url(#${ids.hlBlur})`}
      />

      {/* ── Clock face circle ─────────────────────────────────────────────── */}
      <circle
        cx={C} cy={C} r={clockR}
        stroke={color}
        strokeWidth="1.4"
        strokeOpacity="0.9"
        strokeLinejoin="round"
        filter={`url(#${ids.iconGlow})`}
      />

      {/* ── Hour hand  (≈ 12 o'clock) ────────────────────────────────────── */}
      <line
        x1={C}     y1={C}
        x2={C - 1} y2={C - 11}
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.9"
        filter={`url(#${ids.iconGlow})`}
      />

      {/* ── Minute hand (≈ 3 o'clock) ────────────────────────────────────── */}
      <line
        x1={C}      y1={C}
        x2={C + 13} y2={C}
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.9"
        filter={`url(#${ids.iconGlow})`}
      />
    </svg>
  )
}
