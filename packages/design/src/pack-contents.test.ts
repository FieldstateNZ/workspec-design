import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { FONT_MANIFEST } from './fonts/font-manifest.js';

// src/ -> package root
const PACKAGE_ROOT = fileURLToPath(new URL('..', import.meta.url));

const packageJson = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')) as {
  exports: Record<string, string | Record<string, string>>;
};

/**
 * Every concrete file path the export map promises, read straight from
 * package.json rather than duplicated here — this is what makes the test a
 * gate against B1-class regressions instead of a snapshot that quietly
 * agrees with whatever `files`/`exports` say. `.` (dist build output) and
 * `./fonts/*` (a glob, not a file) are asserted separately below.
 */
function exportFileTargets(exportsMap: Record<string, string | Record<string, string>>): string[] {
  const targets = new Set<string>();
  for (const [specifier, target] of Object.entries(exportsMap)) {
    if (specifier === '.' || specifier === './fonts/*') continue;
    const values = typeof target === 'string' ? [target] : Object.values(target);
    for (const value of values) {
      targets.add(value.replace(/^\.\//, ''));
    }
  }
  return [...targets];
}

describe('published tarball contents', () => {
  let tarballEntries: string[];
  let tmpDir: string;

  beforeAll(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'workspec-design-pack-'));
    // No manual build here: this exercises the real `pnpm pack` path,
    // including the `prepack` guard (N1) that builds `dist/` first.
    execFileSync('pnpm', ['pack', '--pack-destination', tmpDir], {
      cwd: PACKAGE_ROOT,
      stdio: 'pipe',
    });
    const tarballName = readdirSync(tmpDir).find((name) => name.endsWith('.tgz'));
    if (!tarballName) {
      throw new Error(`pnpm pack did not produce a .tgz file in ${tmpDir}`);
    }
    const listing = execFileSync('tar', ['-tzf', join(tmpDir, tarballName)], {
      encoding: 'utf8',
    });
    tarballEntries = listing
      .trim()
      .split('\n')
      .map((entry) => entry.replace(/^package\//, ''));
  }, 120_000);

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('includes every concrete export-map target file', () => {
    const targets = exportFileTargets(packageJson.exports);
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) {
      expect(tarballEntries, `missing export target: ${target}`).toContain(target);
    }
  });

  it('includes the dist build output backing the `.` export', () => {
    expect(tarballEntries).toContain('dist/index.js');
    expect(tarballEntries).toContain('dist/index.d.ts');
  });

  it('includes every self-hosted font file, the manifest, and every OFL license (the `./fonts/*` glob)', () => {
    for (const entry of FONT_MANIFEST) {
      expect(tarballEntries, `missing font file: ${entry.file}`).toContain(`fonts/${entry.file}`);
    }
    expect(tarballEntries).toContain('fonts/manifest.json');

    const families = [...new Set(FONT_MANIFEST.map((entry) => entry.family))];
    for (const family of families) {
      const slug = family.toLowerCase().replace(/\s+/g, '-');
      expect(tarballEntries).toContain(`fonts/licenses/${slug}-OFL.txt`);
    }
  });

  it('includes LICENSE and NOTICE', () => {
    expect(tarballEntries).toContain('LICENSE');
    expect(tarballEntries).toContain('NOTICE');
  });

  it('excludes src/, test files, and the tokens source-of-record', () => {
    for (const entry of tarballEntries) {
      expect(entry.startsWith('src/'), `unexpected src/ entry: ${entry}`).toBe(false);
      expect(/\.test\./.test(entry), `unexpected test file entry: ${entry}`).toBe(false);
      expect(
        entry.includes('source-of-record'),
        `unexpected source-of-record entry: ${entry}`,
      ).toBe(false);
    }
  });
});
