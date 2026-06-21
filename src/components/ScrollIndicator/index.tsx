import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.9 }}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
    >
      <motion.span
        style={{
          color: '#3DDC84',
          fontSize: '1rem',
          lineHeight: 1,
          opacity: 0.65,
        }}
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        ↓
      </motion.span>
    </motion.div>
  )
}
