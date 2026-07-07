import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Component smoke-render suite needs jsdom + the React plugin's JSX
// transform; the rest of this package's tests (tokens/generator/contrast,
// vitest.config.ts) are plain node-environment string/data tests and stay
// separate so that suite doesn't pay jsdom's startup cost. Registered
// directly in the root vitest.config.ts `projects` array alongside
// vitest.config.ts (Vitest's directory-glob project discovery only picks up
// one config per package, so this needs an explicit path entry there).
export default defineConfig({
  plugins: [react()],
  test: {
    name: 'design-components',
    environment: 'jsdom',
    setupFiles: ['./vitest.components.setup.ts'],
    include: ['src/components/**/*.test.tsx'],
  },
});
