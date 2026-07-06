import { expect, test } from '@playwright/test';

// S1 acceptance criteria (DELIVERY_PLAN.md / workspec-design#2): the Tailwind
// preset and self-hosted fonts resolve correctly through a real Tailwind v4
// build, in both themes, with fonts actually served over the network — not
// just asserted against generated CSS strings in the package's own unit tests.

test.describe('fixture smoke — @workspec/design resolves through a real Tailwind v4 build', () => {
  test('accent resolves per-theme, bg-primary matches it, Inter Tight is served', async ({
    page,
  }) => {
    const woff2Responses: number[] = [];
    page.on('response', (response) => {
      if (response.url().endsWith('.woff2')) woff2Responses.push(response.status());
    });

    await page.goto('/');

    const rawAccent = page.getByTestId('raw-accent');
    const primarySwatch = page.getByTestId('primary-swatch');
    const toggle = page.getByTestId('theme-toggle');

    // ── dark (index.html's initial data-theme="dark" / class="dark") ────────
    await expect(rawAccent).toHaveCSS('color', 'rgb(52, 209, 127)');
    await expect(primarySwatch).toHaveCSS('background-color', 'rgb(52, 209, 127)');

    // ── toggle flips both data-theme and .dark together ──────────────────────
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    await expect(rawAccent).toHaveCSS('color', 'rgb(27, 138, 85)');
    await expect(primarySwatch).toHaveCSS('background-color', 'rgb(27, 138, 85)');

    // ── the font-sans utility (mapped from --sans) resolves to Inter Tight ──
    const bodyFontFamily = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(bodyFontFamily.replace(/"/g, '')).toMatch(/^Inter Tight/);

    // ── at least one self-hosted woff2 was actually requested and served ────
    expect(woff2Responses.length).toBeGreaterThan(0);
    expect(woff2Responses.every((status) => status === 200)).toBe(true);
  });
});
