import styles from './GhostBackdrop.module.css'

/**
 * Decorative "Platform / Flutter" watermark behind the case study's first row.
 * "Platform" hugs the top-right corner (over the phone/gallery side) and
 * "Flutter" the bottom-left corner (over the heading side), forming a diagonal.
 *
 * Each word is anchored to its own corner with fluid CSS (relative padding +
 * container-query font sizing), so it adapts to any row size or aspect ratio
 * without hard-coded pixel dimensions — see GhostBackdrop.module.css.
 */
export default function GhostBackdrop() {
  return (
    <div className={styles.ghost} aria-hidden="true">
      <span className={`${styles.word} ${styles.platform}`}>Platform</span>
      <span className={`${styles.word} ${styles.flutter}`}>Flutter</span>
    </div>
  )
}
