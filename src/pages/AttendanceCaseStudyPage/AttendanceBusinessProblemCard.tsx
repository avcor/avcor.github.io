import InfoCard from '../FlutterCaseStudyPage/InfoCard'

export default function AttendanceBusinessProblemCard() {
  return (
    <InfoCard title="Business Problem" delay={0.15}>
      <p>
        Staff attendance was punched from anywhere, with no proof the person punching
        was physically present, so proxy punching and location spoofing went
        undetected.
      </p>
      <p>
        Needed a punch flow that proves a live person is in front of the camera, not a
        photo, not a colleague, and not punching in from off-site.
      </p>
    </InfoCard>
  )
}
