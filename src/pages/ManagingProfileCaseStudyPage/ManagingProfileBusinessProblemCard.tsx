import InfoCard from '../FlutterCaseStudyPage/InfoCard'

export default function ManagingProfileBusinessProblemCard() {
  return (
    <InfoCard title="Business Problem" delay={0.15}>
      <p>
        A family member switching to another person's linked medical profile needed to
        see that profile's data immediately, without losing their own account state or
        the pod's live connection.
      </p>
      <p>
        Updating user data in Redux all at once triggered renders across multiple
        screens at once, visible as flicker. The switch also had to swap the session
        token and medical data for the new profile while preserving the original
        owner's account, and still read and reconfigure the shared pod's hardware state
        after switching.
      </p>
    </InfoCard>
  )
}
