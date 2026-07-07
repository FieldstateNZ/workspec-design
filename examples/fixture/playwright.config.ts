import { defineConfig } from '@playwright/test';

// S1 acceptance smoke: boots the BUILT app (`vite preview`, not the dev
// server) so what's asserted is what `@workspec/design/tailwind` +
// `@workspec/design/fonts.css` actually produce through a real Tailwind v4
// build. Uses the pre-installed Chromium (PLAYWRIGHT_BROWSERS_PATH points at
// it locally; CI runs `playwright install --with-deps chromium` instead).
const PORT = Number(process.env.E2E_PORT ?? 4391);

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    browserName: 'chromium',
    // Chromium refuses to run as root without this; harmless elsewhere.
    launchOptions: { args: ['--no-sandbox'] },
  },
  webServer: {
    command: `pnpm exec vite preview --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
