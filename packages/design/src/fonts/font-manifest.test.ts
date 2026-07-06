import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { FONT_MANIFEST } from './font-manifest.js';
import { buildFontsCss } from '../generate/build-fonts-css.js';

// src/fonts/ -> src/ -> <package root>/
const packageFile = (relativePath: string): string =>
  fileURLToPath(new URL(`../../${relativePath}`, import.meta.url));

// Matches the slug already baked into every woff2 file name (inter-tight,
// jetbrains-mono, caveat, lora) — one word-lowercased, hyphen-joined slug
// per family, used again for its OFL license file name.
const familySlug = (family: string): string => family.toLowerCase().replace(/\s+/g, '-');

describe('font manifest', () => {
  it('has 22 entries across the 4 self-hosted families (latin + latin-ext only)', () => {
    expect(FONT_MANIFEST).toHaveLength(22);
    expect(new Set(FONT_MANIFEST.map((entry) => entry.family))).toEqual(
      new Set(['Inter Tight', 'JetBrains Mono', 'Caveat', 'Lora']),
    );
  });

  it.each(FONT_MANIFEST)('$family $weight $subset: woff2 file exists under fonts/', (entry) => {
    expect(existsSync(packageFile(`fonts/${entry.file}`))).toBe(true);
  });

  it.each(FONT_MANIFEST)(
    '$family $weight $subset: fonts.css has a matching @font-face',
    (entry) => {
      const fontsCss = readFileSync(packageFile('fonts.css'), 'utf8');
      const rule = new RegExp(
        `@font-face \\{[^}]*font-family: '${entry.family}';[^}]*font-weight: ${entry.weight};[^}]*src: url\\('\\./fonts/${entry.file}'\\)`,
        's',
      );
      expect(fontsCss).toMatch(rule);
    },
  );

  it('fonts.css matches a fresh build from the manifest (run pnpm gen:tokens)', () => {
    expect(buildFontsCss(FONT_MANIFEST)).toBe(readFileSync(packageFile('fonts.css'), 'utf8'));
  });

  it.each([...new Set(FONT_MANIFEST.map((entry) => entry.family))])(
    '%s: OFL license file exists under fonts/licenses/',
    (family) => {
      expect(existsSync(packageFile(`fonts/licenses/${familySlug(family)}-OFL.txt`))).toBe(true);
    },
  );

  it.each([...new Set(FONT_MANIFEST.map((entry) => entry.family))])(
    '%s: OFL license file starts with a Copyright line',
    (family) => {
      const license = readFileSync(
        packageFile(`fonts/licenses/${familySlug(family)}-OFL.txt`),
        'utf8',
      );
      expect(license).toMatch(/^Copyright \d{4}/);
    },
  );

  it.each([...new Set(FONT_MANIFEST.map((entry) => entry.family))])(
    '%s: package NOTICE lists it under OFL-1.1',
    (family) => {
      const notice = readFileSync(packageFile('NOTICE'), 'utf8');
      const allFamilies = [...new Set(FONT_MANIFEST.map((entry) => entry.family))];
      const start = notice.indexOf(family);
      // Bound the block to just this family's section: from its own heading up
      // to whichever other family's heading comes next (or end of file), so a
      // family missing its own license line can't pass on a neighbour's.
      const nextHeadingIndex = Math.min(
        ...allFamilies
          .filter((other) => other !== family)
          .map((other) => notice.indexOf(other, start + family.length))
          .filter((index) => index !== -1),
        notice.length,
      );
      const familyBlock = notice.slice(start, nextHeadingIndex);
      expect(familyBlock).toMatch(/SIL Open Font License, Version 1\.1/);
    },
  );
});
