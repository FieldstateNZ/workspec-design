import { defineConfig } from 'tsup';

// Library build for the `.` and `./components` exports — tokens.css,
// tailwind.css, tokens.json, themes/*.css, fonts.css, fonts/*, components.css,
// and design-shell.css are committed files at the package root (see
// scripts/generate.ts and scripts/migrate-components.ts) and ship as-is; they
// never pass through tsup. Named entries (rather than an array) so the
// components barrel lands at dist/components/index.{js,d.ts}, matching the
// `./components` export map target.
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'components/index': 'src/components/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
});
