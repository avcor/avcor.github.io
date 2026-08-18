import { DEEP_DIVE_PANELS } from './deepDiveData'
import styles from './SectionStepper.module.css'

interface SectionStepperProps {
  activeIndex: number
  onChange: (index: number) => void
}

export default function SectionStepper({ activeIndex, onChange }: SectionStepperProps) {
  return (
    <div className={styles.stepper} role="tablist" aria-label="Deep dive sections">
      {DEEP_DIVE_PANELS.map((panel, i) => (
        <button
          key={panel.id}
          type="button"
          role="tab"
          aria-selected={activeIndex === i}
          data-active={activeIndex === i || undefined}
          className={styles.step}
          onClick={() => onChange(i)}
        >
          <span className={styles.index}>{panel.index}</span>
          <span className={styles.label}>{panel.eyebrow}</span>
        </button>
      ))}
    </div>
  )
}
