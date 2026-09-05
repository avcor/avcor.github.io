import { ArrowRight } from 'lucide-react'
import type { ContactLink } from '../../config/contact'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import styles from './ContactLinkRow.module.css'

interface ContactLinkRowProps {
  link: ContactLink
}

const MAILTO_OR_TEL = /^(?:mailto:|tel:)([^?]+)/

export default function ContactLinkRow({ link }: ContactLinkRowProps) {
  const external = link.href.startsWith('http')
  const copyValue = decodeURIComponent(link.href.match(MAILTO_OR_TEL)?.[1] ?? link.href)
  const { copied, copy } = useCopyToClipboard()

  return (
    <div className={styles.row}>
      <a
        href={link.href}
        className={styles.link}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        aria-label={`Open ${link.label}`}
      >
        <span className={styles.labelSpacer} aria-hidden="true">
          {link.label}
        </span>
        <ArrowRight size={16} className={styles.arrow} />
      </a>

      <button
        type="button"
        className={`${styles.label} ${copied ? styles.copied : ''}`}
        onClick={() => copy(copyValue)}
      >
        {copied ? 'Copied!' : link.label}
      </button>
    </div>
  )
}
