# End-to-end product flow — design handoff

Source: claude.ai/design project "End-to-end product flow" (June 2026). This bundle is the
implementation reference for the reassembled shell, the freeform⇄structured lens morph, the
tethered Architecture room, the rework halo, and the Atlas co-author rail.

## Contents

- `WorkSpec Shell.dc.html` — seven journey screens of the reassembled app (nav badges,
  structured lens board, room + tether bar, flow-to-build, reconcile overlay, stacking-rule
  responses, four-mechanics taxonomy bar).
- `Morph + Tether Prototype.dc.html` — the interactive spatial contract: lens flip (280ms
  morph in place), loosen glide (`lensOffset`), rework halo toggle, room + Esc-home. The JS
  at the bottom of the file is the behavioral spec.
- `WorkSpec Arc.dc.html` — the upstream concept board (7 brief questions, leans, anti-patterns).
- `support.js` — runtime the `.dc.html` prototypes need if opened in a browser.
- `design-spec.md` — distilled implementation spec: exact hex/px/copy values per feature.
- `understanding.md` — subsystem map of this repo (discovery canvas, structured C4, data/API
  layer, Atlas/proposals, views) with file paths, line refs, data models, and gotchas, produced
  June 2026. Line numbers drift; verify before editing.
- `DEV-LEAD-BRIEF.md` — working agreement + repo conventions for implementation agents.

## The four mechanics (pinned taxonomy)

Pill = lens (total re-representation) · Overlay = tint (temporary, total) ·
ON BOARD = projection (partial re-cluster) · ROOM ↗ = tethered surface.
Guard-rail: a partial view never goes in the pill.

## Status

Landed: grouped sidebar (Board/Design/Registers/Deliver/Project/Workspace), phase tag removed,
Design-group ON BOARD / ROOM ↗ badges, Data Dictionary + User Journeys nav surfaces,
Topology ↗ Workspace nav link (`/topology` list + `/topology/:id` detail, absolute nav item
in the project sidebar Workspace section and the workspace AppLayout rail).
Remaining work is tracked in GitHub issues labeled `design:end-to-end-flow`.
Deferred by design: Reconcile overlay (no drift substrate on canvas yet), Data Flow nav item
(no renderer — nav slot intentionally absent until renderer ships).
