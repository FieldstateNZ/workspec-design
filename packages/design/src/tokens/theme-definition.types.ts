import type { TokenName } from './token-names.js';

/** One `name: value` custom-property declaration. */
export interface TokenEntry {
  readonly name: TokenName;
  readonly value: string;
}

/**
 * A run of token declarations that shared one comment in the source CSS
 * (e.g. "ink", "accent — brand green"). `comment` is the verbatim comment
 * body, `\n`-joined for the (rare) multi-line ones — kept so the generated
 * CSS can reproduce it, and so nothing is lost from the extraction source.
 */
export interface TokenSection {
  readonly comment?: string;
  readonly tokens: readonly TokenEntry[];
}

/**
 * One CSS rule block a console theme file is split into (workspec#384 — see
 * `PIPELINE_LIMIT_NOTE` in `shared-comments.ts`). Reproducing the same split
 * in generated CSS is the point: a single rule with too many properties
 * silently lost tokens under the enterprise app's Tailwind v4 pipeline. The
 * first three blocks are the enterprise extraction itself; a fourth block
 * (the `--el-*` tokens, a workspec-studio-only addition — see
 * `console-dark.ts`'s file header) exists for the same pipeline-limit
 * reason, not a new one.
 */
export interface TokenBlock {
  /** Comment appearing directly above this block's selector, if any. */
  readonly precedingComment?: string;
  readonly sections: readonly TokenSection[];
}

/** The full transcription of one enterprise console theme file. */
export interface ThemeDefinition {
  readonly name: 'console-dark' | 'console-light';
  /** e.g. `[data-aesthetic="console"][data-theme="dark"]` — identical across all blocks. */
  readonly selector: string;
  /** The file's opening comment, e.g. "WorkSpec · Console · Dark — brand guidelines v1". */
  readonly titleComment: string;
  readonly blocks: readonly [TokenBlock, TokenBlock, TokenBlock, TokenBlock];
  /** Comment appearing after the final block's closing brace, if any (console-dark only). */
  readonly trailingComment?: string;
}
