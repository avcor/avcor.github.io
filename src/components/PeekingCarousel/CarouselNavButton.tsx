import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './CarouselNavButton.module.css'

interface CarouselNavButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled: boolean
}

export default function CarouselNavButton({ direction, onClick, disabled }: CarouselNavButtonProps) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight

  return (
    <button
      type="button"
      className={`${styles.button} ${styles[direction]}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous screenshot' : 'Next screenshot'}
    >
      <Icon size={20} strokeWidth={2} />
    </button>
  )
}
