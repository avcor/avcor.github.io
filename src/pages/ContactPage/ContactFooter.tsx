import { motion } from 'framer-motion'
import { revealOnScroll } from '../../utils/motion'
import styles from './ContactFooter.module.css'

export default function ContactFooter() {
  return (
    <motion.div {...revealOnScroll(0.6, { y: 0, duration: 0.8 })} className={styles.footer}
    >
      <span className={styles.left}>People &bull; Ideas &bull; A More Open Internet</span>

      <span className={styles.right}>
        Same
        <br />
        Timezone
        <br />
        For Good Ideas
      </span>
    </motion.div>
  )
}
