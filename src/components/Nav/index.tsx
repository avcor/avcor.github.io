import { motion } from 'framer-motion'
import styles from './Nav.module.css'

const links = ['Work', 'About', 'Writing', 'Contact']

interface NavProps {
  activeLink?: string
}

export default function Nav({ activeLink }: NavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={styles.nav}
    >
      {links.map((link, i) => (
        <span key={link} className={styles.linkWrapper}>
          {i > 0 && <span className={styles.separator} />}
          <a
            href={`#${link.toLowerCase()}`}
            className={`${styles.link} ${activeLink === link ? styles.linkActive : ''}`}
          >
            {link}
          </a>
        </span>
      ))}
    </motion.nav>
  )
}
