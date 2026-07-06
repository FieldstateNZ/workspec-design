import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The S1 acceptance fixture: proves `@workspec/design`'s Tailwind preset and
// self-hosted fonts work end to end in a real Tailwind v4 build (not just
// unit-tested string output). See tests/smoke.spec.ts for what's asserted.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
