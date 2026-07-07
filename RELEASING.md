# Releasing

`workspec-design` publishes one package to npm: `@workspec/design`. `apps/preview` and
`examples/fixture` are `private` and never publish.

## Versioning

Tokens are a contract — see [`packages/design/README.md`](./packages/design/README.md#versioning)
for the full policy (major = rename/remove, minor = add, patch = value correction). Bump the
single package's version directly:

```bash
npm version <x.y.z> --prefix packages/design --no-git-tag-version   # or edit packages/design/package.json by hand
git commit -am "release: v<x.y.z>"
git tag v<x.y.z>
git push origin main --tags
```

Pushing the tag runs [`release.yml`](./.github/workflows/release.yml): install → build → typecheck
→ test → pack → publish.

## Auth: OIDC trusted publishing (no `NPM_TOKEN`)

`release.yml` publishes via npm **trusted publishing** — GitHub mints a short-lived OIDC token
(`id-token: write`) that npm exchanges for publish rights. There is no `NPM_TOKEN` secret to
create, rotate, or leak. Provenance is attached automatically because the publish runs in this
OIDC-authenticated CI context and `packages/design/package.json` sets
`publishConfig.provenance: true`.

### One-time bootstrap (Brett)

Trusted publishing can only be registered for a package that **already exists** on the registry,
so the very first publish has to happen by hand:

1. `npm login` on a workstation, as an account with publish rights to the `@workspec` scope.
2. From the repo root:
   ```bash
   pnpm install
   pnpm -r build
   pnpm typecheck && pnpm test
   pnpm --filter @workspec/design publish --access public --no-git-checks
   ```
3. Once `@workspec/design` exists on npmjs.com, register a **trusted publisher** for it:
   - Owner: `FieldstateNZ`
   - Repo: `workspec-design`
   - Workflow: `release.yml`
4. From this point on, every `git push --tags` of a `v*` tag publishes automatically —
   no further manual `npm publish` is needed, and no token is stored anywhere.

### Requirements

- npm CLI **>= 11.5.1** (trusted publishing's OIDC exchange needs it; `release.yml` upgrades the
  Node 20 runner's bundled npm 10 to a pinned 11.x before publishing).
- The trusted publisher's `owner/repo/workflow` must match exactly, or the OIDC exchange is
  rejected.

## Dist-tag behaviour

`release.yml` derives the npm dist-tag from `packages/design/package.json`'s version, not a fixed
value:

- A **stable** version (`0.1.0`, `1.2.0`, …) publishes to `latest`.
- A **prerelease** version (`0.1.0-alpha.0`, `1.0.0-rc.1`, …) publishes to its prerelease channel
  — the first dot-segment after the hyphen (`alpha`, `rc`, …) — **not** `latest`. npm 11.x
  rejects publishing a prerelease version to `latest` without an explicit `--tag` override, so
  this derivation is required, not cosmetic.

Consumers pin against the tag that matches their tolerance for churn (see
[`packages/design/README.md`](./packages/design/README.md#versioning) for the full pinning
guidance) — e.g. `npm dist-tag ls @workspec/design` to see what's live, or
`pnpm add @workspec/design@alpha` to track the prerelease channel explicitly.

## Preflight (always)

```bash
pnpm install
pnpm lint && pnpm format:check && pnpm typecheck && pnpm test
pnpm -r build

# Inspect exactly what the tarball will contain — no src/, dist + committed
# CSS/JSON artifacts + README + LICENSE + NOTICE (see packages/design/package.json `files`).
pnpm --filter @workspec/design pack --pack-destination /tmp
tar tzf /tmp/workspec-design-*.tgz
```

## Manual path

If publishing from a workstation instead of CI (the one-time bootstrap above, or a break-glass
release):

```bash
npm login                        # an account with @workspec publish rights
pnpm -r build
# Provenance requires a supported CI with OIDC; from a laptop, publish without it:
pnpm --filter @workspec/design publish --access public --no-git-checks
```

Add `--dry-run` first to rehearse.

## GitHub Pages (the preview page, not part of this release)

`apps/preview` — the token/theme preview generated from `tokens.json` — deploys separately via
[`pages.yml`](./.github/workflows/pages.yml) on every push to `main` that touches
`apps/preview/**` or `packages/design/**`, to <https://fieldstatenz.github.io/workspec-design/>.
It is not gated on an npm release; the preview always tracks the workspace source, not the
published tarball (see `apps/preview/package.json` — it depends on `@workspec/design` via
`workspace:*`).
