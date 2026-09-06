import type { ReactNode } from 'react'
import { ArrowRight, Check, Copy, Mail, Phone } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import type { ContactLink } from '../../config/contact'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { trackEvent } from '../../services/analytics'
import styles from './ContactLinkRow.module.css'

interface ContactLinkRowProps {
  link: ContactLink
}

const MAILTO_OR_TEL = /^(?:mailto:|tel:)([^?]+)/

/* Every contact link renders in the same white tint, none of these are
 * treated as brand-colored tags, so plain icon shapes at 16px. */
const LINK_ICONS: Record<string, ReactNode> = {
  LinkedIn: <FaLinkedin size={16} />,
  GitHub: <FaGithub size={16} />,
  Email: <Mail size={16} />,
  Call: <Phone size={16} />,
}

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
        onClick={() => trackEvent('contact_click', { label: link.label })}
      >
        <span className={styles.icon}>{LINK_ICONS[link.label]}</span>
        <span className={styles.label}>{link.label}</span>
        <ArrowRight size={16} className={styles.arrow} />
      </a>

      {/* Explicit fallback: the link above may fail silently if the user has
       * no handler app registered (e.g. no telephony app on Linux), so copying
       * the raw value is always available as its own visible action. */}
      <button
        type="button"
        className={styles.copyBtn}
        onClick={() => {
          copy(copyValue)
          trackEvent('contact_copy', { label: link.label })
        }}
        aria-label={`Copy ${link.label.toLowerCase()}`}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  )
}
