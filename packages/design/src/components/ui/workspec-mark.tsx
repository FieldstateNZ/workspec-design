interface WorkspecMarkProps {
  size?: number;
  surface?: string;
  className?: string;
}

export function WorkspecMark({
  size = 24,
  surface = 'var(--bg-elevated)',
  className,
}: WorkspecMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M 10 32 L 54 32" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="square" />
      <circle
        cx="10"
        cy="32"
        r="4.5"
        stroke="var(--ink)"
        strokeWidth="2.6"
        style={{ fill: surface }}
      />
      <rect
        x="25.5"
        y="25.5"
        width="13"
        height="13"
        stroke="var(--ink)"
        strokeWidth="2.6"
        style={{ fill: surface }}
      />
      <circle cx="54" cy="32" r="4.5" fill="var(--accent)" />
    </svg>
  );
}
