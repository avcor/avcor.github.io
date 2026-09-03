import InfoCard from '../FlutterCaseStudyPage/InfoCard'

export default function EcgBusinessProblemCard() {
  return (
    <InfoCard title="Business Problem" delay={0.15}>
      <p>
        Doctors could not get an ECG instantly, and once one was taken, finding it
        again later for review was its own search.
      </p>
      <p>
        Needed a wired capture flow that produces a reviewable ECG on the spot,
        uploads it without blocking the doctor, and still works when the network
        does not.
      </p>
    </InfoCard>
  )
}
