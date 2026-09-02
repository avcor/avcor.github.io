import InfoCard from '../FlutterCaseStudyPage/InfoCard'

export default function SecurityBusinessProblemCard() {
  return (
    <InfoCard title="Business Problem" delay={0.15}>
      <p>
        Digiicampus runs on student and staff devices across many institutions, none of
        them under our control, carrying attendance, payments, and academic records. No
        client-side control assumed the device, network, or the binary itself could be
        trusted.
      </p>
      <p>
        Needed defense in depth ahead of any single control failing: transport that
        cannot be read out of the APK, tamper detection that cannot be silently patched
        around, and a token store that survives a hostile or corrupted keystore instead
        of locking users out.
      </p>
    </InfoCard>
  )
}
