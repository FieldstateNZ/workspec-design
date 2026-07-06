import { defineConfig } from 'vitest/config';

// Workspace-root Vitest config. `packages/*` and `apps/*` don't exist yet
// (they land in S1+) — this runs the root-level repo-integrity suite. Once
// those directories exist, each contributes its own vitest.config.ts and this
// gains a `projects: ['packages/*', 'apps/*']` array, mirroring
// workspec-decision-studio.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
  },
});
