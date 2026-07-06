# Inventory

What is being extracted from `workspec/artifacts/workspec` into `@workspec/design`, and what is
deliberately left behind. This is a snapshot as of **2026-07-06** (S0). Source paths below are
paths in the `workspec` (Enterprise) repo unless stated otherwise — nothing at those paths has
been modified by this extraction; see `docs/drift-log.md` for every discrepancy found while
comparing them against the design handoffs.

## Token groups (extraction boundary)

Source of record: `workspec/artifacts/workspec/src/styles/tokens/` — `index.css` (import-only
entry point, `@import`s the two theme files) + `console-dark.css` + `console-light.css`, 124
custom properties each, byte-verified. Both files are deliberately split into three
`[data-aesthetic="console"][data-theme="..."]` rule blocks (~50 properties each) — a workaround
for a Tailwind v4 CSS pipeline limit that silently dropped tokens past ~75 properties in one
rule (see the header comment in each file, and workspec#384 / commit `c8f2075`).

| Group                                                                     | Prefix                                                                                          | Count (per theme)                                                                                                                 | Source file                |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Surface ramp + lines                                                      | `--bg`, `--bg-soft`, `--bg-elevated`, `--bg-elev` (alias), `--panel-dark`, `--line`, `--line-2` | 7                                                                                                                                 | `console-{dark,light}.css` |
| Ink (text scale)                                                          | `--ink`, `--ink-soft`, `--ink-muted`, `--ink-fade`, `--ink-ghost`                               | 5                                                                                                                                 | `console-{dark,light}.css` |
| Accent (brand green)                                                      | `--accent`, `--accent-deep`, `--accent-soft`, `--accent-mid`, `--accent-hover`, `--accent-wash` | 6                                                                                                                                 | `console-{dark,light}.css` |
| Agent (teal, distinct from brand green)                                   | `--agent`, `--agent-soft`, `--agent-mid`                                                        | 3                                                                                                                                 | `console-{dark,light}.css` |
| Status + on-accent                                                        | `--warn`, `--danger`, `--danger-soft`, `--on-accent`                                            | 4                                                                                                                                 | `console-{dark,light}.css` |
| Sticky note variants (6 colors × bg/ink/edge + 3 content-block tokens)    | `--sticky-*`                                                                                    | 21                                                                                                                                | `console-{dark,light}.css` |
| Index-card note (theme-independent by design)                             | `--index-*`                                                                                     | 5                                                                                                                                 | `console-{dark,light}.css` |
| Photo note (theme-independent by design)                                  | `--photo-*`                                                                                     | 5                                                                                                                                 | `console-{dark,light}.css` |
| Prototype Builder wireframe fidelity (identical in both themes by design) | `--wf-sketch-*` / `--wf-hifi-*`                                                                 | 24                                                                                                                                | `console-{dark,light}.css` |
| Canvas surface + grid                                                     | `--canvas-*`                                                                                    | 6                                                                                                                                 | `console-{dark,light}.css` |
| Artifact/discovery-note type colors                                       | `--type-*`                                                                                      | 8                                                                                                                                 | `console-{dark,light}.css` |
| Typography                                                                | `--sans`, `--mono`, `--font-body`, `--font-display`                                             | 4                                                                                                                                 | `console-{dark,light}.css` |
| Spacing (4px base)                                                        | `--s-*`                                                                                         | 11                                                                                                                                | `console-{dark,light}.css` |
| Radius                                                                    | `--r-*`                                                                                         | 6                                                                                                                                 | `console-{dark,light}.css` |
| Elevation (shadows)                                                       | `--sh-*`                                                                                        | 4                                                                                                                                 | `console-{dark,light}.css` |
| Motion                                                                    | `--ease-*` / `--d-*`                                                                            | 5                                                                                                                                 | `console-{dark,light}.css` |
| **Total per theme file**                                                  |                                                                                                 | **124** (byte-verified: `grep -oE -- '(--[a-zA-Z0-9-]+)\s*:'` unique count over each of `console-dark.css` / `console-light.css`) |                            |

### Tailwind mapping

`workspec/artifacts/workspec/src/index.css` — the `@theme inline { ... }` block, **49 custom
properties** (byte-verified), maps Tailwind utility namespaces onto the tokens above:
`--color-background:var(--bg)`, `--color-foreground:var(--ink)`, `--color-primary:var(--accent)`,
`--color-primary-foreground:var(--on-accent)`, `--color-card:var(--bg-elevated)`,
`--color-sidebar-*`, `--color-hot` / `--color-agent`, `--font-sans:var(--sans, ...)`,
`--font-mono:var(--mono, ...)`, `--radius-sm..xl:var(--r-2..--r-5)`. Tailwind v4 is CSS-first
(no `tailwind.config.*`/`postcss.config.*`); the dark variant is class-based —
`@custom-variant dark (&:is(.dark *))` (`src/index.css:9`) — wired via the `@tailwindcss/vite`
plugin in `vite.config.ts`.

### Themes

- **Mechanism:** attribute-driven. `<html data-aesthetic="console" data-theme="dark|light">`
  activates the token palettes; Tailwind's `dark:` variant separately keys off a `.dark` class
  on the same element via `@custom-variant dark`. Every theme-setting code path sets both the
  attribute pair and the class together (see `docs/drift-log.md` D21 for the dual-signal
  implications and D22 for a `localStorage`-key inconsistency between two of the code paths that
  set them).
- **Themes shipped:** `console-dark`, `console-light`. No Paper aesthetic is implemented —
  `use-theme.ts` hardcodes `data-aesthetic="console"`; only `theme` (`light`/`dark`/`system`)
  varies. Paper is handoff-only (see `docs/drift-log.md` D13).

### Fonts

Four families, **not yet self-hosted** (self-hosting is S1 scope per `DELIVERY_PLAN.md`):

| Family         | Weights            | Used via                                                                                                                                                                                                                               |
| -------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inter Tight    | 400, 500, 600, 700 | `--sans` token → `--font-sans` (body/UI text)                                                                                                                                                                                          |
| JetBrains Mono | 400, 500, 600      | `--mono` token → `--font-mono` (code)                                                                                                                                                                                                  |
| Caveat         | 400, 700           | inline `fontFamily` in handwriting/Atlas components (not tokenized)                                                                                                                                                                    |
| Lora           | 400, 700           | canvas font picker only (not tokenized); `--font-serif` is referenced at `src/components/canvas-host/JourneysLensView.tsx:662` but never defined in any token file — the fallback (`'Caveat', cursive`) always applies (drift-log D26) |

Currently loaded from the Google Fonts CDN, and loaded **twice** with the identical `css2` URL:
once via `<link rel="stylesheet">` in `index.html:11` (with `fonts.googleapis.com` /
`fonts.gstatic.com` preconnects), and again via `@import` at `src/index.css:1` (drift-log D23).
All four families are SIL OFL-licensed on Google Fonts; nothing is vendored in-repo today, so no
redistribution notices currently attach. S1 self-hosts them as woff2 + `fonts.css` with OFL
texts vendored alongside.

### Brand assets

`favicon.svg` (`workspec/artifacts/workspec/public/favicon.svg`) and `opengraph.jpg`
(`workspec/artifacts/workspec/public/opengraph.jpg`) are vendored verbatim into
`assets/brand/`. `assets/brand/workspec-mark.svg` is a hand-built standalone export of the
geometry in `workspec/artifacts/workspec/src/components/ui/workspec-mark.tsx` (the canonical,
token-driven component — see the comment header in that SVG file for the exact color
substitutions made for portability). All three are trademarks — see `/NOTICE`.

## Component library inventory

Extraction boundary (dev-lead architecture decision #6 in `DELIVERY_PLAN.md`):
`src/components/ui/` + `src/components/design/` + their stylesheet `design-shell.css` +
portable hooks + `cn()`. Everything outside that boundary is inventoried below by tier, not
copied.

| Piece              | Count                                                    | Provenance (source path)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/` primitives   | 57 files (file-count verified)                           | `workspec/artifacts/workspec/src/components/ui/*.tsx` — shadcn-style Radix wrappers (accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button, button-group, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, empty, field, form, hover-card, input, input-group, input-otp, item, kbd, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, segmented-toggle, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip, workspec-mark). All 57 are verdict `clean` in the component map (no app-internal binding). |
| `design/` files    | 14 files (13 components + 1 barrel, file-count verified) | `workspec/artifacts/workspec/src/components/design/{artifact-card,avatar-2,chip,client-picker-tile,code-block,detail-panel,frame,index,lens-toggle,page-shell,seg-choice,steps-bar,surf,typography}.tsx`/`.ts`. **Flag:** 13 of 14 are verdict `clean`; `page-shell.tsx` is verdict `needs-inversion` — it imports `wouter`'s `Link` directly, coupling it to the app router. It is inside the stated extraction boundary per architecture decision #6, but per the component map it isn't actually import-clean yet. Flagged in `docs/drift-log.md` (D31) rather than fixed — extraction is not redesign.                                                                                                                                        |
| `design-shell.css` | 1 file                                                   | `workspec/artifacts/workspec/src/styles/design-shell.css` — shared component CSS (`.frame`, `.btn`, `.input`, `.chip`, `.steps`, `.segchoice`, `.surf`, `.av`, `.codeblk`), ported from a design handoff. Consumes tokens; contains 7 hardcoded-hex lines despite that (`.av` avatar colors `#0a0a0c`/`#10a37f`/`#9ec6ff`, `.codeblk` syntax colors `#9ec6ff`/`#5cf2c0` — drift-log D27).                                                                                                                                                                                                                                                                                                                                                         |
| Portable hooks     | 2 files                                                  | `workspec/artifacts/workspec/src/hooks/use-mobile.tsx` (19 lines, viewport/breakpoint check) and `use-toast.ts` (191 lines, shadcn toast store) — both dependency-free beyond React, used by `ui/sidebar.tsx` and `ui/toaster.tsx` respectively. `use-theme.ts` is **not** in this list — it's app-specific (syncs to the backend via `useUpdateUserPreferences`, hardcodes `data-aesthetic`), so it's on the not-extractable list below, not the portable-hooks list.                                                                                                                                                                                                                                                                            |
| `cn()`             | 1 file                                                   | `workspec/artifacts/workspec/src/lib/utils.ts` — `clsx` + `tailwind-merge`, 68 call-site imports across components as `@/lib/utils`. Zero internal dependencies; extracts as-is.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### Not-extracted (app-level palettes and page-scoped CSS)

These token families live **outside** `src/styles/tokens/` and are excluded from the boundary
above, per `DELIVERY_PLAN.md` architecture decision #5:

| Family                                            | Where                                              | Why excluded                                                                                                                                                                                                                                                                               |
| ------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--color-artifact-*` (8 tokens)                   | `src/index.css`                                    | Superseded pre-token palette — the file's own comment (line 93) says `--type-*` in the token files supersedes these; both still exist in the implementation (drift-log D32).                                                                                                               |
| `--c4-*` (6) / `--c4-conn-*` (4)                  | `src/index.css`                                    | C4-diagram-specific element/connection palette, not part of the design-system token surface.                                                                                                                                                                                               |
| `--el-*` / `--conn-*` (8)                         | `src/index.css`                                    | C4 style-spec-derived tokens applied to `.c4-el`/`.c4-conn`, computed from the C4 palette above (e.g. `--el-surface` is a `color-mix` of accent into `--bg-elevated`).                                                                                                                     |
| `--radius`, `--grid-line`, `--grid-line-strong`   | `src/index.css`                                    | Cross-theme constants outside the per-theme token files; `--grid-line*` also has a `.dark, [data-theme="dark"]` dual-signal block (line 121).                                                                                                                                              |
| Legacy gray-utility compatibility shim            | `src/index.css` `@layer utilities` (lines 143–223) | Rewrites `bg-white`, `bg-gray-50/100/200/300`, `text-gray-400..900`, `border-gray-*`, `bg-indigo-50` to console tokens. This is a backwards-compatibility shim in a codebase whose own `CLAUDE.md` says "no backwards-compatibility shims" — flagged, not carried forward (drift-log D24). |
| `--bg-elev-2`, `--line-soft`, `--accent-glow` (3) | `src/pages/landing.css`                            | Landing-page-only extensions, scoped to bare `[data-theme="dark"]`/`[data-theme="light"]` (not gated on `data-aesthetic`, unlike every other token). Flagged as upstream candidates per architecture decision #5, not extracted (drift-log D25).                                           |

### Not-extractable-yet component tiers

Verdict counts are tallied directly from the committed component map, `docs/component-map.json`
(213 per-component records), via:

```
jq -r '.components | group_by(.extractable) | .[] | "\(.[0].extractable): \(length)"' docs/component-map.json
```

which reproduces:

- **clean:** 116 (the 57 `ui/` + 13 of 14 `design/`, plus 46 files elsewhere that happen to be
  import-clean but are not in the extraction boundary and so are not extracted this slice)
- **needs-inversion:** 39
- **not-extractable:** 58

(The map's own scout-time summary note claimed 100/48/65 — wrong; corrected in
`docs/component-map.json`'s `notes` array at commit time, see that file for detail.)

#### `needs-inversion` (~39) — clean but for one swappable binding

| Directory                                                    | Count  | Binding dependency                                                                                                                                               |
| ------------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shell/` (incl. `shell/board/`, `shell/thread-detail/`)      | 13     | `@workspace/api-client-react` (row/response types), `wouter`                                                                                                     |
| `pull-requests/`                                             | 6      | `@/hooks/use-pull-requests`                                                                                                                                      |
| `canvas/`                                                    | 4      | `@/hooks/use-presence`, `@/lib/canvas-utils`, `@/hooks/use-instance-config` (via `license-banner.tsx`, filed under `canvas/`'s sibling but grouped here per map) |
| `registers/` (incl. `registers/adr/`)                        | 4      | `@workspace/api-client-react`, `@/lib/cost-engine`                                                                                                               |
| `chat/`                                                      | 3      | `@/hooks/use-interaction-mode`, `@/hooks/use-speech-to-text`                                                                                                     |
| `board/`                                                     | 2      | `@workspace/api-client-react`                                                                                                                                    |
| `project/`                                                   | 2      | `@/hooks/use-ingestion-stream`, `@/hooks/use-project-artifacts-by-type`                                                                                          |
| `design/`, `layout/`, `theme/`, `topology/`, components-root | 1 each | `wouter` (`page-shell.tsx`), `@/hooks/use-theme` (`AppSidebar.tsx`), `@/canvas/topology/model`                                                                   |

Dominant bindings across the tier: `@workspace/api-client-react` (16 components),
`wouter` (6), `@/hooks/use-pull-requests` (6). All are single-swap points — accept the data/nav
primitive as a prop instead of importing it — not structural rewrites.

#### `not-extractable` (~58) — bound to app state, canvas engine, or router

| Directory                                                                                 | Count  | Binding dependency                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout/`                                                                                 | 11     | `@workspace/api-client-react`, `wouter`, `@/hooks/use-workspace`                                                                                                                                                                                          |
| `shell/`                                                                                  | 10     | `@workspace/api-client-react`, `wouter`, `@/hooks/use-topology-panel`                                                                                                                                                                                     |
| `project/`                                                                                | 4      | `@workspace/api-client-react`, `wouter`, `@/hooks/use-workspace`                                                                                                                                                                                          |
| `topology/`                                                                               | 4      | `@/hooks/use-topology-panel`, `@/canvas/*`                                                                                                                                                                                                                |
| `canvas-host/`                                                                            | 3      | `@/canvas/*` (store, types, hooks), `@workspace/api-client-react`, `wouter`                                                                                                                                                                               |
| `canvas/`                                                                                 | 3      | `@/hooks/use-project-artifacts-by-type`, `@/lib/canvas-utils`, `@/lib/pencil-ink`                                                                                                                                                                         |
| `registers/`                                                                              | 3      | `@workspace/api-client-react`, `@/hooks/use-workspace`, `@/lib/pencil-ink`                                                                                                                                                                                |
| `settings/`                                                                               | 3      | `@workspace/api-client-react`, raw `fetch()` bypassing the generated client (3 call sites in `mcp-sessions-card.tsx`)                                                                                                                                     |
| `atlas/`, `board/`, `diagrams/`, `documents/`, `terminal/`                                | 2 each | `@/hooks/use-atlas-turn`; `@workspace/api-client-react`; `@/canvas/c4/PrOverlayContext`, `@/hooks/useC4Diagram`; `@workspace/api-client-react`, `wouter`; (terminal, see map for detail)                                                                  |
| `bugs/`, `dashboard/`, `decide/`, `discovery/`, `editor/`, `prototype/`, `pull-requests/` | 1 each | raw `fetch()` (`bugs/bug-detail-panel.tsx`); `wouter` + `@workspace/api-client-react`; `@radix-ui/react-dialog` + `@workspace/api-client-react`; `@workspace/api-client-react`; `@/hooks/use-project-branches`; `@/canvas/*`; `@/hooks/use-pull-requests` |

Dominant bindings across the tier: `@workspace/api-client-react` (35), `wouter` (21),
`@/hooks/use-workspace` (11), `@/canvas/store` (7), `@/hooks/use-topology-panel` (6). Three
files bypass the generated API client entirely with raw `fetch()` +
`@tanstack/react-query`: `bugs/bug-detail-panel.tsx`, `board/ChangeRequestDetailPane.tsx`,
`settings/mcp-sessions-card.tsx` — contrary to the WorkSpec repo's own stated frontend pattern
("never write raw fetch calls for API routes").

Test coverage of the entire component tree today: **zero** component tests (verified — the only
test file under `src/` in the WorkSpec repo is `src/lib/cost-engine.test.ts`, a pure-function
test unrelated to components).
