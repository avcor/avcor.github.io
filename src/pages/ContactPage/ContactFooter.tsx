import { motion } from 'framer-motion'
import styles from './ContactFooter.module.css'

export default function ContactFooter() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className={styles.footer}
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
