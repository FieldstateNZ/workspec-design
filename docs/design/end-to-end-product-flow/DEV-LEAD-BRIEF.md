# WorkSpec end-to-end design build — shared brief

Repo root: /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede
All paths below are relative to repo root unless absolute.

## Non-negotiable repo conventions (from CLAUDE.md)
- No backwards-compat shims, no dual-path code, clean cuts.
- No `any` — proper types or unknown + narrowing. Zod imports are `zod/v4`.
- API surface owned by lib/api-spec/openapi.yaml → `pnpm --filter @workspace/api-spec run codegen` regenerates lib/api-client-react + lib/api-zod (NEVER hand-edit generated). Then implement route in artifacts/api-server/src/routes/.
- DB: lib/db/src/schema.ts (re-exports from lib/db/src/schema/). After schema change: `pnpm --filter @workspace/db run generate`, register migration in lib/db/drizzle/meta/_journal.json (check actual path — may be lib/db/migrations/meta/_journal.json; current head idx=35), `pnpm --filter @workspace/db run migrate` (needs DATABASE_URL=postgresql://workspec:workspec@localhost:5433/workspec).
  - GOTCHA: drizzle.config.ts has a tablesFilter that does NOT include several live tables. Check it before generate; if your table isn't in the filter, follow the repo's existing precedent for how those tables' migrations were authored (look at how canvas_object_layouts / canvas_views migrations were produced) rather than fighting drizzle-kit.
- Comments: only WHY-comments for hidden constraints. No what-comments, no "added X" comments.
- Frontend: wouter, Tailwind v4 utilities, Framer Motion, generated React Query hooks from @workspace/api-client-react for API routes (no raw fetch for NEW API routes; legacy raw fetch exists in canvas sync — leave it).
- Tests (api-server): Vitest + Testcontainers (Docker is running). Look at existing tests under artifacts/api-server (check both src/__tests__/ and test/) and copy the harness patterns exactly.
- Typecheck per package: `pnpm --filter @workspace/workspec run typecheck`, `pnpm --filter api-server run typecheck` (confirm filter name from package.json), `pnpm --filter @workspace/db run typecheck` if it exists.
- KNOWN PRE-EXISTING failures — do not fix, do not be blocked by: ProjectCanvas.tsx:3254 TS2322 (inside a `false &&` block); the board-designer package fails typecheck entirely. Your bar: no NEW errors in the packages you touch.

## Design tokens / fonts
- App light tokens: --bg #f6f6f7, --bg-soft #fafafb, --bg-elevated #fff, --line #e4e4e7, --ink #0a0a0c, --accent #1b8a55 (green), --agent #0d8a72 (teal). Tailwind maps: bg-background, bg-card, border-border, text-primary etc. Use tokens/Tailwind classes where possible; exact design hexes for the new design-language elements (coral #d8643f rework, room blue #3a6ea5, on-board green #1f8a6a, sticky #ffe566/#d9c238) are fine inline.
- Caveat (handwritten) font: check artifacts/workspec/index.html / index.css for font loading. If Caveat isn't loaded, add it alongside however the app loads fonts today, with `cursive` fallback. JetBrains Mono: the app has a --mono var (check tokens) — use var(--mono).
- Both themes must remain legible: the app has dark + light themes (data-theme on html). Test classes against both; prefer semantic token classes, use color-mix or explicit dark adjustments only if something is illegible.

## Full design spec (distilled from the design bundle)
Read docs/design-handoffs/end-to-end-product-flow/design-spec.md for exact px/hex/copy values.
Original design HTML (source of truth if spec is ambiguous):
- "docs/design-handoffs/end-to-end-product-flow/Morph + Tether Prototype.dc.html"
- "docs/design-handoffs/end-to-end-product-flow/WorkSpec Shell.dc.html"

## Subsystem map (from the understanding pass)
Read docs/design-handoffs/end-to-end-product-flow/understanding.md — sections: discovery-canvas, structured-c4, data-api, atlas-proposals, views-surfaces. It has exact file paths, line numbers, data models, and risks. Trust it but verify line numbers by reading the files.

## Working agreement
- You own ONLY the files listed in your task. If you believe you must touch another file, it must be additive and conflict-free (new file is fine; do not edit files owned by a concurrently running slice).
- Run your package typechecks before finishing. Report: files changed, decisions made, anything deferred, exact verification commands run + results.
- The dev server (vite on 5173, api on 3001 with tsx watch) is running; do not start/stop servers.
