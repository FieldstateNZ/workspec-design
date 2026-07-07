/**
 * TwoLetterAvatar — the design's 22px round avatar with mono caps
 * initials. Distinct from shadcn's image-based <Avatar>: this is for
 * symbolic identifiers (client app, agent role, presence cursor)
 * where there's no profile picture.
 *
 * The palette key picks the colour scheme:
 *   cc       black foreground (Claude Code)
 *   gpt      emerald (ChatGPT)
 *   cur      blue (Cursor)
 *   custom   muted (any MCP)
 *   agent    accent (Atlas / hosted agent)
 *   user     ink-soft (human presence)
 *
 * The two letters render from the `id` prop (first two chars,
 * uppercased). Override with `letters` if the id isn't right
 * (e.g. user initials from a name).
 */
import { cn } from '../../lib/utils';

type Palette = 'cc' | 'gpt' | 'cur' | 'custom' | 'agent' | 'user';

const PALETTES: Record<Palette, string> = {
  cc: 'bg-foreground text-background',
  gpt: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  cur: 'bg-blue-400/20 text-blue-600 dark:text-blue-300',
  custom: 'bg-muted text-muted-foreground',
  agent: 'bg-primary/15 text-primary',
  user: 'bg-muted text-foreground',
};

const SIZES = {
  sm: 'size-[18px] text-[8px]',
  md: 'size-[22px] text-[9px]',
  lg: 'size-[28px] text-[10px]',
};

export function TwoLetterAvatar({
  id,
  letters,
  palette,
  size = 'md',
  className,
}: {
  id: string;
  letters?: string;
  palette?: Palette;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const p = palette ?? (PALETTES[id as Palette] ? (id as Palette) : 'custom');
  const text = (letters ?? id).toUpperCase().slice(0, 2);
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-mono font-bold',
        SIZES[size],
        PALETTES[p],
        className,
      )}
    >
      {text}
    </span>
  );
}
