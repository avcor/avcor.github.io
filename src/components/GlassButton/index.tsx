import type { MouseEvent, ReactNode } from 'react'
import GlassSurface from '../GlassSurface'
import styles from './GlassButton.module.css'

interface GlassButtonProps {
  children: ReactNode
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  /** Matches the radius the button used to carry, in pixels. */
  cornerRadius?: number
  /** Styles the button itself: size, typography, color. Not its surface. */
  className?: string
  ariaLabel?: string
  ariaCurrent?: boolean
  title?: string
}

/**
 * A button whose surface is liquid glass instead of a CSS blur. The caller
 * still owns size, padding, typography and color through `className`; the
 * glass replaces the background, border, blur and shadow it used to set.
 */
export default function GlassButton({
  children,
  onClick,
  disabled = false,
  cornerRadius = 9999,
  className = '',
  ariaLabel,
  ariaCurrent,
  title,
}: GlassButtonProps) {
  return (
    <GlassSurface cornerRadius={cornerRadius}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-current={ariaCurrent ? 'true' : undefined}
        title={title}
        className={`${styles.button} ${className}`}
      >
        {children}
      </button>
    </GlassSurface>
  )
}
