import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseCssCustomProperties } from '../parse/parse-css-custom-properties.js';
import { TAILWIND_MAPPING } from './tailwind-mapping.js';

const vendored = readFileSync(
  fileURLToPath(new URL('./source-of-record/tailwind-mapping.css', import.meta.url)),
  'utf8',
);

describe('Tailwind mapping fidelity', () => {
  it('has exactly 49 entries (byte-verified against docs/inventory.md)', () => {
    expect(TAILWIND_MAPPING).toHaveLength(49);
  });

  it('matches the vendored @theme inline segment 1:1 (names, values, order)', () => {
    const parsed = parseCssCustomProperties(vendored);

    expect(TAILWIND_MAPPING.map((entry) => entry.name)).toEqual(parsed.map((entry) => entry.name));
    expect(TAILWIND_MAPPING.map((entry) => entry.value)).toEqual(
      parsed.map((entry) => entry.value),
    );
  });
});
