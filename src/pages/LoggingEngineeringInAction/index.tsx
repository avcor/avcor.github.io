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
        <h2 className={styles.headingText}>
          <span className={styles.headingLine}>Production Case Files</span>
          <span className={styles.headingLineAccent}>proof, not anecdotes,</span>
          <span className={styles.headingLine}>traced through the logs.</span>
        </h2>

        <p className={styles.description}>
          Two production incidents, closed using only what the logs showed. No reproduction,
          no escalation, no guesswork.
        </p>
      </motion.div>

      <div className={styles.cards}>
        <StoryCard
          delay={0.05}
          title="Assignment Submission"
          issue="Customer Success reported a student unable to submit an assignment, with a screen recording showing a genuine failure: submitted before the deadline, but the upload still failed."
          investigation="CS confirmed no other student was affected, so instead of touching the codebase we checked production logs for that student at that college."
          finding="The logs showed the mismatch: the app's request carried a pre-deadline timestamp, but the server's response reflected the real time, and the two didn't line up. The student had manually changed their phone's clock before submitting."
          impact="Closed with proof, not a guess, reported back to Customer Success within 1 hour and with no code changes needed."
        />

        <div className={styles.cardsDivider} />

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
