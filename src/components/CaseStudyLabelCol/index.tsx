import styles from './CaseStudyLabelCol.module.css'

interface CaseStudyLabelColProps {
  /** Engineering domain from the index circuit (e.g. "Platform", "Security"). */
  category: string
  /** Case study name, matches the circuit pill's label. */
  name: string
}

/** Sticky vertical tag mirroring the spy rail on the opposite edge of every
 *  case study gallery: which domain this case study belongs to, and its name. */
export default function CaseStudyLabelCol({ category, name }: CaseStudyLabelColProps) {
  return (
    <aside className={styles.labelCol}>
      <span className={styles.verticalLabel}>
        <span className={styles.category}>{category}</span>
        <span className={styles.dot}>/</span>
        {name}
      </span>
    </aside>
  )
}
