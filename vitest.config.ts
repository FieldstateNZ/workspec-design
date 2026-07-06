import { defineConfig } from 'vitest/config';

// Workspace-root Vitest config. `vitest run` here executes the root
// repo-integrity suite AND every package's own project (mirroring
// workspec-decision-studio); `pnpm -r test` runs each package in isolation.
// `examples/*` (the fixture app) is deliberately excluded — its Playwright
// smoke runs via `pnpm --filter fixture e2e`, not Vitest.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    projects: ['.', 'packages/*'],
  },
});
