import { Download } from 'lucide-react'
import { trackEvent } from '../../services/analytics'
import styles from './ResumeButton.module.css'

const RESUME_URL =
  'https://docs.google.com/document/d/1avGaHalUbSXpf9hMBXArECdRR8LE9OpSE_3MzHcs-ws/export?format=pdf&tab=t.h5t71zd0t8c4'

export default function ResumeButton() {
  return (
    <a
      href={RESUME_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      onClick={() => trackEvent('resume_download')}
    >
      <Download size={14} />
      Resume
    </a>
  )
}
