import { ArrowRight } from 'lucide-react'
import type { ContactLink } from '../../config/contact'
import styles from './ContactLinkRow.module.css'

interface ContactLinkRowProps {
  link: ContactLink
}

export default function ContactLinkRow({ link }: ContactLinkRowProps) {
  const external = link.href.startsWith('http')

  return (
    <a
      href={link.href}
      className={styles.row}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      <span className={styles.label}>{link.label}</span>
      <ArrowRight size={16} className={styles.arrow} />
    </a>
  )
}
