import { motion } from 'framer-motion'
import { ACHIEVEMENT_GROUPS } from './achievementsData'
import styles from './EngineeringAchievementsRail.module.css'

interface EngineeringAchievementsRailProps {
  activeGroupId?: string
  activeCaseStudyId?: string
}

export default function EngineeringAchievementsRail({
  activeGroupId = 'platform-engineering',
  activeCaseStudyId = 'flutter-integration',
}: EngineeringAchievementsRailProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={styles.rail}
      aria-label="Engineering achievements"
    >
      <div className={styles.title}>
        <span className={styles.titleLine}>Engineering</span>
        <span className={styles.titleAccent}>Achievements</span>
      </div>

      <ol className={styles.timeline}>
        {ACHIEVEMENT_GROUPS.map((group) => {
          const isActiveGroup = group.id === activeGroupId

          return (
            <li
              key={group.id}
              className={`${styles.group} ${isActiveGroup ? styles.groupActive : ''}`}
            >
              <span className={`${styles.node} ${isActiveGroup ? styles.nodeActive : ''}`} />
              <span className={`${styles.groupTitle} ${isActiveGroup ? styles.groupTitleActive : ''}`}>
                {group.label}
              </span>

              {group.caseStudies.length > 0 && (
                <ul className={styles.subList}>
                  {group.caseStudies.map((caseStudy) => {
                    const isActiveCaseStudy = isActiveGroup && caseStudy.id === activeCaseStudyId

                    return (
                      <li
                        key={caseStudy.id}
                        className={`${styles.subItem} ${isActiveCaseStudy ? styles.subItemActive : ''}`}
                      >
                        <span className={`${styles.subDot} ${isActiveCaseStudy ? styles.subDotActive : ''}`} />
                        {caseStudy.label}
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ol>
    </motion.nav>
  )
}
