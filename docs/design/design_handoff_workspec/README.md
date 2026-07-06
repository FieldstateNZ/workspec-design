# Handoff: Workspec Design Set

## Overview

**Workspec** is a graph-native spec OS for product teams. It treats every artifact (note → feature → slice → ticket) as a node in a single living graph, with provenance, drafts, and versions all visible. An AI collaborator ("Atlas") drafts in pencil; humans promote to ink.

This bundle contains **two complete aesthetic directions** for the Workspec product, each shipped as a 14-surface design set:

- **Paper** — blueprint-cream paper, ink-black rules, faded blueprint blue, coral accent. Architectural drawing aesthetic. Source-Serif display, Inter UI, JetBrains Mono meta, Caveat for handwritten layer.
- **Console** (a.k.a. Terminal) — high-tech terminal-inspired direction. Dense, dark, monospace-forward.

Both directions ship the same 14 surfaces so they can be compared apples-to-apples and one chosen (or hybridized) for production.

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes that show intended look and behavior. They are NOT production code to lift wholesale. The task is to **recreate these designs in the target codebase's environment** (React/Next, Vue, SvelteKit, etc.) using its existing component primitives and patterns. If no environment exists yet, the recommended stack is React + Tailwind + a tokens layer wired to CSS custom properties so both directions can ship behind a theme switch.

Some HTML uses runtime React + Babel for interactive prototypes; the static surfaces are plain HTML+CSS. Treat both as visual specs.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, layout, and component anatomy. Recreate pixel-near in the target stack using the documented tokens.

Hand-drawn underlines, pencil annotations, and stamp marks in the Paper direction are intentional and should be preserved (use SVG or a small set of pre-rendered stroke assets).

## Directions

### Paper

**Visual DNA**
- Paper grain — cream stock with faint grid (1px lines on 24px grid, ~6% ink opacity)
- Ink rules — 1.5px solid hairlines, double-rule under section headings (1.5px + 1px @ 40% opacity, 5px gap)
- Coral underline accents — slightly rotated rectangles under emphasized words (`-0.3deg`)
- Cartouche / title block — bottom-right cartouche on contents-style pages (hidden on workspace shells)
- Hand layer — Caveat font for pencil notes, Atlas drafts, marginalia
- Stamps — corner badge stamps for tier markers (e.g. "Most teams")
- Trim marks — registration ticks in the four page corners

**Type ramp**
- Display: Source Serif 4, 600/italic, -0.025 to -0.035em letter-spacing
- UI: Inter 400/500/600/700
- Meta/code: JetBrains Mono 400/500/600
- Hand: Caveat 400/500/600

**Color tokens** (CSS custom properties — see `paper/tokens.css`)
```
--paper:        #f5efe1   /* base sheet */
--paper-soft:   #efe7d3   /* card surface */
--paper-deep:   #e7dfc9   /* sunk panel */
--paper-edge:   #ddd2b6   /* recessed */
--ink:          #1c1814   /* primary text + rules */
--ink-soft:     #3a342c   /* secondary text */
--ink-fade:     #6b6354   /* meta/labels */
--ink-ghost:    #9a9281   /* draft/disabled */
--rule-soft:    rgba(28,24,20,0.18)
--coral:        #c96442   /* accent / draft / live */
--ochre:        #b78a3a   /* warn */
--blue:         #3a5a7a   /* logical lens */
--green:        #4a6b3a   /* approved */
```

### Console (Terminal)

**Visual DNA**
- Black-charcoal field, monospace everywhere, mint and amber accents
- Dense data tables, IDs visible, status pills as ASCII-flavored chips
- Scanlines on hero / live regions
- Frame numbers and timestamps in the chrome (filename : line : col aesthetic)
- Box-drawing rule lines

(Full token set in `console/tokens.css` — read it directly; the visual logic is symmetric to Paper.)

## Surfaces (both directions)

