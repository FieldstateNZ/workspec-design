# Handoff: WorkSpec v4 — Interaction Modes

## Overview

WorkSpec is a collaborative product-spec canvas. Until v4, it assumed **one interaction model**: type into the in-product chat, hosted "Atlas" agent drives the canvas. Dogfooding via Claude Code surfaced a second pattern: the user's own AI client (Claude Code, ChatGPT, Cursor) drives WorkSpec through MCP. These aren't competing models — they're two cells of a 2×2:

|              | **MCP-only**                     | **Hosted (with chat)**             |
|--------------|----------------------------------|------------------------------------|
| **Single user** | Solo dev with their AI client    | Solo user using in-product Atlas   |
| **Multi user**  | Team where everyone uses MCP     | Team with shared Atlas + own clients |

This handoff package contains the design exploration of how WorkSpec needs to change to **support all four cells**: workspace creation flow, chat-panel reframe (different idiom per cell), connections settings, multi-agent presence on canvas, mode-switching, and a paper aesthetic alongside the existing terminal aesthetic.

The "interesting cell" — the one to push hardest on — is **Multi user × Hosted**: shared Atlas + multiple human members + each with their own MCP clients all on the same canvas.

---

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, **not production code to copy directly**. The task is to recreate these designs in WorkSpec's existing app environment (e.g. React, Vue, native — whichever framework the production app uses) using its established patterns and component library.

If WorkSpec doesn't yet have a frontend codebase, choose React + TypeScript with CSS modules or Tailwind for production. The token files in this bundle (`tokens.css`, `paper.css`, etc.) translate cleanly to either approach.

