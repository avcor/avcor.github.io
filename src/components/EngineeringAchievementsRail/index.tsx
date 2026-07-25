import { AnimatePresence, motion } from 'framer-motion'
import VerticalLabel from '../VerticalLabel'
import { ACHIEVEMENT_GROUPS } from './achievementsData'
import styles from './EngineeringAchievementsRail.module.css'

interface EngineeringAchievementsRailProps {
  activeGroupId?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

export default function EngineeringAchievementsRail({
  activeGroupId = 'platform-engineering',
}: EngineeringAchievementsRailProps) {
  return (
    <nav className={styles.rail} aria-label="Engineering achievements">
      <span className={styles.line} aria-hidden="true" />

      {ACHIEVEMENT_GROUPS.map((group) => {
        const isActive = group.id === activeGroupId

        return (
          <div key={group.id} className={styles.group}>
            <div className={styles.mainRow}>
              <span
                className={`${styles.lineTint} ${isActive ? styles.lineTintActive : ''}`}
                aria-hidden="true"
              />
              <motion.div
                className={styles.mainDot}
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={{ duration: 0.24, ease: EASE }}
                data-active={isActive || undefined}
                role="img"
                aria-label={group.label}
              >
                {isActive && (
                  <>
                    <span className={styles.ring} aria-hidden="true" />
                    <span className={styles.glow} aria-hidden="true" />
                  </>
                )}
              </motion.div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key={group.id}
                    className={styles.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.24, ease: EASE }}
                  >
                    <VerticalLabel text={group.label} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {group.caseStudies.length > 0 && (
              <div className={styles.subList}>
                {group.caseStudies.map((caseStudy) => (
                  <span key={caseStudy.id} className={styles.subDot} title={caseStudy.label} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
