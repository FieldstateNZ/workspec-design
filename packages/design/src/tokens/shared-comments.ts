/**
 * Explains why each console theme file is split into three CSS rule blocks
 * instead of one. Identical, word-for-word, in both `console-dark.css` and
 * `console-light.css` — kept as a single constant here rather than
 * transcribed twice. See workspec#384 and `DELIVERY_PLAN.md` decision 4.
 */
export const PIPELINE_LIMIT_NOTE = `The Console palette is split across a few rules ON PURPOSE: a single
[data-aesthetic][data-theme] rule with ~75+ custom properties tripped a
Tailwind v4 CSS-pipeline limit that silently dropped ~half the tokens from
the production build (the whole app lost its colour). Keep each rule well
under that — add a new split rather than growing one past ~50 tokens.`;
