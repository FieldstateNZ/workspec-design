import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// This is a project Pages site served at
// https://fieldstatenz.github.io/workspec-design/ — assets must resolve
// under that subpath, so `base` defaults to `/workspec-design/`. Override
// with `PREVIEW_BASE_PATH=/` (or any other prefix) for local dev/preview so
// `vite dev`/`vite preview` serve from the site root instead.
export default defineConfig({
  base: process.env.PREVIEW_BASE_PATH ?? '/workspec-design/',
  // Resolve `@workspec/design`'s "." export to its TypeScript source (the
  // `@workspec/source` condition packages/design's package.json exports map
  // defines) rather than `dist/index.js`. Without this, dev/build silently
  // depend on `packages/design/dist` already existing — bundling from source
  // instead means live tokens and no cross-package build-order dependency.
  resolve: {
    conditions: ['@workspec/source'],
  },
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
