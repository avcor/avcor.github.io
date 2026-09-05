import worldMap from '../../assets/world-map-dots.png'
import styles from './WorldMapDots.module.css'

/** Quiet dot-matrix world map, a background texture behind the contact
 *  content. Desaturated and dimmed via CSS to stay on-theme and never
 *  compete with the heading or links. */
export default function WorldMapDots() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <img src={worldMap} alt="" className={styles.map} />
    </div>
  )
}