| # | Surface | Purpose |
|---|---|---|
| 01 | `brand.html` | Wordmark, voice, three aesthetic directions, manifesto |
| 02 | `tokens.html` | Color, type, space, radius, shadow, motion tokens |
| 03 | `components.html` | Buttons, inputs, chips, tabs, dialog, toast, menus |
| 04 | `canvas-primitives.html` | Artifact card, edge, lens toggle, lasso, board tile |
| 05 | `shell.html` | Workspace shell layout pattern |
| 06 | `states.html` | Empty, loading, error states |
| 07 | `screen-empty.html` | Cold-start canvas |
| 08 | `screen-onboarding.html` | First-run flow |
| 09 | `screen-discovery.html` | Notes → drafts → features (the core canvas) |
| 10 | `screen-container.html` | Drilled-in container view |
| 11 | `screen-lens.html` | Logical / deployment lens toggle |
| 12 | `screen-board.html` | Board-as-artifact (board lives inside the canvas) |
| 13 | `screen-detail.html` | Detail panel with sources / versions / activity |
| 14 | `screen-agent.html` | Atlas thinking — pencilling drafts in real time |
| 15 | `screen-marketing.html` | Marketing landing page |
| ↳ | `index.html` | Contents page linking all surfaces |

## Key Concepts to Preserve in Implementation

1. **Provenance is visible.** Every artifact card shows: drawn-by, dated, source links (`[[note-41]]` style), version (v1/v2/v3), state (drafted | inked | superseded).
2. **Pencil vs ink.** Drafts render with dashed coral borders, ghost-ink text, and Caveat-font margin notes. Promoting to ink converts to solid 1.5px ink stroke + Source Serif title.
3. **Atlas is a co-author, not a chatbot.** Agent surface streams reasoning steps (Goal → Tool → Draft → Tool) into a right-rail, with drafted artifacts pulsing on the canvas. No chat window.
4. **Boards are artifacts on the canvas, not a separate route.** Drilling into a board zooms in; tickets keep their source links.
5. **Lens toggle.** Same graph, two views — Logical (feature/slice/contract) and Deployment (service/db/queue). Coral bar slides under the active lens; canvas re-projects.
6. **Selection-driven command bar.** Lasso a group → command bar appears with verbs (Group · Ask Atlas · Promote · Supersede).
7. **Underline as emphasis.** Coral hand-drawn underline under one word per heading. Use SVG path with slight rotation, not `text-decoration`.

## Components Reference

Component anatomy is documented in `paper/components.html` and `paper/canvas-primitives.html` (and the Console equivalents). For each:

- **Buttons** — three weights (primary coral fill, default ink-stroked, ghost). 1.5px border, no border-radius (sharp corners are part of the language). Hover: subtle paper-shadow lift.
- **Chips** — small status tags. Variants: default (ink stroke), coral fill, blue (lens), green (approved), ghost (meta).
- **Artifact card** — see `canvas-primitives.html`. Anatomy: kicker (mono uppercase) → title (serif) → meta row → optional pencil overlay. Draft variant uses dashed coral border.
- **Edges** — 1px stroke, blue for logical, ink for default, dashed coral for draft connections.
- **Detail panel** — right rail, 360–420px, paper-deep background, version-history timeline + action stack.
- **Topbar** — wordmark + nav + spacer + meta + avatar. 1.5px ink rule below with 1px @ 40% double-rule echo.

## Interactions & Behavior

- **Hover on card** — soft paper-shadow + 1px translate-up; coral kicker brightens.
- **Hover on link / chip** — color shifts toward coral (200ms ease-out).
- **Promote draft → ink** — dashed coral border solidifies to 1.5px ink over ~280ms; Caveat margin note fades to mono meta.
- **Lens toggle** — coral underline bar slides 280ms ease-out under active lens label; canvas edges re-project (cross-fade ~360ms).
- **Atlas drafting** — drafted cards pulse coral box-shadow, 1.6s infinite, staggered by ~300ms.
- **Loading** — paper-deep skeleton with shimmer (linear-gradient, 1.6s linear infinite).
- **Empty** — centered with crosshair icon (coral dot, ink crosshair lines), CTA pair.

