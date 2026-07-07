# End-to-end product flow — design handoff (screen ↔ issue index)

This is the canonical hi-fi design set for the WorkSpec go-live build — the design artifact every `design-gap` issue (#231–#265) refers to. Exported from Claude Design (claude.ai/design).

**Build order and dependencies live in tracking issue #280.** Start there. This file maps each design screen to the issue that implements it.

## Reading order

1. `understanding.md`, `design-spec.md`, `DEV-LEAD-BRIEF.md`, `AUDIT-BRIEF.md` — the written design briefs (already in this folder).
2. `chats/chat1.md`, `chats/chat2.md` — the design conversation; the reasoning lives here, not just in the final pixels.
3. The screen's `.dc.html` file (below), then follow its import (`./support.js`).
4. Recreate **pixel-perfectly in the real stack** (React + Tailwind v4 + Framer Motion + generated API hooks). Match the visual output; don't copy the prototype's internal structure. Don't render in a browser unless asked — dimensions/colours/layout are in the source.

## Screen → issue → file

| # | Screen | Implements | File |
|---|--------|-----------|------|
| 00 | WorkSpec Screens (index of all screens) | — overview | `00 WorkSpec Screens.dc.html` |
| 01 | Discovery / Board | #231 | `01 Discovery.dc.html` |
| 02 | Architecture | #232 ✅ done | `02 Architecture.dc.html` |
| 03 | Data Dictionary | #233 | `03 Data Dictionary.dc.html` |
| 04 | User Journeys | #234 | `04 User Journeys.dc.html` |
| 05 | Decisions | #235 | `05 Decisions.dc.html` |
| 06 | Risks | #237 | `06 Risks.dc.html` |
| 07 | Backlog | #255 | `07 Backlog.dc.html` |
| 08 | Build | #258 | `08 Build.dc.html` |
| 09 | Triage | #259 | `09 Triage.dc.html` |
| 10 | Test | #260 | `10 Test.dc.html` |
| 11 | Attention | #261 | `11 Attention.dc.html` |
| 12 | Velocity | #262 | `12 Velocity.dc.html` |
| 13 | Reconcile | #263 | `13 Reconcile.dc.html` |
| 14 | Documents | #264 | `14 Documents.dc.html` |
| 15 | Settings | #265 | `15 Settings.dc.html` |

## Shared / cross-cutting (foundation — part of #231)

| Concern | File |
|---------|------|
| App shell (grouped nav + topbar + canvas host) | `WorkSpec Shell.dc.html` |
| Left nav | `WorkSpecNav.dc.html` |
| Top bar | `WorkSpecTopbar.dc.html` |
| Lens morph + tether mechanic (Freeform⇄Structured, ROOM↗ tether) | `Morph + Tether Prototype.dc.html` |
| Architecture arc / C4 reference | `WorkSpec Arc.dc.html` |
| Shared script imported by the screens | `support.js` |

The 16 numbered screens, `WorkSpecNav`, `WorkSpecTopbar`, and `chats/` were added on top of the original handoff (which carried only the shell prototypes + written briefs) so every per-screen design now resolves.
