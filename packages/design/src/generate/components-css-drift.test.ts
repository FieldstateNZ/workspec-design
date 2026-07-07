import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import { compileComponentsCss } from './build-components-css.js';

// src/generate/ -> package root
const PACKAGE_ROOT = fileURLToPath(new URL('../../', import.meta.url));

describe('components.css matches its source of truth', () => {
  let tmpDir: string;

  afterAll(() => {
    if (tmpDir) rmSync(tmpDir, { recursive: true, force: true });
  });

  // Real @tailwindcss/cli compile (not a pure-function drift check like the
  // other artifacts in this directory — see build-components-css.ts) run
  // twice at 120s timeout each: once here, once by `pnpm gen:tokens`-adjacent
  // `build:components-css`. Recompiling into a temp file and byte-comparing
  // is the only way to gate drift on a JIT-compiled artifact.
  it('recompiling src/generate/components-entry.css reproduces the committed file byte-for-byte', () => {
    tmpDir = mkdtempSync(join(tmpdir(), 'workspec-design-components-css-'));
    const outputPath = join(tmpDir, 'components.css');
    compileComponentsCss(outputPath);

    const rebuilt = readFileSync(outputPath, 'utf8');
    const committed = readFileSync(join(PACKAGE_ROOT, 'components.css'), 'utf8');
    expect(
      rebuilt,
      'run `pnpm --filter @workspec/design run build:components-css` to regenerate',
    ).toBe(committed);
  }, 120_000);
});
