# CASE_STUDY_STRUCTURE.md — Reference for building a new case study

This documents the actual structure of the Flutter case study as it exists in code today,
so a new case study (e.g. a second entry on the index circuit) can follow the same
pattern instead of inventing a new one. Read this before adding a new case study.

Everything below reflects the current codebase. If the code has since diverged from this
doc, trust the code and update this file.

---

## 1. Mental model

A case study is a full-screen **sheet that slides up over the homepage** when a leaf
node on the index circuit is clicked. It is not a routed page — this is a single-page
app with no router (`App.tsx` mounts `Home`, `ImpactPage`, `IndexPage`, and
`CaseStudyOverlay` all at once; visibility is controlled by React state, not a URL).

Inside the sheet there are **three vertically-scrolled sections** (the `.page`
container scrolls on the y-axis; the spy bar jumps by `scrollTop = el.offsetTop`),
tracked by a scroll-spy sidebar:

1. **Overview** — the "what/why" story: hero intro, product screenshots, business
   problem, ownership, headline impact stats. This is the only section that grows and
   scrolls internally.
2. **System architecture** (locked to one viewport, not scrolling) — an interactive,
   pan/zoomable lifecycle diagram on the left, paired with a detail panel on the right
   that swaps content based on which diagram node is selected. Each node maps to a
   "deep dive": a problem/decision/insight writeup backed by a code/table/flow proof
   artifact.
3. **CI/CD architecture** (same locked, node-driven pattern as section 2) — a second
   diagram + deep-dive pair covering the release pipeline. It is a near-verbatim
   duplicate of section 2's machinery under a different folder (see §3/§5).

The Flutter case study grew from two sections to three: the deep-dive/diagram pattern
proved reusable enough that CI/CD got its own copy rather than being folded into the
first diagram. Both locked sections share the same components and CSS; only their data
files differ.

---

## 2. Entry point wiring

```
src/features/IndexCircuit/circuitData.ts      → case study node data (id, label, pillPath, position)
src/features/IndexCircuit/index.tsx           → OPENABLE_CASE_STUDY_IDS set gates which leaf nodes are clickable
src/features/IndexCircuit/CircuitCaseStudyPill.tsx → renders the clickable leaf node on the SVG circuit board
src/context/CaseStudyOverlayContext.tsx       → { openId, open, close } — which case study (by id) is open
src/features/CaseStudyOverlay/index.tsx       → the sliding sheet itself; renders CaseStudyGallery when open
```

**Important current limitation**: `CaseStudyOverlay` does not switch on `openId` — it
always renders `CaseStudyGallery` (the Flutter one), regardless of which id opened it.
Today there is only one openable case study (`'flutter-integration'`, gated by
`OPENABLE_CASE_STUDY_IDS`). To add a second case study you must:

1. Add its id to `OPENABLE_CASE_STUDY_IDS` in `IndexCircuit/index.tsx`.
2. Make `CaseStudyOverlay` switch on `openId` and render the matching gallery
   component instead of hardcoding `CaseStudyGallery`.

---

## 3. File layout of the current (Flutter) case study

