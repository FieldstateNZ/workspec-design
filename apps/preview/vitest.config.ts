import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Registered as a project in the root vitest.config.ts (`projects: [..., 'apps/*']`),
// so `pnpm test` at the repo root runs this smoke alongside packages/design's suite.
export default defineConfig({
  // Resolve `@workspec/design`'s "." export to its TypeScript source (the
  // `@workspec/source` condition packages/design's package.json exports map
  // defines) instead of `dist/index.js` — otherwise this suite only passes
  // when `packages/design/dist` happens to already exist (e.g. built as a
  // side effect of another package's test run), not on its own merits.
  resolve: {
    conditions: ['@workspec/source'],
  },
  plugins: [react()],
  test: {
    name: 'preview',
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
