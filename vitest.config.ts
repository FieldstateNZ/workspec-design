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
    // 'packages/*' only picks up one config file per directory (its own
    // directory-glob discovery), so packages/design's second suite (the S4
    // component smoke tests, jsdom + react plugin) needs an explicit path
    // entry alongside the directory glob that finds vitest.config.ts.
    projects: ['.', 'packages/*', 'packages/design/vitest.components.config.ts', 'apps/*'],
  },
});
