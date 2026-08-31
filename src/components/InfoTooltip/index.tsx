import { Info } from 'lucide-react'
import styles from './InfoTooltip.module.css'

interface InfoTooltipProps {
  text: string
}

/** A small (i) affordance that reveals a caveat or footnote on hover/focus,
 *  for a claim that needs qualifying context without cluttering the headline. */
export default function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <span className={styles.wrapper} tabIndex={0} role="button" aria-label={text}>
      <Info size={14} strokeWidth={2} className={styles.icon} />
      <span className={styles.bubble} role="tooltip">
        {text}
      </span>
    </span>
  )
}
