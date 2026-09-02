import InfoCard from '../FlutterCaseStudyPage/InfoCard'
import styles from '../FlutterCaseStudyPage/OwnershipCard.module.css'

const ownershipPoints = [
  'Built the encrypted token store on Android Keystore, with legacy-plaintext migration and self-healing rebuild on keystore corruption',
  'Diagnosed and fixed a production ANR from Keystore2 Binder contention by pre-warming and process-caching the encrypted prefs at app start',
  'Implemented dual-layer certificate pinning with pins and signer digests XOR-obfuscated so they cannot be recovered with strings',
  'Built RootDetectionManager from scratch: root, Magisk/Zygisk/KernelSU, and Frida detection, mirrored in a native JNI layer',
  'Added signing-certificate verification against obfuscated trusted hashes, so a patched, re-signed build fails to run, handling app-signing key-rotation lineage',
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
