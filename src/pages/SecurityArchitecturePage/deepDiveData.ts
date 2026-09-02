import { AppWindow, Globe, KeyRound, Lock } from 'lucide-react'
import type { DeepDivePanel } from '../../components/ArchitectureDiagram/types'

/**
 * Section B: Data & Transport Security. Four concerns: how data is protected in
 * transit (pinning, network lockdown), how the session token is protected at rest
 * (Keystore store), and the narrowest remote surface the app keeps small (the
 * payment WebView bridge).
 */
export const DEEP_DIVE_PANELS: DeepDivePanel[] = [
  {
    id: 'obfuscated-cert-pinning',
    index: '01',
    eyebrow: 'Transport Pinning',
    icon: Lock,
    headingLines: ['Cert pins live in the APK', 'as XOR-obfuscated bytes,', 'not string constants.'],
    accentIndex: 1,
    impact: 'Zero pin hashes recoverable from the APK with `strings apk.apk | grep sha256`',
    problem:
      'Plaintext SHA-256 constants sitting in the APK string table are trivially greppable, the exact weakness a naive `CertificatePinner` setup leaves open.',
    decision:
      "`ApiClient.java` runs two independent pinning layers: OkHttp's `CertificatePinner` as the primary enforcement, and a custom `PinVerificationInterceptor` that walks the peer certificate chain and computes SPKI SHA-256 per certificate. Pins are stored as XOR-obfuscated byte arrays, decoded only at runtime, and pin against issuing intermediates rather than leaf certificates.",
    insight:
      'Pinning intermediates instead of leaves is deliberate: public CAs rotate leaf certificates on a roughly 90 day cycle and cloud load balancers issue fresh wildcard leaves on renewal, either would brick the app on a routine certificate rotation if pinned directly.',
    watermark: 'Pinning',
    proof: {
      kind: 'table',
      columns: ['Layer', 'Role'],
      emphasizeCol: 0,
      rows: [
        ['CertificatePinner (OkHttp)', 'Primary enforcement, built into the connect path'],
        ['PinVerificationInterceptor', 'Secondary check, walks the chain, logs MATCH / MISMATCH'],
        ['XOR obfuscation', 'Pin bytes never appear as plaintext strings in the APK'],
      ],
    },
  },
  {
    id: 'network-security-config',
    index: '02',
    eyebrow: 'Network Lockdown',
    icon: Globe,
    headingLines: ['Cleartext traffic is off', 'everywhere, with exactly', 'one documented exception.'],
    accentIndex: 1,
    impact: 'One named cleartext exception, everything else refuses plaintext HTTP',
    problem:
      'A blanket cleartext ban is easy to state and easy to silently break with one forgotten legacy endpoint that still expects `http://`.',
    decision:
      '`network_security_config.xml` sets `cleartextTrafficPermitted=false` at the root, with a domain-scoped pin set (10 SHA-256 pins, includeSubdomains), and one narrow, exact-host cleartext exception for a logging origin, flagged in the config as temporary pending HTTPS support on that origin.',
    insight:
      'debug-overrides only trusts user-installed proxy CAs on debuggable builds, so a rooted device running a release build cannot MITM traffic just by installing a proxy CA, a common debugging assumption the config deliberately does not extend to release.',
    watermark: 'Network',
    proof: {
      kind: 'code',
      filename: 'res/xml/network_security_config.xml',
      code: `<network-security-config>
  <base-config cleartextTrafficPermitted="false" />

  <domain-config>
    <domain includeSubdomains="true">api.example.com</domain>
    <pin-set>
      <pin digest="SHA-256">...</pin>   <!-- 10 pinned intermediates -->
    </pin-set>
  </domain-config>

  <!-- temporary, exact-host: this log origin has no HTTPS yet -->
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="false">logs.example.com</domain>
  </domain-config>
</network-security-config>`,
    },
  },
  {
    id: 'keystore-token-store',
    index: '03',
    eyebrow: 'Encrypted Token Store',
    icon: KeyRound,
    headingLines: ['The session token lives in', 'Keystore-backed AES-256,', 'and heals if Keystore breaks.'],
    accentIndex: 1,
    impact: 'Zero plaintext tokens after first read; self-heals instead of bricking login',
    problem:
      'Android Keystore state can be corrupted by an OS-level keystore migration or a factory reset, and a naive `EncryptedSharedPreferences` integration just throws and locks the user out.',
    decision:
      '`Utils.getSecurePrefs` wraps AndroidX `EncryptedSharedPreferences` on a Keystore `MasterKey` (AES256_SIV key wrapping, AES256_GCM value encryption), auto-migrates the legacy plaintext store on first read, and on catching `KeyStoreException` / `AEADBadTagException` / Tink keyset errors, wipes and rebuilds the encrypted file once instead of leaving the user locked out.',
    insight:
      'Scope is deliberate: the store holds the session token, the one credential worth Keystore-grade protection, not the general local cache. The instance is process-cached and pre-warmed in `Application.onCreate()`, added after a production ANR traced to Keystore2 Binder contention blocking the main thread for 5+ seconds. The security fix and the performance fix were the same change.',
    watermark: 'Keystore',
    proof: {
      kind: 'flow',
      steps: [
        { type: 'node', label: 'Cold start', detail: 'Application.onCreate()' },
        { type: 'node', label: 'Pre-warm + cache EncryptedSharedPreferences' },
        {
          type: 'branch',
          condition: 'Keystore read succeeds?',
          yes: { label: 'Serve token from cached store' },
          no: { label: 'Wipe + rebuild once', detail: 'on corruption; else legacy fallback, logged' },
        },
      ],
    },
  },
  {
    id: 'webview-hardening',
    index: '04',
    eyebrow: 'Payment Bridge',
    icon: AppWindow,
    headingLines: ['The payment page is remote,', 'so the bridge into it', 'exposes one method, no data.'],
    accentIndex: 1,
    impact: 'One JS-callable method exposed to the payment WebView, zero data-passing entry points',
    problem:
      'Card and UPI entry happens on the payment provider\'s own hosted checkout page, so a wide `@JavascriptInterface` surface (or trusting any URL the WebView redirects to) would hand that remote page arbitrary native calls or let a spoofed callback URL fake a payment.',
    decision:
      '`AndroidJSInterface` exposes a single no-argument `onClicked()` callback, nothing else, and `PaymentGatewayActivity` matches every redirect against a regex allowlist (success/failure patterns plus known fee paths) in `shouldOverrideUrlLoading` before treating it as a payment outcome.',
    insight:
      "The bridge's minimalism is the control, not a restriction added afterward: there is no method to widen scope later, since arbitrary data-passing was never built in the first place. Payment details are only ever entered on the provider's page, never handled by the app.",
    watermark: 'WebView',
    proof: {
      kind: 'table',
      columns: ['Surface', 'Exposed to JS', 'Notes'],
      emphasizeCol: 1,
      rows: [
        ['AndroidJSInterface.onClicked()', 'Yes', 'No arguments, no return data'],
        ['Payment redirect URLs', 'N/A', 'Matched against successRegex / failureRegex first'],
        ['Any other native method', 'No', 'Not implemented'],
      ],
    },
  },
]
