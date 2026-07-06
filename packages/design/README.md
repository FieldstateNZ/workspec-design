# @workspec/design

Design tokens, themes, Tailwind v4 preset, and self-hosted fonts for the WorkSpec "Console"
aesthetic — extracted verbatim from WorkSpec Enterprise (`workspec/artifacts/workspec`). See the
repo-root `DELIVERY_PLAN.md` and `docs/inventory.md` for the extraction discipline and boundary;
this package is slice S1.

Typed TS token tables in `src/tokens/` are the source of truth. A generator
(`scripts/generate.ts`) emits every consumable form as a committed file; a Vitest drift test
regenerates them in-memory on every test run and fails if they've drifted from what's committed.

## Install

```bash
pnpm add @workspec/design
```

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

### TypeScript

```ts
import { THEME_TOKENS, THEME_SELECTORS, themeStyle, TOKEN_GROUPS } from '@workspec/design';

THEME_TOKENS['console-dark']['--accent']; // '#34d17f'
THEME_SELECTORS['console-dark']; // '[data-aesthetic="console"][data-theme="dark"]'

// Scope a theme to a subtree instead of <html>, e.g. in React:
<div style={themeStyle('console-light') as React.CSSProperties}>…</div>;
```

### Individual themes / `tokens.json`

```css
@import '@workspec/design/themes/console-dark.css';
```

```ts
import tokens from '@workspec/design/tokens.json';
```

## What's in here

| Export                                   | What                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| `.`                                      | Typed API — `TokenName`, `THEME_TOKENS`, `TOKEN_GROUPS`, `themeStyle`, … |
| `./tokens.css`                           | Both theme files' raw custom properties (no Tailwind mapping)            |
| `./tailwind` (`./tailwind.css`)          | The Tailwind v4 CSS-first preset                                         |
| `./tokens.json`                          | Machine-readable themes + groups + Tailwind mapping + font summary       |
| `./themes/console-dark.css`, `.../light` | One theme at a time                                                      |
| `./fonts.css`, `./fonts/*`               | Self-hosted `@font-face` rules + woff2 + OFL license texts               |

124 tokens per theme, 49 Tailwind mapping entries, 4 self-hosted font families (Inter Tight,
JetBrains Mono, Caveat, Lora — all SIL OFL, see `NOTICE`). Extraction discipline: names, values,
and selectors move exactly as found in the enterprise source — zero renames, zero value changes.
Any handoff-vs-implementation discrepancy found along the way is logged in the repo-root
`docs/drift-log.md`, not silently fixed here.

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

Tokens are a contract: a **major** bump renames or removes a token/export, a **minor** bump adds
one, a **patch** bump corrects a value. (Full policy lands with the release workflow in S3.)
