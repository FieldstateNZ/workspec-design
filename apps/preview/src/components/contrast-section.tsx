import { REPO_LINKS } from '../repo-links';

/**
 * Contrast results are owned by a parallel delivery slice (the WCAG AA gate
 * + `docs/contrast-audit.md`) and aren't in `tokens.json` in this workspace,
 * so this section links out to the audit rather than duplicating — or
 * guessing at — its PASS/FAIL matrix by hand.
 */
export function ContrastSection() {
  return (
    <section className="rounded-lg border border-border bg-card p-4" data-testid="contrast-section">
      <h2 className="mb-2 text-sm font-semibold">Contrast</h2>
      <p className="text-sm text-muted-foreground">
        Every documented role pair is checked against WCAG AA in CI. See{' '}
        <a
          href={REPO_LINKS.contrastAudit}
          className="text-primary underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          docs/contrast-audit.md
        </a>{' '}
        for the full per-pair PASS/FAIL results — not duplicated here so this page can't drift from
        the audit of record.
      </p>
    </section>
  );
}
