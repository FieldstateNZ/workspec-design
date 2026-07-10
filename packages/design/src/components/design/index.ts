/**
 * Design system primitives — the WorkSpec design layer that sits on
 * top of shadcn/ui. Pages should import from here for any of the
 * recurring patterns the handoff frames use:
 *
 *   - <DesignFrame>          page hero shell with mono-caps header strip
 *   - <CardHeaderStrip>      same strip standalone (settings sub-cards)
 *   - <Lbl>                  10px mono-caps section label
 *   - <DisplayTitle>         32-36px page hero title
 *   - <Lead>                 14px ink-soft lead paragraph
 *   - <Kicker>               alias of <Lbl> for context lines
 *   - <StepsBar>             numbered pip row for multi-step flows
 *   - <SegChoice>            two-up segmented choice card
 *   - <ClientPickerTile>     4-col tile with avatar + check badge
 *   - <TwoLetterAvatar>      22px round mono-caps initials avatar
 *   - <Chip>                 mono-caps pill (outline / active / agent / ghost)
 *   - <Status>               dot + label lifecycle pill (accent / warn / muted)
 *   - <Surf>                 generic muted bordered panel
 *   - <InfoBar>              bottom-of-step explanatory bar (1 or 2 col)
 *   - <CodeBlock>            syntax-highlighted JSON/config snippet
 *   - mcpConfigTokens()      helper for MCP config token arrays
 *
 * The primitives are unstyled by the page — pages compose them with
 * Tailwind utilities and shadcn primitives (Button, Dialog, Card, etc.)
 * for layout. The design layer enforces the typography/colour idiom.
 */
export { Lbl, DisplayTitle, Lead, Kicker } from './typography';
export { Chip } from './chip';
export { Status, type StatusTone } from './status';
export { Surf, InfoBar } from './surf';
export { DesignFrame, CardHeaderStrip } from './frame';
export { StepsBar } from './steps-bar';
export { SegChoice } from './seg-choice';
export { TwoLetterAvatar } from './avatar-2';
export { ClientPickerTile, type ClientTile } from './client-picker-tile';
export { CodeBlock, mcpConfigTokens } from './code-block';
export { PageShell, PageHeader } from './page-shell';
export {
  ArtifactCard,
  ArtifactCardHeader,
  ArtifactCardBody,
  ArtifactCardFooter,
  SimpleArtifactCard,
  type ArtifactType,
} from './artifact-card';
export { LensToggle, type LensOption } from './lens-toggle';
export { DetailPanel, DetailPanelCloseButton } from './detail-panel';
