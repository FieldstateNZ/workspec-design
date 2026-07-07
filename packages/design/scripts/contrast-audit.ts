// Standalone contrast-audit runner (workspec-design#3). Prints the full
// pair × theme matrix to the console and (re)writes the committed
// docs/contrast-audit.md from the same generator the drift test
// (src/contrast/audit-report.test.ts) checks against.
//
//   pnpm --filter @workspec/design audit:contrast
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEME_NAMES } from '../src/tokens/theme-name.js';
import { THEMES } from '../src/tokens/theme-registry.js';
import { themeToRecord } from '../src/tokens/theme-to-record.js';
import { CONTRAST_PAIRS } from '../src/contrast/pairs.js';
import { CONTRAST_CLASS_THRESHOLDS } from '../src/contrast/contrast-class-thresholds.js';
import { pairLabel } from '../src/contrast/pair-label.js';
import { measureContrast } from '../src/contrast/measure-contrast.js';
import { roundRatio } from '../src/contrast/round-ratio.js';
import { contrastVerdict } from '../src/contrast/contrast-verdict.js';
import { buildAuditReport } from '../src/contrast/build-audit-report.js';

// scripts/ -> packages/design/ -> packages/ -> <repo root>/
const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));

console.log('WCAG AA contrast matrix\n');
let failCount = 0;
for (const pair of CONTRAST_PAIRS) {
  for (const theme of THEME_NAMES) {
    const record = themeToRecord(THEMES[theme]);
    const rawRatio = measureContrast(record, pair.textToken, pair.bgToken);
    const ratio = roundRatio(rawRatio);
    const threshold = CONTRAST_CLASS_THRESHOLDS[pair.class];
    const status = contrastVerdict(rawRatio, threshold) ? 'PASS' : 'FAIL';
    if (status === 'FAIL') failCount += 1;
    console.log(
      `${status.padEnd(4)} ${theme.padEnd(14)} ${pairLabel(pair).padEnd(40)} ` +
        `${ratio.toFixed(2)}:1 (>= ${threshold}:1 ${pair.class})`,
    );
  }
}
console.log(
  `\n${failCount} of ${CONTRAST_PAIRS.length * THEME_NAMES.length} checks below threshold.`,
);

const reportPath = join(repoRoot, 'docs/contrast-audit.md');
writeFileSync(reportPath, buildAuditReport(), 'utf8');
console.log(`\nwrote docs/contrast-audit.md`);
