import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// This config does not set `test.globals: true` (matching the rest of the
// workspace's explicit-import style), so React Testing Library's built-in
// auto-cleanup — which relies on a *global* `afterEach` — never registers.
// Without this, DOM trees from earlier tests in the same file stay mounted
// and multi-render queries (e.g. `getByTestId` in App.test.tsx) find
// duplicates across tests.
afterEach(() => {
  cleanup();
});
