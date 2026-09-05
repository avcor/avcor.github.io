import ContactLeftPanel from './ContactLeftPanel'
import DottedWorldMap from '../../components/DottedWorldMap'
import { MAP_DOT_COLORS } from '../../config/mapColors'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  return (
    <section id="contact" className={styles.page}>
      <div className={styles.content}>
        <ContactLeftPanel />

        <div className={styles.mapColumn}>
          <DottedWorldMap
            className={styles.map}
            density="medium"
            dotRadius={0.2}
            edgeFade={0}
            edgeMinScale={0.7}
            edgeMinOpacity={1}
            fadeSteps={8}
            dotColor={MAP_DOT_COLORS.bright}
            metallic={false}
            accent="var(--color-primary)"
            markers={[]}
            connections={[]}
            showLabels={false}
            animate
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      </div>
    </section>
  )
}
