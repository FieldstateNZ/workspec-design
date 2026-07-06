# Design handoff bundles

This directory vendors three design-handoff bundles verbatim (byte-identical, `cp -r`) from
`workspec/docs/design-handoffs/` as of **2026-07-06**. Nothing in these bundles is edited,
reformatted, or reorganized — see the repo-integrity test (`test/repo-integrity.test.ts`) for
the hash guard that protects this. They are historical/reference material: the extraction
discipline for this repo treats them as read-only inputs, not editable source.

## Bundles

### `design_handoff_interaction_modes/`

- **Provenance:** `workspec/docs/design-handoffs/design_handoff_interaction_modes/`
- **What it is:** "WorkSpec v4 — Interaction Modes" — a 2×2 seat-mode × interaction-mode
  exploration (MCP-only vs. Hosted): creation flow, chat-panel reframe, connections settings,
  multi-agent presence, mode switch, and a Console/Paper theme switcher.
- **Canon determination — token STRUCTURE of record.** This bundle introduces the unified
  token variable scheme (identical variable names — `--bg`, `--ink`, `--accent`, `--agent`,
  `--s-*`, `--r-*`, `--sh-*`, `--d-*`, etc. — across all four of its theme files) and the
  `data-aesthetic` + `data-theme` attribute model. That is exactly the structure and attribute
  model `workspec/artifacts/workspec/src/styles/tokens` implements. It self-labels **v4** and
  its `tokens.css` is a byte-for-byte strict superset of
  `design_handoff_workspec/console/tokens.css` (18 added lines, zero changed lines) — evidence
  it postdates that bundle.

### `end-to-end-product-flow/`

- **Provenance:** `workspec/docs/design-handoffs/end-to-end-product-flow/`
- **What it is:** 18 Claude-Design (`.dc.html`) screen exports (00 WorkSpec Screens through 15
  Settings, plus shell/nav/topbar/prototype specials), a `design-spec.md`, and process docs
  (`AUDIT-BRIEF.md`, `DEV-LEAD-BRIEF.md`, chat transcripts).
- **Canon determination — visual/VALUE canon for the go-live build.** `INDEX.md` self-describes
  as "the canonical hi-fi design set for the WorkSpec go-live build." Its accent values — green
  `#1b8a55` (light) / `#34d17f` (dark) — are labeled "brand guidelines v1" and are the values
  the implementation ships. Neither token bundle in this directory contains this green accent;
  both are coral-era. This bundle carries no `tokens.css` of its own — its colors live as
  literal hex in `design-spec.md` and the `.dc.html` exports.

### `design_handoff_workspec/`

- **Provenance:** `workspec/docs/design-handoffs/design_handoff_workspec/`
- **What it is:** The original two-direction exploration — Paper vs. Console ("Terminal") — 14
  surfaces each, coral accent (`#ff5a36`), agent named Atlas.
- **Canon determination — superseded historical reference.** Both of its directions predate
  the unified token scheme: `console/tokens.css` uses the pre-unification namespace later
  extended by `design_handoff_interaction_modes`, and `paper/tokens.css` uses a wholly
  different, non-unified namespace (`--paper`/`--coral`/`--blue`/`--ochre`/`--sage`) never
  carried forward. Kept here for historical reference only; it is not a canon for either
  structure or values.

## Reading order

Structure and attribute model → `design_handoff_interaction_modes`. Visual values for the
current build → `end-to-end-product-flow`. Anything not covered by either (e.g. a Paper
aesthetic) → `design_handoff_workspec`, flagged in `docs/drift-log.md` as unimplemented or
superseded rather than treated as current guidance.

See `docs/inventory.md` for how these map onto the live implementation, and
`docs/drift-log.md` for every discrepancy found between the handoffs and that implementation.
