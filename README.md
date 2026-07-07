# WorkSpec Design

The WorkSpec design system — tokens, themes, and components extracted from **WorkSpec
Enterprise** into a standalone, publishable package (`@workspec/design`). Consumed by
[Decision Studio](https://github.com/FieldstateNZ/workspec-decision-studio), WorkSpec product
sites, future mini-apps, and, eventually, WorkSpec Enterprise itself (mirroring the
`workspec-schemas` extraction pattern: substrate out of the monolith, product repos consume).

This README stays short — the package-level detail (usage, exports, versioning policy) lives in
[`packages/design/README.md`](./packages/design/README.md). See it rendered live at
[fieldstatenz.github.io/workspec-design](https://fieldstatenz.github.io/workspec-design/), and
see [`RELEASING.md`](./RELEASING.md) for how `@workspec/design` gets published.

## Extraction discipline

This is an **extraction, not a creation**. Token names, values, selectors, and component
behaviour move exactly as they exist in `workspec/artifacts/workspec` — API cleanup (imports,
prop types, dead code) is in scope, redesign is not. Every discrepancy found between the design
handoffs and the live implementation is _flagged_ in `docs/drift-log.md` for Brett's
adjudication, never resolved unilaterally in this repo.

## Repo layout

```
packages/design/      @workspec/design — tokens, themes, Tailwind v4 preset, fonts (S1)
apps/preview/          Token/theme preview, generated from tokens.json, deployed to Pages (S3)
examples/fixture/      Tiny Vite + React app proving the Tailwind preset + fonts work (S1)
docs/design/          Vendored design-handoff bundles (verbatim, byte-identical to source)
docs/inventory.md     What's being extracted, what's left behind, and why
docs/drift-log.md     Every handoff-vs-implementation discrepancy found, open for review
assets/brand/         WorkSpec name, logo, wordmark — trademarks, see NOTICE
DELIVERY_PLAN.md       The slice-by-slice delivery plan for this extraction
RELEASING.md           How @workspec/design gets published (OIDC trusted publishing)
```

The component library (`packages/design`'s `ui`/`design` exports) lands in a later slice per
`DELIVERY_PLAN.md`.

## Licensing

Code and token/theme/component definitions are Apache-2.0. The WorkSpec name, logos, wordmarks,
and everything under `assets/brand/` are trademarks and are **not** licensed for reuse — see
[`NOTICE`](./NOTICE).
