import ContactLeftPanel from './ContactLeftPanel'
import DottedWorldMap from '../../components/DottedWorldMap'
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
            dotRadius={0.38}
            edgeFade={2}
            edgeMinScale={0.3}
            edgeMinOpacity={0.4}
            fadeSteps={8}
            dotColor="var(--color-white-a25)"
            metallic={false}
            accent="var(--color-primary)"
            markers={[]}
            connections={[]}
            showLabels={false}
            animate
          />
        </div>
      </div>
    </section>
  )
}
