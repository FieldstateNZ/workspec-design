
## summary
The WorkSpec "Morph + Tether" prototype and Shell frames define six tightly interlocking UI subsystems. Each is driven by a single shared canvas that re-represents its items between two lenses (Freeform / Structured) via a 280ms cross-fade with simultaneous scale micro-transforms — no items are hidden, they only change form. Items carry a flat placement record {x, y, lensOffset?} where the offset is nullable from day one; when a user "loosens" an item, writing lensOffset turns the item into a loose chip that glides to a diverged position in Structured while staying at its sketch position in Freeform.

Architecture rooms are tethered sub-canvases entered from an element, not from the nav. The tether bar provides a breadcrumb (Board button → element color swatch + name → room name), an Esc keyboard handler that pops back to the board, and a ghost of the originating element in the room canvas itself. The Atlas rail is a 320px right column that cycles through three states — PROPOSING (with reasoning stream and proposal cards), QUIET (shows a recency log of just-accepted proposals and any still-open ones), and listening (top-bar indicator only). Proposals are tombstoned on Dismiss so Atlas never re-surfaces them unless inputs materially change.

The rework halo is pure board-layer metadata: the element keeps its ink state, its VC border, its ‹/› build tag, and its arc-stage corner tag untouched; the halo is a coral dashed ring added on top as a fifth, transient channel. Links on a reworking element are flagged "contested" rather than "dangling" — traceability and gap detection understand the distinction. The Reconcile overlay tints domain cards by sync state (green SYNC / amber DRIFT / grey UNLINKED) without filtering or hiding anything; the "UNDER REWORK · DRIFT EXPECTED" quieting label appears inline in the drift digest to explain expected divergence without suppressing the finding.

The four-mechanics taxonomy bar is a persistent dark footer strip that pins the distinction between the four navigation modalities: Pill (total re-representation), Overlay (tint-not-filter), ON BOARD (partial projection sharing board logic), and ROOM ↗ (tethered surface with own spatial logic and breadcrumb home). The constraint stated explicitly is that a partial view — one that hides items — must never be placed in the lens pill.

## dataModel
Placement record (per canvas item):
  { x: number, y: number, lensOffset?: { dx: number, dy: number } | null }
  lensOffset is nullable from day one. Null = anchored (item stays at (x,y) in both lenses).
  Non-null = loosened (Structured position is x+dx, y+dy; Freeform stays at x,y).
  Writing lensOffset from null to a value is the "loosen" operation — no schema change needed later.

Lens state (board-level):
  lens: "freeform" | "structured"

Rework halo (per-element board metadata, NOT an element state field):
  reworking: boolean   — stored as board overlay metadata, not on the element record itself.
  Affects: halo visibility, link flag (contested vs live), drift digest quieting label.
  Does NOT change: VC state (drafted/inked/superseded), arc stage, build tag.

Dismissal tombstone (per Atlas proposal):
  { proposalId: string, inputHash: string, dismissedAt: timestamp }
  Atlas re-proposes only when inputHash changes materially.

Item kinds and their display across lenses:

STICKY (freeform-native, untyped):
  Freeform form: #ffe566 background, 1px solid #d9c238 border, 2px border-radius, Caveat 600 ~17-21px,
    color #5a3d00, rotate(-3deg) or rotate(2deg), box-shadow 0 6px 16px rgba(0,0,0,0.12).
  Structured form ("LOOSE · UNTYPED chip"): white background, 1.5px dashed #d1d1d6 border, 8px border-radius,
    width 150px, padding 9px 11px. Eyebrow "LOOSE · UNTYPED" in JetBrains Mono 7.5px 700 #76767c letterSpacing 0.1em.
    Content in Caveat 15px #5a4a2a. CTA button "type it →" font-size 9px 600 color #1b8a55
    background rgba(27,138,85,0.08) border 1px solid rgba(27,138,85,0.25) border-radius 4px padding 2px 7px.

