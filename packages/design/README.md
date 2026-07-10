# @workspec/design

The WorkSpec design system — design tokens, themes, a Tailwind v4 preset, and self-hosted fonts
for the "Console" aesthetic — as a consumable npm package. Extracted verbatim from WorkSpec
Enterprise (`workspec/artifacts/workspec`); see the repo-root `DELIVERY_PLAN.md` and
`docs/inventory.md` for the extraction discipline and boundary.

**Consumers:** WorkSpec Enterprise (the origin app, migrating onto this package),
[Decision Studio](https://github.com/FieldstateNZ/workspec-decision-studio), WorkSpec product
sites, and future mini-apps — one source of truth for every surface that needs to look and feel
like WorkSpec. See it rendered live at
[fieldstatenz.github.io/workspec-design](https://fieldstatenz.github.io/workspec-design/)
(`apps/preview`, generated from this package's own `tokens.json`).

Typed TS token tables in `src/tokens/` are the source of truth. A generator
(`scripts/generate.ts`) emits every consumable form as a committed file; a Vitest drift test
regenerates them in-memory on every test run and fails if they've drifted from what's committed.

## Install

```bash
pnpm add @workspec/design
```

Not yet on npm — see [Releasing](#releasing) below.

## Usage

### CSS variables only

```css
@import '@workspec/design/tokens.css';
```

Then set `<html data-aesthetic="console" data-theme="dark">` (or `"light"`) — every token in
`docs/inventory.md`'s token table becomes a `var(--name)` custom property on that element.

### Tailwind v4 (CSS-first)

```css
@import 'tailwindcss';
@import '@workspec/design/tailwind';
@import '@workspec/design/fonts.css';
```

`@workspec/design/tailwind` is the `@theme inline` mapping (`bg-background`, `text-primary`,
`rounded-lg`, …) plus `@custom-variant dark (&:is(.dark *))` and the `@tailwindcss/typography`
plugin import — everything from the enterprise `src/index.css` **except** `@import "tailwindcss"`
itself, which stays in your own entry CSS (see the line above). `tw-animate-css` and
`@tailwindcss/typography` are dependencies of this package, so your Tailwind build resolves them
without you installing either yourself.

The dark variant needs **both** signals set together on the themed root, same as the enterprise
app: `<html data-aesthetic="console" data-theme="dark" class="dark">`.

> **The dual-signal rule.** Every dark surface in this system depends on **two** attributes
> agreeing on the same element: `data-theme="dark"` (which token values apply) and Tailwind's
> `.dark` class (which `dark:` variants apply). Setting only one gives you tokens with the wrong
> Tailwind variants, or `dark:` utilities with the wrong token values. Always set both together.
> See the full contract in [`docs/theming.md`](../../docs/theming.md).

### Fonts only

```css
@import '@workspec/design/fonts.css';
```

Registers `@font-face` rules for all four self-hosted families (Inter Tight, JetBrains Mono,
Caveat, Lora) without pulling in tokens or the Tailwind preset. Reference a family by its literal
name (`font-family: 'Caveat', cursive;`) or, if you also import the tokens/preset, via the
`--sans`/`--mono` tokens (`font-family: var(--sans);`) or Tailwind's `font-sans`/`font-mono`
utilities.

### TypeScript

```ts
import { THEME_TOKENS, THEME_SELECTORS, themeStyle, TOKEN_GROUPS } from '@workspec/design';

THEME_TOKENS['console-dark']['--accent']; // '#34d17f'
THEME_SELECTORS['console-dark']; // '[data-aesthetic="console"][data-theme="dark"]'

// Scope a theme to a subtree instead of <html>, e.g. in React:
<div style={themeStyle('console-light') as React.CSSProperties}>…</div>;
```

### JSON (for tooling)

```ts
import tokens from '@workspec/design/tokens.json';
```

Machine-readable: every theme's tokens, the semantic group table, the Tailwind mapping, and the
font family/weight summary — see [`apps/preview`](../../apps/preview) for a consumer that renders
its whole page from this one file. Useful for design tools, doc generators, or a lint rule that
checks a value against the token table without depending on this package's TS build.

### Individual theme CSS

```css
@import '@workspec/design/themes/console-dark.css';
```

Ship one theme's custom properties without the other — e.g. for a build that never needs
`console-light` and would rather not carry its bytes.

## What's in here

| Export                                   | What                                                                                                                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.`                                      | Typed API — `TokenName`, `THEME_TOKENS`, `TOKEN_GROUPS`, `themeStyle`, `useTheme`, `setTheme`, `initTheme`, …                                                         |
| `./components`                           | React component library (`ui/` + `design/`, incl. `Chip`, `Status`, …)                                                                                                |
| `./tokens.css`                           | Both theme files' raw custom properties (no Tailwind mapping)                                                                                                         |
| `./tailwind` (`./tailwind.css`)          | The Tailwind v4 CSS-first preset                                                                                                                                      |
| `./tokens.json`                          | Machine-readable themes + groups + Tailwind mapping + font summary                                                                                                    |
| `./themes/console-dark.css`, `.../light` | One theme at a time                                                                                                                                                   |
| `./fonts.css`, `./fonts/*`               | Self-hosted `@font-face` rules + woff2 + OFL license texts                                                                                                            |
| `./components.css`, `./design-shell.css` | Generated Tailwind utility CSS / hand-authored design-shell CSS                                                                                                       |
| `./element-grammar.css`                  | Shared "typed element" grammar — one accent -> tinted-surface -> tinted-border -> eyebrow rule for any typed thing a user can open (a Decisions option, a C4 node, …) |

138 tokens per theme (124 extracted from Enterprise, 49 Tailwind mapping entries, 4 self-hosted
font families (Inter Tight, JetBrains Mono, Caveat, Lora — all SIL OFL, see `NOTICE`), plus 14
`--el-*` tokens that are a **workspec-studio-only addition**, not extracted from Enterprise — see
`console-dark.ts`'s file header and `docs/inventory.md`). Extraction discipline for the other 124:
names, values, and selectors move exactly as found in the enterprise source — zero renames, zero
value changes. Any handoff-vs-implementation discrepancy found along the way is logged in the
repo-root `docs/drift-log.md`, not silently fixed here.

## Regenerating committed artifacts

```bash
pnpm --filter @workspec/design gen:tokens
```

Run this after editing anything in `src/tokens/` or `fonts/manifest.json`. `git diff --exit-code`
after running it should show no changes — that's the CI drift gate.

## Scripts

| Script                                      | Does                                              |
| ------------------------------------------- | ------------------------------------------------- |
| `pnpm --filter @workspec/design build`      | tsup → `dist/` (ESM + `.d.ts`) for the `.` export |
| `pnpm --filter @workspec/design typecheck`  | `tsc --noEmit`                                    |
| `pnpm --filter @workspec/design test`       | vitest (drift gates, parser, fonts)               |
| `pnpm --filter @workspec/design gen:tokens` | regenerate every committed artifact               |

## Versioning

**Tokens are a contract.** This package follows semver against that contract, not just its TS API:

| Change                                                                                        | Bump      |
| --------------------------------------------------------------------------------------------- | --------- |
| Rename or remove a token, theme, export, or the `[data-aesthetic][data-theme]` selector shape | **major** |
| Add a token, theme, or export                                                                 | **minor** |
| Correct an existing token's _value_ (a color, a spacing number, a shadow)                     | **patch** |

A value correction is patch-level, but it is never a silent edit: it has to flow through the
drift/contrast gates first (`docs/drift-log.md` for any handoff-vs-implementation discrepancy,
the WCAG AA contrast gate in CI, `docs/contrast-audit.md` for the results) before it ships — see
`DELIVERY_PLAN.md`'s extraction discipline.

**Pin accordingly:**

- Apps that want to track the system as it evolves (new tokens, new themes, corrected values):
  pin with `^` (`"@workspec/design": "^0.1.0"`) and re-test on minor/patch bumps.
- Anything that needs exact, reproducible visual output (a snapshot-tested screen, an exported
  design artifact, a frozen brand moment): pin with `~` or an exact version, and bump
  deliberately after reviewing the changelog/diff.

## Licensing

Code, tokens, theme definitions, and the self-hosted fonts (SIL OFL — see [`NOTICE`](./NOTICE))
are Apache-2.0. The WorkSpec name, logo, and wordmark are trademarks of Fieldstate/Ingenious and
are **not** licensed for reuse — they aren't part of this package's exports, but they are visible
on [the preview page](https://fieldstatenz.github.io/workspec-design/) this package's `tokens.json`
generates; see the repo-root `NOTICE` for the full split.

## Releasing

Not yet on npm. `@workspec/design`'s first publish is a one-time manual step (see
[`RELEASING.md`](../../RELEASING.md)); after that, every `v*` tag push publishes automatically via
OIDC trusted publishing — no token, no manual `npm publish`. Once live, dist-tags follow the
version: a stable release publishes to `latest`, a prerelease (`-alpha.`, `-rc.`, …) to its own
channel.
