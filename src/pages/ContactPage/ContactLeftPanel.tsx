import { motion } from 'framer-motion'
import { revealOnScroll } from '../../utils/motion'
import { CONTACT_LINKS, LOCATION } from '../../config/contact'
import ContactLinkRow from './ContactLinkRow'
import styles from './ContactLeftPanel.module.css'

export default function ContactLeftPanel() {
  return (
    <div className={styles.column}>
      {/* 1. Heading */}
      <motion.h2 {...revealOnScroll(0.2)} className={styles.heading}>
        <span className={styles.headingLine}>Let&apos;s start</span>
        <span className={styles.headingLineAccent}>with hello.</span>
      </motion.h2>

      {/* 2. Supporting text */}
      <motion.p {...revealOnScroll(0.3)} className={styles.description}>
        Picked these because I actually
        <br />
        check them.
      </motion.p>

      {/* 3. Contact links */}
      <motion.div {...revealOnScroll(0.4)} className={styles.links}>
        {CONTACT_LINKS.map((link) => (
          <ContactLinkRow key={link.label} link={link} />
        ))}
      </motion.div>

      {/* 4. Location / availability */}
      <motion.div {...revealOnScroll(0.5)} className={styles.location}>
        <span className={styles.locationDot} />
        <span>{LOCATION.base}</span>
        <span className={styles.locationSeparator} />
        <span>{LOCATION.availability}</span>
      </motion.div>
    </div>
  )
}
