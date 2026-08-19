import { motion } from 'framer-motion'
import GlassBadge from '../../components/GlassBadge'
import PanelProof from './PanelProof'
import type { DeepDivePanel as PanelData } from './deepDiveData'
import styles from './DeepDivePanel.module.css'

const ease = [0.16, 1, 0.3, 1] as const

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.38, delay, ease },
  }
}

interface DeepDivePanelProps {
  panel: PanelData
  variant?: 'split' | 'stacked'
}

export default function DeepDivePanel({ panel, variant = 'split' }: DeepDivePanelProps) {
  return (
    <div className={`${styles.panel} ${variant === 'stacked' ? styles.stacked : ''}`}>
      <span className={styles.watermark} aria-hidden="true">
        {panel.watermark}
      </span>

      {/* ── Left: narrative ── */}
      <div className={styles.left}>
        <motion.div {...fadeUp(0.02)} className={styles.eyebrow}>
          <GlassBadge icon={panel.icon} size={40} />
          <span className={styles.eyebrowText}>
            {panel.index} · {panel.eyebrow}
          </span>
        </motion.div>

        <motion.h2 {...fadeUp(0.06)} className={styles.heading}>
          {panel.headingLines.map((line, i) => (
            <span
              key={line}
              className={i === panel.accentIndex ? styles.headingAccent : styles.headingLine}
            >
              {line}
            </span>
          ))}
        </motion.h2>

        <motion.div {...fadeUp(0.1)} className={styles.impact}>
          {panel.impact}
        </motion.div>

        <motion.div {...fadeUp(0.14)} className={styles.rows}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Problem</span>
            <p className={styles.rowText}>{panel.problem}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Decision</span>
            <p className={styles.rowText}>{panel.decision}</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.18)} className={styles.insight}>
          <span className={styles.insightDash} />
          <p>{panel.insight}</p>
        </motion.div>
      </div>

      {/* ── Right: proof artifact, or map-orientation guide for the overview ── */}
      <motion.div {...fadeUp(0.12)} className={styles.right} key={panel.id}>
        {panel.proof ? (
          <>
            <span className={styles.proofLabel}>Proof</span>
            <PanelProof proof={panel.proof} />
          </>
        ) : panel.guide ? (
          <>
            <span className={styles.proofLabel}>Read the map</span>
            <p className={styles.guide}>{panel.guide}</p>
          </>
        ) : null}
      </motion.div>
    </div>
  )
}
