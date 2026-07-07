/**
 * One-off codemod that copied the WorkSpec component library out of the
 * enterprise monorepo (`workspec/artifacts/workspec/src/{components,hooks,lib,styles}`)
 * into `packages/design/src` (S4, workspec-design#5, DELIVERY_PLAN.md decision 6).
 *
 * Kept as a record of exactly what the migration did — it is NOT part of the
 * regular build, test, or gen:tokens pipeline. `SOURCE_ROOT` below points at a
 * sibling checkout of the enterprise repo that only exists in the environment
 * this migration ran in; running this script again requires that checkout at
 * that path. Never wire it into package.json scripts or CI.
 *
 * Rewrite rules — mechanical import-specifier cleanup only, never a
 * behavioural change (extraction discipline, DELIVERY_PLAN.md: "this is an
 * extraction, not a creation"):
 *
 *   from ui/*.tsx:
 *     @/components/ui/X  -> ./X            (same directory)
 *     @/lib/utils         -> ../../lib/utils
 *     @/hooks/use-mobile  -> ../../hooks/use-mobile
 *     @/hooks/use-toast   -> ../../hooks/use-toast
 *
 *   from design/*.tsx:
 *     @/components/ui/X  -> ../ui/X
 *     @/lib/utils         -> ../../lib/utils
 *
 *   from hooks/use-toast.ts:
 *     @/components/ui/toast -> ../components/ui/toast
 *
 * Any `@/...` specifier still present after these rewrites is a coupling the
 * extraction boundary (docs/inventory.md) says shouldn't exist inside this
 * boundary — the script throws rather than silently shipping it. It found
 * none beyond the two documented cases handled outside this script:
 * design/page-shell.tsx's `wouter` import (inverted by hand, see
 * docs/inventory.md and the commit that touches that file) and the plain
 * `lib/utils.ts` / `hooks/use-mobile.tsx` / `design-shell.css` files, which
 * have no `@/` imports to rewrite at all.
 */
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_ROOT = '/home/user/workspec/artifacts/workspec/src';
const PACKAGE_ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(PACKAGE_ROOT, 'src');

type RewriteKind = 'ui' | 'design' | 'hook-use-toast' | 'none';

function rewriteImports(contents: string, kind: RewriteKind): string {
  let out = contents;
  if (kind === 'ui') {
    out = out.replace(/from (["'])@\/components\/ui\/([^"']+)\1/g, 'from $1./$2$1');
    out = out.replace(/from (["'])@\/lib\/utils\1/g, 'from $1../../lib/utils$1');
    out = out.replace(/from (["'])@\/hooks\/use-mobile\1/g, 'from $1../../hooks/use-mobile$1');
    out = out.replace(/from (["'])@\/hooks\/use-toast\1/g, 'from $1../../hooks/use-toast$1');
  } else if (kind === 'design') {
    out = out.replace(/from (["'])@\/components\/ui\/([^"']+)\1/g, 'from $1../ui/$2$1');
    out = out.replace(/from (["'])@\/lib\/utils\1/g, 'from $1../../lib/utils$1');
  } else if (kind === 'hook-use-toast') {
    out = out.replace(/from (["'])@\/components\/ui\/([^"']+)\1/g, 'from $1../components/ui/$2$1');
  }

  const stray = out.match(/from (["'])@\/[^"']+\1/g);
  if (stray) {
    throw new Error(`unrewritten @/ import remains: ${stray.join(', ')}`);
  }
  return out;
}

function migrateDir(sourceDir: string, destDir: string, kind: RewriteKind): string[] {
  mkdirSync(destDir, { recursive: true });
  const files = readdirSync(sourceDir).filter((name) => /\.(tsx|ts)$/.test(name));
  for (const name of files) {
    const contents = readFileSync(join(sourceDir, name), 'utf8');
    writeFileSync(join(destDir, name), rewriteImports(contents, kind), 'utf8');
  }
  return files;
}

const uiFiles = migrateDir(join(SOURCE_ROOT, 'components/ui'), join(SRC, 'components/ui'), 'ui');

const designFiles = migrateDir(
  join(SOURCE_ROOT, 'components/design'),
  join(SRC, 'components/design'),
  'design',
);

mkdirSync(join(SRC, 'hooks'), { recursive: true });
writeFileSync(
  join(SRC, 'hooks/use-mobile.tsx'),
  rewriteImports(readFileSync(join(SOURCE_ROOT, 'hooks/use-mobile.tsx'), 'utf8'), 'none'),
  'utf8',
);
writeFileSync(
  join(SRC, 'hooks/use-toast.ts'),
  rewriteImports(readFileSync(join(SOURCE_ROOT, 'hooks/use-toast.ts'), 'utf8'), 'hook-use-toast'),
  'utf8',
);

mkdirSync(join(SRC, 'lib'), { recursive: true });
writeFileSync(
  join(SRC, 'lib/utils.ts'),
  rewriteImports(readFileSync(join(SOURCE_ROOT, 'lib/utils.ts'), 'utf8'), 'none'),
  'utf8',
);

copyFileSync(join(SOURCE_ROOT, 'styles/design-shell.css'), join(PACKAGE_ROOT, 'design-shell.css'));

console.log(`migrated ${uiFiles.length} ui/ files, ${designFiles.length} design/ files`);
console.log('migrated hooks/use-mobile.tsx, hooks/use-toast.ts, lib/utils.ts, design-shell.css');
