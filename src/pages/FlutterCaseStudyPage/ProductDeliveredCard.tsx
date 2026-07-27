import { motion } from 'framer-motion'
import { Box } from 'lucide-react'
import styles from './ProductDeliveredCard.module.css'

export default function ProductDeliveredCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.badge}>
            <Box size={24} strokeWidth={1.75} />
          </div>

          <h1 className={styles.title}>Product Delivered</h1>
          <div className={styles.rule} />

          <p className={styles.description}>
            Production screens built on top of the Flutter platform.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
