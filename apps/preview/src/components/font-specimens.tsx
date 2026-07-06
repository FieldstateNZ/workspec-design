import { tokensJson } from '../tokens-data';

/**
 * Families already demoed via a typography token (`--sans` → Inter Tight,
 * `--mono` → JetBrains Mono) — excluded here so the two aren't shown twice.
 */
const TOKEN_BOUND_FAMILIES = new Set(['Inter Tight', 'JetBrains Mono']);

/**
 * The self-hosted font families that don't back a typography token (Caveat,
 * Lora) — read from `tokens.json`'s `fonts` summary, not hand-listed, so a
 * future font addition/removal shows up here automatically.
 */
export function FontSpecimens() {
  const extraFamilies = Object.keys(tokensJson.fonts).filter(
    (family) => !TOKEN_BOUND_FAMILIES.has(family),
  );

  return (
    <div className="mb-6 flex flex-col gap-2" data-testid="font-specimens">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Additional self-hosted faces
      </h3>
      <div className="token-swatch-grid">
        {extraFamilies.map((family) => (
          <div
            key={family}
            className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-3 text-xs"
          >
            <p className="truncate text-2xl" style={{ fontFamily: `'${family}'` }}>
              Ag Workspec 123
            </p>
            <span className="truncate text-foreground">{family}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
