import { Cpu, FileCheck, Scale, ShieldAlert } from 'lucide-react'
import type { DeepDivePanel } from '../../components/ArchitectureDiagram/types'

/**
 * Section C: Runtime Integrity & Tamper Defense. The from-scratch detection
 * engine, its native mirror, the signature check that closes the re-signing
 * threat, and the fail-open policy that keeps a slow or restricted device from
 * being treated as a hostile one.
 */
export const DEEP_DIVE_PANELS: DeepDivePanel[] = [
  {
    id: 'root-hook-detection',
    index: '01',
    eyebrow: 'Tamper Detection',
    icon: ShieldAlert,
    headingLines: ['A 1,200-line detection engine,', 'built from scratch, no', 'RootBeer, no Play Integrity.'],
    accentIndex: 1,
    impact: 'Root, Magisk/Zygisk/KernelSU, and Frida detection with zero third-party security libraries',
    problem:
      'Root-cloaking apps and modern systemless-root tooling (Magisk, Zygisk, KernelSU, APatch) defeat the classic su-binary-path checks that most off-the-shelf detection libraries still rely on.',
    decision:
      '`RootDetectionManager.kt` checks su binary paths, a 30+ package root-app allowlist, `/proc/self/mountinfo` for systemless-root bind mounts, and dangerous props read via reflection into the hidden `SystemProperties` API. Hook detection scans `/proc/self/maps` for Substrate/Xposed/Frida markers, checks Frida port 27042 via `/proc/net/tcp` with a socket-connect fallback, and fingerprints Frida GumJS/GLib thread names (`gum-js-loop`, `pool-frida`).',
    insight:
      'Built on-device rather than delegated to Play Integrity on purpose: Play Integrity is a network attestation that needs Google Play Services, returns a coarse pass/fail verdict, and is rate-limited, so it cannot run offline, on non-GMS devices, or give the granular per-signal detail (a specific Frida thread, a specific mount) this engine acts on in real time and re-checks on every foreground. The same checks are mirrored 1:1 with the iOS build.',
    watermark: 'Detect',
    proof: {
      kind: 'table',
      columns: ['Check', 'Signal', 'Survives'],
      emphasizeCol: 2,
      rows: [
        ['su / root-app allowlist', '30+ packages, /system write probe', 'Basic root'],
        ['Mount-based detection', '/proc/self/mountinfo bind mounts', 'Magisk / Zygisk / KernelSU'],
        ['Frida port probe', '/proc/net/tcp LISTEN, port 27042', 'Default Frida deployment'],
        ['GumJS thread fingerprint', 'gum-js-loop, pool-frida', 'A renamed frida-server binary'],
      ],
    },
  },
  {
    id: 'native-integrity-mirror',
    index: '02',
    eyebrow: 'Native Mirror',
    icon: Cpu,
    headingLines: ['The hook checks run twice,', 'once in Kotlin, once in', 'native code, over JNI.'],
    accentIndex: 1,
    impact: 'A Java-only hook can no longer blind the entire detection surface',
    problem:
      'If every tamper check runs inside the JVM, a single well-placed Java hook can intercept and neutralize the whole detection layer at once.',
    decision:
      '`NativeRuntimeIntegrity.kt` bridges over JNI to a native runtime-integrity library (`hook-detection.c`), which duplicates the hooking and Frida probes in native code, independent of the Kotlin layer.',
    insight:
      'The two layers fail differently on purpose: a missing native library fails closed for the core integrity check (`isCompromised()` returns true if the .so will not load), but the native hook probes themselves fail open, additive on top of the Kotlin baseline rather than a replacement for it.',
    watermark: 'Native',
    proof: {
      kind: 'table',
      columns: ['Layer', 'Language', 'Failure mode if unavailable'],
      emphasizeCol: 2,
      rows: [
        ['RootDetectionManager', 'Kotlin / JVM', 'Baseline, always runs'],
        ['NativeRuntimeIntegrity', 'C, native (JNI)', 'Core check fails closed; probes fail open'],
      ],
    },
  },
  {
    id: 'signature-verification',
    index: '03',
    eyebrow: 'Signature Verification',
    icon: FileCheck,
    headingLines: ['Patch the APK, re-sign it,', 'reinstall it, and the app', 'refuses to run.'],
    accentIndex: 1,
    impact: 'A patched, re-signed build cannot silently run, no root or Frida needed to attempt it',
    problem:
      'A determined attacker can decompile a release APK, patch out the pinning and root-detection checks, re-sign it with their own key, and reinstall it, all without root or Frida, if nothing on-device verifies the binary is still the one that was published.',
    decision:
      '`checkSignatureMismatch` compares the running APK SHA-256 signing certificate against per-variant trusted hashes (obfuscated with the same XOR scheme as the pin bytes), walking the signing-certificate history to handle app-signing key rotation across the upload-key and internal-track distribution paths.',
    insight:
      'This is the specific control for the specific threat: a patched, re-signed APK fails signature verification rather than running with the tamper checks intact but neutered.',
    watermark: 'Signature',
    proof: {
      kind: 'code',
      filename: 'RootDetectionManager.kt',
      code: `fun checkSignatureMismatch(context: Context): Boolean {
    // walks the signing-cert history for key rotation
    val actual = currentSigningCertHash(context)
    val trusted = deobfuscate(BuildConfig.TRUSTED_SIGNER_SHA256)

    // true = tampered / re-signed APK
    return actual != trusted
}`,
    },
  },
  {
    id: 'fail-open-policy',
    index: '04',
    eyebrow: 'Detection Policy',
    icon: Scale,
    headingLines: ['A slow or restricted device', 'is not a hostile one,', 'so it is never blocked.'],
    accentIndex: 1,
    impact: 'Only confirmed tampering blocks a session; indeterminate signals never lock a user out',
    problem:
      'A probe that times out or hits a SELinux read denial on a clean device tells you nothing about whether the device is compromised, so treating "I could not tell" the same as "tampered" locks out legitimate users.',
    decision:
      'Only affirmative detections (a confirmed su binary, a confirmed Frida thread, a confirmed signature mismatch) trigger the Security Notice and sign-out flow. Timeouts and probe failures are logged via `recordSecurityFindings()` but never block the session.',
    insight:
      'Security telemetry is kept out of the enforcement decision in both directions: a fetched remote-config value can never turn a hostile runtime into a trusted one, and the same separation keeps an overly strict probe from punishing a legitimate user.',
    watermark: 'Policy',
    proof: {
      kind: 'flow',
      steps: [
        { type: 'node', label: 'Run root / hook / signature probes' },
        {
          type: 'branch',
          condition: 'Affirmative detection?',
          yes: { label: 'Security Notice dialog', detail: 'Sign Out' },
          no: { label: 'Log the result, do not block', detail: 'timeouts / denials are indeterminate' },
        },
      ],
    },
  },
]