```
src/pages/CaseStudyGallery/           → the shell: spy bar + the three sections
  index.tsx
  CaseStudyGallery.module.css
  SpyBar.tsx                         → scroll-spy sidebar nav (3 items: Overview, System architecture, CI/CD Architecture)
  SpyBar.module.css

src/pages/FlutterCaseStudyPage/       → Section A: Overview
  index.tsx                          → composition root only
  CaseStudyIntro.tsx                 → eyebrow + heading + description + tag pills
  ProductDeliveredCard.tsx           → 3-screenshot fan display + lightbox trigger
  ScreenshotLightbox.tsx             → full-screen zoom/carousel portal
  BusinessProblemCard.tsx            → uses InfoCard
  OwnershipCard.tsx                  → uses InfoCard, bullet list
  InfoCard.tsx                       → shared eyebrow+body card wrapper (Business Problem / Ownership)
  ImpactBar.tsx                      → 1 hero stat + 3 icon stats, horizontal bar
  GhostBackdrop.tsx                  → (removed) decorative watermark — was deleted from this page
  page-content.md, page-4-content.md → plain-text copy dumps, kept in sync with the .tsx copy by hand

src/pages/PlatformEngineeringPage/    → Section B: System architecture deep-dive
  LifecycleMap.tsx                   → hand-drawn SVG diagram, pan/zoom, clickable nodes → selects a panel
  LifecycleMap.module.css
  lifecycleMapData.ts                → MAP_NODES / MAP_CONNECTORS geometry + panelId links (7 panel nodes)
  DeepDivePanel.tsx                  → renders one panel: eyebrow/heading/impact/problem/decision/insight + proof
  DeepDivePanel.module.css
  deepDiveData.ts                    → DEEP_DIVE_PANELS array — the content for every node (6 panels)
  PanelProof.tsx                     → renders proof.kind: 'code' | 'table' | 'flow'
  PanelProof.module.css

src/pages/CiCdArchitecturePage/       → Section C: CI/CD architecture deep-dive
  LifecycleMap.tsx                   → same diagram component, different filter/marker ids (rough-cicd, arrow-cicd, dot-cicd)
  LifecycleMap.module.css            → IDENTICAL to PlatformEngineeringPage's copy
  pipelineMapData.ts                 → this section's MAP_NODES / MAP_CONNECTORS (8 panel nodes)
  DeepDivePanel.tsx                  → same renderer (only a JSDoc comment differs from Platform's)
  DeepDivePanel.module.css
  deepDiveData.ts                    → this section's DEEP_DIVE_PANELS (5 panels)
  PanelProof.tsx                     → IDENTICAL to PlatformEngineeringPage's copy
  PanelProof.module.css
```

Section C is a **copy-paste duplication** of Section B's folder (the duplicate-vs-generalize
choice discussed at the end of this section). `PanelProof.tsx` + `LifecycleMap.module.css`
are byte-identical across the two; `DeepDivePanel.tsx` differs only in a comment. Only the
`*MapData.ts` and `deepDiveData.ts` content files carry real per-section difference. Two
copies is tolerable; if a **third** diagram section is ever added, that is the point to
stop duplicating and extract the `LifecycleMap` + `DeepDivePanel` + `PanelProof` trio into
one shared, data-driven module that takes `{ nodes, connectors, panels }` as props.

`FlutterCaseStudyPage` and `PlatformEngineeringPage` are named after this specific case
study's content, not generically — there's no abstraction yet for "any case study's
overview" or "any case study's architecture diagram". A second case study currently
means either (a) duplicating this folder pattern under a new name, or (b) generalizing
these into reusable, data-driven components first. Which one to do is a call to make
when you get there — not decided by this doc.

---

## 4. Section A — Overview page anatomy

`CaseStudyGallery` mounts `<FlutterCaseStudyPage />` inside `<section id="overview">`.
Layout (`FlutterCaseStudyPage.module.css`):

```
topRow     → flex row: CaseStudyIntro (left) | ProductDeliveredCard (right)
middleRow  → flex row: BusinessProblemCard | divider | OwnershipCard
impact     → ImpactBar, full width
```
Mobile (`≤768px`): both rows collapse to `flex-direction: column`.

- **CaseStudyIntro**: eyebrow label, 3-line stacked heading (one accent line), one
  description paragraph, row of icon+label tag pills (tech stack).
- **ProductDeliveredCard**: 3 screenshots — one focal (`.frame`, clickable) with the
  other two peeking out behind it (`.frameSide`, decorative, dimmed). Bottom-fade mask.
  A glass "Click to Enlarge" pill (icon + label) opens `ScreenshotLightbox`, a
  portal-rendered carousel with keyboard arrow/Escape support. The pill is mounted only
  **after the card's entry animation completes** (`onAnimationComplete` → `isEntered`)
  and then reveals with an opacity-led fade + scale — this is the backdrop-filter
  compositing workaround documented in §7 (Animation conventions), not just polish.
