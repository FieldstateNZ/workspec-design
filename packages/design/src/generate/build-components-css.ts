import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildComponentsCssBanner } from './build-components-css-banner.js';

// src/generate/ -> src/ -> <package root>/
const PACKAGE_ROOT = fileURLToPath(new URL('../../', import.meta.url));

/**
 * Compiles `components.css` at `outputPath` by shelling out to the real
 * `@tailwindcss/cli` against `src/generate/components-entry.css`, then
 * prepends the generated-file banner. Unlike the deterministic string
 * builders elsewhere in this directory (buildTokensCss, buildTailwindCss,
 * ...), this is a genuine JIT compile — it scans live `.tsx` source via
 * `@source`, so it needs the real engine, not a pure function. Used by both
 * `scripts/build-components-css.ts` (writes the committed artifact) and
 * `components-css-drift.test.ts` (writes to a temp file and byte-compares).
 */
export function compileComponentsCss(outputPath: string): void {
  execFileSync(
    'pnpm',
    ['exec', 'tailwindcss', '-i', 'src/generate/components-entry.css', '-o', outputPath],
    { cwd: PACKAGE_ROOT, stdio: 'pipe' },
  );
  const compiled = readFileSync(outputPath, 'utf8');
  writeFileSync(outputPath, `${buildComponentsCssBanner()}\n${compiled}`, 'utf8');
}
