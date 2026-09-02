import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import styles from '../FlutterCaseStudyPage/OwnershipCard.module.css'

const ownershipPoints = [
  'Built the Keystore-backed token store, with self-healing rebuild on keystore corruption',
  'Fixed a production ANR by pre-warming and caching the encrypted prefs at app start',
  'Implemented dual-layer certificate pinning with XOR-obfuscated pins',
  'Built the root, hook, and Frida detection engine from scratch, mirrored in native JNI',
  'Added signing-certificate verification, so a re-signed build fails to run',
]

export default function SecurityOwnershipCard() {
  return (
    <InfoCard title="My Ownership" delay={0.22}>
      <ul className={styles.list}>
        {ownershipPoints.map((point) => (
          <li key={point} className={styles.item}>
            <span className={styles.bullet} />
            {point}
          </li>
        ))}
      </ul>
    </InfoCard>
  )
}
