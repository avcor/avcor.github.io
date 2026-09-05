import ContactLeftPanel from './ContactLeftPanel'
import DottedWorldMap from '../../components/DottedWorldMap'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  return (
    <section id="contact" className={styles.page}>
      <div className={styles.content}>
        <ContactLeftPanel />

        <div className={styles.mapColumn}>
          <DottedWorldMap className={styles.map} />
        </div>
      </div>
    </section>
  )
}
