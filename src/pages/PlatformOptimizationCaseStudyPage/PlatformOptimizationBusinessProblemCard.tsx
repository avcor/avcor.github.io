import InfoCard from '../FlutterCaseStudyPage/InfoCard'

export default function PlatformOptimizationBusinessProblemCard() {
  return (
    <InfoCard title="Business Problem" delay={0.15}>
      <p>
        Ten years of accumulated code let storage, cold start, and build size degrade
        quietly, culminating in some installs holding 45 GB of local storage from
        unlimited caches and un-evicted uploads.
      </p>
      <p>
        Needed area-by-area optimization driven by production telemetry, not synthetic
        profiling, without regressing existing functionality.
      </p>
    </InfoCard>
  )
}
