import { THEME_NAMES } from '../tokens/theme-name.js';
import type { ThemeName } from '../tokens/theme-name.js';
import { THEMES } from '../tokens/theme-registry.js';
import { themeToRecord } from '../tokens/theme-to-record.js';
import { CONTRAST_CLASS_THRESHOLDS, CONTRAST_PAIRS, pairLabel } from './pairs.js';
import type { ContrastPair } from './pairs.js';
import { KNOWN_CONTRAST_FAILURES } from './known-failures.js';
import { measureContrast } from './measure-contrast.js';
import { roundRatio } from './round-ratio.js';

interface MeasuredCheck {
  readonly pair: ContrastPair;
  readonly theme: ThemeName;
  readonly ratio: number;
  readonly threshold: number;
  readonly pass: boolean;
}

function measureAll(): readonly MeasuredCheck[] {
  const checks: MeasuredCheck[] = [];
  for (const pair of CONTRAST_PAIRS) {
    for (const theme of THEME_NAMES) {
      const record = themeToRecord(THEMES[theme]);
      const ratio = roundRatio(measureContrast(record, pair.textToken, pair.bgToken));
      const threshold = CONTRAST_CLASS_THRESHOLDS[pair.class];
      checks.push({ pair, theme, ratio, threshold, pass: ratio >= threshold });
    }
  }
  return checks;
}

function driftLogIdFor(check: MeasuredCheck): string {
  const entry = KNOWN_CONTRAST_FAILURES.find(
    (f) =>
      f.textToken === check.pair.textToken &&
      f.bgToken === check.pair.bgToken &&
      f.theme === check.theme,
  );
  return entry?.driftLogId ?? '**NEEDS ALLOWLIST ENTRY**';
}

function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

function buildMatrixSection(checks: readonly MeasuredCheck[]): string {
  const rows = CONTRAST_PAIRS.map((pair) => {
    const dark = checks.find((c) => c.pair === pair && c.theme === 'console-dark');
    const light = checks.find((c) => c.pair === pair && c.theme === 'console-light');
    if (!dark || !light) throw new Error(`missing measurement for ${pairLabel(pair)}`);
    return (
      `| \`${pairLabel(pair)}\` | ${pair.class} | ${formatRatio(dark.threshold)} | ` +
      `${formatRatio(dark.ratio)} | ${dark.pass ? 'PASS' : 'FAIL'} | ` +
      `${formatRatio(light.ratio)} | ${light.pass ? 'PASS' : 'FAIL'} |`
    );
  });

  return [
    '## Matrix',
    '',
    `Every documented pair (\`src/contrast/pairs.ts\`), measured against both themes' actual ` +
      'token values.',
    '',
    '| Pair | Class | Threshold | Dark ratio | Dark | Light ratio | Light |',
    '|---|---|---|---|---|---|---|',
    ...rows,
  ].join('\n');
}

function buildFailuresSection(checks: readonly MeasuredCheck[]): string {
  const failures = checks.filter((c) => !c.pass);
  if (failures.length === 0) {
    return ['## Failures', '', 'None — every documented pair meets its class threshold.'].join(
      '\n',
    );
  }

  const rows = failures.map(
    (check) =>
      `| \`${pairLabel(check.pair)}\` | ${check.theme} | ${check.pair.class} | ` +
      `${formatRatio(check.threshold)} | ${formatRatio(check.ratio)} | ${driftLogIdFor(check)} |`,
  );

  return [
    '## Failures',
    '',
    `${failures.length} of ${checks.length} pair×theme checks fall below their class threshold. ` +
      'Each is a documented, allowlisted drift (`src/contrast/known-failures.ts`) — extraction ' +
      'discipline forbids changing token values to fix these here; disposition is recorded in ' +
      '`docs/drift-log.md` for Brett to adjudicate. This audit does not change any token value.',
    '',
    '| Pair | Theme | Class | Threshold | Ratio | Drift log |',
    '|---|---|---|---|---|---|',
    ...rows,
  ].join('\n');
}

