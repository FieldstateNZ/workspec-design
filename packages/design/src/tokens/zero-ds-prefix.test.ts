import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TOKEN_NAMES } from './token-names.js';
import { TAILWIND_MAPPING } from './tailwind-mapping.js';

// workspec-decision-studio's `--ds-*` layer (packages/ui/src/themes.ts) is the
// exact thing this extraction exists to make obsolete (S10 deletes it in
// favour of these token names) — so a `ds-` prefixed name anywhere in this
// package would be a sign the extraction picked up that bespoke port by
// mistake, not the enterprise source. See docs/drift-log.md.
const DS_PREFIX_PATTERN = /(^|[^a-zA-Z0-9])ds-[a-zA-Z]/;

const packageRoot = fileURLToPath(new URL('../../', import.meta.url));

function listFilesRecursive(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

describe('zero ds-prefix gate', () => {
  it('no TOKEN_NAMES entry is ds-prefixed', () => {
    expect(TOKEN_NAMES.filter((name) => DS_PREFIX_PATTERN.test(name))).toEqual([]);
  });

  it('no TAILWIND_MAPPING name is ds-prefixed', () => {
    expect(
      TAILWIND_MAPPING.map((entry) => entry.name).filter((name) => DS_PREFIX_PATTERN.test(name)),
    ).toEqual([]);
  });

  it('no source file under src/ contains a ds-prefixed custom property or class name', () => {
    const srcDir = join(packageRoot, 'src');
    // This file itself is exempt — it's the only place in `src/` allowed to
    // *talk about* the `ds-` prefix (see the comment above `DS_PREFIX_PATTERN`).
    const self = fileURLToPath(import.meta.url);
    const offenders = listFilesRecursive(srcDir)
      .filter((path) => path.endsWith('.ts') && path !== self)
      .filter((path) => DS_PREFIX_PATTERN.test(readFileSync(path, 'utf8')))
      .map((path) => path.slice(packageRoot.length));

    expect(offenders).toEqual([]);
  });

  it('no generated artifact contains a ds-prefixed custom property', () => {
    const artifacts = [
      'themes/console-dark.css',
      'themes/console-light.css',
      'tokens.css',
      'tailwind.css',
      'tokens.json',
      'fonts.css',
    ];
    const offenders = artifacts.filter((relativePath) =>
      DS_PREFIX_PATTERN.test(readFileSync(join(packageRoot, relativePath), 'utf8')),
    );

    expect(offenders).toEqual([]);
  });
});
