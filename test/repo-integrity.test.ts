import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/**
 * SHA-256 of each token-bearing vendored file, computed at vendor time
 * (2026-07-06) from workspec/docs/design-handoffs/. These guard the
 * reference-of-record against silent edits — CI can't reach back into the
 * source workspec repo to re-diff, so a hash is the only tamper check
 * available. A legitimate re-vendor (Brett pulls a newer handoff export)
 * updates these constants alongside the file it re-hashes; that is the one
 * time this test is expected to change.
 */
const VENDORED_TOKEN_HASHES: Record<string, string> = {
  'docs/design/design_handoff_workspec/console/tokens.css':
    'cbd2ae63afca2d326eb0c4d3c2bd4732a7a8d66a08442f9b92a7c1970f25fe01',
  'docs/design/design_handoff_workspec/paper/tokens.css':
    '874e91e98592f26bab6f7131737a880aafa39af18849b4c41ae23625e5103e2b',
  'docs/design/design_handoff_interaction_modes/tokens.css':
    '1ca699562f85d97441292de01aa1ef5dbd3d097e292a8afdeaad581277d1e877',
  'docs/design/design_handoff_interaction_modes/tokens/console-light.css':
    '987f0b0f6b06746892e6209faab319c18300b7040f51d3d7bec9856799e85cd1',
};

function sha256(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

describe('vendored design-handoff bundles', () => {
  const bundles = [
    'docs/design/design_handoff_workspec',
    'docs/design/design_handoff_interaction_modes',
    'docs/design/end-to-end-product-flow',
  ];

  it.each(bundles)('%s exists', (bundle) => {
    expect(existsSync(join(ROOT, bundle))).toBe(true);
  });

  it.each(bundles)('%s/README.md exists', (bundle) => {
    expect(existsSync(join(ROOT, bundle, 'README.md'))).toBe(true);
  });

  it('design_handoff_interaction_modes/tokens.css exists (token structure of record)', () => {
    expect(existsSync(join(ROOT, 'docs/design/design_handoff_interaction_modes/tokens.css'))).toBe(
      true,
    );
  });

  it('end-to-end-product-flow/INDEX.md exists (visual/value canon)', () => {
    expect(existsSync(join(ROOT, 'docs/design/end-to-end-product-flow/INDEX.md'))).toBe(true);
  });
});

describe('vendored token files stay byte-identical to their source of record', () => {
  it.each(Object.entries(VENDORED_TOKEN_HASHES))(
    '%s matches its vendor-time hash',
    (path, expected) => {
      expect(sha256(join(ROOT, path))).toBe(expected);
    },
  );
});

describe('NOTICE and license split', () => {
  it('NOTICE exists and contains the trademark clause', () => {
    const notice = readFileSync(join(ROOT, 'NOTICE'), 'utf-8');
    expect(notice).toMatch(/trademark/i);
    expect(notice).toMatch(/assets\/brand/);
  });
});

describe('inventory and drift-log are complete', () => {
  it('docs/inventory.md exists and is non-trivial', () => {
    const path = join(ROOT, 'docs/inventory.md');
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(1024);
  });

  it('docs/drift-log.md exists and is non-trivial', () => {
    const path = join(ROOT, 'docs/drift-log.md');
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(1024);
  });
});
