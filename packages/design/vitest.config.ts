import { defineConfig } from 'vitest/config';

// The token tables and generator are plain data/string transforms — no DOM
// needed. The parser and drift-gate tests read committed files from disk with
// node:fs, which the node environment supports directly.
export default defineConfig({
  test: {
    name: 'design',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
