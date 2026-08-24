import { motion } from 'framer-motion'
import StoryCard from './StoryCard'
import styles from './LoggingEngineeringInAction.module.css'

/**
 * Its own section and spy-bar stop between Overview and Architecture, under a
 * recruiter-facing label (not hidden under "architecture", which recruiters
 * tend to skip). Two real production investigations where guesswork was
 * skipped in favor of hard evidence from the logs.
 */
export default function LoggingEngineeringInAction() {
  return (
    <div className={styles.content}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className={styles.heading}
      >
        <span className={styles.headingText}>Production Case Files</span>
        <span className={styles.headingDash} />
        <p className={styles.headingSub}>
          Proof, not anecdotes: two production incidents traced through the logs.
        </p>
      </motion.div>

      <div className={styles.cards}>
        <StoryCard
          delay={0.05}
          title="Assignment Submission"
          issue="A student reported that their assignment upload failed after the submission deadline."
          investigation="Traced the request timeline in production logs and inspected the server response alongside the device info attached to each log."
          finding="The device clock had been manually changed, so the request carried a timestamp the server rejected as past the deadline. The app and network path were both working correctly."
          impact="Customer Success closed the case quickly with clear evidence, no prolonged investigation and no engineering escalation."
        />

        <StoryCard
          delay={0.15}
          title="Consent Failure"
          issue="A non-dismissable consent screen is meant to gate the app until the user accepts the terms. Customer Success reported a user for whom the consent flow was broken."
          investigation="A screen recording looked normal and the app worked for everyone in-house, so instead of trusting the reproduction we read the user's production logs."
          finding="The logs showed the real state: consent was never accepted, the backend was correctly returning 403, and it happened only on Android versions below 13. The consent broadcast was sent implicitly on the system bus, but on those versions the receiver had fallen back to a separate local bus, so the signal never arrived. The fix sends an explicit, package-scoped broadcast and registers the receiver on the system bus from Android 8 up."
          impact="Root-caused from logs alone, with no back-and-forth with the customer, and the fix shipped within 2 hours of the report."
        />
      </div>
    </div>
  )
}
