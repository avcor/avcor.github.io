import { Layers, Cpu, Route, RefreshCw, Power, Cable } from 'lucide-react'
import type { DeepDivePanel } from '../../components/ArchitectureDiagram/types'

export const DEEP_DIVE_PANELS: DeepDivePanel[] = [
  {
    id: 'seam',
    index: '01',
    eyebrow: 'The Seam',
    icon: Layers,
    headingLines: ['Building the seam', 'between two runtimes', 'without a rewrite'],
    accentIndex: 1,
    impact: 'Zero blast radius on the existing native app',
    problem:
      'Digii Campus is a large, long-lived native Android app: ~60 feature modules, mixed Java/Kotlin, Room, Retrofit. New surfaces (exams, placements, digital passes) ship in Flutter without rewriting the host.',
    decision:
      'Keep the native surface deliberately small: one host activity, one engine manager, one method channel, six handler groups. The interesting engineering is the seam between the two runtimes.',
    insight:
      'Add-to-app is easy to demo and hard to run in production. The difference is entirely in the lifecycle seam, and the complexity lives there, not in the line count.',
    watermark: 'Seam',
    guide:
      'The map beside this is the seam. Every state is a place the shared engine can fail: cold start, routing, process death, teardown, the bridge. Select any node to see the code that keeps a host that knows nothing about Flutter alive.',
  },
  {
    id: 'engine',
    index: '02',
    eyebrow: 'The Engine',
    icon: Cpu,
    headingLines: ['One cached engine,', 'reused for every route.'],
    accentIndex: 0,
    impact: '4s cold start → instant',
    problem:
      'A cold `FlutterEngine` (Dart isolate, plugin registration, first frame) paid on every navigation makes Flutter feel like the slow part of the app.',
    decision:
      "Exactly one engine, owned by a `FlutterEngineManager` singleton and parked in Flutter's `FlutterEngineCache`. Every subsequent screen attaches to the already-booted Dart state.",
    insight:
      "The cache is the source of truth, not the local field. `isEngineInitialized()` asserts identity against the cache, so state can't drift into 'I have an engine but the framework disagrees.'",
    watermark: 'Engine',
    proof: {
      kind: 'code',
      filename: 'FlutterEngineManager.kt',
      code: `fun isEngineInitialized(): Boolean {
    val engine = flutterEngine ?: return false
    return FlutterEngineCache.getInstance()
        .get(ENGINE_ID) === engine  // identity, not a null-check
}`,
    },
  },
  {
    id: 'routing',
    index: '03',
    eyebrow: 'Routing',
    icon: Route,
    headingLines: ['The intent is the', 'single source of truth.'],
    accentIndex: 1,
    impact: '0 double-navigations, every re-entry path',
    problem:
      'Pushing the route into Flutter eagerly works in the happy path and breaks everywhere else: config change, process death, and `singleTask` re-entry leave stale, empty, or duplicated routes.',
    decision:
      'The route rides inside the `Intent` as extras. The Android activity lifecycle is the only thing that drives navigation; `onCreate` and `onNewIntent` replay it against the live engine.',
    insight:
      'The whole transition collapses to one condition: apply the route only on a fresh launch or a cold re-warm, never on config-change recreation, where Flutter has already navigated.',
    watermark: 'Routing',
    proof: {
      kind: 'table',
      columns: ['Situation', 'Signal', 'Action'],
      emphasizeCol: 2,
      rows: [
        ['Fresh launch', 'savedInstanceState == null', 'Apply route'],
        ['Re-warm after death', 'engine wasn’t cached', 'Apply route'],
        ['Config recreation', 'saved state + cached engine', 'Don’t re-apply'],
        ['singleTask re-entry', 'onNewIntent', 'Rebind + apply'],
      ],
    },
  },
  {
    id: 'process-death',
    index: '04',
    eyebrow: 'Process Death',
    icon: RefreshCw,
    headingLines: ['Crash-on-resume,', 'eliminated.'],
    accentIndex: 1,
    impact: 'crash-on-resume → clean re-warm',
    problem:
      '`FlutterEngineCache` is in-memory. After Android kills the process, the OS recreates the activity but the cache is empty: the Flutter delegate throws `IllegalStateException` and the app appears to crash on resume.',
    decision:
      'Re-warm the engine before `super.onCreate`, so the delegate finds a live engine where it expects one. On re-warm we drop `savedInstanceState`, since it belongs to the dead engine.',
    insight:
      'The dependency on the framework’s internal ordering is a debt, so it’s carried loud and dated: validated against Flutter 3.41.9, with an instruction to re-verify on upgrade.',
    watermark: 'Resume',
    proof: {
      kind: 'code',
      filename: 'DigiiFlutterActivity.kt',
      code: `val engineWasCached =
    FlutterEngineCache.getInstance().get(engineId) != null
if (!engineWasCached) {
    manager.warmUpEngine(applicationContext)  // re-warm first
}
// fresh engine → fresh start; drop stale saved state
super.onCreate(if (engineWasCached) savedInstanceState else null)`,
    },
  },
  {
    id: 'teardown',
    index: '05',
    eyebrow: 'Teardown',
    icon: Power,
    headingLines: ['Destroy only when', 'nothing is attached.'],
    accentIndex: 1,
    impact: '0 host crashes on logout / tenant switch',
    problem:
      'On logout or tenant switch the shared engine must go, but calling `engine.destroy()` while a `DigiiFlutterActivity` is still attached crashes the host on its next render.',
    decision:
      'Defer disposal until the engine is provably detached. `cleanup()` pulls the engine from the cache immediately so new launches re-warm, but destroys it only once the activity confirms detachment.',
    insight:
      'Two independent events (the logout request and the activity teardown) are sequenced correctly no matter which order they arrive in.',
    watermark: 'Teardown',
    proof: {
      kind: 'flow',
      steps: [
        { type: 'node', label: 'cleanup()', detail: 'logout / tenant switch · main thread' },
        {
          type: 'branch',
          condition: 'activity attached & alive?',
          yes: {
            label: 'remove from cache · pendingDispose = true · activity.finish()',
            detail: 'do NOT destroy yet',
          },
          no: { label: 'disposeInternal()', detail: 'safe, nothing attached' },
        },
        { type: 'node', label: 'onDestroy()', detail: 'after super.onDestroy(), engine is detached' },
        { type: 'node', label: 'if pendingDispose → disposeInternal()', detail: 'destroyed exactly once' },
      ],
    },
  },
  {
    id: 'bridge',
    index: '06',
    eyebrow: 'The Bridge',
    icon: Cable,
    headingLines: ['One channel,', 'a chain of handlers.'],
    accentIndex: 0,
    impact: '1 channel · 6 handlers · 0 secrets in logs',
    problem:
      'Native ↔ Dart traffic (tokens, user records, tenant config) flows over a single `MethodChannel`. A giant when-block would grow forever and risk leaking PII into logcat.',
    decision:
      'Calls fan out through a composite of six focused handler groups (chain of responsibility). A `LoggingResult` decorator traces every call by shape, never by value.',
    insight:
      'A handler that throws degrades to a structured `HANDLER_CRASH` error on the Dart side: a bug in one native handler can’t take down the app.',
    watermark: 'Bridge',
    proof: {
      kind: 'code',
      filename: 'MethodChannel',
      code: `// log the shape, never the value: no secret hits logcat
is Map<*, *> -> "map(keys=\${result.keys.toList()})"
is String    -> "string(len=\${result.length})"

// dispatch: first handler to claim the call wins
val handled = handlers.any { it.handle(call, wrapped) }
if (!handled) wrapped.notImplemented()`,
    },
  },
]
