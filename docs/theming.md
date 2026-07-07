# Theming contract

The exact theme-switching mechanism this package extracts, verbatim, from
`workspec/artifacts/workspec`. Per `DELIVERY_PLAN.md`'s extraction discipline, nothing here is
invented — this documents what the enterprise app already does, so a consuming host can
reproduce it correctly. (Cross-linked from the package README in a later slice — S3 owns
`README.md`.)

## 1. The attribute pair activates a palette

```html
<html data-aesthetic="console" data-theme="dark"></html>
```

Setting `data-aesthetic="console"` together with `data-theme="dark"` or `data-theme="light"` on
`<html>` (or any ancestor of the themed content) activates that theme's custom properties. Each
theme file's selector requires both attributes — there is no single-attribute fallback:

| Theme           | Selector (in the generated CSS file)                                          |
| --------------- | ----------------------------------------------------------------------------- |
| `console-dark`  | `[data-aesthetic="console"][data-theme="dark"]` (`themes/console-dark.css`)   |
| `console-light` | `[data-aesthetic="console"][data-theme="light"]` (`themes/console-light.css`) |

These strings are also available at runtime from `THEME_SELECTORS` (`src/tokens/theme-selectors.ts`),
so a host never has to hand-transcribe them. The `data-aesthetic` dimension is always required
even though this package only ships one aesthetic ("console") — the implementation's selector
model reserves the slot for a second aesthetic ("paper") that exists only in design handoffs, not
in the running app (see `docs/inventory.md` "Themes" and `docs/drift-log.md` D13). Consumers of
this package should still always set `data-aesthetic="console"`, not omit it.

`tokens.css` (and its package export, `@workspec/design/tokens.css`) `@import`s both theme files,
so a consumer who wants both themes available and switches by attribute alone only needs to import
that one file. A consumer who wants exactly one theme, statically, can instead import
`@workspec/design/themes/console-dark.css` (or `.../console-light.css`) directly and skip
shipping the other theme's CSS.

## 2. Tailwind's `dark:` variant needs a SECOND, independent signal

The Tailwind v4 preset (`@workspec/design/tailwind`, generated from
`src/tokens/tailwind-mapping.ts`) declares:

```css
@custom-variant dark (&:is(.dark *));
```

This means every `dark:` utility class (`dark:bg-card`, `dark:text-ink`, …) activates based on a
`.dark` **class** on an ancestor element — a completely different, independent signal from the
`data-theme` **attribute** that activates the token palette above. Setting only `data-theme="dark"`
switches the CSS variables' values but leaves every `dark:` Tailwind utility inactive, and vice
versa. A consumer must set **both signals together**, on the same themed root:

```html
<html data-aesthetic="console" data-theme="dark" class="dark"></html>
```

This is not a design choice this package introduces — it's the enterprise implementation's actual
mechanism, carried forward as-is (`docs/drift-log.md` D21, "Dual dark-mode signalling": "every
known code path sets both together, but the mechanism itself has two independent triggers with no
single source of truth"). D22 records a real bug this dual-signal design invites: one of the
enterprise app's three theme-setting code paths used a different `localStorage` key and could
flip the `.dark` class without touching `data-theme`, letting the two signals disagree until React
mounted. Anything that sets one signal without the other is a bug waiting to surface exactly like
D22 — always write to both.

### The no-flash inline-script pattern

To avoid a flash of the wrong theme before the app's JavaScript runs, set both signals
synchronously from an inline `<script>` in `<head>`, before any stylesheet or app bundle loads —
the pattern the enterprise `index.html` uses (see below for exact provenance):

```html
<head>
  <script>
    (function () {
      var root = document.documentElement;
      var theme = 'dark';
      try {
        var stored = JSON.parse(localStorage.getItem('workspec.theme'));
        theme =
          stored && stored.theme === 'light'
            ? 'light'
            : stored && stored.theme === 'dark'
              ? 'dark'
              : window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
      } catch (e) {
        /* localStorage unavailable or malformed — fall through to the light default above */
      }
      root.setAttribute('data-aesthetic', 'console');
      root.setAttribute('data-theme', theme);
      root.classList.toggle('dark', theme === 'dark');
    })();
  </script>
  <!-- stylesheets and app scripts follow -->
</head>
```

**Provenance:** this pattern is not vendored verbatim in this repo — `docs/design/` vendors only
the design-handoff bundles, not enterprise app source. It is transcribed from two files in
`workspec/artifacts/workspec` (not copied here; read during extraction, per
`docs/drift-log.md`'s citation convention):

- `index.html` — the no-flash inline script itself, run before first paint.
- `src/hooks/use-theme.ts` — the mounted-React hook that takes over after hydration, keeps
  `data-theme`/`.dark` in sync with user preference changes, and defines the `"workspec.theme"`
  JSON `localStorage` shape the script above reads.

Both are cited by `docs/drift-log.md` D22, which also documents a third code path
(`src/main.tsx`) that reads a **different**, mismatched `localStorage` key
(`"workspec-theme"`, a plain string) and can desynchronize the two signals — logged, not fixed,
per extraction discipline. A host implementing this pattern from scratch should pick **one**
persisted-preference key and shape and use it everywhere, precisely to avoid reintroducing D22.

## 3. `themeStyle()` — scoped or inline theming

Setting attributes on `<html>` assumes a host controls the whole document — not true for a
module-federation host embedding this design system in a subtree of a page it doesn't otherwise
theme. For that case, `@workspec/design` exports `themeStyle()`:

```ts
import { themeStyle } from '@workspec/design';

<div style={themeStyle('console-dark') as React.CSSProperties}>…</div>;
```

`themeStyle(theme)` returns every one of that theme's 124 tokens as a plain
`Record<string, string>` of CSS custom properties (`{ '--bg': '#0a0a0c', '--ink': '#e8e8ea', ... }`)
suitable for an inline `style` prop or `Object.assign(el.style, themeStyle(...))` — it scopes the
token palette to exactly the element it's applied to, with no dependency on `<html>`'s attributes
at all. It does **not** set the `.dark` class: a host that also wants Tailwind's `dark:` utilities
to activate inside that subtree still needs to add `.dark` on an ancestor of it (or wrap it in a
`<div className={theme === 'console-dark' ? 'dark' : ''}>`) — `themeStyle()` only carries the
token values, per §1, not the Tailwind signal from §2.

## Summary

| Signal              | Activates                                        | Values                                       | Set via                                     |
| ------------------- | ------------------------------------------------ | -------------------------------------------- | ------------------------------------------- |
| `data-aesthetic`    | which aesthetic's tokens apply                   | `"console"` (only value shipped)             | attribute on themed root                    |
| `data-theme`        | which theme's token values apply                 | `"dark"` \| `"light"`                        | attribute on themed root                    |
| `.dark` class       | Tailwind's `dark:` utility variant               | present / absent                             | class on themed root (or an ancestor of it) |
| `themeStyle(theme)` | scoped/inline token values, no attributes needed | a `Record<string, string>` of all 124 tokens | inline `style`                              |

This package ships the CSS and the TS values — it does not ship a theme manager. Keeping the three
root-level signals synchronized (or choosing `themeStyle()` instead, when attributes aren't an
option) is the host application's responsibility.
