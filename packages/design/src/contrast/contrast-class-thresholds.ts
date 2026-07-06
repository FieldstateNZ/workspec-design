import type { ContrastClass } from './pairs.types.js';

/** Minimum ratio required for each {@link ContrastClass}. */
export const CONTRAST_CLASS_THRESHOLDS: Readonly<Record<ContrastClass, number>> = {
  'normal-text': 4.5,
  'large-text-or-ui': 3,
};
