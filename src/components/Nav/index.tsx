import { motion } from 'framer-motion'

const links = ['Work', 'About', 'Writing', 'Contact']

export default function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', alignItems: 'center', gap: 0 }}
    >
      {links.map((link, i) => (
        <span key={link} style={{ display: 'flex', alignItems: 'center' }}>
          {i > 0 && (
            <span
              style={{
                display: 'inline-block',
                width: 3,
                height: 3,
                borderRadius: '50%',
                backgroundColor: '#3DDC84',
                margin: '0 14px',
                opacity: 0.7,
                flexShrink: 0,
              }}
            />
          )}
          <a
            href={`#${link.toLowerCase()}`}
            style={{
              fontSize: '0.78rem',
              letterSpacing: '0.05em',
              color: 'rgba(230, 237, 243, 0.38)',
              transition: 'color 0.2s ease',
              fontWeight: 400,
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLAnchorElement).style.color = 'rgba(230, 237, 243, 0.85)')
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLAnchorElement).style.color = 'rgba(230, 237, 243, 0.38)')
            }
          >
            {link}
          </a>
        </span>
      ))}
    </motion.nav>
  )
}
