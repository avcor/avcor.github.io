import styles from './RecruiterPill.module.css'

export default function RecruiterPill() {
  return (
    <button type="button" className={styles.pill}>
      For Recruiters
      <span className={styles.dot} />
    </button>
  )
}
