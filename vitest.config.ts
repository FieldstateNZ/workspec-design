import { defineConfig } from 'vitest/config';

// Workspace-root Vitest config. `vitest run` here executes the root
// repo-integrity suite AND every package's/app's own project (mirroring
// workspec-decision-studio); `pnpm -r test` runs each package in isolation.
// `examples/*` (the fixture app) is deliberately excluded — its Playwright
// smoke runs via `pnpm --filter fixture e2e`, not Vitest. `apps/*` (the S3
// token preview) IS included — its jsdom smoke render is Vitest, not Playwright.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    projects: ['.', 'packages/*', 'apps/*'],
  },
});
