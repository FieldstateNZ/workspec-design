import { defineConfig } from 'tsup';

// Library build for the `.` export only — tokens.css, tailwind.css, tokens.json,
// themes/*.css, fonts.css, and fonts/* are committed files at the package root
// (see scripts/generate.ts) and ship as-is; they never pass through tsup.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
});
