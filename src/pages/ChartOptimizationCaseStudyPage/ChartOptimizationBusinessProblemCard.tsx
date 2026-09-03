import InfoCard from '../FlutterCaseStudyPage/InfoCard'

export default function ChartOptimizationBusinessProblemCard() {
  return (
    <InfoCard title="Business Problem" delay={0.15}>
      <p>
        Dozee Home renders heart rate, SpO2, respiration rate, and sleep quality as
        charts a user can read at a glance. Correctness and accuracy of every point
        mattered more than how fast the chart appeared.
      </p>
      <p>
        The hardware sampled about 4 points a minute, over 9,000 points across an
        8-hour sleep session, and the first iteration recomputed all of them on every
        open: axis labels overlapped differently on every screen size, and the chart
        took a visible ~5 seconds to draw.
      </p>
    </InfoCard>
  )
}
