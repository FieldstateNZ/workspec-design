import { expect, test, type Page } from '@playwright/test';

// S1 acceptance criteria (DELIVERY_PLAN.md / workspec-design#2): the Tailwind
// preset and self-hosted fonts resolve correctly through a real Tailwind v4
// build, in both themes, with fonts actually served over the network — not
// just asserted against generated CSS strings in the package's own unit tests.

/**
 * Resolves a CSS custom property (e.g. `--accent`) to its browser-computed
 * color, by setting it as a scratch element's `color` and reading that back
 * — the same resolution path a component's own `background-color: var(--x)`
 * goes through. Comparing a component's computed style against this proves
 * the token actually reached the component through the real preset +
 * `@source` pipeline, not just that the string `var(--x)` appears somewhere
 * in generated CSS (see the package's own unit tests for that lower-level
 * check; this is the S4 extraction-fidelity proxy — full pixel-diff against
 * the running Enterprise app is deferred, see this file's S4 describe block).
 */
async function resolveColorVar(page: Page, name: string): Promise<string> {
  return page.evaluate((varName) => {
    const probe = document.createElement('div');
    probe.style.color = `var(${varName})`;
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    return resolved;
  }, name);
}

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

// S4 acceptance criteria (DELIVERY_PLAN.md / workspec-design#5): the migrated
// `ui/` + `design/` component library, rendered by src/components-page.tsx,
// picks up the same preset + tokens pipeline S1 proved for raw Tailwind
// utilities above — computed-style equality against each token is the
// extraction-fidelity proxy. Full pixel-diff against the running Enterprise
// app is deferred (needs a live Enterprise instance to diff against).
test.describe('fixture smoke — S4 migrated components resolve through the same token pipeline', () => {
  test('primary Button, Card, and a design-shell element all resolve to their tokens, in both themes', async ({
    page,
  }) => {
    await page.goto('/');

    const primaryButton = page.getByTestId('btn-primary');
    const card = page.getByTestId('card');
    const shellChip = page.getByTestId('shell-chip');

    // ── dark (index.html's initial data-theme="dark" / class="dark") ────────
    await expect(primaryButton).toHaveCSS(
      'background-color',
      await resolveColorVar(page, '--accent'),
    );
    await expect(card).toHaveCSS('background-color', await resolveColorVar(page, '--bg-elevated'));
    await expect(shellChip).toHaveCSS('border-top-color', await resolveColorVar(page, '--line-2'));
    await expect(shellChip).toHaveCSS('color', await resolveColorVar(page, '--ink-soft'));

    // ── toggle flips both data-theme and .dark together (same contract) ─────
    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await expect(primaryButton).toHaveCSS(
      'background-color',
      await resolveColorVar(page, '--accent'),
    );
    await expect(card).toHaveCSS('background-color', await resolveColorVar(page, '--bg-elevated'));
    await expect(shellChip).toHaveCSS('border-top-color', await resolveColorVar(page, '--line-2'));
    await expect(shellChip).toHaveCSS('color', await resolveColorVar(page, '--ink-soft'));
  });

  test('the rest of the components page renders without throwing', async ({ page }) => {
    await page.goto('/');
    const componentsPage = page.getByTestId('components-page');
    await expect(componentsPage).toBeVisible();
    await expect(componentsPage.getByText('Secondary')).toBeVisible();
    await expect(componentsPage.getByText('Card content.')).toBeVisible();
    await expect(componentsPage.getByText('Badge')).toBeVisible();
    await expect(componentsPage.getByText('Open dialog')).toBeVisible();
    await expect(componentsPage.getByText('Chip', { exact: true })).toBeVisible();
    await expect(componentsPage.getByText('Single seat')).toBeVisible();

    await componentsPage.getByText('Open dialog').click();
    await expect(page.getByText('Dialog title')).toBeVisible();
  });
});
