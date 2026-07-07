import type { TokenName } from '../tokens/token-names.js';
import type { ThemeName } from '../tokens/theme-name.js';

/**
 * One committed, documented contrast-gate failure: a pair (identified by
 * its two tokens, matching a `ContrastPair` from `pairs.ts`) in one theme
 * that measured below its class threshold at the time of the initial audit
 * (2026-07-06). Extraction discipline forbids changing token values to fix
 * these — they're recorded here and in `docs/drift-log.md` for Brett's
 * adjudication instead.
 *
 * `measuredRatio` is asserted against by `contrast-gate.test.ts` (rounded to
 * 2 decimal places) so this file can't silently drift from reality: if a
 * future token edit changes the ratio without updating this entry, the gate
 * fails until someone reconciles it.
 */
export interface KnownContrastFailure {
  readonly textToken: TokenName;
  readonly bgToken: TokenName;
  readonly theme: ThemeName;
  readonly measuredRatio: number;
  /** `docs/drift-log.md` entry ID this failure is recorded under. */
  readonly driftLogId: string;
}
