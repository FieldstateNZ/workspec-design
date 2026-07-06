import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildAuditReport } from './build-audit-report.js';

// src/contrast/ -> src/ -> packages/design/ -> packages/ -> <repo root>/
const committed = (): string =>
  readFileSync(
    fileURLToPath(new URL('../../../../docs/contrast-audit.md', import.meta.url)),
    'utf8',
  );

describe('generated artifacts are up to date', () => {
  it('docs/contrast-audit.md matches its source of truth', () => {
    expect(
      buildAuditReport(),
      'run `pnpm --filter @workspec/design audit:contrast` to regenerate',
    ).toBe(committed());
  });
});
