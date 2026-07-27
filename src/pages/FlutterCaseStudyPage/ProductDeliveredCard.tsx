import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Expand, X } from 'lucide-react'
import screenshot from '../../assets/screenshots/access-management-dashboard.jpg'
import styles from './ProductDeliveredCard.module.css'

export default function ProductDeliveredCard() {
  const [expanded, setExpanded] = useState(false)

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

          <button type="button" className={styles.viewLink} onClick={() => setExpanded(true)}>
            <span>View full screen</span>
            <Expand size={15} strokeWidth={2} className={styles.viewLinkIcon} />
          </button>
        </div>

        <div className={styles.right}>
          <div className={styles.phone}>
            <img src={screenshot} alt="Access Management Dashboard screen" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.lightbox}
            onClick={() => setExpanded(false)}
          >
            <button type="button" className={styles.lightboxClose} aria-label="Close">
              <X size={22} strokeWidth={2} />
            </button>
            <motion.img
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
              src={screenshot}
              alt="Access Management Dashboard screen"
              className={styles.lightboxImage}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
