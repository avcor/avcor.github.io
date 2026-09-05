import { motion } from 'framer-motion'
import { CONTACT_LINKS, LOCATION } from '../../config/contact'
import ContactLinkRow from './ContactLinkRow'
import styles from './ContactLeftPanel.module.css'

const ease = [0.16, 1, 0.3, 1] as const

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  }
}

export default function ContactLeftPanel() {
  return (
    <div className={styles.column}>
      {/* 1. Heading */}
      <motion.h2 {...fadeUp(0.2)} className={styles.heading}>
        <span className={styles.headingLine}>Let&apos;s</span>
        <span className={styles.headingLineAccent}>connect.</span>
      </motion.h2>

      {/* 2. Supporting text */}
      <motion.p {...fadeUp(0.3)} className={styles.description}>
        Good products start
        <br />
        with a conversation.
      </motion.p>

      {/* 3. Contact links */}
      <motion.div {...fadeUp(0.4)} className={styles.links}>
        {CONTACT_LINKS.map((link) => (
          <ContactLinkRow key={link.label} link={link} />
        ))}
      </motion.div>

      {/* 4. Location / availability */}
      <motion.div {...fadeUp(0.5)} className={styles.location}>
        <span className={styles.locationDot} />
        <span>{LOCATION.base}</span>
        <span className={styles.locationSeparator} />
        <span>{LOCATION.availability}</span>
      </motion.div>
    </div>
  )
}