function buildVerdictSection(checks: readonly MeasuredCheck[]): string {
  const CORE_BACKGROUNDS = new Set(['--bg', '--bg-soft', '--bg-elevated', '--panel-dark']);
  const light = checks.filter((c) => c.theme === 'console-light');
  const primaryInk = light.filter(
    (c) =>
      (c.pair.textToken === '--ink' || c.pair.textToken === '--ink-soft') &&
      CORE_BACKGROUNDS.has(c.pair.bgToken),
  );
  const primaryClean = primaryInk.every((c) => c.pass);
  const weakestPrimaryRatio = Math.min(...primaryInk.map((c) => c.ratio));
  const failingLight = light.filter((c) => !c.pass);
  const failingRoles = [...new Set(failingLight.map((c) => c.pair.textToken))];

  const primarySentence = primaryClean
    ? `In the light theme — the theme the Decision Studio live demo follows via ` +
      '`prefers-color-scheme` — the primary text hierarchy (`--ink`, `--ink-soft`) measures ' +
      `AA-clean against every documented surface (\`--bg\`, \`--bg-soft\`, \`--bg-elevated\`, ` +
      `\`--panel-dark\`): all ${primaryInk.length} of ${primaryInk.length} pairs pass, the ` +
      `weakest at ${formatRatio(weakestPrimaryRatio)} against a 4.5:1 requirement. If the ` +
      "demo's readability problem is about primary body or heading text, that is off-spec " +
      'usage of the design system, not a defect in the spec itself — a conclusion to confirm ' +
      'during S10 (workspec-decision-studio#8) against this audit.'
    : 'In the light theme, the primary text hierarchy (`--ink`, `--ink-soft`) itself does not ' +
      'measure fully AA-clean against every documented surface — see the Failures section ' +
      'above for the specific pairs. That makes this at least partly a spec weakness, not ' +
      'purely off-spec usage; adjudication is needed before S10 (workspec-decision-studio#8) ' +
      'assumes the spec is sound.';

  const weaknessSentence =
    failingRoles.length > 0
      ? ' The spec is not spotless everywhere, though: ' +
        `${failingRoles.map((role) => `\`${role}\``).join(', ')} fail their own class ` +
        'threshold against at least one documented surface in the light theme (see Failures ' +
        "above for exact ratios). If the demo's readability complaint traces to any of those " +
        'roles — tertiary/metadata text, placeholder or disabled UI, warning-colored text, or ' +
        'button/badge labels on a filled accent — it is a weak pair in the spec itself, not ' +
        "off-spec usage, and needs Brett's adjudication (`docs/drift-log.md`)."
      : ' Every documented pair in the light theme is AA-clean, with no exceptions.';

  return ['## Verdict — workspec-decision-studio#8', '', primarySentence + weaknessSentence].join(
    '\n',
  );
}

/**
 * Builds `docs/contrast-audit.md` from `pairs.ts`, `known-failures.ts`, and
 * the two themes' actual token values — deterministic and dependency-free,
 * so `audit-report.test.ts` can regenerate it in memory and byte-compare
 * against the committed file (the same drift-gate pattern used for every
 * other generated artifact in this package). `scripts/contrast-audit.ts` is
 * the only thing that writes the result to disk.
 */
export function buildAuditReport(): string {
  const checks = measureAll();

  return (
    [
      '# Contrast audit',
      '',
      'Generated by `pnpm --filter @workspec/design audit:contrast` from `src/contrast/pairs.ts`, ' +
        '`src/contrast/known-failures.ts`, and the theme token tables — do not hand-edit; ' +
        're-run the generator instead. `src/contrast/audit-report.test.ts` byte-compares this ' +
        "file against the generator's output on every test run.",
      '',
      'Ratios use WCAG 2.x relative luminance + contrast ratio, hand-rolled in `src/contrast/` ' +
        '(no dependency). "Class" is the WCAG success-criterion bucket a pair is checked ' +
        'against: `normal-text` (SC 1.4.3, >=4.5:1) or `large-text-or-ui` (SC 1.4.3 large-text ' +
        'exception / SC 1.4.11, >=3:1) — see `src/contrast/pairs.ts` for the per-pair ' +
        'classification rationale.',
      '',
      buildMatrixSection(checks),
      '',
      buildFailuresSection(checks),
      '',
      buildVerdictSection(checks),
      '',
    ].join('\n') + '\n'
  );
}