The HTML/JSX in this bundle uses:
- React 18 + Babel standalone (in-browser transpile — production app should use a real bundler)
- Inline CSS variables driven by token files
- A `<DesignCanvas>` wrapper component (this is presentation-only — **do not ship it**; it's how options were laid out side-by-side for review)

---

## Fidelity

**High-fidelity.** Final colors, typography, spacing, and interaction patterns are intentional. Components are sized and laid out as they should appear in production. Hover/active states are partially specified in CSS — extend them following the same idiom (subtle border-color shift, small elevation change, no glow in paper / soft glow in terminal).

The icons used in mocks are minimal SVG placeholders (`frames/icons.jsx`). **Replace with WorkSpec's icon system in production.**

---

## How to navigate the design

Open `Interaction Modes.html` in a browser. The page is a pannable/zoomable design canvas with **8 sections**, each holding several artboards:

| § | Section | Artboards | Purpose |
|---|---------|-----------|---------|
| Brief | Intro | 2 | Read-me + the 2×2 matrix overview |
| 01 | The matrix | (within Brief) | Visualizes the four cells, identifies the "interesting" one |
| 02 | Workspace creation flow | 4 | New 4-step flow: name → seat mode → interaction mode → connect (if MCP-only) |
| 03 | Chat panel reframe | 4 | Same panel, four configurations — input affordance shifts per cell |
| 04 | Connections settings | 2 | Token list + connect-new-client wizard |
| 05 | Multi-agent presence | 3 | Three loudness variants: Minimal / Medium / Loud (recommend Medium) |
| 06 | Mode switch + open Qs | 2 | MCP→Hosted upgrade flow + recommendations table for 8 open questions |
| 07 | Theme switcher | 2 | Two-axis aesthetic × theme controls (settings page + compact top-bar) |
| 08 | Paper aesthetic | 9 | The three highest-leverage frames re-skinned in editorial idiom |

Click any artboard label to open it fullscreen in a focus overlay (←/→/Esc to navigate).

---

## The two aesthetics

WorkSpec ships **two aesthetics**, each with a light + dark theme, giving four total token files:

| File | Aesthetic | Theme | When to use |
|------|-----------|-------|-------------|
| `tokens.css` | Console (terminal) | Dark | Default — technical, mono-heavy, dense |
| `tokens/console-light.css` | Console | Light | Console fans who want light surfaces |
| `paper.css` (with `tokens/paper-light.css` data) | Paper (editorial) | Light | Warm, crafted, serif-display |
| `tokens/paper-dark.css` | Paper | Dark | "Midnight paper" — warm dark variant |

**Component CSS doesn't branch.** All four files expose the same variable names (`--bg`, `--ink`, `--accent`, `--canvas-from`, `--type-persona`, etc.). The aesthetic switch is one CSS file swap + one attribute change:

```html
<html data-aesthetic="console" data-theme="dark">
  <link rel="stylesheet" href="tokens.css"/>     <!-- or paper-dark, console-light, etc. -->
  <link rel="stylesheet" href="shell.css"/>      <!-- shared component CSS -->
  <link rel="stylesheet" href="paper.css"/>      <!-- adds .paper{} scope overrides for editorial -->
</html>
```

The paper aesthetic additionally **wraps content in a `.paper` ancestor** — this re-binds tokens AND adds serif headings, ink rules, marginalia notes, and other editorial-specific treatments that are too idiom-shifting to express as token swaps alone. See `paper.css` for the full override list.

---

## Design tokens

### Colors — Console Dark (`tokens.css`, the default)

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#0a0a0c` | Page background |
| `--bg-soft` | `#16161a` | Card surface |
| `--bg-elevated` | `#1c1c22` | Elevated surface (dialogs, menus) |
| `--line` | `#26262c` | Soft 1px borders |
| `--line-2` | `#34343d` | Stronger 1px borders |
| `--ink` | `#e8e8ea` | Primary text |
| `--ink-soft` | `#a4a4ac` | Secondary text |
| `--ink-fade` | `#62626a` | Tertiary / metadata |
| `--ink-ghost` | `#3a3a42` | Disabled / placeholder |
| `--accent` | `#ff5a36` | Identity coral, CTAs, selection |
| `--accent-soft` | `rgba(255,90,54,0.12)` | Accent wash |
| `--agent` | `#5cf2c0` | Hosted agent (Atlas) green |
| `--on-accent` | `#0a0a0c` | Text on accent fills |
| `--canvas-from / --canvas-to` | `#16161a → #0a0a0c` | Workspace canvas radial bg |
| `--type-persona / --type-feature / --type-scenario / --type-userreq` | `#9ec6ff / #5cf2c0 / #f2c94c / #ff8e8e` | Artifact type labels |

### Colors — Paper Light (`paper.css` & `tokens/paper-light.css`)

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#f3ecd8` | Warm cream surface |
| `--bg-soft` | `#ede4cc` | Recessed cream |
| `--bg-elevated` | `#fbf6e8` | Card stock |
| `--ink` | `#1c1814` | Deep ink (text + borders) |
| `--ink-soft` | `#5a4f3f` | Secondary |
| `--ink-fade` | `#8a7d68` | Tertiary |
| `--accent` | `#c96442` | Coral, ink-stamped (no glow) |
| `--agent` | `#3f7a5c` | Sage green |
| `--on-accent` | `#fbf6e8` | Cream-on-coral |
| `--type-persona / --type-feature / --type-scenario / --type-userreq` | `#3a5a8a / #3f7a5c / #a87718 / #a83a2a` | Deepened for legibility on cream |

The other two themes (`console-light`, `paper-dark`) are mirror inversions following the same variable names — see those files for exact values.

### Typography

**Console aesthetic:**
- Sans: `'Inter Tight', system-ui, sans-serif` — UI text, body
- Mono: `'JetBrains Mono', ui-monospace, monospace` — labels, kicker text, tool calls, code, metadata, kbd hints

Mono is used liberally in console — it carries the "this is a technical environment" feeling.

**Paper aesthetic:**
- Serif (display): `'Source Serif 4', Georgia, serif` — section titles, panel titles, artifact names, member names
- Sans (body): `'Source Sans 3', 'Inter Tight', sans-serif` — chat messages, descriptions
- Mono (labels only): `'JetBrains Mono', monospace` — kicker labels, tool calls, IDs, timestamps

Mono is **demoted** in paper — used only for labels and technical content, never for body text.

> **Production font note:** `Source Serif 4` and `Source Sans 3` are open-source substitutes for `Tiempos` and `Söhne`. If WorkSpec licenses Tiempos/Söhne, swap the stacks throughout `paper.css` and the `*-paper.jsx` files.

### Spacing scale (4px base)

`--s-1: 4px`, `--s-2: 8px`, `--s-3: 12px`, `--s-4: 16px`, `--s-5: 20px`, `--s-6: 24px`, `--s-8: 32px`, `--s-10: 40px`, `--s-12: 48px`, `--s-16: 64px`, `--s-20: 80px`

### Radius

Console: `--r-1: 3px`, `--r-2: 4px`, `--r-3: 6px`, `--r-4: 8px`, `--r-5: 12px`, `--r-pill: 99px`

Paper is **slightly tighter** to feel more print-like: `--r-1: 2px`, `--r-2: 3px`, `--r-3: 4px`, `--r-4: 6px`, `--r-5: 8px`.

### Shadow

Console uses subtle drop shadows + a `--sh-glow` token (`0 0 0 1px var(--accent), 0 0 24px rgba(255,90,54,0.2)`) used for selected artifacts.

Paper does not glow. `--sh-glow` in paper is overridden to a flat `0 0 0 1px var(--accent)` — selection becomes an ink stamp, not a halo.

### Motion

`--d-fast: 120ms`, `--d-base: 180ms`, `--d-slow: 280ms` with `--ease-out: cubic-bezier(0.2, 0.7, 0.3, 1)` and `--ease-in-out: cubic-bezier(0.5, 0, 0.5, 1)`. Standard.

---

## Screens / views

### § Brief — The 2×2 matrix

Sets up the problem space. The matrix shows that **identity is layered, not picked**: a workspace in Hosted mode automatically also accepts MCP connections (Hosted = Hosted + MCP). MCP-only is purely additive of clients. The core question the rest of the design answers: how does the chat panel, presence, and creation flow change per cell?

### § 02 — Workspace creation flow (4 steps)

A **new** flow. Today's WorkSpec has a single creation step. v4 adds two new questions:

**Step 1 · Name** — unchanged from today.

**Step 2 · Seat mode** — Single-user vs Multi-user. Drives whether the workspace is a private notebook or a team canvas. Affects pricing tier (multi-user only available on team plans).

**Step 3 · Interaction mode** — MCP-only vs Hosted. The pivotal new question:
- **MCP-only** = no in-product chat, no Atlas. Drive entirely through your own client. Cheaper, more technical.
- **Hosted** = in-product chat with Atlas (the WorkSpec-hosted agent). Atlas is opinionated and concierge-y. Always *also* accepts MCP clients.

**Step 4 · Connect** — only shown for MCP-only mode. A walk-through of pasting the MCP config block into Claude Code / ChatGPT / Cursor / custom. For Hosted-mode workspaces, this step is skipped — the user lands directly in the canvas with Atlas already greeting them.

**Layout per step:**
- Centered modal-style card, max-width ~620px
- Step indicator at top: `1 → 2 → 3 → 4` with active dot + line connectors (mono caps)
- Title: 24px serif (paper) or sans-bold (console), letter-spacing -0.02em
- Two large radio-card options side-by-side
- Footer with `Back` / `Continue` buttons

See `frames/creation.jsx` for the four step components.

### § 03 — Chat panel reframe (4 cells)

The chat panel is the same component across all four cells **structurally**, but the input affordance and content semantics shift:

| Cell | Title | Input | Stream content |
|------|-------|-------|----------------|
| Single · MCP-only | "Inbox" | **Locked** — diagonal-stripe pattern, "drive from your client" | Read-only log of tool calls coming in via MCP |
| Single · Hosted | "Atlas" | Chat input with `⏎` send | User messages + Atlas responses + tool calls |
| Multi · MCP-only | "Notes & activity" | **Note vs Turn toggle** — N for note (default), T for "dispatch as pending turn" | Notes from human members + tool calls from members' clients + system events |
| Multi · Hosted (the interesting cell) | "Atlas + activity" | Chat input that routes by `@mention`: `@atlas` → hosted, `@brett/cc` → that client, plain → note | Everything: Atlas, member messages, member-client tool calls, notes, system events |

**Key UI primitives** (defined in `Interaction Modes.html` `<style>` block under `.cp …`):
- `.turn` — base chat row, `24px 1fr` grid (avatar + content)
- `.turn .meta` — mono caps timestamp + author label, with `.meta b` switching to sans for the bold author name
- `.turn.system .body` — italic/muted, no avatar
- `.turn.action .body` — mono in a bordered card (tool calls)
- `.turn.note .body` — accent left-border + cream wash; in paper this becomes italic-serif marginalia
- `.input.locked` — disabled state with stripe pattern + lock icon

**Avatars** (`.av`) are 22px circles with initials; per-author colors are tokens (`.av.brett` = accent, `.av.atlas` = ringed sage, `.av.cc` = inverted ink, etc.). See the `.av.*` rules in `Interaction Modes.html` and the paper overrides in `paper.css`.

The **Multi · Hosted** cell is the most demanding to build — it needs to handle multi-author message routing, mention parsing, and three classes of content (chat / notes / tool calls) interleaving correctly. Build this one first; the others are simplifications.

See `frames/chat-panel.jsx` (Console) and `frames/chat-panel-paper.jsx` (Paper).

### § 04 — Connections settings

**Connections list** (`ConnectionsSettings`):
- Heading + paragraph + "Connect new client" CTA
- Table-like list of token rows. Each row: client icon, name + ID, scope label, last-active timestamp, action `⋯` menu
- Two side-by-side cards below: workspace endpoint URL, default-scope-for-new-clients toggle (Concierge / Advisor / Ask each time)

Row state: `live` (recently active — accent color on scope), default, revoked (50% opacity, strikethrough name, `restore` button).

**Connect-new-client wizard** (`ConnectWizard`):
- Two-column layout. Left: client picker (Claude Code / ChatGPT / Cursor / Custom). Right: label input + scope toggle, then a syntax-highlighted MCP config codeblock, then `Copy / Reveal token / Download mcp.json` actions, then a pulsing "listening for first call" status row.

The codeblock is the highest-leverage piece — make sure JSON keys highlight in `--accent` and string values in `--agent`. See `paper.css` for how this codeblock should render in the paper aesthetic (cream stock, deep ink, thick left rule).

See `frames/connections.jsx` and `frames/connections-paper.jsx`.

### § 05 — Multi-agent presence (3 loudness variants)

How to render multiple agents working on the canvas simultaneously. Three options:

1. **Minimal** — cursors only. Hover any artifact for attribution. Lowest visual noise.
2. **Medium** *(recommended default)* — cursors + small author dots on artifacts that an agent recently created/edited. Click a dot to filter the canvas by that agent.
3. **Loud** — cursors + author dots + author chip below each artifact + persistent activity stream pinned to top-right of canvas.

Recommendation: **Medium** as default, **Loud** offered as a per-user toggle for facilitators / debugging sessions.

The presence canvas needs:
- A panable/zoomable workspace
- Live cursors per connected agent (smooth interpolation between server updates — 60fps, not raw position events)
- Per-agent color (Atlas = sage, brett/cc = ink/blue, brett/gpt = teal, brett = accent)
- Author dots: small badge in top-right of artifact, with letter mark in paper / colored dot in console
- Activity stream (Loud variant only): scrolling ledger of recent edits, ~6 visible at a time, paper version reads like a printed register

See `frames/presence.jsx` and `frames/presence-paper.jsx`.

### § 06 — Mode switch + recommendations

**Mode-switch flow** — what happens when an MCP-only workspace upgrades to Hosted (or vice versa). Important behaviors:
- MCP → Hosted: enables Atlas. Existing artifacts preserved. New chat panel unlocked. Existing client tokens **continue working** (Hosted = Hosted + MCP, additive).
- Hosted → MCP-only: disables Atlas. Chat history archived (read-only). All existing client tokens preserved. Confirms with destructive-style modal.

See `frames/mode-switch.jsx`.

**Recommendations table** — a working-document with the team's open questions and our recommended answers. **Read this before implementing** — it includes calls on:
- Billing model (Hosted = recurring, MCP = pay-per-token)
- Default scope for new clients (Advisor for IDE clients, Concierge for web ChatGPT)
- Whether Atlas can author tool calls in MCP-only workspaces (no — out of scope for v4)
- Multi-user invite flow (deferred, Q3)
- Token rotation cadence (manual now, automated rotation in v4.1)
- Plus 3 more — see the artboard

See `frames/recs.jsx`.

### § 07 — Theme switcher

Two independent toggles:
- **Aesthetic**: Console / Paper
- **Theme**: Light / Dark / Auto (system)

Two presentations:
1. **Settings · Appearance page** — full treatment with 2×2 preview matrix showing all four combinations
2. **Compact · top-bar control** — two segmented chips side-by-side, sits in workspace top bar, `⌘⇧L` cycles

Recommendation: ship the compact control as the everyday surface; the settings page is for first-time discovery.

The implementation is two HTML attributes (`data-aesthetic`, `data-theme`) + the corresponding token CSS file. Components don't branch.

See `frames/theme-switcher.jsx`.

### § 08 — Paper aesthetic variants

The three highest-leverage frames reskinned in paper:
1. Chat panel (all 4 cells) — `frames/chat-panel-paper.jsx`
2. Connections list + connect wizard — `frames/connections-paper.jsx`
3. Multi-agent presence (all 3 variants) — `frames/presence-paper.jsx`

The other v4 frames (creation flow, mode switch, recommendations table) translate cleanly with **just token swaps** — no paper-specific overrides needed. Validate this assumption with a quick implementation pass before committing to it.

---

## Interactions & behavior

### Chat panel
- **Send (⏎)** — sends message; in Multi-Hosted, routes by mention: `@atlas` to hosted agent, `@brett/cc` as targeted dispatch, plain text as note
- **Note vs Turn (Multi-MCP)** — keyboard `N` (default) leaves a passive note; `T` dispatches as pending turn that any advisor-scoped client can claim. This is the core multi-MCP coordination primitive.
- **Tool call rendering** — actions render in a mono card after the agent's text response, never inline
- **System events** — italic muted; not in a card; no avatar gutter

### Workspace creation
- Steps animate left-to-right with `transform: translateX` + opacity over `--d-base`
- "Continue" disabled until current step has a valid selection
- Step 4 (connect) on MCP-only path can be skipped with "I'll do this later" — workspace is created but presence canvas shows an empty state until first MCP call lands

### Presence
- Cursor positions: smooth-interpolated between server updates at 60fps
- Author dots: appear when an artifact is created or edited, fade after 30s, on hover return + show full author label
- Activity stream (Loud): newest at top, animates in, max 6 visible

### Theme switching
- Aesthetic + theme persist per-user per-device in localStorage
- `⌘⇧L` cycles aesthetic; `⌘⇧D` cycles theme
- No flash on first paint — apply attributes from localStorage in a blocking inline script before stylesheet loads

### Connect wizard
- "Listening for first call" status polls the workspace endpoint every 2s; auto-advances to "connected" when the first MCP call lands
- Token revealed only once on creation; copy-button shows confirmation toast

---

## State management

The product needs (at minimum):

- **Workspace**: `id`, `name`, `seatMode (single|multi)`, `interactionMode (mcp|hosted)`, `members[]`, `clientTokens[]`, `aesthetic`, `theme`
- **ClientToken**: `id`, `userId`, `clientType (cc|gpt|cursor|custom)`, `label`, `scope (concierge|advisor|ask)`, `lastActiveAt`, `revoked`
- **ChatTurn**: `id`, `kind (message|action|note|system)`, `authorId`, `authorClientId?`, `body`, `toolCalls[]`, `mentions[]`, `createdAt`
- **PendingTurn** (multi-MCP): `id`, `noteId`, `dispatchedBy`, `claimedBy?`, `claimedAt?`, `status`
- **Cursor**: `clientId`, `x`, `y`, `viewportZoom`, `lastSeenAt` (ephemeral, in-memory)
- **AuthorDot**: `artifactId`, `clientId`, `editedAt` (decay after 30s)

Real-time channels needed:
- Cursor positions (high-frequency, ephemeral)
- Artifact CRUD events (canonical, persisted)
- Chat stream (canonical, persisted)
- Pending turn queue (canonical, persisted)

---

## Files in this bundle

| File | What it contains |
|------|------------------|
| `Interaction Modes.html` | Entry point. Loads tokens, fonts, all JSX frames. Contains inline `<style>` for canvas-specific helpers (`.frame`, `.cp`, `.av`, `.surf`, `.conn`, `.codeblk`, etc.) — these belong in your component CSS. |
| `app.jsx` | Top-level layout: `<DesignCanvas>` with 8 sections of artboards. The canvas wrapper is presentation-only. |
| `design-canvas.jsx` | Pan/zoom canvas component (presentation-only, do not ship). |
| `tokens.css` | Console-Dark tokens (default). |
| `tokens/console-light.css` | Console-Light tokens. |
| `tokens/paper-light.css` | Paper-Light tokens. |
| `tokens/paper-dark.css` | Paper-Dark tokens. |
| `shell.css` | Shared component CSS. **Token-driven** — zero hex codes; everything reads from `var(--*)`. This is the file to port to your real component library first. |
| `paper.css` | Paper aesthetic overrides. Scoped under `.paper` ancestor. Adds serif headings, ink rules, marginalia note styles, ledger activity stream. |
| `frames/icons.jsx` | Minimal SVG icon set used by mocks. **Replace with WorkSpec's icon system in production.** |
| `frames/brief.jsx` | The read-me brief on the canvas. |
| `frames/matrix.jsx` | The 2×2 visual. |
| `frames/creation.jsx` | Workspace creation flow steps 1–4. |
| `frames/chat-panel.jsx` | Console chat panel — 4 cells. |
| `frames/chat-panel-paper.jsx` | Paper chat panel — 4 cells. |
| `frames/connections.jsx` | Console connections list + wizard. |
| `frames/connections-paper.jsx` | Paper connections list + wizard. |
| `frames/presence.jsx` | Console multi-agent presence — 3 variants. |
| `frames/presence-paper.jsx` | Paper multi-agent presence — 3 variants. |
| `frames/mode-switch.jsx` | MCP ↔ Hosted upgrade/downgrade flow. |
| `frames/recs.jsx` | Recommendations table for 8 open questions. **Read this before implementing.** |
| `frames/theme-switcher.jsx` | Settings page + compact top-bar variants. |

---

## Suggested implementation order

1. **Port `shell.css` + `tokens.css`** to your component library. Verify a token file swap produces the expected light/paper variants without component changes.
2. **Build the chat panel** as a single `<ChatPanel>` component with a `mode` prop driving the four configurations. Multi · Hosted is the most demanding — start there; the others are simplifications.
3. **Workspace creation flow** — straightforward. Wire to your existing onboarding routing.
4. **Connections settings + wizard** — needs MCP backend (token issuance, scope persistence, listening endpoint).
5. **Multi-agent presence** — start with Medium variant only. Cursors + author dots. Defer Loud (activity stream) to v4.1 if budget tight.
6. **Theme switcher** — one component, two attributes, four token files. Half-day job once the token system is in place.
7. **Paper aesthetic** — port `paper.css` last. Validate that creation/mode-switch/recs work without paper-specific overrides.

---

## Questions for the design team

- Atlas's exact concierge → advisor handoff behavior in Hosted mode (when does it auto-promote scope?)
- Does pending-turn dispatch show up in non-MCP-only Hosted workspaces too, or only Multi-MCP?
- Token rotation cadence (recs say "manual now"; confirm shipping config)
- The "loud" presence variant's activity stream — is this every event, or filtered to creates/deletes? (Mocks show creates only.)
