import styles from './VerticalLabel.module.css'

interface VerticalLabelProps {
  text: string
}

export default function VerticalLabel({ text }: VerticalLabelProps) {
  const words = text.split(' ')

  return (
    <div className={styles.label} aria-hidden="true">
      {words.map((word, i) => (
        <span key={i} className={styles.word}>
          {word}
        </span>
      ))}
    </div>
  )
}
