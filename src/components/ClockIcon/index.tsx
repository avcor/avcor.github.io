import { useId } from 'react'
import ClockIconDefs, { type ClockIconIds } from './ClockIconDefs'

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

  const ids: ClockIconIds = {
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
      <ClockIconDefs ids={ids} color={color} />

      {/* ── Soft background radial glow ──────────────────────────────────── */}
      <circle
        cx={C} cy={C} r={outerR + 8}
        fill={`url(#${ids.bgGlow})`}
        filter={`url(#${ids.bgBlur})`}
      />

      {/* ── Dark glass background circle ─────────────────────────────────── */}
      <circle cx={C} cy={C} r={outerR} fill="var(--color-bg-glass)" fillOpacity="0.93" />

      {/* ── Outer ring, gradient stroke + glow ──────────────────────────── */}
      <circle
        cx={C} cy={C} r={outerR}
        stroke={`url(#${ids.ringGrad})`}
        strokeWidth="1.2"
        filter={`url(#${ids.ringGlow})`}
      />

      {/* ── Inner ring, thinner, very low opacity ────────────────────────── */}
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
