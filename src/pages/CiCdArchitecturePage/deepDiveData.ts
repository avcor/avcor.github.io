import { RotateCcw, GitBranch, Lock, Settings2, ShieldCheck } from 'lucide-react'
import type { DeepDivePanel } from '../../components/ArchitectureDiagram/types'

export const DEEP_DIVE_PANELS: DeepDivePanel[] = [
  {
    id: 'scaffold-regen',
    index: '01',
    eyebrow: 'Scaffold Regeneration',
    icon: RotateCcw,
    headingLines: ['Every pub get', 'erases the host.'],
    accentIndex: 1,
    impact: '0 forgotten permissions across every scaffold wipe',
    problem:
      'digii-mobile is a Flutter module, not an app: `flutter pub get` regenerates `.android/` and `.ios/` from scratch on every run, silently wiping host AndroidManifest permissions and the AppAuth redirect scheme.',
    decision:
      '`tool/setup.sh --permissions` re-patches `AndroidManifest.xml`, `build.gradle` manifestPlaceholders, and `Info.plist` idempotently after every `pub get`. `--doctor` is a read-only check that warns when the scaffold has drifted.',
    insight:
      'The fix is not "don\'t regenerate," it\'s making the regeneration harmless: the patch step is scripted and runs automatically in CI, not remembered by a developer.',
    proof: {
      kind: 'flow',
      steps: [
        { type: 'node', label: 'flutter pub get', detail: 'regenerates .android/ .ios/ from the module template' },
        { type: 'node', label: 'Host permissions wiped', detail: 'AndroidManifest, AppAuth scheme, Info.plist reset' },
        { type: 'node', label: 'tool/setup.sh --permissions', detail: 'idempotent re-patch, runs every build' },
        { type: 'node', label: '--doctor (read-only)', detail: 'flags drift before it ships' },
      ],
    },
  },
  {
    id: 'artifact-boundary',
    index: '02',
    eyebrow: 'The Artifact Boundary',
    icon: GitBranch,
    headingLines: ['One AAR,', 'two different sources.'],
    accentIndex: 1,
    impact: 'One dependency graph switch, zero source duplication',
    problem:
      'The Flutter module and the Android host are separate repos. CI needs the host to build without ever checking out or compiling Flutter source, but local development needs to iterate against it directly.',
    decision:
      '`flutter build aar` publishes a versioned AAR into a local Maven repo. `build.gradle` branches on an `isCI` flag: CI resolves the prebuilt AAR from that repo (transitively pulling the per-ABI engine AARs via its POM), local builds depend on `project(":flutter")` directly.',
    insight:
      '`evaluationDependsOn(":flutter")` only runs when the Flutter source module is actually present, so CI never has to check it out just to read one Gradle extension property.',
    proof: {
      kind: 'table',
      columns: ['Context', 'Dependency source', 'What it buys'],
      emphasizeCol: 1,
      rows: [
        ['CI', 'com.CollPoll:flutter_release:1.0 (local Maven)', 'No Flutter checkout, no Dart toolchain on the build agent'],
        ['Local dev', 'project(":flutter") (source module)', 'Hot reload, breakpoints into Dart, always current'],
      ],
    },
  },
  {
    id: 'ndk-lock',
    index: '03',
    eyebrow: 'The NDK Lock',
    icon: Lock,
    headingLines: ['Pin the NDK,', 'or lose 150MB silently.'],
    accentIndex: 1,
    impact: '~150MB/ABI recovered per stripped release',
    problem:
      'AGP needs the exact NDK that matches the Flutter engine to find `llvm-strip`. If it can\'t, it silently skips stripping and `libflutter.so` ships unstripped: ~156MB instead of ~11MB, per ABI.',
    decision:
      '`ndkVersion` reads `project(":flutter").extensions.getByName("flutter").ndkVersion` locally, so it can never drift from whatever Flutter SDK digii-mobile points to. CI has no `:flutter` module to query, so the resolved value is a comment-documented hardcoded fallback.',
    insight:
      'The CI fallback is a real coupling, not a convenience: bump the Flutter SDK and forget to update the CI constant, and the failure is a silent size regression, not a build error.',
    proof: {
      kind: 'code',
      filename: 'app/build.gradle',
      code: `ndkVersion isCI
    ? "28.2.13676358"  // must match Flutter SDK's ndkVersion
    : project(":flutter").extensions
        .getByName("flutter").ndkVersion`,
    },
  },
  {
    id: 'variant-wiring',
    index: '04',
    eyebrow: 'Variant Config Wiring',
    icon: Settings2,
    headingLines: ['Config swap is', 'a task dependency,', 'not a convention.'],
    accentIndex: 1,
    impact: 'Google-services config can\'t ship to the wrong build type',
    problem:
      'debug/qa and release builds need different `google-services.json` files. Relying on a developer to manually swap the file before building is exactly the kind of step that gets skipped under deadline pressure.',
    decision:
      '`switchToNonRelease` and `switchToRelease` Copy tasks stage the correct file, and an `afterEvaluate` block force-wires them as a `dependsOn` for every relevant per-variant task, so the swap runs whether or not anyone remembers it.',
    insight:
      '`registerDependencies()` looks up each task by name and only wires it if present, which is what makes the same block safe across build-type task graphs that don\'t all exist for every variant.',
    proof: {
      kind: 'code',
      filename: 'app/build.gradle',
      code: `def nonReleaseTasksQa = [
    'processQaGoogleServices',
    'mergeQaJniLibFolders',
    'collectQaDependencies',
]
registerDependencies(nonReleaseTasksQa, "switchToNonRelease")`,
    },
  },
  {
    id: 'symbol-signing',
    index: '05',
    eyebrow: 'Symbol & Signing Hygiene',
    icon: ShieldCheck,
    headingLines: ['Readable crashes,', 'correctly signed.'],
    accentIndex: 0,
    impact: '~140MB → ~9MB per release APK, symbols kept readable',
    problem:
      'A release build needs to be small, obfuscated, and stripped, but crash reports for an obfuscated, stripped binary are unreadable without the exact symbol files from that build.',
    decision:
      '`flutter build apk --release --obfuscate --split-debug-info=build/symbols/android` writes de-obfuscation maps alongside the APK; a post-build `llvm-strip` pass removes Flutter 3.41\'s unstripped `libflutter.so`. `build/symbols/android` is archived with every release.',
    insight:
      '`tool/release.sh` currently signs with the debug keystore; it\'s flagged in the script\'s own README, not hidden, precisely because the production keystore wiring is still an open item, not an oversight.',
    proof: {
      kind: 'table',
      columns: ['Step', 'Flag / tool', 'Why'],
      emphasizeCol: 1,
      rows: [
        ['Obfuscate', '--obfuscate --split-debug-info', 'Crash symbolication without shipping readable Dart names'],
        ['Strip', 'post-build llvm-strip', 'libflutter.so: ~140MB unstripped, ~9MB stripped'],
        ['Sign', 'signingConfigs.debug (current)', 'Known gap, flagged before Play Store publish'],
      ],
    },
  },
]
