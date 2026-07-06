# Cohesion audit — shared rubric for per-page design-gap analysis

The product owner reviewed the staging deploy and rejected it: the end-to-end design was a brief to **take the whole application and make it cohere** ("rip it apart and put it back together so it makes sense"). What shipped instead is **design fragments slotted next to the pre-existing app** — the new shell/nav/lens/Atlas pieces landed, but most of the app was never reconciled to them. This audit produces one GitHub issue per page capturing the gap.

Concrete symptom the owner cited: on the Discovery canvas, the in-canvas **Views** popup still lists `Discovery · Structured · Architecture · Data Dictionary · Journeys · Data Flow` as flat peers — which (a) duplicates and contradicts the regrouped left nav (Board / Design / Registers / Deliver), (b) exposes **Structured** as a peer view when the design made it a *lens* of Discovery (the freeform⇄structured pill), and (c) lists Architecture / Data Dictionary / Journeys as flat entries rather than the ROOM ↗ / ON BOARD surfaces the nav now labels. That popup is the seam where "bits slotted in" is visible.

## The design's established language (what every surface must now cohere to)

Read these (same directory):
- `design-spec.md` — exact tokens, the four-mechanics taxonomy, component anatomy.
- `understanding.md` — how the real app is built (file/line refs).
- `WorkSpec Shell.dc.html`, `Morph + Tether Prototype.dc.html`, `WorkSpec Arc.dc.html` — the prototypes.

Load-bearing principles to judge each page against:
1. **The four mechanics, pinned.** Pill = lens (total re-representation) · Overlay = tint (temporary, total) · ON BOARD = projection (partial re-cluster, shares board logic) · ROOM ↗ = tethered surface (own spatial logic + breadcrumb home). A partial view never goes in the lens pill.
2. **Nav grouped by what a surface IS** — Board · Design · Registers · Deliver · Project · Workspace. No "Phase" machine; readiness is per element.
3. **One board, two lenses** — freeform ⇄ structured is a pill on one canvas, not two tabs/views.
4. **Design rooms are tethered/projected, not flat peers** — Architecture + Data Flow = ROOM ↗; Data Dictionary + User Journeys = ON BOARD.
5. **Atlas is the single co-author rail** — reasoning stream + pencilled proposals + tombstoned dismissals; not a chat window, not a flat "Proposals" tab.
6. **Console-light token system** — bg `#f6f6f7`, cards `#fff`, line `#e4e4e7`, ink `#0a0a0c`, accent green `#1b8a55`, agent teal `#0d8a72`; Inter Tight UI + JetBrains Mono labels + Caveat for the AI/pencil hand layer. Both light and dark themes must read.
7. **Material encodes state** — draft = dashed/pencil, inked = solid, rework = coral halo, drift = amber. State is never a separate dashboard.

## Per-page analysis rubric (what each issue must contain)

For the assigned page:
1. **Read the real implementation** (the page component + its key sub-components/panels) so findings are grounded, not generic.
2. **Determine design coverage**: `covered` (the design bundle specifies this surface) · `partial` (touched but incompletely, or only the chrome around it) · `none` (no design exists — **needs design**).
3. **List specific failings** — each a concrete, addressable gap against the principles above. Cite what the page does today vs. what cohesion requires. Cover at minimum: does it use the new shell + grouped nav + tokens, or does it look like a different era of the app? Does it contradict any of the four mechanics? Does it duplicate navigation the nav now owns? Is its AI surface the Atlas rail or something older? Theme legibility?
4. **Verdict**: `needs-design` (no spec — design must define it) and/or `needs-rework` (spec exists, implementation diverges).

## GitHub issue template (file with `gh issue create`)

Title: `Cohesion: <Page name> — <one-line gap>`
Labels: `design-cohesion-audit` always; add `needs-design` when coverage is `none`.

Body (markdown):
```
## Page
<name> · route(s) `…` · component `artifacts/workspec/src/pages/….tsx`

## Design coverage
covered | partial | none — <one sentence on what the design bundle says, or that it's silent>

## Current state
<2–4 sentences: what the page renders and does today, grounded in the code>

## Failings vs. the design language
- <specific gap 1>
- <specific gap 2>
- …

## Verdict
needs-design | needs-rework | both — <what has to happen>

## References
- Design: docs/design-handoffs/end-to-end-product-flow/{design-spec.md, …}
- Part of the cohesion audit epic (#EPIC)
```

Be specific and honest. "Looks fine, low priority" is a valid finding for a standard auth page — say so rather than inventing problems. But for any core product surface, dig: the owner's complaint is that the analysis so far has been shallow.
