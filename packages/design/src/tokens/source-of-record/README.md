# Source of record

Byte-exact vendored copies of the enterprise token files this package extracts, kept purely as
an extraction-fidelity fixture for the tests in `src/tokens/source-of-record.test.ts` and
`src/tokens/tailwind-mapping.test.ts`. **Do not hand-edit these files** — they must stay
byte-identical to the source path they were copied from, so the provenance note lives here
instead of inside them.

| File                   | Vendored from                                                                                                                                                                                                                                                                                                                                                                                                                      | Vendored on | Byte-identical |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `console-dark.css`     | `workspec/artifacts/workspec/src/styles/tokens/console-dark.css`                                                                                                                                                                                                                                                                                                                                                                   | 2026-07-06  | yes            |
| `console-light.css`    | `workspec/artifacts/workspec/src/styles/tokens/console-light.css`                                                                                                                                                                                                                                                                                                                                                                  | 2026-07-06  | yes            |
| `index.css`            | `workspec/artifacts/workspec/src/styles/tokens/index.css`                                                                                                                                                                                                                                                                                                                                                                          | 2026-07-06  | yes            |
| `tailwind-mapping.css` | A vendored **segment** of `workspec/artifacts/workspec/src/index.css` — the `@theme inline` block, `@custom-variant dark`, and the typography `@plugin` line only. Not byte-identical to any single range of the source file's line numbers because a provenance comment is prepended inside it (see that file's own header) rather than kept in this README, since it is already a curated excerpt rather than a whole-file copy. | 2026-07-06  | segment only   |

`console-dark.css` and `console-light.css` are the two files `src/tokens/console-dark.ts` and
`src/tokens/console-light.ts` transcribe. `index.css` is vendored for completeness (it is the
enterprise entry point that `@import`s the two theme files — see `docs/inventory.md`) but is not
itself parsed by any test; the extraction boundary for `index.css` proper is the segment in
`tailwind-mapping.css`, per `DELIVERY_PLAN.md` architecture decision #5.

Per `docs/inventory.md` / `DELIVERY_PLAN.md` architecture decision #5, the app-level palettes
elsewhere in the enterprise `src/index.css` (`--color-artifact-*`, `--c4-*`, `--el-*`/`--conn-*`,
`--grid-line*`, `:root --radius`, the gray-utility compatibility shim, keyframes) are **not**
extracted and are therefore not vendored here.
