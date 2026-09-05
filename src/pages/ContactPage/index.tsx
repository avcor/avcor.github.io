import ContactLeftPanel from './ContactLeftPanel'
import DottedWorldMap from '../../components/DottedWorldMap'
import { MAP_DOT_COLORS } from '../../config/mapColors'
import avMonogram from '../../assets/av-monogram.png'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  return (
    <section id="contact" className={styles.page}>
      <div className={styles.content}>
        <ContactLeftPanel />

        <div className={styles.mapColumn}>
          <DottedWorldMap
            density="medium"
            dotRadius={0.2}
            edgeFade={0}
            edgeMinScale={0.8}
            edgeMinOpacity={0.9}
            fadeSteps={10}
            dotColor={MAP_DOT_COLORS.bright}
            landOpacity={0.55}
            metallic={false}
            accent={MAP_DOT_COLORS.mapAccent}
            markers={[{ id: 'del', label: 'New Delhi', lat: 28.6139, lng: 77.209 }]}
            connections={[]}
            showLabels={false}
            animate
            preserveAspectRatio="xMidYMid slice"
          />
        </div>
      </div>

      <img src={avMonogram} alt="AV monogram" className={styles.monogram} />
    </section>
  )
}
