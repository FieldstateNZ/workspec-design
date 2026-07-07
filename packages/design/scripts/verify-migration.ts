// Migration-fidelity verifier (S4, workspec-design#5). Compares every
// migrated boundary file (docs/inventory.md's "migrated from" column)
// against its enterprise source at workspec/artifacts/workspec/src, proving
// the extraction discipline held: components moved AS THEY EXIST, with only
// mechanical import-specifier rewrites (packages/design/scripts/migrate-components.ts)
// and the two documented, justified exceptions below.
//
// Both sides are reformatted through this repo's own Prettier config before
// comparing — the committed migration already went through `pnpm format`
// (packages/design/src/components isn't in .prettierignore, unlike the
// byte-vendored artifacts it sits next to), so raw text diffs are 100% noise
// (quote style, semicolons, wrapping). Prettier-normalizing both sides
// cancels that noise out and leaves only real content differences. Import
// and re-export ("export ... from") statements are then stripped from both
// sides before comparing, since the codemod's entire job was rewriting
// their specifiers — that is the one *expected* textual change extraction
// permits everywhere.
//
//   pnpm --filter @workspec/design run verify:migration
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const ENTERPRISE_SRC = '/home/user/workspec/artifacts/workspec/src';
// scripts/ -> package root
const PACKAGE_ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(PACKAGE_ROOT, 'src');

const PRETTIER_OPTIONS = {
  singleQuote: true,
  semi: true,
  printWidth: 100,
  trailingComma: 'all' as const,
  arrowParens: 'always' as const,
};

interface Mapping {
  readonly label: string;
  readonly sourcePath: string;
  readonly migratedPath: string;
  /** Set only for the boundary's documented expected deviations. */
  readonly justification?: string;
}

function tsMappings(dir: 'ui' | 'design'): Mapping[] {
  const migratedDir = join(SRC, 'components', dir);
  const files = readdirSync(migratedDir)
    .filter((name) => /\.(tsx|ts)$/.test(name))
    .sort();
  return files.map((name) => ({
    label: `components/${dir}/${name}`,
    sourcePath: join(ENTERPRISE_SRC, 'components', dir, name),
    migratedPath: join(migratedDir, name),
  }));
}

/**
 * Every expected content deviation beyond a mechanical import-specifier
 * rewrite, keyed by this script's `label`. Each is required by *this
 * package's* stricter settings (`tsconfig.base.json`: `verbatimModuleSyntax`,
 * `noUncheckedIndexedAccess`, `noUnusedLocals`; `eslint.config.js`:
 * `consistent-type-imports`, `no-explicit-any`) that the enterprise app's
 * own tsconfig/eslint don't carry — confirmed one-by-one by reverting each
 * file to its source form and running `tsc --noEmit` / `eslint` against it.
 */
const JUSTIFICATIONS: Record<string, string> = {
  'components/design/page-shell.tsx':
    "INVERSION (docs/inventory.md, DELIVERY_PLAN.md decision 6): wouter's `Link` replaced by " +
    'a `linkComponent` prop (default plain `<a>`) so the package carries no router dependency. ' +
    'The only behaviour-shaped change in the whole migration.',
  'components/ui/calendar.tsx':
    "`DayButton` split into its own `import type` — react-day-picker's `DayButton` is used " +
    "here only as a type (`React.ComponentProps<typeof DayButton>`); the enterprise app's " +
    "eslint config doesn't enforce `@typescript-eslint/consistent-type-imports`, this " +
    "package's does (verified: reverting to a single mixed-value import fails `pnpm lint` " +
    'with "Imports \\"DayButton\\" are only used as type").',
  'components/ui/input-otp.tsx':
    "Non-null assertion added on `inputOTPContext.slots[index]`: this package's tsconfig sets " +
    "`noUncheckedIndexedAccess` (the enterprise app's does not), which types array index " +
    'access as possibly-`undefined`. `index` is always in range (input-otp renders exactly ' +
    '`maxLength` slots) — see the comment left in the file.',
  'components/design/artifact-card.tsx':
    '`as any` replaced with a typed `as React.CSSProperties` cast (plus the `import type * as ' +
    "React` that requires): this package's eslint config enforces " +
    "`@typescript-eslint/no-explicit-any` as an error; the enterprise app's does not " +
    "(verified: reverting to the source's `['--art-accent' as any]` fails `pnpm lint`).",
  'hooks/use-toast.ts':
    'Dead-code removal: the runtime `actionTypes` const was only ever read as `typeof ' +
    "actionTypes` (a type position) — no call site read its value — so this package's " +
    'no-unused-vars gate flags the const itself as dead. Inlined as a literal `ActionType` ' +
    'type; the `Action` union it feeds is unchanged. See the comment left in the file.',
};

