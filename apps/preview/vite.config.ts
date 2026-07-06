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
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
