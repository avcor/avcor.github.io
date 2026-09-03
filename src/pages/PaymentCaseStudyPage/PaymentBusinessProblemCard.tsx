import InfoCard from '../FlutterCaseStudyPage/InfoCard'

export default function PaymentBusinessProblemCard() {
  return (
    <InfoCard title="Business Problem" delay={0.15}>
      <p>
        The requirement was "show the student their fees," with no agreement on what a
        student needed to see first or what could be left out.
      </p>
      <p>
        A fee screen that dumps every number at once miscommunicates as badly as one
        that hides the due. The screen had to state financial status plainly, without
        overloading or underloading the student.
      </p>
    </InfoCard>
  )
}
