import InfoCard from '../FlutterCaseStudyPage/InfoCard'

export default function SecurityBusinessProblemCard() {
  return (
    <InfoCard title="Business Problem" delay={0.15}>
      <p>
        Rooted phones, intercepting proxies, and repackaged builds are normal field
        conditions, not edge cases. No single client-side control can be assumed to hold.
      </p>
      <p>
        So the requirement was defense in depth: transport that can't be read out of the
        APK, tamper detection that can't be silently patched around, and a token store
        that survives a corrupted keystore instead of locking users out.
      </p>
    </InfoCard>
  )
}
