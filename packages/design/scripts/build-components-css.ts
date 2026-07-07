// Regenerates the committed `components.css` artifact this package ships for
// non-Tailwind consumers of the migrated `ui/` + `design/` components. Run
// after changing any migrated component's Tailwind classes:
//
//   pnpm --filter @workspec/design run build:components-css
//
// components-css-drift.test.ts recompiles the same artifact into a temp file
// and fails CI if it differs from what's committed here.
import { fileURLToPath } from 'node:url';
import { compileComponentsCss } from '../src/generate/build-components-css.js';

// scripts/ -> package root
const outputPath = fileURLToPath(new URL('../components.css', import.meta.url));

compileComponentsCss(outputPath);
console.log(`wrote components.css`);
