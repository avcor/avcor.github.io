export interface ClockIconIds {
  bgGlow: string
  ringGrad: string
  bgBlur: string
  ringGlow: string
  hlBlur: string
  iconGlow: string
}

interface ClockIconDefsProps {
  ids: ClockIconIds
  color: string
}

/** Gradients and blur filters for {@link ClockIcon}. Kept in its own file so
 *  the icon's shape markup stays readable and under the component size limit. */
export default function ClockIconDefs({ ids, color }: ClockIconDefsProps) {
  return (
    <defs>
      {/* ── Soft radial glow behind the rings ────────────────────────── */}
      <radialGradient id={ids.bgGlow} cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
        <stop offset="55%"  stopColor={color} stopOpacity="0.06" />
        <stop offset="100%" stopColor={color} stopOpacity="0"    />
      </radialGradient>

      {/* ── Outer ring stroke gradient (top-right to bottom-left) ─────── */}
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

      {/* ── Top-left highlight blur (10 to 11 o'clock shine) ──────────── */}
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
  )
}