## State Management Hints

- Artifact graph: nodes (id, type, title, body, sources[], drawnBy, drawnAt, version, state) + edges (from, to, kind: source|supersedes|feeds|cites).
- Lens: top-level enum {logical, deployment} — projects same graph to different layout.
- Atlas stream: array of steps {kind: goal|tool|draft|note, payload}, append-only during a draft session.
- Selection: Set<artifactId> drives the command bar.
- Versions: artifact has a `history: [{v, drawnBy, drawnAt, summary}]`; the live record is `history[history.length-1]`.

## Design Tokens — Spacing, Radius, Shadow, Motion

Spacing scale (px): `4 8 12 16 20 24 32 40 48 56 72 96 120`
Radius: **0** (sharp corners are the brand) except for tiny pills (1–2px).
Shadow:
- `--sh-1` subtle paper shadow: `0 1px 0 rgba(28,24,20,0.06), 0 4px 12px rgba(28,24,20,0.04)`
- `--sh-2` lifted card: `0 2px 0 rgba(28,24,20,0.08), 0 12px 32px rgba(28,24,20,0.08)`
Motion: `200ms ease-out` for hover; `280ms cubic-bezier(.2,.7,.2,1)` for state transitions; `360ms` for layout re-projection.

## Assets

- **Fonts** — Source Serif 4, Inter, JetBrains Mono, Caveat (all from Google Fonts; vendor or self-host in production).
- **Icons** — none used as a set; SVG drawn inline where needed (crosshair for empty state, simple symbols on cards). Replace with the codebase's icon library (Lucide / Phosphor) if there's an existing one.
- **Images** — none. Hero art on marketing page is composed entirely of SVG + positioned divs.

## Files in This Bundle

```
design_handoff_workspec/
├── README.md                         (this file)
├── paper/
│   ├── index.html                    contents
│   ├── brand.html
│   ├── tokens.html
│   ├── tokens.css                    ← pull tokens from here
│   ├── components.html
│   ├── canvas-primitives.html
│   ├── shell.html
│   ├── shell.css                     ← shell layout
│   ├── states.html
│   ├── screen-empty.html
│   ├── screen-onboarding.html
│   ├── screen-discovery.html
│   ├── screen-container.html
│   ├── screen-lens.html
│   ├── screen-board.html
│   ├── screen-detail.html
│   ├── screen-agent.html
│   └── screen-marketing.html
└── console/                          (terminal-inspired direction, parallel structure)
```

## Recommended Implementation Order

1. **Tokens layer** — port `paper/tokens.css` and `console/tokens.css` into the codebase as CSS custom properties scoped under `[data-theme="paper"]` / `[data-theme="console"]`.
2. **Type loading** — add Source Serif 4, Inter, JetBrains Mono, Caveat (Paper); the Console fonts are documented in its tokens file.
3. **Primitive components** — Button, Chip, Input, Card, Tabs, Toast, Dialog. Match anatomy from `components.html`.
4. **Canvas primitives** — ArtifactCard (with draft / ink / superseded states), Edge, LensToggle, Bubble, BoardTile.
5. **Shell** — Topbar + Sidebar + main + optional right detail panel. Two-column and three-column variants.
6. **Screens in order of dependency** — empty → discovery → detail → board → lens → container → agent.
7. **Marketing** last — uses no shell components, can ship independently.

## Open Questions for Product

- Final choice between Paper and Console (or do both ship as themes?)
- Atelier (third direction) was scoped on the overview but unbuilt — keep, drop, or revisit?
- Real Atlas backend contract — what does the `step` stream look like over the wire?
- Persistence model for graph state (CRDT? operational transform? simple last-write-wins?)
