import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// src/components/ -> package root
const PACKAGE_ROOT = fileURLToPath(new URL('../../', import.meta.url));
const COMPONENTS_ROOT = fileURLToPath(new URL('.', import.meta.url));

const packageJson = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8')) as {
  peerDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

function listFilesRecursive(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

/**
 * S4's half of the extraction contract (docs/inventory.md, DELIVERY_PLAN.md
 * decision 6): the migrated component tree must be a leaf package —
 * react/react-dom peers only, nothing that ties it back to the enterprise
 * monorepo it came from.
 */
describe('component package peer policy', () => {
  it('peerDependencies is exactly react + react-dom', () => {
    expect(Object.keys(packageJson.peerDependencies ?? {}).sort()).toEqual(['react', 'react-dom']);
  });

  it('no dependency, devDependency, or peerDependency is an @workspace/* (enterprise-monorepo-internal) package', () => {
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies,
    };
    const offenders = Object.keys(allDeps).filter((name) => name.startsWith('@workspace/'));
    expect(offenders).toEqual([]);
  });

  it('no dependency is `wouter` (the page-shell inversion removed the only coupling)', () => {
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies,
    };
    expect(Object.keys(allDeps)).not.toContain('wouter');
  });

  it('no migrated component file references a workspec app path or the enterprise `@workspace/*` scope', () => {
    // This file itself is exempt — it's the one place allowed to *talk
    // about* the patterns it's checking for.
    const self = fileURLToPath(import.meta.url);
    const offenders = listFilesRecursive(COMPONENTS_ROOT)
      .filter((path) => /\.(tsx?|css)$/.test(path) && path !== self)
      .filter((path) => {
        const contents = readFileSync(path, 'utf8');
        return /@workspace\//.test(contents) || /\/workspec\/artifacts\/workspec/.test(contents);
      })
      .map((path) => path.slice(PACKAGE_ROOT.length));

    expect(offenders).toEqual([]);
  });
});
