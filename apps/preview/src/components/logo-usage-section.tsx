import { WorkspecMarkIcon } from './workspec-mark-icon';

/**
 * The mark, a minimum clear-space note, and the trademark line — the mark
 * itself matches `/assets/brand/workspec-mark.svg` and its portable copy at
 * `public/workspec-mark.svg` (see that file's header comment for provenance).
 */
export function LogoUsageSection() {
  return (
    <section className="rounded-lg border border-border bg-card p-4" data-testid="logo-usage">
      <h2 className="mb-3 text-sm font-semibold">Logo usage</h2>
      <div className="flex flex-wrap items-center gap-6">
        <div className="rounded-md border border-dashed border-border p-6">
          <WorkspecMarkIcon size={48} className="text-accent" />
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          Keep clear space around the mark of at least the height of its terminal circle (the small
          ring at the line's left end) on every side. Do not recolor the accent dot, stretch the
          mark, or place it on a background it can't contrast against.{' '}
          <a
            href={`${import.meta.env.BASE_URL}workspec-mark.svg`}
            className="text-primary underline underline-offset-2"
            download
          >
            Download the SVG
          </a>
          .
        </p>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        The WorkSpec name, logo, and wordmark are trademarks of Fieldstate/Ingenious and are not
        licensed under Apache-2.0 for reuse — see <code className="font-mono">NOTICE</code>.
      </p>
    </section>
  );
}
