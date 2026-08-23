import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import GlassBadge from '../GlassBadge'
import PanelProof from './PanelProof'
import type { DeepDivePanel as PanelData } from './types'
import styles from './DeepDivePanel.module.css'

const ease = [0.16, 1, 0.3, 1] as const

/** Renders `` `code` `` spans inline as styled <code> — calls out
 *  identifiers/commands within prose paragraphs. */
function renderInlineCode(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? (
      <code key={i} className={styles.inlineCode}>
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  )
}

/** Reveal on scroll into view — each section animates as the reader reaches it. */
function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10%' },
    transition: { duration: 0.5, delay, ease },
  }
}

interface DeepDivePanelProps {
  panel: PanelData
  variant?: 'split' | 'stacked'
  /** Overrides the proof column — used to drop the lifecycle map into the Seam. */
  proofSlot?: ReactNode
  proofLabel?: string
}

export default function DeepDivePanel({
  panel,
  variant = 'split',
  proofSlot,
  proofLabel,
}: DeepDivePanelProps) {
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
            <p className={styles.rowText}>{renderInlineCode(panel.problem)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Decision</span>
            <p className={styles.rowText}>{renderInlineCode(panel.decision)}</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.18)} className={styles.insight}>
          <span className={styles.insightDash} />
          <p>{renderInlineCode(panel.insight)}</p>
        </motion.div>
      </div>

      {/* ── Right: proof artifact, an override slot (the map), or a guide ── */}
      <motion.div {...fadeUp(0.12)} className={styles.right}>
        {proofSlot ? (
          <>
            <span className={styles.proofLabel}>{proofLabel ?? 'Walkthrough'}</span>
            {proofSlot}
          </>
        ) : panel.proof ? (
          <>
            <span className={styles.proofLabel}>Walkthrough</span>
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
