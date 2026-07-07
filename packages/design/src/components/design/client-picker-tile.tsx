/**
 * ClientPickerTile — the 4-col tile picker used in workspace-create
 * step 4 ("connect first client") and the connections page.
 *
 * Layout:
 *   ┌────────────────┐
 *   │ ●●  ✓          │   ← avatar (top-left), check badge (top-right)
 *   │                │
 *   │  Claude Code   │   ← label
 *   │  RECOMMENDED   │   ← optional mono-caps tag
 *   └────────────────┘
 *
 * Active state matches the design: --accent border + --accent-soft 5%
 * wash, with the corner check badge filling in.
 */
import { Check } from 'lucide-react';
import { TwoLetterAvatar } from './avatar-2';
import { cn } from '../../lib/utils';

export interface ClientTile {
  id: string;
  label: string;
  /** Mono-caps tag rendered under the label ("recommended" / "any MCP"). */
  tag?: string;
  /** Avatar palette key. Defaults to `id`. */
  av?: string;
}

export function ClientPickerTile({
  client,
  active,
  onClick,
  className,
}: {
  client: ClientTile;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        // 1.5px border matches Card / Input / SegChoice.
        'relative text-left rounded-md border-[1.5px] bg-muted/30 hover:bg-muted/50 transition-colors px-3 py-3.5',
        active && 'border-primary bg-primary/5',
        className,
      )}
    >
      <TwoLetterAvatar id={client.av ?? client.id} />
      <div className="text-xs font-semibold mt-2">{client.label}</div>
      {client.tag && (
        <div
          className={cn(
            'text-[9px] font-mono uppercase tracking-wider mt-0.5',
            active ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {client.tag}
        </div>
      )}
      {active && (
        <div className="absolute top-2 right-2 size-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <Check className="size-2.5" />
        </div>
      )}
    </button>
  );
}