- **BusinessProblemCard** / **OwnershipCard**: both wrap `InfoCard` (eyebrow title +
  body). Business Problem is prose paragraphs; Ownership is a bulleted list of past-tense
  action statements.
- **ImpactBar**: first item is a large "hero" stat (value + unit, e.g. `90 → 18 min`);
  remaining items are icon (`GlassBadge`) + title + description, separated by dividers.

---

## 5. Sections B & C — Architecture deep-dive anatomy

Both the System-architecture and CI/CD sections use this identical shape. `CaseStudyGallery`
renders each as a **locked, non-scrolling** section (`.sectionLocked`, `height: 100vh`)
with a two-column grid:

```
archMap    → <LifecycleMap activePanelId={selected} onSelect={setSelected} />
archDetail → <DeepDivePanel panel={selectedPanel} variant="stacked" />  (AnimatePresence crossfade on change)
```

Each section holds its own local selection state in `CaseStudyGallery` (`selected` /
`selectedCiCd`), each defaulting to its first panel's id, and pulls from its own
`DEEP_DIVE_PANELS` import. The CI/CD copy imports the `CiCdArchitecturePage` versions of
`LifecycleMap` / `DeepDivePanel` / `deepDiveData`.

### LifecycleMap (the diagram)

- Hand-drawn SVG (`filter: url(#rough)` displacement + `--font-hand`), nodes are rounded
  rects, connectors are bezier/straight paths with arrow or dot end markers.
- Data lives in `lifecycleMapData.ts`: `MAP_NODES` (id, optional `panelId`, label, sub,
  rect) and `MAP_CONNECTORS` (id, path `d`, optional label, end marker).
- A node with `panelId` is interactive (clickable/focusable, calls `onSelect(panelId)`
  on click or Enter/Space); a node without `panelId` is purely decorative (dashed
  outline, muted).
- One node can double as the title/overview trigger (`MAP_TITLE`).
- **Pan/zoom** via the `usePanZoom` hook (`src/hooks/usePanZoom.ts`): drag-to-pan,
  button-driven `−`/`+` zoom, and a reset button that only appears once zoomed. Zoom is
  deliberately **not** wheel-driven (a wheel gesture over a canvas inside a scrolling
  page is ambiguous) and always anchors on the container centre. Pan is clamped so the
  content can never be dragged fully out of view.
- Bottom-of-map controls are two glass pills: a centred **"Drag to pan"** hint
  (`MousePointerClick` icon) and a bottom-right zoom cluster. Both reveal on scroll-into-view
  (`whileInView`, opacity-led — see §7 Animation conventions) and follow the shared
  glass-pill button spec (§6).

### DeepDivePanel (the content, `deepDiveData.ts`)

```ts
interface DeepDivePanel {
  id: string
  index: string           // '01', '02', ...
  eyebrow: string          // small label above the heading
  icon: LucideIcon
  headingLines: string[]   // stacked heading, one line per <span>
  accentIndex: number      // which headingLines index renders in the accent color
  impact: string           // single-line pill stat, e.g. 'Zero blast radius on the existing native app'
  problem: string
  decision: string
  insight: string
  watermark: string        // giant faint background word
  proof?: Proof            // omit only for the panel that instead sets `guide`
  guide?: string           // shown instead of a proof — orients the reader to the diagram itself
}
```

Every panel renders: eyebrow, heading, `impact` pill, then **Problem** and **Decision**
rows (label + paragraph), then an **Insight** callout below a divider, then on the right
either the `proof` artifact or the `guide` paragraph (used only by the panel that sits
next to the diagram itself — read the diagram, not more prose).

### Proof (`PanelProof.tsx`), three kinds

```ts
type Proof =
  | { kind: 'code'; filename: string; code: string }
  | { kind: 'table'; columns: string[]; rows: string[][]; emphasizeCol: number }
  | { kind: 'flow'; steps: FlowStep[] }

type FlowStep =
  | { type: 'node'; label: string; detail?: string }
  | { type: 'branch'; condition: string; yes: {...}; no: {...} }
```