FEATURE · INKED (freeform form = pinned card):
  Freeform: white bg, 1px solid #cfe6da border, 4px left border #1f8a6a, 9px border-radius,
    rotate(-1.5deg) or rotate(1deg), box-shadow 0 10px 22px rgba(0,0,0,0.16).
    Pin head: position absolute top -7px left 50% transform translateX(-50%), 13×13px circle,
    radial-gradient(circle at 35% 30%, #9fb6d0, #3d5d7a), box-shadow 0 2px 4px rgba(0,0,0,0.3).
    Eyebrow "FEATURE · INKED" JetBrains Mono 8px 700 #1f8a6a. Title Inter Tight 14px 600.
  Structured: same border scheme but no rotation, box-shadow 0 2px 8px rgba(0,0,0,0.06), no pin head.
    Width 226px. Title font-weight 700. Entity/ADR tags shown (8px 700 JetBrains Mono colored per kind).
    "ARCHITECTURE · ROOM ↗" button: 9.5px 700 #3a6ea5 background rgba(58,110,165,0.07)
    border 1px solid rgba(58,110,165,0.25) border-radius 5px padding 4px 9px.

Build tag ‹/›: font-size 9px 700 color #6d4fa6 JetBrains Mono — shown in both freeform and structured.

INK STROKE (freeform canvas SVG):
  Freeform: opacity 1.
  Structured: opacity 0.15. Transition: opacity 0.28s ease.

DOMAIN card (structured-only, post-acceptance):
  white bg, 1px solid #e4e4e7, 4px left border (color varies by domain), 12px border-radius,
  box-shadow "0 1px 2px rgba(0,0,0,0.06), 7px 7px 0 -2px #ececee" (stacked-card shadow effect).
  Title 17px 700 letter-spacing -0.01em. Eyebrow "DOMAIN" JetBrains Mono 9px 700 #b8b8be.
  On fresh acceptance: border color #1b8a55, border 1px solid #cfe6da, shadow replaces with
    "7px 7px 0 -2px #e2efe8", animation draftPulse 2.4s. Tag "✦ inked just now · via Atlas" #0d8a72.

LOOSE ITEMS TRAY (structured canvas, bottom-left):
  Container: 250px wide, white bg, 1px dashed #d1d1d6 border, 10px border-radius, padding 11px 13px.
  Header row: "LOOSE · UNTYPED" JetBrains Mono 9px 700 #76767c + count #b8b8be JetBrains Mono 10px.
  Each item: sticky thumbnail (22×18px #ffe566 border 1px solid #d9c238 2px border-radius rotate(-3deg))
    + Caveat 15px text + "type it" button.

RECONCILE overlay states per domain card:
  SYNC: bg #fff, border 1px solid rgba(27,138,85,0.35), left border 4px solid #1b8a55.
    Badge "SYNC" JetBrains Mono 9px 700 #1b8a55.
  DRIFT: bg #fffdf4, border 1px solid rgba(200,146,22,0.5), left border 4px solid #c89216,
    box-shadow 0 2px 10px rgba(200,146,22,0.12). Badge "DRIFT · N" #97701f.
  UNLINKED: bg #fff, border #e4e4e7, left border 4px solid #b8b8be, opacity 0.8.
    Badge "UNLINKED" #76767c.

Atlas rail header states:
  PROPOSING: badge text "PROPOSING", color #0d8a72, background rgba(13,138,114,0.10),
    border-radius 4px, padding 2px 6px, JetBrains Mono 9px 700, letter-spacing 0.06em.
    Count shown as plain #b8b8be JetBrains Mono 11px right-aligned.
  QUIET: badge text "QUIET", color #76767c, background #f6f6f7, border-radius 4px, JetBrains Mono 9px 700.

## integrationPoints
1. LENS PILL — position: absolute top 14px left 50% transform translateX(-50%) z-index 20.
   Outer pill: bg #fff border 1px solid #e4e4e7 border-radius 999px padding 4px 13px 4px 4px
   box-shadow 0 2px 8px rgba(0,0,0,0.08). Inner track: bg #f6f6f7 border-radius 999px padding 2px gap 2px.
   Active button: bg #ffffff color #0e3b2a box-shadow 0 1px 2px rgba(0,0,0,0.1).
   Inactive button: bg transparent color #76767c box-shadow none.
   Both buttons: border none border-radius 999px padding 6px 14px (outer) / 5px 13px (inner active)
   font-size 12px font-weight 600 cursor pointer transition all 0.2s ease.
   Caption beside track: font-size 11.5px color #76767c white-space nowrap —
     "same spots — sketch clothes" (freeform) / "280ms morph · positions held" (structured).

2. LENS MORPH TRANSITIONS — all controlled by CSS transition on opacity and transform, 0.28s ease.
   Freeform→Structured: ffO fades 1→0 (items), stO fades 0→1.
   Scale micro-transforms during fade-out: sticky scale(0.94) + rotate(±2deg); pinned card scale(0.96).
   Scale micro-transforms during fade-in: chips scale(0.94)→scale(1); cards scale(0.96)→scale(1).
   Ink strokes: strokeO transitions 1→0.15 (ghost at 15%).
   Loose item glide: transform: translate(0,0) in freeform → translate(185px, 35px) in structured,
   transition transform 0.28s ease on the outer container div.

3. REWORK HALO toggle — JS: toggleRework = () => setState(s => ({ rework: !s.rework }))
   Halo div: position absolute inset -16px -52px -22px -18px (extends outside element bounds),
   border 1.5px dashed #d8643f border-radius 14px background rgba(216,100,63,0.03),
   opacity: reworkO (0 or 1), transition opacity 0.28s ease.
   "REWORKING" label: position absolute top -14px right -44px font-size 8.5px 700 #d8643f
   JetBrains Mono bg #fafafb padding 0 4px white-space nowrap, "● REWORKING".
   Margin notes: opacity+transform animate in, transform goes translateY(6px)→translateY(0).
   Button while off: "✎ pull back to the whiteboard" — color #d8643f bg rgba(216,100,63,0.06)
     border 1px dashed rgba(216,100,63,0.45).
   Button while on: "✓ done reworking" — color #fff bg #d8643f border solid #d8643f.
   Halo is visible in BOTH lenses once active (outer container wraps both freeform+structured slots).

4. ROOM / TETHER — openRoom sets { room: true }, replaces board view with room view entirely.
   Tether bar: flex row, bg #fff border 1px solid #e4e4e7 border-radius 9px padding 8px 12px
   margin 12px 14px 0, box-shadow 0 1px 3px rgba(0,0,0,0.05), z-index 5.
   Back button: inline-flex, color #1b8a55 bg rgba(27,138,85,0.08) border 1px solid rgba(27,138,85,0.22)
   border-radius 6px padding 4px 10px font-size 11.5px 600, left chevron SVG 12×12.
   Breadcrumb: "Board" button › [9px colored swatch + element name 12px 600] › "Architecture · containers" 12px 700.
   Right side: Topology placement pill (optional context), font-size 10.5px 600 #3a6ea5
   bg rgba(58,110,165,0.07) border 1px solid rgba(58,110,165,0.22) border-radius 6px.
   Ghost card: bg rgba(255,255,255,0.7) border 1.5px dashed #c7ccd2 border-radius 9px padding 10px 12px.
   Eyebrow "GHOST · CAME FROM" JetBrains Mono 7.5px 700 #b8b8be. Content 12.5px 600 #76767c.
   Sub-copy "click Board to return to its exact spot" 9.5px #b8b8be.
   Esc handler: document.addEventListener('keydown', e => { if (e.key === 'Escape' && room) setState({ room: false }) }).
   Esc hint label in tether bar: "Esc → back to the board, camera held" 10px #b8b8be JetBrains Mono.

5. ATLAS RAIL (320px, right column) — bg #ffffff border-left 1px solid #e4e4e7 flex column.
   Header: padding 13px 16px 12px border-bottom 1px solid #e4e4e7 flex items-center space-between.
   Icon: 24×24 bg rgba(13,138,114,0.10) color #0d8a72 border-radius 6px.
   Reasoning stream block (PROPOSING state only): padding 11px 16px border-bottom 1px solid #f0f0f1
   bg #fafafb. Label "Reading the board" JetBrains Mono 8.5px 700 #b8b8be letterSpacing 0.1em mb 7px.
   Key-value rows: JetBrains Mono 11px gap 7px. Keys colored (#0d8a72 for goal/read, #1b8a55 for draft).
   Intro copy (PROPOSING): 11.5px line-height 1.5 #76767c mb 13px. "Pencilled from your sketch.
   Accept to ink into the structured lens; dismiss to suppress — dismissals are tombstoned;
   Atlas re-proposes only if the sketch materially changes."
   Proposal card: border 1px solid #e4e4e7, left accent border 3px solid [color], border-radius 8px
   padding 11px 12px mb 11px bg #fff.
   Eyebrow row: ✦ icon 12px + kind label JetBrains Mono 8.5px 700 letterSpacing 0.08em — color matches accent.
   Example: "GROUP → DOMAIN" color #1b8a55; "PROMOTE → PERSONA" color #3a6ea5.
   Title: Caveat 17px, color dark variant of accent (#0e3b2a for green, #1e3a5a for blue).
   Rationale: 10.5px #76767c line-height 1.4 mb 9px.
   Accept button: flex 1, font-size 11px 600 color #fff bg [accent color], border none, border-radius 6px padding 6px.
   Dismiss button: 11px 500 color #76767c bg #fff border 1px solid #e4e4e7 border-radius 6px padding 6px 12px.
   Footer input: padding 11px 14px border-top 1px solid #e4e4e7 flex gap 8px.
   Textarea: flex 1 height 34px bg #fafafb border 1px solid #e4e4e7 border-radius 7px px 11px
   font-size 12px color #b8b8be placeholder "Ask Atlas, or @mention a client…".
   Send button: 34×34 bg #1b8a55 border-radius 7px color #fff.

6. NAV BADGES in Design group:
   ON BOARD badge: text "ON BOARD", font-size 7.5px 700, letter-spacing 0.05em, JetBrains Mono.
     color #1f8a6a, background rgba(31,138,106,0.07), border 1px solid rgba(31,138,106,0.2),
     border-radius 3px, padding 1px 4px. Used on: Data Dictionary, User Journeys.
   ROOM ↗ badge: text "ROOM ↗", same sizing/padding.
     color #3a6ea5, background rgba(58,110,165,0.07), border 1px solid rgba(58,110,165,0.2).
     Used on: Architecture, Data Flow.
   Both badges: margin-left auto (push to right of nav row).
   Nav row: display flex align-items center gap 9px padding 7px 9px border-radius 7px color #4a4a52.
   Active nav row (Architecture when in room): background rgba(58,110,165,0.10) color #1e3a5a.
   Active nav row (Board/Discovery): background rgba(27,138,85,0.10) color #0e3b2a.

7. RECONCILE OVERLAY pill/indicator:
   Board-top pill: bg #fff border 1px solid rgba(200,146,22,0.4) border-radius 999px padding 5px 14px.
   Icon: SVG stroke #c89216. Text "Reconcile overlay on" 12px 700 #97701f.
   Sub-text "tints by sync state · nothing hidden, nothing locked" 11px #76767c.
   "UNDER REWORK · DRIFT EXPECTED" inline quieting badge in drift digest item:
     bg #f3f3f4 border 1px solid #e4e4e7 border-radius 3px padding 1.5px 6px
     JetBrains Mono 8px 700 letterSpacing 0.05em color #76767c.

8. FOUR-MECHANICS TAXONOMY BAR:
   bg #0e0f13 border-radius 12px padding 16px 22px flex wrap gap 10px 22px.
   Label "THE FOUR MECHANICS · PINNED": JetBrains Mono 10px 700 #5cf2c0 flex-shrink 0.
   Four items interleaved with "·" separators (#34343d):
     "Pill = lens." strong #e8e8ea + description #a4a4ac 11.5px.
     "Overlay = tint." strong #e8e8ea + description.
     "ON BOARD = projection." strong #1f8a6a + description.
     "ROOM ↗ = tethered surface." strong #6f9fd0 + description.
   Footer constraint note: 10.5px #62626a flex-basis 100%:
     "A partial view never goes in the pill — 'lens' must never come to mean 'a view that hides things.'"

## risks
LENS MORPH — both representations must exist in the DOM simultaneously (cross-fade); pointer-events must be toggled so only the active lens is interactive (ffPe / stPe switching). Using CSS visibility:hidden or display:none breaks the cross-fade. The outer container div for each item must be position:absolute at canvas coordinates; the inner freeform and structured slots are position:absolute inset:0 inside it.

LOOSE ITEM GLIDE — the translate() is applied to the outer container, not the inner slot. The transition must be on transform 0.28s ease at the container level so the item smoothly drifts to its structured home during the morph. The lensOffset stores the delta, not the absolute structured position. If lensOffset is null, the translate stays translate(0,0) in both lenses (no glide).

REWORK HALO — the halo div's inset values (-16px -52px -22px -18px) extend outside the element bounds and will be clipped by any parent with overflow:hidden. The canvas must not set overflow:hidden on the item container layer. The z-index of the halo must be below the item card but still above the canvas background.

ROOM VIEW — the room replaces the entire canvas area (showBoard / showRoom toggle). Camera position ("camera held") is a prototype note implying the canvas pan/zoom state should be preserved when entering and exiting a room, but the prototype does not implement this — implementors must decide whether to store and restore canvas transform on room entry/exit.

ATLAS TOMBSTONES — the prototype describes tombstoning semantically ("dismissals are tombstoned; Atlas re-proposes only if the sketch materially changes") but provides no implementation. The inputHash strategy (Coffers pattern) must be designed — what constitutes "material change" to canvas inputs needs a concrete definition.

STACKING RULE CONSTRAINTS — the four channels (form / border / corner tag / halo) are described as non-competing. In practice, halo is position:absolute with negative inset overhanging the card; if the card is inside a CSS grid with gap, the halo will overlap adjacent cards. Items under rework should either have extra canvas margin or the halo should use outline instead of an absolutely positioned div.

RECONCILE OVERLAY — "tints, never filters" means all domain cards remain visible; the amber tint (#fffdf4 background) is applied directly to the card, not via a CSS filter overlay. This means the reconcile state must be composited at render time into the card style, not via a global CSS class toggling a filter on the canvas.

FONT DEPENDENCIES — three non-system fonts are required: Inter Tight (weight 400/500/600/700), JetBrains Mono (400/500/600), Caveat (500/600/700). All handwritten/mono text will fall back incorrectly if these are not loaded. The prototype loads them from Google Fonts — production must ensure they are available in all rendering environments (especially PDF export or SSR).

INITIAL STATE — the prototype's JS state initializes as { lens: "structured", rework: false, room: false }, meaning the Structured lens is the default, not Freeform. This is the opposite of the conceptual "sketch first" framing; verify with product whether Freeform should be the default for new boards.

## apis
No backend API endpoints are defined in these prototype files. All state is local JS component state. The following data model fields are referenced for future API design:

placement = { x: number, y: number, lensOffset?: { dx: number, dy: number } | null }
  — per-item canvas position stored on the element/item record.
reworking: boolean
  — per-item board metadata (NOT the element's VC state field), stored separately from element state.
lens: "freeform" | "structured"
  — per-board/per-user view preference.
dismissal tombstone = { proposalId, inputHash, dismissedAt }
  — per Atlas proposal, stored to prevent re-proposal of dismissed suggestions.

The prototype references the following semantic actions that will need API backing:
  POST /items/:id/loosen — writes lensOffset to placement.
  POST /items/:id/rework-start — sets reworking=true, flags links as contested.
  POST /items/:id/rework-done — clears reworking, restores links to live.
  POST /atlas/proposals/:id/accept — inks the proposed element, triggers canvas re-render.
  POST /atlas/proposals/:id/dismiss — writes tombstone with current inputHash.
  GET /boards/:id/reconcile — returns drift digest per domain/item (sync/drift/unlinked state).
