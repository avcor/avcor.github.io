import { Database, HardDrive, ShieldAlert, Timer, Layers as ViewIcon } from 'lucide-react'
import type { DeepDivePanel } from '../../components/ArchitectureDiagram/types'

export const DEEP_DIVE_PANELS: DeepDivePanel[] = [
  {
    id: 'storage-cache-discipline',
    index: '01',
    eyebrow: 'Storage Discipline',
    icon: HardDrive,
    headingLines: ['One install held 45 GB.', 'Cache-directory migration', 'brought it to 200 MB.'],
    accentIndex: 1,
    impact: '99.5% storage reduction for existing installs, a hard ceiling for new ones',
    problem:
      'Uploaded images and an unlimited HTTP response cache wrote to permanent external storage with no eviction, growing without bound over ten years of use.',
    decision:
      "`ExifUtil` and `ProfilePicUtils` now write to the cache directory Android auto-evicts under storage pressure. OkHttp's response cache is capped at 50MB with LRU eviction. Glide (250 to 100MB), ExoPlayer (200 to 50MB), and OkHttp (100 to 50MB) caches were capped to a combined ~200MB ceiling, and retention cut from 30 to 3 days.",
    insight:
      "Capping new writes doesn't clean up what's already on disk. A one-time migration in `CollPollApplication` deletes the legacy `/Pictures/Digii/uploads/` and `getExternalFilesDir()/Digii/uploads/` directories on first launch and logs freed bytes to analytics, which is how the 99.5% reduction was measured in production.",
    watermark: 'Storage',
    proof: {
      kind: 'table',
      columns: ['Cache', 'Before', 'After'],
      emphasizeCol: 2,
      rows: [
        ['Glide', '250 MB', '100 MB'],
        ['ExoPlayer', '200 MB', '50 MB'],
        ['OkHttp response cache', 'Unlimited', '50 MB, LRU'],
        ['Cache retention', '30 days', '3 days'],
        ['Existing installs (one-time migration)', '~45 GB', '~200 MB'],
      ],
    },
  },
  {
    id: 'cold-start-consolidation',
    index: '02',
    eyebrow: 'Cold Start',
    icon: Timer,
    headingLines: ['Three ad hoc threads,', 'one coordinated startup', 'thread.'],
    accentIndex: 1,
    impact: 'Slow cold start down to 0.78% in production (from ~1.05% in April 2026)',
    problem:
      'Application.onCreate had grown three independent background threads plus synchronous Keystore, Firebase, and security-probe work, any of which could block the main thread on real devices.',
    decision:
      "The three startup threads were coalesced into a single named `CollPoll-Startup` thread. `EncryptedSharedPreferences` now caches a process-lifetime instance instead of rebuilding on every `Utils.getToken` call (599 call sites across the codebase). `FirebaseApp.initializeApp()` moved to its own background thread, independent of the Keystore pre-warm thread. Root and hook-detection probes swapped a subprocess `getprop` call and `getInstalledPackages()` scan for a reflection-based read and per-package lookups.",
    insight:
      "Each fix traced to a specific production ANR trace, not synthetic profiling. Keystore was blocked in a Binder round-trip inside a 599-call-site hot path. Firebase's `ComponentDiscovery` synchronously initialized four SDKs in one burst. Root-detection probes were fast enough on emulators to hide the real-device latency until watchdog timeouts started firing in production.",
    watermark: 'Startup',
    proof: {
      kind: 'table',
      columns: ['Root cause', 'Fix'],
      emphasizeCol: 1,
      rows: [
        ['Keystore Binder ANR (599 call sites via Utils.getToken)', 'Cached EncryptedSharedPreferences instance, process lifetime'],
        ['FirebaseApp ComponentDiscovery ANR', 'Init moved to its own background thread'],
        ['Security-probe watchdog timeout', 'getprop subprocess to reflection; getInstalledPackages() to per-package lookups'],
        ['Startup thread sprawl', 'Coalesced into a single CollPoll-Startup thread'],
      ],
    },
  },
  {
    id: 'ui-recycling',
    index: '03',
    eyebrow: 'UI Rendering',
    icon: ViewIcon,
    headingLines: ['A RecyclerView nested in a', 'NestedScrollView disables', 'view recycling entirely.'],
    accentIndex: 1,
    impact: 'Restored view recycling on a screen that was ANRing',
    problem:
      "Nesting a RecyclerView inside a NestedScrollView forces every row to inflate synchronously, since the scroll container can't participate in the recycling contract.",
    decision:
      'Moved the RecyclerView to scroll directly under `SwipeRefreshLayout`, delegating the swipe-to-refresh child-scroll check to the RecyclerView itself. User-list adapters moved from wholesale `notifyDataSetChanged()` to `DiffUtil`, so only changed rows re-bind.',
    insight:
      "The same nested-scroll anti-pattern recurred in more than one screen. Each instance had to be found and fixed individually, since Android doesn't warn about it until an ANR trace shows the framework serializing every row inflate.",
    watermark: 'Recycle',
    proof: {
      kind: 'table',
      columns: ['Pattern', 'Fix'],
      emphasizeCol: 1,
      rows: [
        ['RecyclerView inside NestedScrollView', 'Moved under SwipeRefreshLayout directly'],
        ['notifyDataSetChanged() on every update', 'DiffUtil, changed rows only'],
        ['Shared WebView across help center / feed / classroom', 'Reworked CollPollWebView'],
        ['Flutter engine lifecycle', 'Reuse/lifecycle tuning in FlutterEngineManager'],
      ],
    },
  },
  {
    id: 'build-shrinking',
    index: '04',
    eyebrow: 'Build & APK Size',
    icon: Database,
    headingLines: ["A silent stripping failure", "let Flutter's engine ship", 'unstripped, at 156MB.'],
    accentIndex: 1,
    impact: 'Reverted a Flutter-driven size regression, ~92MB back down to 54.8MB, no runtime cost',
    problem:
      "Adding the Flutter engine for the add-to-app integration nearly doubled reference-device download size, from ~55MB to ~92MB. Root cause: Android Gradle Plugin strips native libraries via a specific NDK's `llvm-strip`, and without an explicit `ndkVersion` pin, AGP silently falls back to its default NDK. If that default isn't installed, it skips stripping entirely with no build error, so Flutter's `libflutter.so` shipped unstripped, ~156MB versus ~11MB stripped, per ABI.",
    decision:
      'Pinned `ndkVersion` in `app/build.gradle` by reading it directly from the `:flutter` module\'s own `flutter.ndkVersion` extension (via `evaluationDependsOn(":flutter")`), so the host app\'s NDK can never drift from whatever version Flutter\'s build actually requires, on this Flutter SDK or the next.',
    insight:
      "This was a build-tooling failure mode with no visible error message. AGP doesn't fail the build or warn when it can't find the pinned NDK and skips stripping, it just ships the bloat. The fix costs nothing at runtime since it's a pure build-config change, but it can silently regress again on any Flutter SDK upgrade that changes the required NDK version, unless the version is sourced from Flutter's own extension rather than hardcoded.",
    watermark: 'Build',
    proof: {
      kind: 'code',
      filename: 'app/build.gradle',
      code: `// Pin the NDK so AGP can always find llvm-strip and strip native libs
// (e.g. Flutter's libflutter.so: ~156 MB unstripped -> ~11 MB stripped).
// Without this, AGP falls back to its default NDK; if that isn't installed
// it silently skips stripping and the AAB bloats by ~150 MB/ABI.
ndkVersion project(":flutter").extensions.getByName("flutter").ndkVersion`,
    },
  },
  {
    id: 'security-performance',
    index: '05',
    eyebrow: 'Security-Adjacent Performance',
    icon: ShieldAlert,
    headingLines: ['Security hardening caused', 'the regressions it then had', 'to fix.'],
    accentIndex: 1,
    impact: 'Root/hook-detection no longer blows past the security watchdog on real devices',
    problem:
      'Root and hook-detection probes were fast enough on emulators to pass CI, but slow enough on real devices to blow past the security watchdog timeout and fail closed on cold start.',
    decision:
      'Replaced the third-party `RootBeer` library with a custom, lighter detector. Swapped subprocess-based checks for reflection and per-package lookups (see [[cold-start-consolidation|Cold Start]]). Made the watchdog fail-open on timeout instead of indefinitely blocking the user.',
    insight:
      "Failing open on a security check that didn't finish in time is a deliberate tradeoff: blocking a legitimate user indefinitely because a probe is slow is worse than occasionally letting a session through unchecked, since the probe still runs, just without gating the UI on its result.",
    watermark: 'Security',
    proof: {
      kind: 'table',
      columns: ['Change', 'Reasoning'],
      emphasizeCol: 1,
      rows: [
        ['RootBeer to custom detector', 'Lighter, faster on real devices'],
        ['Fail-closed watchdog to fail-open on timeout', 'Never block a legitimate user indefinitely'],
        ['getprop subprocess to reflection', "No fork() during already-heavy cold start"],
        ['getInstalledPackages() to per-package lookup', 'Avoids serializing every installed app'],
      ],
    },
  },
]
