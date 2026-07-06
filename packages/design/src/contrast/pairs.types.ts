import type { TokenName } from '../tokens/token-names.js';

/**
 * WCAG 2.x success-criterion class a pair is checked against:
 * `normal-text` is SC 1.4.3 (4.5:1) — body copy, labels, anything read as
 * running text. `large-text-or-ui` is SC 1.4.3's large-text exception and
 * SC 1.4.11 non-text contrast (3:1) — large/bold text, icons, UI-element
 * outlines, and roles this table classifies as decorative/non-text (see
 * `--ink-ghost` in `pairs.ts`).
 */
export type ContrastClass = 'normal-text' | 'large-text-or-ui';

/** One documented (text-or-UI role) on (background role) combination this system's components can produce. */
export interface ContrastPair {
  readonly textToken: TokenName;
  readonly bgToken: TokenName;
  readonly class: ContrastClass;
  /** Why this pair is classified the way it is, when it isn't obvious from the token names alone. */
  readonly rationale?: string;
}
