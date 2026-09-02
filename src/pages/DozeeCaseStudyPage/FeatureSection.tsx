import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../../components/GlassBadge'
import InfoTooltip from '../../components/InfoTooltip'
import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import ownershipStyles from '../FlutterCaseStudyPage/OwnershipCard.module.css'
import styles from './FeatureSection.module.css'

interface ImpactItem {
  icon: LucideIcon
  title: string
  description: string
}

interface FeatureSectionProps {
  index: string
  title: string
  problem: ReactNode
  ownershipPoints: string[]
  heroLine: string
  heroCaveat?: string
  impactItems: ImpactItem[]
}

export default function FeatureSection({
  index,
  title,
  problem,
  ownershipPoints,
  heroLine,
  heroCaveat,
  impactItems,
}: FeatureSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={styles.section}
    >
      <div className={styles.heading}>
        <span className={styles.index}>{index}</span>
        <span className={styles.title}>{title}</span>
        <span className={styles.dash} />
      </div>

      <div className={styles.row}>
        <div className={styles.problem}>
          <InfoCard title="Business Problem">{problem}</InfoCard>
        </div>

        <div className={styles.divider} />

        <div className={styles.ownership}>
          <InfoCard title="My Ownership">
            <ul className={ownershipStyles.list}>
              {ownershipPoints.map((point) => (
                <li key={point} className={ownershipStyles.item}>
                  <span className={ownershipStyles.bullet} />
                  {point}
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
      </div>

      <div className={styles.impact}>
        <div className={styles.hero}>
          <span className={styles.heroValue}>{heroLine}</span>
          {heroCaveat && <InfoTooltip text={heroCaveat} />}
        </div>

        <div className={styles.impactItems}>
          {impactItems.map(({ icon: Icon, title: itemTitle, description }) => (
            <div key={description} className={styles.impactItem}>
              <div className={styles.impactItemDivider} />
              <div className={styles.impactItemInner}>
                <GlassBadge icon={Icon} size={40} />
                <div className={styles.impactText}>
                  <div className={styles.impactItemTitle}>{itemTitle}</div>
                  <div className={styles.impactItemDescription}>{description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
