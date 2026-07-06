# @workspec/design — Delivery Plan

Extraction of the WorkSpec design system out of the WorkSpec (Enterprise) monolith into a
standalone publishable package, and migration of Decision Studio onto it. Mirrors the
workspec-schemas extraction: substrate out of the monolith, product repos consume.

**Extraction discipline (governs every slice):** this is an extraction, not a creation. Token
names, values, selectors, and component behaviour move exactly as they exist in
`workspec/artifacts/workspec`. API cleanup is allowed (imports, prop types, dead code);
redesign is not. Discrepancies are *flagged* in the drift log for Brett's adjudication, never
resolved unilaterally.

## Canonical sources (S0 finding of record)

| Role | Source |
|---|---|
| Token structure + theming model of record | `workspec/docs/design-handoffs/design_handoff_interaction_modes/` — unified variable names, `data-aesthetic` + `data-theme` attribute model |
| Visual/value canon for the go-live build | `workspec/docs/design-handoffs/end-to-end-product-flow/` — "canonical hi-fi design set", green accent "brand guidelines v1" |
| Historical two-direction exploration | `workspec/docs/design-handoffs/design_handoff_workspec/` — coral-era Paper/Console; superseded on both axes |
| Live implementation being extracted | `workspec/artifacts/workspec/src/styles/tokens/console-{dark,light}.css` (124 vars × 2 themes), `src/index.css` `@theme inline` Tailwind v4 mapping (49 vars), `src/styles/design-shell.css`, `src/components/ui/` (57 primitives) + `src/components/design/` (14 files) |

## Slices

| Slice | Issue | Deliverable |
|---|---|---|
| S0 | workspec-design#1 | Repo bootstrap (pnpm + TS strict + Vitest + CI, Decision Studio conventions), handoff bundles vendored to `docs/design/`, brand assets under `assets/brand/` with NOTICE trademark split, `docs/inventory.md` + `docs/drift-log.md` |
| S1 | workspec-design#2 | `packages/design`: one TS source of truth generating `tokens.css`, `tailwind.css` (v4 CSS-first preset), `tokens.json`, typed TS exports; committed artifacts + byte-compare drift test in CI (schema-package pattern); self-hosted fonts (`fonts.css` + woff2, OFL notices) |
| S2 | workspec-design#3 | Themes importable individually (`themes/console-dark.css`, `themes/console-light.css`), completeness (unbound-variable) check, WCAG AA contrast gate in CI over the documented role-pair table, `docs/contrast-audit.md` recording as-is results (failures logged as drift, values not changed) |
| S3 | workspec-design#4 | `release.yml` (OIDC trusted publishing, Decision Studio pattern), version policy in README (tokens are a contract: major = rename/remove, minor = add, patch = value correction), `apps/preview` generated from `tokens.json`, deployed to GitHub Pages |
| S4 | workspec-design#5 | Component library migrated as-it-exists: `ui/` (57) + `design/` (13 + barrel) + `design-shell.css` + portable hooks (`use-mobile`, `use-toast`) + `cn()`; react/react-dom as peers; provenance per component in inventory; smoke render test per component; preview page renders every component in both themes |
| S10 | workspec-decision-studio#8 | `--ds-*` layer deleted; `packages/ui` + `apps/site` consume WorkSpec token names, preset, and migrated components; bespoke survivors justified; readability fixed per the S2 audit; host-contract doc updated |

Order: S0 → S1 → (S2 ∥ S3) → S4 → S10.

## Architecture decisions (dev-lead calls, recorded)

1. **Repo shape** mirrors workspec-decision-studio: pnpm workspace, `packages/design`
   (publishable `@workspec/design`) + `apps/preview` (private, Pages). Same tsconfig.base,
   eslint flat config, prettier, vitest-projects, node >= 20, `pnpm@10.33.0` conventions.
2. **Source of truth** is typed TS token tables in `packages/design/src/tokens/`. A generator
   emits the four consumable forms into committed files; a Vitest byte-compare test (the
   Decision Studio schema-package pattern) is the CI drift check. Rationale: consumers get
   plain importable files; the repo gets one place values live.
3. **Tailwind preset is a CSS file** (`@workspec/design/tailwind`). WorkSpec is on Tailwind v4
   CSS-first — there is no JS config to extract; the preset is the `@theme inline` mapping +
   `@custom-variant dark` + plugin imports exactly as found in `src/index.css`.
4. **The 3-rule token split stays.** The enterprise token files are deliberately split into
   three rule blocks under ~50 custom properties each to dodge a Tailwind v4 pipeline limit
   that silently dropped tokens (workspec#384). Consumers compile these files through the same
   pipeline, so the workaround ships, with its comment.
5. **Extraction boundary for tokens**: the 124-var × 2 theme set + the Tailwind mapping +
   fonts. App-level palettes in `index.css` (`--color-artifact-*` [superseded], `--c4-*`,
   `--el-*`/`--conn-*`, `--grid-line*`) and `landing.css` extensions (`--bg-elev-2`,
   `--line-soft`, `--accent-glow`) are *not* extracted — logged in the inventory with reasons,
   the landing extensions flagged in the drift log as candidates for upstreaming.
6. **Extraction boundary for components**: `src/components/ui/` + `src/components/design/` +
   their stylesheet `design-shell.css` + portable hooks + `cn()`. Everything outside that
   (app screens, panels, board/shell composites bound to app state, router, or the generated
   API client) is on the not-extractable-yet list with the blocking dependency named.
7. **Fonts self-host in the package** (Inter Tight, JetBrains Mono, Caveat, Lora — all SIL
   OFL): woff2 + `@font-face` in `fonts.css`, OFL texts vendored. The enterprise app currently
   loads these from the Google Fonts CDN (twice) — logged as drift.
8. **Contrast gate compares against a committed known-failures allowlist** derived from the
   initial audit. New failures break CI; existing ones are documented drift for Brett. This
   satisfies "gate green in CI, or failing pairs documented in the audit".

## Gates owned outside this delivery

- **First npm publish**: `@workspec/design` does not exist on the registry and the `@workspec`
  scope has no trusted publisher for this repo. Brett does the one-time `npm login` publish,
  then registers the trusted publisher (owner FieldstateNZ, repo workspec-design, workflow
  release.yml) — after which tag-push releases are tokenless.
- **S10 install/CI**: Decision Studio resolves `@workspec/design` from the registry
  (`link-workspace-packages=false`), so its lockfile and CI can only go green after the first
  publish. The migration is verified locally against a packed tarball and delivered with a
  one-command follow-up (`pnpm install` to write the lockfile) once the package is live.
- **decision-studio.workspec.io** re-deploy + hero re-capture happen when the site PR merges.

## Review discipline

Every slice: implemented by a delegated agent, verified (build + tests) before review,
adversarially reviewed by a different agent at equal-or-higher tier, blocking findings
resolved, then dev-lead signoff. Nothing merges to `main` without that chain; this branch is
the delivery vehicle for review.
