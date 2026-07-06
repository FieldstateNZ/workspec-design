import type { ThemeName, TokenGroupId } from '@workspec/design';
import { tokenKindForGroup } from '../token-kind';
import { tokensJson } from '../tokens-data';
import { TokenSwatch } from './token-swatch';

interface TokenSectionProps {
  readonly theme: ThemeName;
  readonly groupId: TokenGroupId;
}

/** One token group's swatch grid, for one theme — the tokens come from `tokens.json`'s `groups`. */
export function TokenSection({ theme, groupId }: TokenSectionProps) {
  const tokenNames = tokensJson.groups[groupId];
  const themeTokens = tokensJson.themes[theme].tokens;
  const kind = tokenKindForGroup(groupId);

  return (
    <div className="mb-6">
      <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {groupId}
      </h3>
      <div className="token-swatch-grid">
        {tokenNames.map((token) => (
          <TokenSwatch
            key={token}
            token={token}
            value={themeTokens[token as keyof typeof themeTokens]}
            kind={kind}
          />
        ))}
      </div>
    </div>
  );
}