const MAPPINGS: Mapping[] = [
  ...tsMappings('ui'),
  ...tsMappings('design'),
  {
    label: 'hooks/use-mobile.tsx',
    sourcePath: join(ENTERPRISE_SRC, 'hooks/use-mobile.tsx'),
    migratedPath: join(SRC, 'hooks/use-mobile.tsx'),
  },
  {
    label: 'hooks/use-toast.ts',
    sourcePath: join(ENTERPRISE_SRC, 'hooks/use-toast.ts'),
    migratedPath: join(SRC, 'hooks/use-toast.ts'),
  },
  {
    label: 'lib/utils.ts',
    sourcePath: join(ENTERPRISE_SRC, 'lib/utils.ts'),
    migratedPath: join(SRC, 'lib/utils.ts'),
  },
].map((m) => (JUSTIFICATIONS[m.label] ? { ...m, justification: JUSTIFICATIONS[m.label] } : m));

const CSS_MAPPING = {
  label: 'design-shell.css',
  sourcePath: join(ENTERPRISE_SRC, 'styles/design-shell.css'),
  migratedPath: join(PACKAGE_ROOT, 'design-shell.css'),
};

/**
 * Removes every `import ...` and `export ... from '...'` statement (single-
 * or multi-line) from already-Prettier-formatted code. Safe because Prettier
 * (semi: true) always terminates a statement with a line ending in `;`, so
 * the state machine just consumes lines until it sees that terminator.
 */
function stripModuleSpecifierStatements(code: string): string {
  const lines = code.split('\n');
  const out: string[] = [];
  let i = 0;
  const startsStatement = /^\s*(import\b|export\s*(\*|\{))/;
  const terminates = /from\s+['"][^'"]*['"];?\s*$/;
  while (i < lines.length) {
    const line = lines[i] ?? '';
    if (startsStatement.test(line)) {
      let j = i;
      while (j < lines.length && !terminates.test(lines[j] ?? '')) j++;
      out.push('/* module-specifier statement removed */');
      i = j + 1;
      continue;
    }
    out.push(line);
    i += 1;
  }
  return out.join('\n').trim();
}

async function formatted(code: string, filepath: string): Promise<string> {
  return prettier.format(code, { ...PRETTIER_OPTIONS, filepath });
}

type Status = 'identical' | 'justified-deviation' | 'UNJUSTIFIED DEVIATION';

interface Result {
  readonly label: string;
  readonly status: Status;
  readonly justification?: string;
}

async function checkMapping(mapping: Mapping): Promise<Result> {
  const rawSource = readFileSync(mapping.sourcePath, 'utf8');
  const rawMigrated = readFileSync(mapping.migratedPath, 'utf8');
  const sourceFormatted = await formatted(rawSource, mapping.sourcePath);
  const migratedFormatted = await formatted(rawMigrated, mapping.migratedPath);
  const sourceStripped = stripModuleSpecifierStatements(sourceFormatted);
  const migratedStripped = stripModuleSpecifierStatements(migratedFormatted);

  if (sourceStripped === migratedStripped) return { label: mapping.label, status: 'identical' };
  if (mapping.justification) {
    return {
      label: mapping.label,
      status: 'justified-deviation',
      justification: mapping.justification,
    };
  }
  return { label: mapping.label, status: 'UNJUSTIFIED DEVIATION' };
}

async function main() {
  const results: Result[] = [];
  for (const mapping of MAPPINGS) {
    results.push(await checkMapping(mapping));
  }

  const cssIdentical =
    readFileSync(CSS_MAPPING.sourcePath, 'utf8') === readFileSync(CSS_MAPPING.migratedPath, 'utf8');
  results.push({
    label: CSS_MAPPING.label,
    status: cssIdentical ? 'identical' : 'UNJUSTIFIED DEVIATION',
  });

  const identical = results.filter((r) => r.status === 'identical');
  const justified = results.filter((r) => r.status === 'justified-deviation');
  const unjustified = results.filter((r) => r.status === 'UNJUSTIFIED DEVIATION');

  console.log(`Migration fidelity — ${results.length} boundary files checked\n`);
  for (const r of results) {
    const mark = r.status === 'identical' ? 'IDENTICAL' : r.status;
    console.log(`${mark.padEnd(22)} ${r.label}`);
  }

  console.log(
    `\n${identical.length} identical, ${justified.length} justified deviation(s), ` +
      `${unjustified.length} unjustified deviation(s).`,
  );

  if (justified.length > 0) {
    console.log('\nJustified deviations:');
    for (const r of justified) {
      console.log(`- ${r.label}: ${r.justification}`);
    }
  }

  if (unjustified.length > 0) {
    console.log('\nUNJUSTIFIED DEVIATIONS (extraction discipline violated):');
    for (const r of unjustified) {
      console.log(`- ${r.label}`);
    }
    process.exitCode = 1;
  }
}

main();