- `code` → renders via the shared `src/components/CodeBlock` (mac-dot header with
  filename, syntax-agnostic `<pre>`).
- `table` → simple table, one column optionally emphasized (primary color).
- `flow` → vertical chain of nodes and yes/no branches, used for lifecycle logic that's
  clearer as a diagram than as a code snippet (e.g. the Teardown panel's dispose logic).

Pick `code` when the proof IS the actual implementation; `table` for compact
before/after or option comparisons; `flow` for branching runtime logic.

---

## 6. Reusable primitives used by case studies

| Component | Path | Role |
|---|---|---|
| `InfoCard` | `pages/FlutterCaseStudyPage/InfoCard.tsx` | eyebrow + body wrapper, used by Business Problem / Ownership |
| `GlassBadge` | `components/GlassBadge` | glassmorphism ring around a Lucide icon — used in ImpactBar, MetricCard, DeepDivePanel eyebrow |
| `CodeBlock` | `components/CodeBlock` | the only code-rendering primitive — reuse it, don't build another |
| `ScreenshotLightbox` | `pages/FlutterCaseStudyPage/ScreenshotLightbox.tsx` | portal-rendered zoom/carousel, keyboard nav |
| `SpyBar` | `pages/CaseStudyGallery/SpyBar.tsx` | scroll-spy sidebar; generic over `{ id, label }[]`, reusable as-is |
| `useScrollSpy` | `hooks/useScrollSpy.ts` | IntersectionObserver-based active-section tracker, generic, reusable as-is |
| `usePanZoom` | `hooks/usePanZoom.ts` | drag-to-pan + button-zoom for a fixed-size canvas, clamped; returns `{ containerRef, transform, isDragging, isZoomed, reset, zoomIn, zoomOut, canZoomIn, canZoomOut, handlers }`. Generic, reusable as-is |
| `MetricCard` | `components/MetricCard` | icon+metric+title+description card — **not currently used inside the case study**, but available if a future case study wants a grid of stat cards instead of the custom `ImpactBar` layout |

`SpyBar`, `useScrollSpy`, and `usePanZoom` are the pieces here that are already fully
generic — everything else is Flutter-content-specific and would need either duplication
or generalization for a second case study.

### The glass-pill button system

Every clickable "chrome" control across the case study shares one visual spec — reuse
it for any new button so the page stays in sync (this was explicitly enforced this
session):

- **Shape/size**: `height: 40px`, `border-radius: 999px`, text at `0.82rem`, icons at
  `16px`, `gap: 8px`, `padding: 0 16px` (icon-only variants are `40×40`).
- **Surface**: `background: var(--color-white-a04)`, `border: 1px solid var(--color-white-a08)`,
  `backdrop-filter: blur(20px)`.
- **States**: hover → `background: var(--color-white-a07)`, `border-color: var(--color-white-a15)`;
  focus-visible → `outline: 1px solid var(--color-primary-a60)`, `outline-offset: 2px`.
- **Icon colour**: `var(--color-primary)` (green) on the leading icon.

Instances following this spec: the overlay **Share** / **Close** pills
(`CaseStudyOverlay`), the **Click to Enlarge** pill (`ProductDeliveredCard`), and both
maps' **zoom cluster** + **Drag to pan** hint (`LifecycleMap`). There is no shared
`Button` component yet — the spec is duplicated in each `.module.css`. If a fourth
consumer appears, extract a `GlassButton` primitive rather than copying it again.

---

## 7. Content & copy conventions (learned this session)

- **No em dashes (`—`)** in any user-facing copy. Rewrite with a colon (explanatory
  clause), a comma (joining independent clauses), or parentheses (a true aside) —
  whichever reads most naturally for that specific sentence. This applies to strings in
  `deepDiveData.ts`/`lifecycleMapData.ts` and to comments inside displayed `code` proof
  blocks (those are rendered on-page). It does **not** apply to internal JSDoc/comments
  in the `.ts`/`.tsx` source that are never rendered.
- **Impact/stat pills are a single claim, not two independent numbers stapled together.**
  A pattern like `"60 native modules · 0 rewrites"` reads ambiguously — which number is
  the achievement? Prefer one sentence that makes the causal relationship explicit, e.g.
  `"Zero blast radius on the existing native app"` or `"0 double-navigations, every
  re-entry path"`. If a number in the stat requires the reader to already know what it
  refers to (e.g. "4 re-entry paths" without ever having read the problem text), drop
  the number and name the concept instead ("every re-entry path").
  See `deepDiveData.ts` → `impact` fields for the resolved examples.
- **Tone**: terse, causal, engineering-precise — matches the site owner's own notes
  voice (short independent clauses, cause → consequence framing, no marketing adjectives
  like "seamless"/"robust"/"leveraging"). When in doubt, favor the vocabulary a senior
  engineer would actually use to describe risk and architecture (e.g. "blast radius",
  "regression risk", "source of truth") over generic achievement language.
- Colors always come from `src/styles/theme.css` custom properties, never hardcoded hex
  — see root `CLAUDE.md` for the full theme system rules. Text-emphasis specifics
  established this session: `var(--color-white)` for content that needs to read at full
  brightness (e.g. Ownership list items, DeepDivePanel row text, chart node labels),
  `var(--color-text-primary)` for standard body copy, `var(--color-text-muted)` for
  secondary/annotation text (chart sub-labels, connector labels).
- **Carry debt loud and dated, don't hide it.** The deep-dive copy deliberately names
  its own open gaps and version couplings inline: `signingConfigs.debug` is "flagged
  before Play Store publish", the CI NDK fallback is called "a real coupling, not a
  convenience", the process-death ordering is "validated against Flutter 3.41.9, with an
  instruction to re-verify on upgrade". This honesty is a feature of the voice, not a
  TODO to clean up — it reads as senior judgement to an engineering recruiter. Keep it
  in new panels' `insight` fields.

### Animation & UI conventions (learned this session)

- **`backdrop-filter` + an animating ancestor transform = a flat/transparent flash.**
  Chrome cannot composite a glass (`backdrop-filter`) element correctly while any
  ancestor is mid-`transform` (the sheet slide-up, a card's `y` entry animation). The
  element paints flat until the transform settles, then the blur "pops" in. Computed
  style still reports `blur(20px)` the whole time — it's a compositing artifact, not a
  CSS value change, so it can't be debugged by reading styles.
- **Two fixes, used together:** (1) mount glass controls only **after** the entry
  transform completes — gate on framer's `onAnimationComplete` (`ProductDeliveredCard`)
  or `whileInView` (`LifecycleMap` controls); (2) make reveal animations **opacity-led**
  — fade `opacity 0→1` alongside a small `scale`, so while the scale is far from `1`
  (where the backdrop mis-composites) the element is still near-invisible and the fade
  masks the transient. Never reveal a glass element with a transform alone.
- Standard entry easing across the case study is `[0.16, 1, 0.3, 1]`; section content
  reveals with `whileInView` + `viewport={{ once: true }}` (see `DeepDivePanel.fadeUp`,
  `ImpactBar`), one-shot mount reveals use `initial`/`animate`.

---

## 8. Checklist for adding a new case study

1. Add a leaf node entry to `circuitData.ts` (id, label, pillPath, positions) and add
   the id to `OPENABLE_CASE_STUDY_IDS` in `IndexCircuit/index.tsx`.
2. Update `CaseStudyOverlay` to switch on `openId` and render the right gallery
   component (currently it always renders `CaseStudyGallery` — this needs generalizing
   first, see §2).
3. Decide: duplicate the `FlutterCaseStudyPage` + `PlatformEngineeringPage` folder
   pattern under new names, or extract the generic parts (layout shells, `InfoCard`,
   `ImpactBar` shape, `DeepDivePanel`/`PanelProof`/`LifecycleMap` machinery) into
   data-driven components that take the new case study's content as props/data files.
4. Write the Overview content: intro (eyebrow/heading/description/tags), 2–3
   screenshots, business problem (1–2 paragraphs), ownership (bulleted past-tense
   actions), impact bar (one hero metric + up to 3 supporting stats).
5. Design the lifecycle/architecture diagram(s): identify the distinct engineering
   decisions worth a deep dive (aim for 4–6 per diagram, matching the Flutter case
   study's Seam / Engine / Routing / Process Death / Teardown / Bridge breakdown), lay
   out `MAP_NODES`/`MAP_CONNECTORS`, and write one `DeepDivePanel` entry per node
   (problem/decision/insight/proof). A second diagram section (like CI/CD) is optional —
   add it only if there's a genuinely separate system worth its own map; if you do,
   duplicate the folder (as CI/CD did) unless this is the third such section, in which
   case generalize first (see §3).
6. Apply the copy conventions in §7 before treating any text as final — check for em
   dashes and ambiguous stat pairings specifically, and make sure known gaps are flagged
   in-copy rather than hidden.
7. Sanity-check the recruiter lens (§9): each deep dive should name a concrete failure
   it prevents, not just describe a feature.

---

## 9. What to showcase to a recruiter (the content lens)

This repo has no product source — the "code" in each panel is an illustrative excerpt.
So the recruiter-facing value lives entirely in *which decisions* the case study chooses
to surface and *how* it frames them. A detail earns a spot on the page when it does at
least one of:

- **Names a concrete failure it prevents** ("crash-on-resume", "double-navigation",
  "secrets in logcat", "host crash on logout") rather than describing a feature.
- **Carries a measurable delta** (`4s → instant`, `~140MB → ~9MB`, `90 → 18 min`,
  `~150MB/ABI recovered`) — a before/after a non-engineer can still register.
- **Shows a non-obvious systems call** the average mid-level engineer would miss: the
  cache (not a local field) as source of truth, the Intent as the single navigation
  authority, dispose-only-when-detached sequencing, config swap as a task `dependsOn`.
- **Flags its own remaining risk** honestly (§7, "carry debt loud").

The current Flutter case study is the worked example — its showcase spine:

| Layer | The headline | Why it lands with a recruiter |
|---|---|---|
| Impact bar | `90 → 18 min` CI/CD · Zero blast radius · `4s → instant` · `~140MB → ~9MB` | Four numbers that frame scope before any prose |
| Seam | one activity / one engine / one channel / six handlers | Shows restraint: the hard part is the seam, not the line count |
| Engine | one cached `FlutterEngine`, identity-checked against the cache | Cache as source of truth; `4s → instant` |
| Routing | route rides in the `Intent`, replayed by the Android lifecycle | Correct across config-change, process death, `singleTask` re-entry |
| Process death | re-warm before `super.onCreate`, drop stale saved state | Turns a resume-crash into a clean re-warm; version-pinned honestly |
| Teardown | destroy only once provably detached | Two out-of-order events sequenced safely; `0 host crashes on logout` |
| Bridge | one channel, chain-of-responsibility handlers, log shape-not-value | Fault isolation + no PII in logs from one design |
| CI/CD: scaffold | idempotent `tool/setup.sh --permissions` after every `pub get` | "Make regeneration harmless" instead of "don't regenerate" |
| CI/CD: artifact boundary | prebuilt AAR in CI vs `project(":flutter")` locally, via `isCI` | No Dart toolchain on the build agent, hot reload kept locally |
| CI/CD: NDK lock | pin the NDK or ship `libflutter.so` unstripped | `~150MB/ABI`; a *silent* size regression, not a build error |
| CI/CD: variant wiring | config swap force-wired as a task `dependsOn` | Removes a deadline-fragile manual step from the build |
| CI/CD: symbols & signing | obfuscate + `--split-debug-info` + `llvm-strip`; debug-keystore gap flagged | Small, symbolicated releases; open item named, not hidden |

When writing a new case study, aim for this density: a handful of decisions that each
prevent a named failure and carry a number, plus one honestly-stated open risk.
