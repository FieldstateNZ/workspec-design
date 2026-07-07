interface WorkspecMarkIconProps {
  readonly className?: string;
  readonly size?: number;
}

/**
 * Inline rendering of `public/workspec-mark.svg` (same geometry, kept in
 * sync by hand — see that file's provenance comment for the source of
 * record). Inlined rather than referenced via `<img src>` because an
 * `<img>`-loaded SVG renders in an isolated document context where
 * `currentColor` can't see this page's `color`/Tailwind text-color classes —
 * inlining is what lets the mark recolor with the surrounding chrome theme.
 */
export function WorkspecMarkIcon({ className, size = 40 }: WorkspecMarkIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="WorkSpec"
      className={className}
    >
      <path d="M 10 32 L 54 32" stroke="currentColor" strokeWidth={2.6} strokeLinecap="square" />
      <circle cx={10} cy={32} r={4.5} stroke="currentColor" strokeWidth={2.6} fill="none" />
      <rect
        x={25.5}
        y={25.5}
        width={13}
        height={13}
        stroke="currentColor"
        strokeWidth={2.6}
        fill="none"
      />
      <circle cx={54} cy={32} r={4.5} fill="#1b8a55" />
    </svg>
  );
}
