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

Inside the sheet there are exactly **two horizontally-scrollable sections**, tracked by
a scroll-spy sidebar:

1. **Overview** — the "what/why" story: hero intro, product screenshots, business
   problem, ownership, headline impact stats.
2. **Architecture** (locked to one viewport, not scrolling) — an interactive lifecycle
   diagram on the left, paired with a detail panel on the right that swaps content
   based on which diagram node is selected. Each node maps to a "deep dive" — a
   problem/decision/insight writeup backed by a code/table/flow proof artifact.

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
src/pages/CaseStudyGallery/           → the shell: spy bar + the two scroll sections
  index.tsx
  CaseStudyGallery.module.css
  SpyBar.tsx                         → scroll-spy sidebar nav (2 items: Overview, System architecture)
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

src/pages/PlatformEngineeringPage/    → Section B: Architecture deep-dive
  LifecycleMap.tsx                   → hand-drawn SVG diagram, clickable nodes → selects a panel
  LifecycleMap.module.css
  lifecycleMapData.ts                → MAP_NODES / MAP_CONNECTORS geometry + panelId links
  DeepDivePanel.tsx                  → renders one panel: eyebrow/heading/impact/problem/decision/insight + proof
  DeepDivePanel.module.css
  deepDiveData.ts                    → DEEP_DIVE_PANELS array — the content for every node
  PanelProof.tsx                     → renders proof.kind: 'code' | 'table' | 'flow'
  PanelProof.module.css
```

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
  A pill hint (icon + "Click to enlarge") opens `ScreenshotLightbox`, a portal-rendered
  carousel with keyboard arrow/Escape support.
- **BusinessProblemCard** / **OwnershipCard**: both wrap `InfoCard` (eyebrow title +
  body). Business Problem is prose paragraphs; Ownership is a bulleted list of past-tense
  action statements.
- **ImpactBar**: first item is a large "hero" stat (value + unit, e.g. `90 → 18 min`);
  remaining items are icon (`GlassBadge`) + title + description, separated by dividers.

---

## 5. Section B — Architecture deep-dive anatomy

`CaseStudyGallery` renders this as a **locked, non-scrolling** section
(`.sectionLocked`, `height: 100vh`) with a two-column grid:

```
archMap    → <LifecycleMap activePanelId={selected} onSelect={setSelected} />
archDetail → <DeepDivePanel panel={selectedPanel} variant="stacked" />  (AnimatePresence crossfade on change)
```

`selected` is local state in `CaseStudyGallery`, defaulting to the first panel's id.

### LifecycleMap (the diagram)

- Hand-drawn SVG (`filter: url(#rough)` displacement + `--font-hand`), nodes are rounded
  rects, connectors are bezier/straight paths with arrow or dot end markers.
- Data lives in `lifecycleMapData.ts`: `MAP_NODES` (id, optional `panelId`, label, sub,
  rect) and `MAP_CONNECTORS` (id, path `d`, optional label, end marker).
- A node with `panelId` is interactive (clickable/focusable, calls `onSelect(panelId)`
  on click or Enter/Space); a node without `panelId` is purely decorative (dashed
  outline, muted).
- One node can double as the title/overview trigger (`MAP_TITLE`).
- A static hint pill ("Click a node to explore", `MousePointerClick` icon) is centered
  at the bottom of the map — added because the diagram has no other affordance telling
  first-time visitors the nodes are clickable.

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
| `MetricCard` | `components/MetricCard` | icon+metric+title+description card — **not currently used inside the case study**, but available if a future case study wants a grid of stat cards instead of the custom `ImpactBar` layout |

`SpyBar` and `useScrollSpy` are the only pieces here that are already fully generic —
everything else is Flutter-content-specific and would need either duplication or
generalization for a second case study.

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
5. Design the lifecycle/architecture diagram: identify the distinct engineering
   decisions worth a deep dive (aim for 4–6, matching the Flutter case study's Seam /
   Engine / Routing / Process Death / Teardown / Bridge breakdown), lay out
   `MAP_NODES`/`MAP_CONNECTORS`, and write one `DeepDivePanel` entry per node
   (problem/decision/insight/proof).
6. Apply the copy conventions in §7 before treating any text as final — check for em
   dashes and ambiguous stat pairings specifically.
