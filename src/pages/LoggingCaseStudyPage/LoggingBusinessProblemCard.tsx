import InfoCard from '../FlutterCaseStudyPage/InfoCard'

export default function LoggingBusinessProblemCard() {
  return (
    <InfoCard title="Business Problem" delay={0.15}>
      <p>
        As the app scaled across institutions, production issues were reconstructed
        from user reports, slow and often impossible to reproduce.
      </p>
      <p>
        Needed centralized, searchable logs from production devices, without
        compromising privacy, UI latency, or offline reliability.
      </p>
    </InfoCard>
  )
}
