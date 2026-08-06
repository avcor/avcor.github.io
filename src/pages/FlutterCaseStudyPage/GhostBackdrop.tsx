import styles from './GhostBackdrop.module.css'

/**
 * Full-width watermark behind the case study's first row. "Platform" is
 * right-aligned (over the phone/gallery side) and "Flutter" is left-aligned
 * (over the heading side), forming a diagonal that spans the row.
 *
 * The 1200×540 viewBox gives the row-wide proportions; `preserveAspectRatio`
 * keeps the type undistorted and always fully visible, scaling to fit the row.
 */
export default function GhostBackdrop() {
  return (
    <svg
      className={styles.ghost}
      viewBox="0 0 1200 540"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <text
        className={styles.ghostText}
        x="1160"
        y="200"
        fontSize="210"
        textAnchor="end"
        dominantBaseline="middle"
      >
        Platform
      </text>
      <text
        className={styles.ghostText}
        x="40"
        y="390"
        fontSize="210"
        textAnchor="start"
        dominantBaseline="middle"
      >
        Flutter
      </text>
    </svg>
  )
}
