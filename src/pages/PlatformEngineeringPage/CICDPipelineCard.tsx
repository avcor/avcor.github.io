import { motion } from 'framer-motion'
import { Boxes, Box, CloudUpload, Download, Bot, Bell, ArrowDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import styles from './CICDPipelineCard.module.css'

interface PipelineNodeProps {
  icon: LucideIcon
  lines: string[]
  tone: 'flutter' | 'android'
  gridRow: number
}

function PipelineNode({ icon: Icon, lines, tone, gridRow }: PipelineNodeProps) {
  return (
    <div
      className={`${styles.node} ${tone === 'flutter' ? styles.nodeFlutter : styles.nodeAndroid}`}
      style={{ gridRow }}
    >
      <div className={styles.nodeIcon}>
        <Icon size={16} strokeWidth={1.75} />
      </div>
      <div className={styles.nodeText}>
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </div>
  )
}

function PipelineArrow({ tone, gridRow }: { tone: 'flutter' | 'android'; gridRow: number }) {
  return (
    <div className={`${styles.arrow} ${tone === 'flutter' ? styles.arrowFlutter : styles.arrowAndroid}`} style={{ gridRow }}>
      <ArrowDown size={14} strokeWidth={2} />
    </div>
  )
}

export default function CICDPipelineCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={styles.wrapper}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <GlassBadge icon={Boxes} size={40} color="var(--color-info)" />
          <span className={styles.title}>CI/CD Pipeline</span>
        </div>

        <div className={styles.diagram}>
          <span className={`${styles.columnLabel} ${styles.labelFlutter}`} style={{ gridColumn: 1, gridRow: 1 }}>
            Flutter CI
          </span>
          <PipelineNode icon={Box} lines={['Build AAR']} tone="flutter" gridRow={2} />
          <PipelineArrow tone="flutter" gridRow={3} />
          <PipelineNode icon={CloudUpload} lines={['Upload', 'GitHub Artifacts']} tone="flutter" gridRow={4} />

          <div className={styles.connector} aria-hidden="true">
            <span className={styles.connectorDot} />
          </div>

          <span className={`${styles.columnLabel} ${styles.labelAndroid}`} style={{ gridColumn: 3, gridRow: 1 }}>
            Android CI
          </span>
          <PipelineNode icon={Download} lines={['Download AAR', '(From GitHub Artifacts)']} tone="android" gridRow={4} />
          <PipelineArrow tone="android" gridRow={5} />
          <PipelineNode icon={Bot} lines={['Build APK']} tone="android" gridRow={6} />
          <PipelineArrow tone="android" gridRow={7} />
          <PipelineNode icon={Bell} lines={['Notify Team']} tone="android" gridRow={8} />
        </div>
      </div>
    </motion.div>
  )
}
