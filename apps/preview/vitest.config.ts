import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Registered as a project in the root vitest.config.ts (`projects: [..., 'apps/*']`),
// so `pnpm test` at the repo root runs this smoke alongside packages/design's suite.
export default defineConfig({
  plugins: [react()],
  test: {
    name: 'preview',
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
