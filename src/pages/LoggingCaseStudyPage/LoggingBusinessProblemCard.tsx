import InfoCard from '../FlutterCaseStudyPage/InfoCard'

export default function LoggingBusinessProblemCard() {
  return (
    <InfoCard title="Business Problem" delay={0.15}>
      <p>
        As the Android application scaled across multiple institutions, diagnosing
        production issues became increasingly difficult. Crashes, authentication
        failures, and payment issues were reconstructed from user reports, which made
        reproduction slow and often impossible.
      </p>
      <p>
        The team needed a centralized way to collect structured logs from production
        devices and make them searchable, without compromising user privacy, adding UI
        latency, or losing logs when a device was offline.
      </p>
    </InfoCard>
  )
}
