

============================== discovery-canvas ==============================

--- summary ---
The Discovery canvas is a custom from-scratch whiteboard engine (no tldraw/ReactFlow dependency) shared by three distinct page layers: discovery, design, and prototype. The same `Canvas` React component, `useCanvasStore` Zustand singleton, and shape-util registry are reused verbatim by the C4 architecture page — the two canvases are not separate engines, they are the same engine with different shape populations and different sync hooks.

Layer routing is purely URL-driven: `v2-discovery.tsx` reads the last path segment (`/design`, `/prototype`, or anything else → `discovery`) and passes that string to `useCanvasSync(projectId, layer)`, which computes `canvasKind = "v2-whiteboard-${layer}"`. Each layer has its own independent snapshot stored in the `project_canvas_content` DB table under `(projectId, canvasKind)`. Switching layers clears the store immediately (`loadSnapshot` with empty shapes) and then fetches the new layer's snapshot from `GET /api/projects/:projectId/canvas/v2-whiteboard-<layer>`. Persistence is debounced 1 second after any store mutation, via `PUT /api/projects/:projectId/canvas/v2-whiteboard-<layer>` with `{ snapshot: { version:1, camera, shapes } }`. A WebSocket at `/api/projects/:projectId/canvas/:kind/watch?sessionId=` pushes snapshot updates to other clients in real time.

The canvas is a DOM-based renderer (not SVG or Canvas2D). `ShapeLayer` sorts shapes by their fractional-index `index` field and renders each one as an absolutely-positioned `<div>` using CSS `transform: translate3d + rotate + scale`. The shape-util registry (`src/canvas/shapes/registry.ts`) maps `shape.type` → a `ShapeUtil<S>` object with `defaultProps`, `getBounds`, `hitTest`, `canResize`, `canEditText`, and `Component`. There is no single "lens" or "layer" toggle inside the canvas engine itself; layers are separate URL routes each loading their own snapshot.

The C4 architecture page reuses the identical `Canvas` component but populates the store with ephemeral `c4node`, `c4boundary`, and `connector` shapes (all have `meta.ephemeral = true` so `exportSnapshot()` excludes them from persistence). The architecture page installs a `C4Bridge` singleton (set via `setC4Bridge`) that intercepts `deleteShapes` and handles node/edge mutations through the diagram REST API. On unmount, architecture.tsx clears the store and resets the active tool to prevent C4 shapes from bleeding into the whiteboard layers. No shared data between the two canvas modes — they read from different storage kinds and have disjoint shapes in the store at any given time.

--- dataModel ---
**Shape union (src/canvas/types.ts)**
- `Shape = StickyShape | TextShape | DrawShape | ImageShape | DeviceShape | WireframeShape | C4NodeShape | ConnectorShape | C4BoundaryShape`
- `BaseShape`: id (ShapeId = branded string), type, x, y, width, height, index (fractional string), rotation? (degrees), groupId?, meta?
- `StickyShape`: text, color ('yellow'|'pink'|'blue'|'green'|'orange'|'purple'), fontFamily?
- `TextShape`: text, fontSize (number), fontWeight (400|500|600|700), color? (CSS), fontFamily?, lockWidth?, lockHeight?
- `DrawShape`: points (Vec2[]), strokeWidth, color (CSS)
- `ImageShape`: src (compressed JPEG data URL), naturalWidth, naturalHeight
- `DeviceShape`: deviceType ('laptop'|'tablet'|'mobile'), url
- `WireframeShape`: componentType (WireframeComponentType — 24 values), label
- `C4NodeShape`: slug (model identity), nodeType (string), label, description?, drillable?, drafted?, validationErrors?, artifactRefId?, isScope?
- `C4BoundaryShape`: label, accent — purely presentational, never persisted (ephemeral)
- `ConnectorShape`: sourceShapeId?, targetShapeId?, freeEnd? (Vec2 during creation), edgeFrom, edgeTo, label?, category? (EdgeCategory = string), lens? ('logical'|'deployment'|'both'), laneOffset?, fanRole?

**Canvas snapshot (store.ts)**
- `CanvasSnapshot`: `{ version: 1, camera: Camera, shapes: Record<string, unknown> }`
- Camera: `{ x: number, y: number, zoom: number }`
- Ephemeral shapes (meta.ephemeral=true) are stripped by `exportSnapshot()`

**DB table: project_canvas_content**
- Columns: project_id (uuid FK→projects), canvas_kind (text), snapshot (jsonb), updated_at (timestamp)
- PK: (project_id, canvas_kind)
- canvas_kind values for discovery engine: 'v2-whiteboard-discovery', 'v2-whiteboard-design', 'v2-whiteboard-prototype'

**Store state (CanvasState interface)**
- camera, shapes, selectedIds (Set<ShapeId>), hoveredId, editingId, activeTool (ToolName), placementNodeType (string|null), history (HistoryStack), marquee (MarqueeState|null), isDragging, isResizing

**WireframeComponentType** (24 values): button, input, textarea, checkbox, radio, toggle, select, slider, card, section, divider, header-bar, footer, navbar, tabs, breadcrumb, pagination, sidebar-nav, table, list, avatar, progress, badge

**HistoryStack**: `{ stack: Command[], pointer: number }` — Command: `{ do, undo: (shapes) => shapes, label? }`

--- apis ---
**HTTP REST**
- `GET /api/projects/:projectId/canvas/:kind` → `{ snapshot: CanvasSnapshot | null }`
- `PUT /api/projects/:projectId/canvas/:kind` body `{ snapshot }`, header `X-Canvas-Session: <uuid>` → `{ ok: true }`
- `POST /api/projects/:projectId/discover` body `{ sourceArtifactIds: string[], rejectedPairs: string[] }` → `{ proposals: ProposalPayload[] }` (called by DiscoverProposals)
- `POST /api/projects/:projectId/notes` via `useCreateNote()` generated hook (creates Note artifact from sticky text)
- `POST /api/projects/:projectId/registers/draft-capture` via `useDraftRegisterCapture()` (AI-drafts decision/risk from shape texts)

**WebSocket**
- `ws[s]://<host>/api/projects/:projectId/canvas/:kind/watch?sessionId=<uuid>` — receives `{ type: 'snapshot', snapshot: CanvasSnapshot }` messages when other clients save

**React API Client hooks (generated, @workspace/api-client-react)**
- `useGetProject(workspaceSlug, projectId)` — project title + phase for header
- `useCreateNote()` → `mutateAsync({ projectId, data: { text } })` returns `{ artifactId }`
- `useDraftRegisterCapture()` → `mutateAsync({ projectId, data: DraftRegisterCaptureInput })` returns `{ prefill }`

**Custom DOM events**
- `window.dispatchEvent(new CustomEvent('workspec:scope-updated', { detail: { projectId, artifactId, type } }))` — triggers AI discovery proposals
- `window.addEventListener('workspec:open-c4-element-editor', ...)` — architecture page only, opens C4ElementEditor
- `window.dispatchEvent(new Event('workspec:needs-branch'))` — architecture page only, opens branch dialog from sidebar

--- integrationPoints ---
**Adding a new shape type:**
1. Add the interface extending `BaseShape` to `src/canvas/types.ts`, add to the `Shape` union and `ToolName` if needed
2. Create a `ShapeUtil<S>` implementation (component + hitTest + bounds + canResize + canEditText) under `src/canvas/shapes/<type>/`
3. Register it in `src/canvas/shapes/registry.ts` — the string key must match the `type` field
4. If tool-creatable, add a Tool (extending ToolBase pattern) under `src/canvas/tools/` and register in the `TOOLS` map inside `usePointerEvents.ts`
5. If panel-creatable, wire into `CanvasPanel.tsx` or `Toolbar.tsx`

**Adding keyboard shortcuts:**
- `src/canvas/hooks/useKeyboardShortcuts.ts` — `useEffect` on `window.addEventListener('keydown', ...)`, guard with `inEditable` check
- Space-bar temporary hand tool is in `usePointerEvents.ts` (not `useKeyboardShortcuts.ts`) — a second keydown effect in the same hook
- Esc is already handled in `useKeyboardShortcuts.ts` lines 85-94: exits editing → exits 'place' tool → clears selection (in priority order). A lens-toggle keybinding would go in the same switch block or a parallel effect in the page component

**Implementing a lens/layer toggle inside the canvas:**
- The current "layer switch" is a URL navigation (wouter `useLocation`). The `layerFromPath` helper in `v2-discovery.tsx` (lines 29-33) reads it
- To add an in-canvas lens toggle (like the C4 page's logical/deployment lens), add UI to Toolbar or a page-level overlay, then navigate via `setLocation` — `useCanvasSync` will reload the snapshot for the new kind
- Alternatively, filter shapes client-side by a `meta.lens` field without changing the snapshot key — this would be a purely client-side approach that keeps all shapes in one snapshot

**Persistence integration point:**
- `useCanvasSync.ts` — the store subscriber (line 48) is where to intercept changes; `exportSnapshot()` is the serialization point where ephemeral shapes are excluded
- The server endpoint is `PUT /api/projects/:projectId/canvas/v2-whiteboard-<layer>` with body `{ snapshot }` and header `X-Canvas-Session`

**Discovery-specific proposals (AI discovery):**
- `DiscoverProposals` component (v2-discovery.tsx lines 47-102) listens for `workspec:scope-updated` custom events and calls `POST /api/projects/:id/discover`
- `ProposalContext` + `ProposalProvider` hold pending/confirmed proposals in React state; no canvas shapes involved — proposals are purely a right-panel concern

**Selection-to-artifact capture:**
- `StickySelectionBar` reads `useCanvasStore(s => s.selectedIds)` and `s.shapes`, filters for `isCapturableShape` (sticky or text with text property), then calls `useDraftRegisterCapture` (generated API hook) → opens `CaptureComposer` as a right-panel slide-in

--- risks ---
**Shared singleton store across pages:** `useCanvasStore` is a module-level Zustand singleton. architecture.tsx explicitly clears the store on unmount to prevent C4 shapes bleeding into discovery layers. If a new page uses the canvas and forgets to clean up, C4 nodes will appear in the whiteboard snapshot. The `exportSnapshot()` filter (ephemeral flag) is the safety net, but only for shapes that correctly set `meta.ephemeral`.

**Layer snapshot isolation:** Each layer (discovery/design/prototype) is a fully separate snapshot stored under a distinct `canvasKind`. There is no shape-level per-layer visibility — you cannot have a shape appear on two layers. Layer switch clears the store immediately and fetches the new snapshot, so any unsaved changes during the 1-second debounce window could be lost if the user switches layers before the PUT fires. The `useCanvasSync` cleanup effect does flush synchronously on unmount (lines 92-107), but only if the user leaves the page, not if they switch layers within the same component.

**C4Bridge is stateful/global:** `setC4Bridge` writes to a module-level variable. Only one page should have the bridge installed at a time. The architecture page clears it on unmount, but if two architecture views were mounted simultaneously (e.g., nested routing), the bridge would be overwritten.

**No typed artifact shapes on discovery canvas:** C4NodeShape exists in the type system and registry, but is never created by discovery layer tooling. The discovery layer only supports: sticky, text, draw, image. The design layer adds: wireframe. The prototype layer adds: device. Typed artifacts (features, personas, domains) do NOT appear as shapes on the discovery canvas — they are only accessible through the structured artifact panels in the sidebar. The `isCapturableShape` function (v2-discovery.tsx line 35-37) explicitly only captures sticky and text shapes as notes.

**`connector` tool not exposed in Toolbar:** ConnectorTool is defined and registered, but the Toolbar component does not include a button for it (STANDARD_TOOLS in Toolbar.tsx has only select/hand/text/draw). It is used on the C4 architecture canvas via the C4-specific C4Toolbar component. Adding it to discovery is possible but currently absent.

**WebSocket `canvasKind` validation:** The WebSocket upgrade handler in `canvas-watch-ws.ts` does NOT validate `kind` against the whitelist — only the HTTP GET/PUT routes do. A client could open a WebSocket subscription to any string kind. This is a minor access-control gap.

**`localStorage` as secondary cache:** The store subscribes and saves to `localStorage` every 800ms (store.ts lines 503-513) independently of `useCanvasSync`. The localStorage key is hardcoded as `workspec-canvas-v1` regardless of layer or project — meaning switching projects/layers without a page reload will momentarily show stale shapes from localStorage before the server fetch resolves.

--- keyFiles ---
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/pages/v2-discovery.tsx [1-294] — Entry point; defines LayerName ('discovery'|'design'|'prototype'), reads URL to select layer, mounts Canvas + Toolbar + CanvasPanel, handles StickySelectionBar → CaptureComposer flow, wraps with ProposalProvider
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/types.ts [1-149] — All shape type definitions: StickyShape, TextShape, DrawShape, ImageShape, DeviceShape, WireframeShape, C4NodeShape, C4BoundaryShape, ConnectorShape, BaseShape, Shape union, ToolName, Command, HistoryStack, MarqueeState, Camera, Vec2, Box, ShapeId
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/store.ts [1-516] — Zustand store (useCanvasStore): camera, shapes, selectedIds, hoveredId, editingId, activeTool, placementNodeType, history, marquee, isDragging, isResizing. All mutations are Command-pattern (do/undo). exportSnapshot() strips ephemeral shapes. localStorage autosave every 800ms (secondary to server sync).
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/hooks/useCanvasSync.ts [1-110] — Server persistence: GET /api/projects/:id/canvas/:kind on mount, PUT with 1s debounce on store change, WebSocket watch for multi-client sync. canvasKind = 'v2-whiteboard-${layer}'.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/Canvas.tsx [1-152] — Root canvas component: mounts Background, ConnectorLayer, ShapeLayer, SelectionLayer, MarqueeBox, CanvasZoomControls, ContextMenu. Calls usePointerEvents and useKeyboardShortcuts. Renders hit-testing for context menu with rotation-aware unrotate.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/shapes/registry.ts [1-34] — ShapeUtil<S> interface definition and shapeUtils registry mapping type string → util. Keys: sticky, text, draw, image, device, wireframe, c4node, c4boundary, connector.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/hooks/useKeyboardShortcuts.ts [1-100] — All keyboard shortcuts: v=select, h=hand, s=sticky, t=text, d=draw, ⌘Z=undo, ⌘⇧Z/⌘Y=redo, ⌘A=select-all, ⌘0=reset-zoom, ⌘1=fit, Delete/Backspace=delete selected, Escape=cancel edit / exit 'place' tool / clear selection.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/hooks/usePointerEvents.ts [1-271] — Routes all pointer/mouse events to the active Tool, tracks hover for connector highlighting, handles right-button pan vs context-menu, Space bar → hand tool (restores on release), double-click dispatch.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/components/Toolbar.tsx [1-455] — Bottom toolbar: select/hand/text/draw/sticky tools (with right-click defaults menu for sticky color+font), upload image, undo/redo, and (only when layer==='prototype') device buttons. Reads/writes useCanvasStore.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/components/CanvasPanel.tsx [1-465] — Draggable side panel shown on design and prototype layers only. Design: wireframe component palette (4 categories, 21 components). Prototype: device palette (laptop/tablet/mobile). Not rendered at all on discovery layer.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/tools/c4Bridge.ts [1-43] — Module-level singleton bridge between canvas tools and C4 React callbacks (createEdge, placeNode, commitNewNode, renameNode, renameEdge, deleteShapes, drillDown, autoLayout). Set by useC4Diagram hook, read by store.deleteShapes and ContextMenu.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/pages/architecture.tsx [1-411] — C4 architecture page: same Canvas component, stores ephemeral C4 shapes, installs C4Bridge, blocks whiteboard shortcuts (s/t/d), clears store on unmount. Distinct from discovery: no useCanvasSync, no layer URL, no CanvasPanel.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/project-canvas-content.ts [1-29] — DB table: project_canvas_content (project_id, canvas_kind TEXT, snapshot JSONB, updated_at). Primary key (project_id, canvas_kind). canvas_kind is 'v2-whiteboard-<layer>' for the v2 engine.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/projects.ts [577-650] — GET/PUT /projects/:id/canvas/:kind — loads/saves canvas snapshot. Validates kind against FIXED_CANVAS_KINDS or v2-whiteboard-* prefix. PUT calls canvasBroadcast to push to WebSocket subscribers.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/tools/SelectTool.ts [1-519] — Select tool: hit-test with rotation, group expansion, marquee selection, drag/resize/rotate gesture handling, double-click to enter text editing. Manages resizeHandle corners + rotation handle at ROTATION_HANDLE_OFFSET=30px above top edge.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/components/SelectionLayer.tsx [1-110] — SVG overlay for selection highlights. Draws accent-color rect for each selected shape (skips connector and c4node types which draw their own). Single selection also gets 4 corner resize handles + rotation handle.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/CanvasSpecContext.tsx [1-34] — React context carrying the project spec (connection styles + element styles) for C4 rendering. Only provided by architecture.tsx via CanvasSpecContext.Provider; discovery canvas renders into EMPTY_CANVAS_SPEC (the default).
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/discovery/proposal-types.ts [1-44] — ProposalPayload union: LinkProposal (link two artifacts) | CaptureProposal (capture to decision/risk/feature). Used by DiscoverProposals component calling POST /api/projects/:id/discover.


============================== structured-c4 ==============================

--- summary ---
The architecture canvas is a custom hand-built system (`pages/architecture.tsx` → custom `Canvas.tsx` + Zustand store `useCanvasStore` + `useC4Diagram` hook) with fractional-index z-ordering, own undo stack, and custom shape types (`C4NodeShape`, `C4BoundaryShape`, `ConnectorShape`). URL pattern `/project/:id/architecture/:diagramId` — the `:diagramId` param is the active diagram slug or UUID; drilling calls `handleActiveChange` → `setLocation` to rewrite the URL. Lens state (`C4Lens = 'logical' | 'deployment'`) is persisted to DB via `diagram_layouts.c4Lens` column; changing it calls `PATCH /layout { c4Lens }` and then re-projects via `buildShapes(d, lens, drillableSlugs, boundaryOpts, draftedSet)` → `store.loadSnapshot(...)` (camera preserved). The drill stack is reconstructed from the diagram list on URL change via `buildStackForTarget`. The `C4BoundaryShape` is synthetic — derived from bounding boxes of inside nodes at render time, never persisted.

**Node-to-artifact linkage**: Every C4 node has a `slug` (the YAML node key, also its shape id = `"c4n_${slug}"`). Diagrams are addressed by slug (`filename without .yaml`), not UUID, because draft-only diagrams may have no DB row yet. `resolveDiagramRef` on the server handles UUID → DB lookup, slug → DB by path, and fallback → read from branch file.

**Draft vs inked rendering**: `C4SystemNode` reads `state: "drafted" | "inked" | "superseded"`. Drafted nodes get `borderStyle: dashed`, `borderWidth: 1.5`, ghost text color, a "Draft" dashed chip, and a drafter chip. Inked nodes are solid. Superseded nodes get `opacity: 0.55` and a "Superseded" chip. Edges also carry `drafted?: boolean` → `strokeDasharray: "5 4"`, coral stroke. Draft detection comes from `useBranchChanges(projectId)` providing `changedPaths: Set<string>` → `draftedSetFor(d)` maps changed paths to node ids.

--- dataModel ---
**diagram_layouts** table (`lib/db/src/schema/diagram-layouts.ts`):
- `id: uuid PK`
- `artifactId: uuid FK artifacts.id` (the diagram artifact's DB id)
- `projectId: uuid FK projects.id`
- `nodePositions: jsonb DEFAULT {}` — `Record<string, { x: number; y: number }>` keyed by node slug
- `viewport: jsonb` — `{ x, y, zoom }` camera state
- `autoLayoutStrategy: text`
- `c4Lens: text` — `'logical' | 'deployment' | null`; meaningful only on c4-container diagrams; null means default to 'logical' at render time

**canvas_objects** table (`lib/db/src/schema/artifacts.ts` lines 220-254):
- `id: uuid PK`
- `artifactId: uuid FK artifacts.id`
- `projectId: uuid FK projects.id`
- `positionX: real`, `positionY: real`
- `width: real`, `height: real`
- `color: text`, `collapsed: boolean`, `locked: boolean`
- `parentId: uuid self-ref` (explicit affinity group parent)
- `zIndex: integer`

**DiagramDetail** interface (ProjectCanvas.tsx):
- `id: string`, `title: string`, `createdAt: string`, `state: string`, `draftBranch: string | null`
- `diagram: { title: string, type: string, nodes: DiagramNodeRaw[], edges: DiagramEdgeRaw[] }`
- `resolvedNodes?: ResolvedDiagramNode[]`
- `layout: { nodePositions: Record<string, {x:number, y:number}> } | null`

**ResolvedDiagramNode** (ProjectCanvas.tsx):
- `id: string` (= slug), `slug: string`, `type: string`, `label: string`, `description?: string`
- `state: string` (`'drafted' | 'inked' | 'superseded'`)
- `version: number`, `draftBranch: string | null`, `artifactRefId: string | null`
- `isSystem: boolean`, `tags?: string[]`, `validationErrors?: ValidationIssue[]`

**C4NodeShape** extends BaseShape (`canvas/types.ts`):
- `type: 'c4node'`
- `slug: string`
- `nodeType: string` (system, actor, domain, container, component, database, etc.)
- `label: string`, `description?: string`
- `drillable?: boolean`, `drafted?: boolean`
- `validationErrors?: ValidationIssue[]`
- `artifactRefId?: string`, `isScope?: boolean`

**C4BoundaryShape** extends BaseShape (`canvas/types.ts`):
- `type: 'c4boundary'`
- `label: string`, `accent: string`
- Synthesized at projection time; `id = "c4_boundary"` — never persisted

**ConnectorShape** extends BaseShape (`canvas/types.ts`):
- `type: 'connector'`
- `sourceShapeId: ShapeId | null`, `targetShapeId: ShapeId | null`
- `edgeFrom: string`, `edgeTo: string` (source/target node slugs)
- `label?: string`, `category?: EdgeCategory`
- `lens?: EdgeLens` (`'logical' | 'deployment' | 'both'`)
- `laneOffset?: number`, `fanRole?: string`

**C4SystemData** props (C4SystemNode.tsx):
- `label: string`, `description?: string`, `nodeType: string`, `tags?: string[]`
- `state?: 'drafted' | 'inked' | 'superseded' | string | null`
- `drafter?: { actorType, actorId } | null`
- `drafts?: Array<{branch, actorType, actorId}>`
- `conflict?: boolean`
- `annotations?`, `annotationsVisible?`, `onToggleAnnotations?`, `onDismissAnnotation?`
- `author?: { authorKey, clientId?, label, lastTouchedAt? }`, `onFilterByAuthor?`
- `onDrillDown?: () => void`, `drillDownLabel?: string`
- `validationErrors?: ValidationIssue[]`

**DiagramDetailIn** (projectModel.ts):
- `diagram: { type: string, nodes: DiagramNodeIn[], edges: DiagramEdgeIn[] }`
- `layout: { nodePositions: Record<string,{x,y}>, c4Lens: string | null } | null`

**C4Frame** (useC4Diagram.ts):
- `diagramId: string`, `title: string`, `level: C4Level`

**C4Level** = `'context' | 'container' | 'component' | 'code'`

**DRILL_CHILD** map (useC4Diagram.ts): `{ system → container, domain → component, container → component, component → code, feature → code }`

**CUSTOM_NODE_TYPES** (ProjectCanvas.tsx): All keyed to C4SystemNode: system, actor, external-system, container, component, class, interface, function, database, domain, participant, user-requirement, system-requirement, feature, note, decision, question. Plus: entity → EntityNode, board → BoardNode, user-journey → JourneyContainerNode, system-boundary → SystemBoundaryNode.

**CUSTOM_EDGE_TYPES** (ProjectCanvas.tsx): `{ floating: FloatingEdge }`

**Lens filter sets** (ProjectCanvas.tsx):
- `LOGICAL_INSIDE = new Set(["domain"])`
- `DEPLOYMENT_INSIDE = new Set(["container","component","database","queue"])`
- `COMPONENT_INSIDE = new Set(["component","feature"])`
- `CODE_INSIDE = new Set(["class","interface","function"])`
- `ALWAYS_OUTSIDE = new Set(["external-system","actor"])`

--- apis ---
GET /api/projects/:projectId/diagrams — list diagrams (branch-aware, addressed by slug)
POST /api/projects/:projectId/diagrams — create diagram (delegates to create_diagram MCP tool)
GET /api/projects/:projectId/diagrams/:id — detail; :id = UUID or slug; resolveDiagramRef fallback to branch file for draft-only
PATCH /api/projects/:projectId/diagrams/:id/layout — upsert diagram_layouts row; body { nodePositions?, viewport?, c4Lens? }
POST /api/projects/:projectId/diagrams/:id/node — add node to YAML; requires draft branch
DELETE /api/projects/:projectId/diagrams/:id/node/:slug — remove node from YAML; requires draft branch
PATCH /api/projects/:projectId/diagrams/:id/node/:slug — rename node in YAML; requires draft branch
POST /api/projects/:projectId/diagrams/:id/edge — add edge to YAML; requires draft branch
DELETE /api/projects/:projectId/diagrams/:id/edge — remove edge from YAML; requires draft branch
PATCH /api/projects/:projectId/diagrams/:id/edge — rename edge in YAML; requires draft branch
GET /api/projects/:projectId/diagrams/:id/linked — linked diagrams (drill targets)
GET /api/projects/:projectId/canvas-objects?view=main — canvas object positions (discovery/boards)
PATCH /api/projects/:projectId/canvas-objects/:canvasObjectId — update positionX/positionY; body { positionX, positionY }
POST /api/projects/:projectId/canvas/arrange — auto-layout all canvas objects

CustomEvents (window):
  workspec:scope-updated — triggers diagram refetch in both canvas systems
  workspec:open-artifact-detail { slug } — opens right-sidebar artifact detail panel
  workspec:open-c4-element-editor { slug } — opens C4 element editor (System B only)
  workspec:node-hover { id } — activates edge flow animation on hover

React hooks:
  useCanvasStore() — Zustand singleton for System B canvas state
  useC4Diagram(projectId, { activeDiagramId, onActiveChange }) — System B drill stack + lens + shape projection
  use-active-c4-diagram — Zustand bridge for right-sidebar outside architecture page subtree
  getC4Bridge() / setC4Bridge(b) — module singleton for canvas mutation callbacks

--- integrationPoints ---
**Adding a new C4 node type:**
1. Add to `NODE_TYPE_COLOURS` and `NODE_TYPE_ICONS` in `/artifacts/workspec/src/components/diagrams/nodes/c4-node-types.ts`
2. Add to `CUSTOM_NODE_TYPES` in `ProjectCanvas.tsx` (map to `C4SystemNode` or a custom component)
3. If it has inside/outside semantics, add to the appropriate set (`LOGICAL_INSIDE`, `DEPLOYMENT_INSIDE`, etc.) in `ProjectCanvas.tsx` and mirror in `projectModel.ts` `buildShapes`
4. Add to the `DRILL_CHILD` map in `useC4Diagram.ts` if drillable
5. Add `labelForType` entry in `c4-node-types.ts`

**Adding a new drill level:** extend `C4Level` type, add route in `scope.tsx` / `architecture.tsx`, add case in `setArchitectureLevelUrl`, add `DRILL_CHILD` entry in `useC4Diagram.ts`, add a `use*Diagram` hook in `ProjectCanvas.tsx` following the existing pattern (slug convention, `workspec:scope-updated` listener, diagram-detail fetch).

**Mutating node positions (System A — scope canvas):**
- C4 diagram positions: `PATCH /api/projects/:projectId/diagrams/:diagramId/layout` body `{ nodePositions: Record<slug, {x,y}> }` — debounced 400ms after `onNodeDragStop`
- Discovery/board positions: `PATCH /api/projects/:projectId/canvas-objects/:canvasObjectId` body `{ positionX, positionY }`
- Auto-layout: `POST /api/projects/:projectId/canvas/arrange`

**Mutating node positions (System B — architecture canvas):**
- Store drag/resize end subscription in `useC4Diagram.ts` → `PATCH /api/projects/:projectId/diagrams/:diagramId/layout { nodePositions }`
- Boundary reflow: `_setShapesRaw` (bypasses undo stack) called from store subscription on shape change

**Mutating diagram content (both systems):**
- Add node: `POST /api/projects/:projectId/diagrams/:id/node`
- Remove node: `DELETE /api/projects/:projectId/diagrams/:id/node/:slug`
- Rename node: `PATCH /api/projects/:projectId/diagrams/:id/node/:slug`
- Add edge: `POST /api/projects/:projectId/diagrams/:id/edge`
- Remove edge: `DELETE /api/projects/:projectId/diagrams/:id/edge`
- Rename edge: `PATCH /api/projects/:projectId/diagrams/:id/edge`
- In System B, these are all invoked through the `c4Bridge` singleton — call `getC4Bridge()` to access the bound callbacks

**Lens switching:**
- System A: `setContainerLens('logical' | 'deployment')` — local React state, re-renders in-place
- System B: `setLens('logical' | 'deployment')` from `useC4Diagram` return — calls `PATCH /layout { c4Lens }` then `buildShapes` re-projection → `store.loadSnapshot`

**Canvas refresh signal:** dispatch `new CustomEvent('workspec:scope-updated')` on `window` to trigger diagram refetch in both systems.

**Opening artifact detail panel:** dispatch `new CustomEvent('workspec:open-artifact-detail', { detail: { slug } })` — consumed by the right-sidebar panel.

**Opening element editor (System B):** dispatch `new CustomEvent('workspec:open-c4-element-editor', { detail: { slug } })`.

**c4Bridge installation:** `setC4Bridge(bridge)` in `useC4Diagram.ts` effect (on mount, cleared on unmount). Any code needing to trigger canvas mutations calls `getC4Bridge().methodName(...)`.

**Draft-only diagrams:** `resolveDiagramRef` in `artifacts/api-server/src/routes/diagrams.ts` — if slug lookup finds no DB row, it falls through to read directly from the branch file. Canonical slugs: component diagrams = `component-${domainSlug}`, code diagrams = `code-${componentSlug}`.

**Adding a new canvas view type:** add to `SYSTEM_VIEW_TYPES` in `lib/db/src/schema/canvas-views.ts`, add to view-registry in `artifacts/api-server/src/services/view-registry.ts`, add routing case in `scope.tsx`.

--- risks ---
**Two-system divergence:** System A (React Flow / scope page) and System B (custom canvas / architecture page) are parallel implementations of C4 rendering. Features added to one are NOT automatically present in the other. Lens persistence is a concrete example: System A uses ephemeral React state; System B persists to `diagram_layouts.c4Lens`. Any new lens or view-mode work must be applied to both or explicitly scoped to one.

**Slug-vs-UUID addressing:** `diagram_layouts.artifactId` is a UUID FK, but `nodePositions` is keyed by node slug. `resolveDiagramRef` accepts both UUID and slug but has a fallback for draft-only files. Code that constructs layout PATCH requests must use the diagram's DB id (UUID) for the URL parameter and node slugs for the `nodePositions` keys — mixing these will silently produce wrong layouts.

**Draft-only diagrams have no DB row:** A freshly seeded container or code diagram lives only on the branch until first commit. `resolveDiagramRef` handles this by reading from the branch file directly, but any code path that does a plain DB lookup by slug will get null. The `markOptimisticDiagramSlug` 4s suppression in `ProjectCanvas.tsx` prevents orphan shelf flicker for just-created diagrams.

**C4BoundaryShape is synthetic and stateless:** The system boundary in System B is derived at projection time from the bounding boxes of inside nodes. It is never stored in `diagram_layouts.nodePositions`. Moving boundary nodes only works by moving all contained nodes — there is no persisted boundary position.

**`_setShapesRaw` bypasses undo:** Boundary reflow in System B calls `_setShapesRaw` directly, meaning boundary shape changes do not enter the undo stack. If an implementation adds boundary-affecting operations to the undo stack, it must also handle boundary re-derivation on undo.

**Canvas objects table vs diagram layouts:** `canvas_objects` (positionX/Y) is for the discovery/board view; `diagram_layouts.nodePositions` is for C4 YAML-backed diagrams. The two tables serve different purposes. `canvas_object_layouts` is a third per-view position override table that overrides canvas_objects anchor positions for specific views — do not confuse these three.

**`requireDraftBranch` guard on canvas edits:** All mutation routes (add/remove/rename node or edge) return 409 if the caller is on main. Any canvas editing feature must either create/target a draft branch or explicitly handle the 409.

**`workspec:scope-updated` CustomEvent coupling:** Both canvas systems refresh on this global event. Any server-side write that changes diagram content should dispatch this event on the client side, but nothing enforces this contract. Missing dispatches lead to stale canvases without error.

**Lens filter sets must be kept in sync between both systems:** `LOGICAL_INSIDE`, `DEPLOYMENT_INSIDE`, etc. in `ProjectCanvas.tsx` and the equivalent filtering in `projectModel.ts` `buildShapes`. Adding a new node type that has inside/outside semantics requires updating both files independently.

**Node width/height constants:** System A uses 300px × 110px constants for dagre layout calculations. These match measured DOM dimensions of `C4SystemNode`. If the node card dimensions change (padding, font size, description wrapping), the dagre layout will produce incorrect spacing.

--- keyFiles ---
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/pages/architecture.tsx [1-120] — Dedicated architecture page. Mounts custom Canvas engine. URL: /project/:id/architecture/:diagramId. Hosts useC4Diagram hook, C4Toolbar (breadcrumb + lens toggle), C4ElementEditor panel, PrOverlayProvider.
  /Users/brettsmith/GitHub/workspec/.claire/worktrees/elegant-banzai-357ede/artifacts/workspec/src/pages/scope.tsx [1-150] — Main scope page mounting ProjectCanvas (React Flow). URL-routing to architecture drill levels. setArchitectureLevelUrl builds path and calls setLocation.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/project/ProjectCanvas.tsx [1-3512] — 3500-line React Flow canvas. Defines all node/edge types, DiagramDetail/ResolvedDiagramNode interfaces, toReactFlow converter, all four diagram-level hooks (useSystemContextDiagram, useContainerDiagram, useComponentDiagram, useCodeDiagram), lens state, drill callbacks, layout persistence, position debounce.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/hooks/useC4Diagram.ts [1-400] — Used only by architecture.tsx. Manages drill stack, lens (persisted), URL-mirrored diagramId, c4Bridge installation, position persistence via store subscription, boundary reflow subscription, draft detection via useBranchChanges.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/c4/projectModel.ts [1-300] — buildShapes(detail, lens, drillableSlugs?, boundary?, draftedSlugs?) → ProjectionResult. nodeShapeId/edgeShapeId conventions. filterEdgesByLens. Z-order assignment. Dagre layout fallback for unsaved positions.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/types.ts [1-150] — C4NodeShape, C4BoundaryShape, ConnectorShape, EdgeLens, EdgeCategory, ToolName type definitions.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/store.ts [1-200] — useCanvasStore Zustand singleton. camera, shapes, selectedIds, history. loadSnapshot (replaces + clears undo), _setShapesRaw (bypass undo), _executeCommand.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/canvas/tools/c4Bridge.ts [1-60] — Module-level bridge singleton. C4Bridge interface: createEdge, placeNode, commitNewNode, renameNode, renameEdge, deleteShapes, drillDown, autoLayout. Installed by useC4Diagram effect.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/diagrams/nodes/C4SystemNode.tsx [1-300] — Card node for all C4 types. C4SystemData interface. Drafted (dashed border, Draft chip, drafter chip), inked (solid), superseded (opacity 0.55). Drill-down button, validation icons, workspec:open-artifact-detail dispatch.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/diagrams/nodes/c4-node-types.ts [1-80] — NODE_TYPE_COLOURS, NODE_TYPE_ICONS, CARD_SURFACE, labelForType. Per-type accent hex values.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/diagrams/nodes/SystemBoundaryNode.tsx [1-80] — Non-interactive spotlight overlay. 9999px box-shadow. pointer-events: none. label chip at top-left.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/diagrams/edges/FloatingEdge.tsx [1-250] — FloatingEdgeData interface. getEdgeParams bounding-box intersection geometry. getSmoothStepPath with borderRadius 12. Custom arrow. Drafted dashes. Hover flow animation.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/diagrams.ts [1-400] — All diagram REST routes. GET list, POST create, GET detail (resolveDiagramRef handles slug+UUID+draft-only), PATCH layout, POST/DELETE/PATCH node, POST/DELETE/PATCH edge, GET linked. requireDraftBranch guard.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/diagram-layouts.ts [1-40] — diagram_layouts table. artifactId FK, nodePositions JSONB (Record<slug, {x,y}>), viewport JSONB, c4Lens text.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/artifacts.ts [220-254] — canvas_objects table (positionX, positionY, width, height, parentId, zIndex). Used for discovery/board positions.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/canvas-views.ts [1-116] — canvas_views table. SYSTEM_VIEW_TYPES enum. Note: logical/deployment are deprecated as first-class views — they are now lenses on the container view.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/hooks/use-active-c4-diagram.ts [1-40] — Zustand bridge exposing { projectId, diagramId, editable, orphans } to the right-sidebar Elements tab outside the architecture page React subtree.


============================== data-api ==============================

--- summary ---
**Artifact placement and canvas position system**

WorkSpec stores artifact placements across three hierarchical DB tables. `canvas_objects` (schema/artifacts.ts, lines 220–253) is the anchor/default position for every artifact: one row per artifact per project, columns `positionX real`, `positionY real`, `width real`, `height real`, `color text`, `collapsed boolean`, `locked boolean`, `parentId uuid` (self-ref, SET NULL on delete), `zIndex integer`. `canvas_object_layouts` (schema/canvas-object-layouts.ts, lines 28–67) layers per-view overrides keyed by `(viewId, artifactId, userId?)` — shared layout when `userId IS NULL`, personal when set. At read time the graph endpoint resolves layout → anchor → (0,0) fallback. `diagram_layouts` (schema/diagram-layouts.ts) handles C4 diagram node positions separately as `nodePositions jsonb` plus `viewport jsonb`, `autoLayoutStrategy text`, `c4Lens text`.

**Draft/ink lifecycle — the design is entirely branch-derived, not column-derived**

There is no `state`, `lifecycle`, `drafted`, or `inked` column on `artifacts`. The schema comment at artifacts.ts line 33–34 is explicit: "lifecycle (drafted/inked/superseded) is derived from the branch the YAML lives on, not stored as a column." An artifact's YAML living only on a draft branch = drafted. After `publishBranch` merges the draft branch to main via git, the YAML on main = inked. The `commit_artifacts` table records `fromState` / `toState` as `'drafted' | 'present' | 'absent'` (commits.ts lines 95–121) — this is an audit trail of the merge event, not a live state column. `commit_drafts` / `commit_draft_artifacts` (commit-drafts.ts) implement the staged-commit pattern: the agent writes a `commit_drafts` row (no git op); the human clicks Commit → git commit is made → row deleted. `project_branch_contexts` (branch-contexts.ts) maps each actor to their current draft branch. `viewerAndBranch()` in branch-context.ts is the single read-path entry point: resolves a user → Actor → their current branch → passes it as `branchOverride` to all YAML reads.

**Lens/view system**

`canvas_views` holds system views (seeded per project, kind='system', userId NULL) and saved views (kind='saved', userId required). Registry keys live in `view-registry.ts`: `discovery`, `system-context`, `container` (deprecated), `work`, `data-dictionary`, `journeys`, `data-flow`, `structure`/`logical`/`deployment` (deprecated). The `container` view exposed a `lenses` array (`logical` | `deployment`) with per-lens `allowedTypes`. The `/projects/:id/views/:viewKey/graph` endpoint returns artifacts + links + a `layouts` array (layout override → anchor fallback → default), `source: "view" | "anchor" | "default"`.

**Where reworking/contested flags and per-lens offsets could live**

No `reworking` / contested transient flag exists today. The closest existing patterns are: (a) the `annotations` table (annotations.ts) — per-artifact agent annotations with `chipLabel`, `body`, `dismissedBy`; this is the current non-blocking flag mechanism. (b) Adding a `reworking boolean` column to `canvas_objects` or `canvas_object_layouts` — the former makes it global across views, the latter makes it per-view. For a per-lens position offset (`lensOffset`), `canvas_object_layouts` is the correct fit: a `lensKey text` column added to it (alongside the existing `viewId`) would store overrides per `(viewId, lensKey, artifactId, userId?)` — the table already has the partial-unique-index pattern needed. Alternatively a `lens_offsets jsonb` column on `diagram_layouts` could hold per-lens delta offsets for diagram nodes.

--- dataModel ---
**`artifacts` table** (lib/db/src/schema/artifacts.ts:35)
- `id uuid PK`
- `project_id uuid FK→projects` (null for workspace-tier personas)
- `workspace_id uuid FK→workspaces` (null for project-tier; XOR check enforced)
- `type text NOT NULL` (closed enum via CHECK, see ALL_ARTIFACT_TYPES)
- `artifact_path text NOT NULL` (e.g. `.workspec/domains/billing.yaml`)
- `created_at timestamptz`, `updated_at timestamptz`
- **No lifecycle column** — state is branch-derived

**`artifact_search` table** (lib/db/src/schema/artifact-search.ts:11)
- `artifact_id uuid PK FK→artifacts`
- `title text NOT NULL`, `slug text`, `summary text`
- `search_vector tsvector NOT NULL`
- `updated_at timestamptz`

**`canvas_objects` table** (anchor positions, lib/db/src/schema/artifacts.ts:220)
- `id uuid PK`
- `artifact_id uuid NOT NULL FK→artifacts`
- `project_id uuid NOT NULL FK→projects`
- `position_x real NOT NULL DEFAULT 0`
- `position_y real NOT NULL DEFAULT 0`
- `width real`, `height real`
- `color text`
- `collapsed boolean NOT NULL DEFAULT true`
- `locked boolean NOT NULL DEFAULT false`
- `parent_id uuid FK→canvas_objects (self-ref, ON DELETE SET NULL)`
- `z_index integer NOT NULL DEFAULT 0`
- `created_at timestamptz`, `updated_at timestamptz`

**`canvas_object_layouts` table** (per-view overrides, lib/db/src/schema/canvas-object-layouts.ts:28)
- `id uuid PK`
- `view_id uuid NOT NULL FK→canvas_views (ON DELETE CASCADE)`
- `artifact_id uuid NOT NULL FK→artifacts (ON DELETE CASCADE)`
- `user_id uuid FK→users (ON DELETE CASCADE)` — null = shared default
- `position_x real NOT NULL DEFAULT 0`
- `position_y real NOT NULL DEFAULT 0`
- `width real`, `height real`
- `collapsed boolean NOT NULL DEFAULT true`
- `parent_layout_id uuid FK→canvas_object_layouts (self-ref, ON DELETE SET NULL)`
- `z_index integer NOT NULL DEFAULT 0`
- `created_at timestamptz`, `updated_at timestamptz`
- Two partial unique indexes: `(view_id, artifact_id) WHERE user_id IS NULL` and `(view_id, artifact_id, user_id) WHERE user_id IS NOT NULL`

**`canvas_views` table** (lib/db/src/schema/canvas-views.ts:64)
- `id uuid PK`
- `project_id uuid NOT NULL FK→projects`
- `user_id uuid FK→users` — null for system views
- `kind text NOT NULL DEFAULT 'saved'` — enum: 'system' | 'saved'
- `view_type text` — registry key (discovery, system-context, etc.)
- `title text NOT NULL`, `slug text NOT NULL`
- `hidden_types text[]`, `layout_strategy text`
- `viewport_x real`, `viewport_y real`, `viewport_zoom real`
- `is_default boolean NOT NULL DEFAULT false`
- CHECK: `(kind = 'system' AND user_id IS NULL) OR (kind = 'saved' AND user_id IS NOT NULL)`

**`diagram_layouts` table** (lib/db/src/schema/diagram-layouts.ts:7)
- `id uuid PK`
- `artifact_id uuid NOT NULL FK→artifacts`
- `project_id uuid NOT NULL FK→projects`
- `node_positions jsonb NOT NULL DEFAULT {}`
- `viewport jsonb`, `auto_layout_strategy text`, `c4_lens text`

**`branches` table** (lib/db/src/schema/branches.ts:4)
- `id uuid PK`, `project_id uuid FK→projects`, `name text NOT NULL`
- Unique on `(project_id, name)`

**`project_branch_contexts` table** (lib/db/src/schema/branch-contexts.ts:31)
- `id uuid PK`
- `project_id uuid NOT NULL FK→projects`
- `actor_type text NOT NULL` — 'human' | 'agent'
- `actor_id text NOT NULL` — users.id as text, or MCP clientId
- `served_user_id text` — for agent rows
- `current_branch text NOT NULL`
- Unique on `(project_id, actor_type, actor_id)`

**`commit_drafts` table** (lib/db/src/schema/commit-drafts.ts:31)
- `id uuid PK`, `project_id uuid FK`, `branch_name text NOT NULL`, `comment text NOT NULL`
- `drafted_by_actor_id text`, `drafted_by_actor_type text`, `drafted_by_actor_name text`

**`commit_draft_artifacts` table** (composite PK: commit_draft_id, artifact_id)

**`commits` table** (lib/db/src/schema/commits.ts:30)
- `id uuid PK`, `project_id uuid FK`, `summary text`, `body text`
- `drafted_by_actor_id text`, `drafted_by_actor_type text`, `drafted_by_actor_name text`
- `published_by_user_id uuid FK→users`
- `git_commit_sha text`, `is_phase_transition boolean`

**`commit_artifacts` table** (lib/db/src/schema/commits.ts:95)
- `commit_id uuid FK→commits`, `artifact_id uuid FK→artifacts`
- `from_state text` — 'drafted' | 'present' | 'absent'
- `to_state text` — same enum

**`canvas_groups` table** + **`canvas_group_members`** (lib/db/src/schema/canvas-groups.ts)
- Groups: boundaryX/Y/Width/Height real, boundaryStyle text, color text, padding real, locked boolean
- Members: unique per artifact_id (one group per artifact in v1)

**`annotations` table** (lib/db/src/schema/annotations.ts:29)
- `artifact_id uuid FK`, `project_id uuid FK`, `author text`, `chip_label text`, `body text`
- `dismissed_by uuid FK→users`, `dismissed_at timestamptz`
- `conversation_message_id uuid` (for chat-turn linkage)

**`artifact_links` table** (lib/db/src/schema/artifacts.ts:180)
- `id uuid PK`, `project_id uuid FK`, `source_id uuid FK→artifacts`, `target_id uuid FK→artifacts`
- `link_type text NOT NULL` (closed enum CHECK against DEFINED_LINK_TYPES)
- `cardinality jsonb` — only for entity-relates-to-entity links: `{ from, to, label? }` with multiplicity strings

--- apis ---
**Canvas object positions (anchor layer)**
- `GET /projects/:projectId/canvas-objects` — list all canvas objects with view filter (`?view=main|discovery|data-dictionary|persona|domain|feature|journeys`). Branch-aware YAML override for titles. Returns: id, artifactId, positionX/Y, width, height, color, collapsed, locked, parentId, zIndex, artifact.{type, title, summary, path}
- `PATCH /projects/:projectId/canvas-objects/:canvasObjectId` — update anchor position/state. Body: positionX, positionY, collapsed, locked, parentId, zIndex (all optional)
- `POST /projects/:projectId/canvas/arrange` — AI auto-layout via Haiku. Body: view, artifactIds[]

**v4 WS-2 view engine (per-view layouts)**
- `GET /projects/:projectId/views` — list system + saved views with registry definitions, lenses, gatedBy
- `GET /projects/:projectId/views/:viewKey/graph` — project artifact graph through view. Returns: view{}, artifacts[], links[], layouts[{artifactId, positionX, positionY, width, height, collapsed, parentId, zIndex, source:'view'|'anchor'|'default'}]
- `PUT /projects/:projectId/views/:viewKey/layouts` — bulk upsert canvas_object_layouts. Body: personal boolean, layouts[{artifactId, positionX, positionY, width?, height?, collapsed?, parentLayoutId?, zIndex?}]

**Artifact content (YAML layer, branch-aware)**
- `GET /projects/:projectId/artifacts/:artifactId/content` — read YAML from viewer's current branch
- `PUT /projects/:projectId/artifacts/:artifactId/content` — write YAML to draft branch (409 if no branch). Body: title, description
- `GET /projects/:projectId/artifacts` — list with `?type=` filter, branch-reconciled for type-filtered queries
- `POST /projects/:projectId/artifacts` — create artifact + canvas object. Body: type, title, description
- `GET /artifacts/:artifactId/history` — ops_log entries that touched this artifact

**Diagrams (layout layer)**
- `GET /projects/:projectId/diagrams` — branch-aware list
- `GET /projects/:projectId/diagrams/:artifactId` — full diagram with resolved nodes, layout, yamlRaw
- `PATCH /projects/:projectId/diagrams/:artifactId/layout` — save node positions + viewport + c4Lens (calls move_diagram_nodes + set_diagram_view MCP tools)
- Node/edge CRUD: POST/PATCH/DELETE `/diagrams/:id/node/:nodeId`, POST/PATCH/DELETE `/diagrams/:id/edge`, POST `/diagrams/:id/attach`

**Draft/publish lifecycle**
- `POST /projects/:projectId/publish` — merge draft branch to main (publishBranch service)
- `POST /projects/:projectId/discard-draft` — discard branch
- `POST /projects/:projectId/draft-branches/:branch/commit` — commit working scratch to branch
- `GET/POST /projects/:projectId/staged-commits` — list/commit/discard agent-staged commits
- `GET /projects/:projectId/draft-commits` — list commits ahead of main on all draft branches
- `POST /projects/:projectId/draft-branches/:branch/update-from-main` — pull latest main into draft branch

**Saved views (legacy, kind='saved' only)**
- `GET/POST /projects/:projectId/canvas-views` — list/create saved views
- `PATCH /projects/:projectId/canvas-views/:viewId` — update saved view
- `DELETE /projects/:projectId/canvas-views/:viewId` — delete saved view

**Context/state hooks**
- `viewerAndBranch(projectId, userId)` in services/branch-context.ts — resolves viewer actor + current draft branch for HTTP handlers
- `requireBranchForActor(projectId, actor)` — mutation gate (throws for agents without a branch)
- `resolveViewForProject(projectId, key)` in services/views.ts — resolves viewKey (uuid|slug|viewType) to canvas_views row

--- integrationPoints ---
**Adding a per-element transient flag (e.g. `reworking`)**

Option A — `canvas_objects` column: Add `reworking boolean NOT NULL DEFAULT false` to `artifactsTable`'s sibling `canvasObjectsTable`. Schema file: lib/db/src/schema/artifacts.ts, after `zIndex` (line 241). This makes the flag global (same across all views). PATCH endpoint at artifacts.ts:541 already spreads arbitrary body fields — add `reworking` to the destructure and `...(reworking !== undefined && { reworking })` to the update set.

Option B — `canvas_object_layouts` column: Add `reworking boolean NOT NULL DEFAULT false` to `canvasObjectLayoutsTable` in lib/db/src/schema/canvas-object-layouts.ts. This makes the flag per-view. The `PUT /views/:viewKey/layouts` endpoint (routes/views.ts:259) already handles bulk layout upserts — extend `LayoutInput` Zod schema (line 244) and the values object (line 327).

**Adding a per-lens position offset (`lensOffset`)**

`diagramLayoutsTable` is the right home for per-lens position data. The `c4Lens` column already stores the active lens. For per-lens offsets: add `lens_offsets jsonb` to `diagram_layouts` as `{ [lensKey: string]: { [nodeId: string]: { dx: number; dy: number } } }`. The `PATCH /projects/:id/diagrams/:id/layout` endpoint in routes/diagrams.ts:833 already passes through `c4Lens` via `set_diagram_view` MCP tool. Extend the request body and the `move_diagram_nodes` / `set_diagram_view` tool handlers in `artifacts/api-server/src/mcp/tools/`.

Alternatively, extend `canvas_object_layouts` with a `lens_key text` column — change the unique indexes to include `lens_key`, giving `(view_id, artifact_id, lens_key) WHERE user_id IS NULL` and `(view_id, artifact_id, lens_key, user_id) WHERE user_id IS NOT NULL`. The `/views/:viewKey/layouts` endpoint would then accept an optional `lensKey` field in each layout item.

**Migration workflow** (confirmed from package.json + migrate.ts)

1. Edit schema in `lib/db/src/schema/`
2. Run `pnpm --filter @workspace/db run generate` — writes `lib/db/migrations/NNNN_<slug>.sql`
3. Add the new journal entry to `lib/db/migrations/meta/_journal.json` (idx, version "7", when, tag, breakpoints true) — current head idx is 35
4. Run `pnpm --filter @workspace/db run migrate` — applies via the custom best-effort runner that tolerates "already exists" errors

**OpenAPI + codegen** (CLAUDE.md)

1. Edit `lib/api-spec/openapi.yaml` — add new path or schema
2. Run `pnpm --filter @workspace/api-spec run codegen` — regenerates `lib/api-client-react` and `lib/api-zod`
3. Implement the route in `artifacts/api-server/src/routes/`

**Route registration** — routes are registered in `artifacts/api-server/src/routes/index.ts`. New routes need to be mounted there.

**MCP tool pattern** — MCP tools live in `artifacts/api-server/src/mcp/tools/` and are invoked via `callTool()` in `routes/_adapter.ts`. The diagram routes already use this pattern: `callTool("move_diagram_nodes", ..., ctx)` and `callTool("set_diagram_view", ..., ctx)`.

--- risks ---
**Lifecycle is branch-derived, not column-derived — any implementation treating state as a DB column will break.** The `artifacts` table has no `state`, `lifecycle`, `drafted`, or `inked` column. Tests, tooling, and new features must read artifact state by comparing the YAML file's presence on main vs. a draft branch. `commit_artifacts.from_state / to_state` are audit records of the merge event, not a queryable live state.

**`canvas_object_layouts` is not in the drizzle.config.ts tablesFilter.** The `drizzle.config.ts` tablesFilter (at lib/db/drizzle.config.ts) does NOT include `canvas_object_layouts`, `canvas_views`, `diagram_layouts`, or `branches`. These tables exist and are functional, but `drizzle-kit push` will not manage them. All schema changes to these tables MUST go through `generate` + the migration file + `_journal.json` + `migrate` script — never `drizzle-kit push`.

**Draft-only diagrams have no DB row and no persistable layout.** `diagram_layouts` is keyed by `artifact_id` (UUID), which a draft-only diagram on a branch doesn't have. The `PATCH /diagrams/:id/layout` route (diagrams.ts:858) explicitly echoes back an ephemeral no-op for unregistered diagrams. Any layout persistence feature must ensure the artifact is ingested first.

**Personal vs shared layout split.** The `PUT /views/:viewKey/layouts` endpoint uses `scopedUserId = parsed.data.personal ? userId : null`. The two partial unique indexes enforce at most one row per (view, artifact) combination per scope. Adding a `lensKey` dimension to `canvas_object_layouts` requires rebuilding both partial unique indexes — the migration must `DROP INDEX` before `CREATE UNIQUE INDEX` if adding lensKey after the fact.

**Branch context absence = writes fall through to main for humans.** `requireBranchForActor` (branch-context.ts) only throws for `actor.type === "agent"` — human mutations without a branch context silently write to main. Any feature that stages transient flags (e.g. `reworking`) needs to be aware that human edits will land on main unless a draft branch is explicitly created.

**`artifact_links.link_type` is a closed enum enforced by a DB CHECK constraint.** Adding a new link type (e.g. for a `contested` relationship) requires editing `DEFINED_LINK_TYPES` in artifacts.ts AND regenerating the CHECK SQL via `drizzle-kit generate`. The existing constraint SQL is derived from the TS array at schema generation time.

**`canvas_groups` enforces one group per artifact** via `uniqueIndex("canvas_group_members_artifact_idx").on(t.artifactId)`. Venn-overlap (artifact in multiple groups) is explicitly deferred. Any rework-flagging that uses groups as the backing store hits this constraint.

**`drizzle-kit generate` uses the `tablesFilter` from drizzle.config.ts.** Several tables that exist in schema/index.ts are NOT in the filter (canvas_object_layouts, canvas_views, diagram_layouts, branches, project_branch_contexts, commit_drafts, annotations, artifact_search, slices, etc.). Generating migrations on those tables requires temporarily adding them to the filter or using a separate config.

--- keyFiles ---
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/artifacts.ts [35-77, 220-253] — Defines `artifactsTable` (id, projectId, workspaceId, type, artifactPath, createdAt, updatedAt — NO lifecycle column), `artifactLinksTable` with DEFINED_LINK_TYPES, and `canvasObjectsTable` (anchor positions: positionX, positionY, width, height, color, collapsed, locked, parentId, zIndex)
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/canvas-object-layouts.ts [1-81] — Per-view artifact position overrides: `canvas_object_layouts` keyed by (viewId, artifactId, userId?). Shared default when userId IS NULL, personal override when set. Fields: positionX, positionY, width, height, collapsed, parentLayoutId (self-ref), zIndex. Two partial unique indexes enforce one-row-per-combination invariants.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/canvas-views.ts [1-116] — Defines `canvas_views` (id, projectId, userId, kind, viewType, title, slug, hiddenTypes, layoutStrategy, viewport*, isDefault). SYSTEM_VIEW_TYPES enum. Kind XOR check.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/diagram-layouts.ts [1-39] — Per-diagram node position store: `diagram_layouts` with nodePositions jsonb, viewport jsonb, autoLayoutStrategy text, c4Lens text. Keyed by artifactId (UUID of the diagram artifact).
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/commits.ts [30-126] — Publish audit: `commits` table (summary, body, draftedByActor*, publishedByUserId, gitCommitSha, isPhaseTransition). `commit_artifacts` records fromState/toState as 'drafted'|'present'|'absent' — NOT a live lifecycle column.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/commit-drafts.ts [1-95] — Agent staged-commit pattern: `commit_drafts` (branchName, comment, draftedBy*) + `commit_draft_artifacts` join table. Agent creates the row; human commits to git; row is deleted. No git op until human approves.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/branch-contexts.ts [1-73] — Per-actor branch context: `project_branch_contexts` (projectId, actorType, actorId, servedUserId, currentBranch). Unique on (projectId, actorType, actorId). This is how draft lifecycle is tracked — which branch an actor is writing to.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/annotations.ts [1-69] — Per-artifact agent/lead annotations: chipLabel text, body text, dismissedBy uuid. Current mechanism for attaching transient flags visible on the canvas. Closest existing pattern to a 'reworking' flag.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/canvas-groups.ts [1-58] — Visual-affinity group boxes: `canvas_groups` (boundaryX/Y/Width/Height, boundaryStyle, color, padding, locked) + `canvas_group_members` with unique per-artifact constraint.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/artifacts.ts [251-604, 1210-1360, 1362-1476] — HTTP routes: GET /projects/:id/canvas-objects (view-filtered, branch-aware), PATCH /canvas-objects/:id (positionX, positionY, collapsed, locked, parentId, zIndex), POST /projects/:id/canvas/arrange (Haiku AI layout), GET/PUT /artifacts/:id/content (branch-aware YAML read/write). Also CRUD for canvas-views (saved kind only).
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/views.ts [1-346] — v4 WS-2 view engine: GET /views (list), GET /views/:viewKey/graph (artifacts+links+layouts with anchor fallback), PUT /views/:viewKey/layouts (bulk upsert canvas_object_layouts). This is the canonical position-save path for the multi-view canvas.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/diagrams.ts [333-928] — Diagram HTTP surface: GET/POST/PATCH for diagrams, PATCH /diagrams/:id/layout (nodePositions → move_diagram_nodes, viewport+c4Lens → set_diagram_view MCP tools), node/edge CRUD. Branch-aware reads. draft-only diagrams are ephemeral (no layout persistence).
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/publish.ts [1-525] — Branch lifecycle HTTP surface: POST /publish (publishBranch), POST /discard-draft, POST /promote, /draft-branches/:branch/commit, /update-from-main, /pull-request, DELETE /draft-branches/:branch, GET/POST /staged-commits/:id/commit|discard.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/services/branch-context.ts [1-280] — viewerAndBranch() — the single read-path entry point resolving userId→Actor→currentBranch. requireBranchForActor() — the mutation gate (agents must have a branch; humans bypass). getBranchForActor / setBranchForActor / clearBranchForAllActors.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/services/view-registry.ts [44-360] — ViewDefinition interface: allowedTypes, lenses (for container view), defaultLens, gatedBy. VIEW_REGISTRY map. SYSTEM_VIEWS_TO_SEED. Lens pattern for container view: two lenses (logical/deployment) each with their own allowedTypes.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/services/publish.ts [263-530] — publishBranch(): git merge → DB commit row + commit_artifacts (fromState='drafted', toState='present') → ingestPath on main → delete branch → clear branch_contexts. This is the drafted→inked transition.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/api-spec/openapi.yaml [848-878, 2840-2999] — API spec owning all generated clients. Relevant schemas: SaveViewLayoutsInput (lines 2840-2874), PublishedArtifactRow fromState/toState enum (2894-2906), CommitArtifactRow (2948-2965), PublishDraftsBody (2876-2892). Path: PUT /projects/{projectId}/views/{viewKey}/layouts (line 848).
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/migrations/meta/_journal.json [1-999] — Migration journal. Current head: idx=35, tag=0035_oauth_clients. New migrations must add an entry here after running pnpm --filter @workspace/db run generate.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/projects.ts [1-178] — DISCOVERY_ARTIFACT_TYPES and DELIVERY_ONLY_ARTIFACT_TYPES arrays — the closed enum for artifact types. Phase-gating logic. projectsTable schema (branchName, promotedAt, requireReviewApproval).


============================== atlas-proposals ==============================

--- summary ---
The AI/proposals machinery in WorkSpec spans three distinct subsystems that are loosely coupled but share the right-sidebar rail as the primary surface.

**Proposals subsystem (discovery canvas):** `ProposalProvider` at `artifacts/workspec/src/components/discovery/ProposalContext.tsx` owns a React-only in-memory state machine. Proposals are generated by `POST /api/projects/:projectId/discover` (route: `artifacts/api-server/src/routes/discover.ts`), which calls Claude synchronously with a system prompt and returns JSON. The trigger is a `workspec:scope-updated` custom DOM event (fired by note/clipping/question artifact mutations) debounced 1500ms in a non-rendering `DiscoverProposals` component in `scope.tsx` (lines 23–78). State transitions: `pending → confirmed` (accept) or removed with tombstone key added to `rejectedPairs` Set (reject). Dismissal is NOT persisted to the DB — `rejectedPairs` is in-memory Set, serialized to the `POST /discover` body as `rejectedPairs: string[]` to suppress server-side re-proposals within the session. On page reload, dismissed proposals reappear (no DB tombstone). `ProposalPanel.tsx` consumes `useProposals()` and renders two sections: Pending (with Accept/Capture… buttons) and Confirmed. Accept transitions state; Capture opens `CaptureComposer` overlay which on save calls `acceptProposal`.

**Atlas co-author surface:** A second, independent subsystem built around `AtlasTurnContext.tsx` (provider) + `useAtlasTurn` hook + `CoAuthorSurface` component. The context is mounted as a sibling of `ProposalProvider` in `scope.tsx` (lines 668–669). `CoAuthorSurface` appears as a `composerOverlay` prop inside `DiscoverySidebar` when `atlasTurn.state.isInFlight` is true AND `chatMode` is `single-hosted` or `multi-hosted`. The surface renders a ledger of `AtlasStep` rows (goal → tool → draft → note kinds), a live pulse indicator, and a Cancel button. Steps are driven step-by-step (not token-by-token) from `atlas_step` NDJSON events on the conversation stream, parsed in `DiscoverySidebar`'s `handleSend` at line 1173. The step deriver lives server-side at `artifacts/api-server/src/services/atlas-steps.ts` (`AtlasStepDeriver` class). The canvas also reads `draftedArtifactIds` from the context state for node pulsing.

**Claude sidebar (right-sidebar tab):** Completely separate channel via `POST /api/sidebar/messages` (SSE/EventSource, not NDJSON). Route: `artifacts/api-server/src/routes/sidebar.ts` backed by `artifacts/api-server/src/sidebar/sidebarAgent.ts`. This uses the LucidBrain SDK's managed-agent infrastructure (`ensureSessionForConversation` / `postUserMessage` / `openSessionEventStream`). Streams SSE events: `init`, `text`, `tool_use`, `tool_result`, `done`, `error`. Tools execute via `executeToolCall` against the project artifact graph.

**Mock-agent route:** `artifacts/api-server/src/routes/mock-agent.ts` exposes `GET /mock-agent/pending`, `POST /mock-agent/respond`, `POST /mock-agent/enqueue`, `GET /mock-agent/turns/:id`, `GET /mock-agent/canvas-state/:projectId`, and three embodiment endpoints (`mouse-to`, `click`, `drag`) guarded by `MOCK_AI=1` env + optional `x-mock-agent-key` shared secret. Responses route to `conversation_messages` via `routeTurnResponse`, emitting `message-appended` conversation events that the SSE channel picks up on the frontend.

--- dataModel ---
**ProposalRecord** (in-memory only, ProposalContext.tsx):
```
{ id: string; payload: ProposalPayload; state: "pending" | "confirmed"; createdAt: number }
```

**ProposalPayload** (proposal-types.ts):
```
LinkProposal = { kind: "link"; sourceArtifactId: string; targetArtifactId: string; label: string; reasoning: string; confidence: number }
CaptureProposal = { kind: "capture"; sourceArtifactId: string; artifactType: "feature"|"decision"|"risk"; confidence: number; reasoning: string; prefill: DecisionPrefill | RiskPrefill | FeaturePrefill }
```

Tombstone key format: `"${sourceId}:${targetId}"` (link) or `"${sourceId}:capture:${artifactType}"` (capture). Stored in `rejectedPairs: Set<string>` in React state only.

**AtlasTurnState** (use-atlas-turn.ts):
```
{ isInFlight: boolean; status: "idle"|"thinking"|"drafting"|"settling"; steps: AtlasStep[]; draftedArtifactIds: Set<string> }
```

**AtlasStep** (atlas-step.ts / services/atlas-steps.ts):
```
| { kind: "goal"; text: string }
| { kind: "tool"; name: string; input: Record<string, unknown> }
| { kind: "draft"; artifactId: string; summary: string }
| { kind: "note"; text: string }
```

**AtlasStepEvent** wire envelope: `{ type: "atlas_step"; step: AtlasStep; index: number }`

**SidebarMessage** (use-sidebar-stream.ts):
```
{ id: string; role: "user"|"assistant"; text: string; raw?: unknown; eventType?: string; result?: unknown }
```

**AgentPendingTurn** (DB, agent-pending-turns.ts):
```
{ id: uuid; agent: text; sessionKey: text; content: text; context: jsonb; callerAgent: text?; callerSessionKey: text?; claimedAt: timestamp?; dispatchedToClientId: text?; claimedByTokenId: uuid?; respondedAt: timestamp?; responseText: text?; responseToolCalls: jsonb?; responseTarget: jsonb?; qualityTag: text? }
```

**RightSidebar tab type**: `"git" | "claude" | "proposals" | "elements" | "notes"` (RightSidebar.tsx line 12). Preference stored under `"workspec:right-sidebar"` in localStorage: `{ collapsed: boolean; activeTab: string | null }`.

**ChatPanelMode** (use-interaction-mode.ts line 74): `"single-mcp" | "single-hosted" | "multi-mcp" | "multi-hosted"`. CoAuthorSurface only renders when mode is `single-hosted` or `multi-hosted`.

**LivePart** (DiscoverySidebar local type, line 831–846):
```
| { kind: "text"; text: string }
| { kind: "thinking" }
| { kind: "builtin_tool"; name: string; input: any }
| { kind: "action"; action: ToolAction }
| { kind: "pending"; name: string; toolUseId: string }
| { kind: "specialist_session"; specialistKind: string; sessionId: string; summary: string; actionsCount: number; toolUseId: string; status: "working"|"delegated"|"complete"; delegationId?: string }
```

--- apis ---
**Proposals:**
- `POST /api/projects/:projectId/discover` — body: `{ sourceArtifactIds: string[], rejectedPairs: string[] }`, response: `{ proposals: ProposalPayload[] }`. No auth token beyond session cookie. Synchronous Anthropic call inside.

**Claude sidebar:**
- `GET /api/sidebar/status` — `{ ready: boolean, reason?: "no-credential" }` (React Query, staleTime 30s)
- `POST /api/sidebar/messages` — body: `{ message: string, projectId: string }`, response: SSE stream with events: `init { sessionId }`, `text { text }`, `tool_use { id, name }`, `tool_result { id, name, result, isError }`, `done {}`, `error { message }`

**Atlas steps (conversation stream, not sidebar):**
- `POST /api/projects/:projectId/conversations/:conversationId/messages` — body: `{ content: string, attachments: any[] }`, response: NDJSON stream including `atlas_step { type, step, index }` events alongside existing event types

**Mock-agent (dev only, MOCK_AI=1):**
- `GET /mock-agent/pending` — list unresponded turns
- `POST /mock-agent/respond` — `{ id, text?, outputs?, toolCalls?, qualityTag? }` — fills turn + routes to chat/canvas
- `POST /mock-agent/enqueue` — `{ agent, sessionKey, content, context? }` — insert pending turn
- `GET /mock-agent/turns/:id` — poll single turn for response
- `GET /mock-agent/canvas-state/:projectId` — snapshot for agent perception
- `POST /mock-agent/atlas/:projectId/mouse-to` — `{ x, y, durationMs? }`
- `POST /mock-agent/atlas/:projectId/click` — `{ x?, y?, durationMs? }`
- `POST /mock-agent/atlas/:projectId/drag` — `{ from: {x,y}, to: {x,y}, durationMs? }`
- `POST /mock-agent/create-project` — `{ workspace_id, pitch, title? }`
- `POST /mock-agent/post-note` — `{ project_id, text, surface?, artifact_slug? }`
- `POST /mock-agent/run-tools` — `{ project_id, tools: [{name, input}] }`

**Hooks:**
- `useProposals()` — `{ proposals, pending, confirmed, rejectedPairs, thinkingCount, addProposals, acceptProposal, rejectProposal, removeProposalsForSource, setThinkingCount }`
- `useAtlasTurnContext()` — `{ state: AtlasTurnState, begin, feed, complete, cancel, reset }` (NOOP_CONTROLLER outside AtlasTurnProvider)
- `useSidebarStream()` — `{ messages, streaming, sessionId, send(text, projectId?), clear }`
- `useSidebarStatus()` — React Query wrapping `GET /api/sidebar/status`
- `useRightSidebarPreference()` — `{ collapsed, activeTab, toggleTab, setActiveTab, collapse, expand }` backed by `"workspec:right-sidebar"` localStorage

--- integrationPoints ---
**Adding a new right-sidebar tab:** Add an entry to the `TABS` constant array in `RightSidebar.tsx` (line 21). Each tab has `{ id: TabId; label: string; icon: React.ReactNode; panel: React.ReactNode }`. Extend `type TabId` (line 12) to include the new id. No registration elsewhere required — tabs are self-contained.

**Restructuring ProposalPanel into a co-author rail:** Replace or augment `ProposalPanel.tsx`. It receives its data from `useProposals()` (no props). To add a reasoning-stream section, consume `useAtlasTurnContext()` inside the panel and render `<CoAuthorSurface>` or a custom version inline. The AtlasTurnProvider wraps the entire scope page so the context is available from any right-sidebar panel rendered within that tree.

**Piping atlas_step events to the Proposals tab:** The `atlas_step` NDJSON events are currently consumed only inside `DiscoverySidebar.handleSend` (line 1173), feeding `atlasTurn.feed(event)`. The `useAtlasTurnContext()` hook can be called in any component inside `AtlasTurnProvider` — including `ProposalPanel`. `atlasTurn.state.steps` and `atlasTurn.state.status` are immediately readable.

**Trigger points for proposal generation:** The `DiscoverProposals` component in `scope.tsx` listens for `workspec:scope-updated` CustomEvents and debounces 1500ms to `POST /api/projects/:projectId/discover`. To add new trigger types (beyond note/clipping/question), modify the `artifactType` guard at line 58 in scope.tsx.

**Adding persistence to dismissals:** `rejectProposal` in `ProposalContext.tsx` (line 93) currently only updates local state. To persist, add a `POST /api/projects/:projectId/proposals/dismiss` call here with the tombstone key. No DB table exists today — would need a new schema.

**Mock-agent turn delivery path to frontend:** `POST /mock-agent/respond` → `routeTurnResponse()` → `db.insert(conversationMessagesTable)` → `publishConversationEvent({ type: "message-appended" })` → SSE conversation-events channel → `useConversationEvents` hook in `DiscoverySidebar` → React Query `invalidateQueries` on `getListMessagesQueryKey` → re-render.

**Sidebar status gate:** `ClaudeSidebar` checks `useSidebarStatus()` before rendering. Status is `ready: false` when `ANTHROPIC_API_KEY` is absent. Any credential-gated sidebar feature should respect this same gate.

**ChatPanel composerOverlay slot:** `DiscoverySidebar` passes `composerOverlay` prop to `<ChatPanel>` (line 1421). This is where `<CoAuthorSurface>` appears today. A new "reasoning stream" section for the Proposals tab would be a separate surface — either also using this slot (switching active panel) or a standalone widget inside `ProposalPanel`.

**Sidebar width persistence:** `RightSidebar` uses `"workspec:right-sidebar-width"` localStorage key (line 58), clamped 200–600px, default 280px. Resize handle is the 4px left-edge div at line 116.

--- risks ---
**Proposals rejection is session-only:** `rejectedPairs` lives in React state and is passed to `POST /discover` each call. Page reload clears it — rejected proposals reappear on the next `workspec:scope-updated` event. There is no DB tombstone. Any implementation that claims "suppress permanently" must add DB persistence.

**ProposalProvider and AtlasTurnProvider are NOT mounted on all pages:** They are mounted only inside `scope.tsx` (lines 668–669). Pages like `workspace-atlas.tsx` or the notes panel accessed from other routes outside scope.tsx will hit the NOOP_CONTROLLER / EMPTY_STATE fallbacks. Any feature expecting these contexts must verify the page tree.

**CoAuthorSurface only activates in hosted interaction modes:** `isHostedSurfaceMode = chatMode === "single-hosted" || chatMode === "multi-hosted"` in `DiscoverySidebar` (line 856). If `useChatPanelMode()` returns `single-mcp` or `multi-mcp`, `composerOverlay` is `undefined` and the surface never renders, even if `atlasTurn.state.isInFlight` is true.

**NotesPanel embeds DiscoverySidebar without the Atlas turn context path:** `NotesPanel` renders `<DiscoverySidebar embedded>` inside the right-sidebar. Since `AtlasTurnProvider` is on the page-level scope.tsx tree, `useAtlasTurnContext()` will return the live controller — but `CoAuthorSurface` will only show if the chat mode is hosted. In MCP-only workspaces it stays hidden.

**The `discover` route calls Anthropic synchronously on the request thread** with no timeout or abort. A slow model response will hold the request open; no streaming. `POST /api/projects/:projectId/discover` returns `{ proposals: [] }` on any error (500 path), so the UI never shows an error state — it silently gets zero proposals.

**The sidebar stream and the conversation NDJSON stream are separate channels:** `ClaudeSidebar` uses `POST /api/sidebar/messages` (SSE, LucidBrain managed-agent session titled "Sidebar"). `DiscoverySidebar` uses `POST /api/projects/:pid/conversations/:cid/messages` (NDJSON, project conversation). These are completely independent sessions and message stores. Atlas steps only flow through the conversation NDJSON path, not the sidebar SSE path — the sidebar's `ToolCard` only sees `tool_use`/`tool_result` events, not `atlas_step` events.

**RightSidebar tab state defaults to collapsed:** `useRightSidebarPreference` loads from localStorage with fallback `{ collapsed: true, activeTab: null }`. The `expand()` fallback tab is `"git"`, not `"proposals"` — an agent trying to open the proposals view programmatically must call `toggleTab("proposals")` explicitly.

--- keyFiles ---
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/layout/right-sidebar/RightSidebar.tsx [1-52, 105-139] — Tab rail + panel host; TABS array at line 21 is where tabs are registered; tab IDs: claude|notes|git|elements|proposals
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/layout/right-sidebar/ProposalPanel.tsx [1-199] — Renders pending/confirmed proposals; consumes useProposals(); accept opens CaptureComposer
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/layout/right-sidebar/ClaudeSidebar.tsx [1-255] — Right-sidebar Claude tab; calls POST /api/sidebar/messages SSE via useSidebarStream(); renders ToolCard + MessageBubble
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/layout/right-sidebar/NotesPanel.tsx [1-46] — Notes & Activity tab; embeds DiscoverySidebar with embedded=true prop
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/discovery/ProposalContext.tsx [1-149] — ProposalProvider + useProposals(); in-memory state machine for proposals; rejectedPairs tombstoning (session-only, not DB-persisted)
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/discovery/proposal-types.ts [1-44] — TypeScript types: LinkProposal, CaptureProposal, ProposalPayload, DecisionPrefill, RiskPrefill, FeaturePrefill
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/atlas/AtlasTurnContext.tsx [1-58] — AtlasTurnProvider wrapping useAtlasTurn; useAtlasTurnContext() returns no-op controller outside a provider
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/atlas/CoAuthorSurface.tsx [1-93] — Hosted-Atlas co-author overlay: header with pulse dot + Atlas label + status label, scrolling StepRow ledger, Cancel button; renders over composer when isInFlight
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/atlas/StepRow.tsx [1-77] — Variant-per-kind row: goal=bold title, tool=mono arrow, draft=dashed card, note=italic; onDraftClick fires for draft rows
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/hooks/use-atlas-turn.ts [1-123] — useAtlasTurn hook; AtlasTurnState + AtlasTurnController interfaces; begin/feed/complete/cancel/reset; 600ms settle timer; draftedArtifactIds Set
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/lib/atlas-step.ts [1-33] — Frontend type mirror: AtlasStep, AtlasStepEvent, AtlasTurnStatus, deriveTurnStatus()
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/hooks/use-sidebar-stream.ts [1-163] — useSidebarStream: POSTs to /api/sidebar/messages, parses SSE frames (init/text/tool_use/tool_result/done/error); SidebarMessage type
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/hooks/use-sidebar-status.ts [1-17] — React Query call to GET /api/sidebar/status; returns { ready: boolean, reason? }
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/project/DiscoverySidebar.tsx [805-1637] — Primary chat surface: full NDJSON stream consumer (handleSend), CoAuthorSurface composerOverlay integration, atlas_step feed at line 1173-1182, all live part types
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/pages/scope.tsx [20-78, 668-748] — AtlasTurnProvider + ProposalProvider mount at lines 668-669; DiscoverProposals trigger component at lines 23-78
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/discover.ts [1-232] — POST /projects/:projectId/discover; calls Anthropic SDK synchronously; returns proposals array; server-side rejectedPairs filtering
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/sidebar.ts [1-90] — GET /api/sidebar/status + POST /api/sidebar/messages (SSE); delegates to runCoordinatorTurn
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/sidebar/sidebarAgent.ts [1-152] — runCoordinatorTurn async generator; SidebarEvent types; managed-agent session lifecycle; executeToolCall dispatch; archived-session recovery
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/mock-agent.ts [1-1177] — Dev-only agent queue: pending/respond/enqueue/turn-poll, canvas-state snapshot, atlas embodiment (mouse-to/click/drag), create-project, post-note, run-tools
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/services/atlas-steps.ts [1-126] — AtlasStepDeriver class: fromAgentMessageText, fromToolUse, fromToolActions — maps NDJSON events to AtlasStep kinds for wire emission
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/agent-pending-turns.ts [1-95] — agentPendingTurnsTable schema: agent, sessionKey, content, context JSONB, callerAgent, claimedByTokenId, respondedAt, responseToolCalls, responseTarget JSONB


============================== views-surfaces ==============================

--- summary ---
The WorkSpec view system is a registry-driven multi-view canvas engine. The server-side registry (view-registry.ts) declares eight live view types (plus four deprecated) with their allowed artifact types, layout strategies, and renderer keys. The frontend fetches these via GET /api/projects/:id/views, and the ViewTabStrip component renders them as a horizontal tab bar. Switching views re-routes the URL; the ScopePage (scope.tsx) maps URL slugs back to system-view types and passes `activeViewSlug` down to ProjectCanvas, which branches its render at lines 1335–1338 into four explicit arms: system-context, data-dictionary, journeys, and discovery. Data-flow is registered in the registry but maps to renderer key "data-flow" with no render arm yet — its tab appears as `disabled` ("soon") in the strip.

Data Dictionary is partially implemented end-to-end. On the server, GET /api/projects/:projectId/data-dictionary (artifacts.ts:1539) returns entities with their fields pre-bundled via YAML parse + field-of-entity link joins. On the canvas, useDataDictionaryCanvas (ProjectCanvas.tsx:1078) fetches from that endpoint and produces React Flow nodes. EntityNode.tsx renders each entity as a 320px card with an inline field table showing name/type/nullable/FK indicators. There is no dedicated full-page or route for Data Dictionary — it renders entirely inside ProjectCanvas when activeViewSlug === "data-dictionary", reachable via URL /project/:id/data-dictionary which hits the wildcard ScopePage route.

User Journeys is also partially implemented. JourneyContainerNode.tsx renders journey artifacts as wide step-card strips; each node fetches its own steps via /api/projects/:projectId/artifacts/:id/content, and CI step statuses via GET /api/v1/projects/:projectId/journeys/:slug/step-statuses. JourneyHealthPanel.tsx shows aggregate pass/fail counts. The journeys view tab is currently registered in view-registry.ts and has a canvas render arm (useJourneysCanvas), but legacyRouteFor() in view-tab-strip.tsx maps "journeys" to "disabled" — so in the ViewTabStrip (used outside the canvas) it renders inert. However the ProjectViewsPanel (used inside the canvas) does not apply that disabled gate and passes the view type directly to onSelectSystemView, so it is navigable from the in-canvas Views picker.

Topology is implemented as a workspace-scope surface (not a canvas view type — there is no topology SystemViewType or view-registry.ts entry). Pages: topology-list.tsx (`/topology` list) and topology.tsx (`/topology/:id` detail). Routes registered in App.tsx. The workspace AppLayout workspaceItems array includes a Topology entry (Boxes icon, `/topology`, active on `location.startsWith('/topology')`). The project sidebar project-nav-items.tsx NAV_DEFS includes `{ section: "Workspace", label: "Topology", path: "/topology", absolute: true }` — the absolute flag means the path is workspace-root-relative, not project-relative, matching the design's "Topology ↗" workspace link. The Connections page (/connections) is a fully implemented workspace-scoped page (settings/connections.tsx) for MCP OAuth session management; it is user-scoped, not workspace-scoped, and is reachable from UserMenu. It is not listed in app-layout.tsx's workspaceItems array and has no AppSidebar nav item.

The project nav (project-nav-items.tsx) is a flat NAV_DEFS array grouped by section strings: Board (Discovery), Design (Architecture, Data Dictionary, User Journeys), Registers (Decisions, Risks), Deliver (Backlog, Build, Triage, Test, Attention, Velocity, Pull requests), Project (Documents, Settings), and Workspace (All projects, Topology — absolute paths). AppSidebar.tsx renders sections by detecting when consecutive items have a different `section` value and inserting a SidebarSectionHeader. Badge support already exists: `AppSidebarItem.badge?: ReactNode` is defined in AppSidebar.tsx (line 138) and rendered right-aligned in expanded mode at NavItem line 218; `ProjectNavConfig.badge?: "on-board" | "room"` drives a BadgeComponent in project-nav-items.tsx that renders the styled pill and is spread into the AppSidebarItem at mapping time. Architecture and Data Dictionary carry "on-board"/"room" badges today.

--- dataModel ---
canvasViewsTable (canvas_views):
  id: uuid PK
  projectId: uuid FK→projects
  userId: uuid FK→users (null for system views)
  kind: text 'system'|'saved'
  viewType: text (SystemViewType enum key or null)
  title: text
  slug: text
  hiddenTypes: text[]
  layoutStrategy: text
  viewportX/Y/Zoom: real
  isDefault: boolean
  CHECK: (kind='system' AND user_id IS NULL) OR (kind='saved' AND user_id IS NOT NULL)

SystemViewType enum (SYSTEM_VIEW_TYPES):
  'discovery' | 'system-context' | 'container' | 'structure' | 'work' | 'journeys' | 'data-flow' | 'logical' | 'deployment' | 'data-dictionary'

ViewDefinition (view-registry.ts):
  type: SystemViewType
  title: string
  slug: string
  allowedTypes: readonly string[]
  hiddenInPhase: readonly ProjectPhase[]
  layoutStrategy: LayoutStrategy ('force-directed'|'dagre-hierarchical'|'container-hierarchy'|'swimlane'|'kanban-columns'|'freeform')
  allowedEdits: readonly ViewEditOp[]
  renderer: RendererKey ('canvas'|'kanban'|'journeys-lane'|'data-flow')
  description: string
  order: number
  deprecated?: boolean
  lenses?: Array<{key, label, allowedTypes, description}>
  defaultLens?: string
  gatedBy?: {kind: 'system-exists'}

ProjectView (use-project-views.ts, frontend):
  id: string
  slug: string
  viewType: string|null
  title: string
  isDefault: boolean
  kind: 'system'|'saved'
  layoutStrategy: string|null
  hiddenTypes: string[]
  viewport: {x,y,zoom}|null
  definition?: {allowedTypes, hiddenInPhase, renderer, allowedEdits, description, order}

userJourneysTable (user_journeys):
  artifactId: uuid PK FK→artifacts
  actorPersonaSlug: text
  actorArchetype: text
  prerequisites: jsonb string[]
  successCriteria: text
  failureModes: jsonb string[]
  testGenerationFramework/Harness/OutputPath: text

journeyStepsTable (journey_steps):
  id: uuid PK
  journeyArtifactId: uuid FK→user_journeys
  stepKey: text (unique per journey)
  orderIndex: integer (unique per journey)
  title: text
  actor: text ('agent'|'user'|'system')
  action: text
  expectedState: jsonb string[]
  linkedFeatureSlugs: jsonb string[]
  linkedSystemRequirementSlugs: jsonb string[]
  UNIQUE(journeyArtifactId, stepKey), UNIQUE(journeyArtifactId, orderIndex)

journeyStepRunsTable (journey_step_runs):
  id: uuid PK
  stepId: uuid FK→journey_steps
  runId: text
  status: text ('passed'|'failed'|'skipped')
  durationMs: integer
  errorMessage: text
  ranAt: timestamp

Entity/Field artifacts live in the artifacts table (type='entity'|'field'), with YAML-encoded metadata:
  entity YAML metadata: nativeName, primary_key[], indexes[], database
  field YAML metadata: type_kind, systemType, nullable, references, order
  field-of-entity link: artifact_links.link_type='field-of-entity', sourceId=field, targetId=entity

AppSidebarItem interface:
  id: string
  label: string
  icon: ReactNode
  onSelect?: () => void
  active?: boolean
  section?: string
  // badge?: ReactNode  ← NOT YET PRESENT — must be added

--- apis ---
GET /api/projects/:projectId/views — list system (non-deprecated) + saved views; returns {system: ProjectView[], saved: ProjectView[]} with full definition object
GET /api/projects/:projectId/views/:viewKey/graph — project artifact graph through a view; returns {view, artifacts, links, layouts[]}; viewKey accepts uuid|slug|type
PUT /api/projects/:projectId/views/:viewKey/layouts — bulk upsert per-view artifact positions; body: {personal: boolean, layouts: LayoutInput[]}
GET /api/projects/:projectId/data-dictionary — entities pre-bundled with fields; returns {entities: [{id, slug, name, description, nativeName, database, primaryKey, indexes, fields: [{id, slug, name, description, type, systemType, nullable, order, references}]}]}
GET /api/projects/:projectId/canvas-objects?view=data-dictionary — raw canvas objects filtered to entity/field/diagram types
GET /api/projects/:projectId/canvas-objects?view=journeys — raw canvas objects filtered to user-journey type
POST /api/v1/journeys/test-runs — CI webhook; body: {projectId, journeySlug, runId, results: [{stepKey, status, durationMs?, errorMessage?}]}; auth: Bearer MCP token
GET /api/v1/projects/:projectId/journeys/:journeySlug/step-statuses — per-step CI status; returns {statuses: [{stepKey, orderIndex, status, ranAt}]}
GET /api/v1/projects/:projectId/journeys — journey health summary; returns {journeys: [{artifactId, title, slug, total, passing, lastRunAt}]}

--- integrationPoints ---
Adding a dedicated route for data-dictionary, journeys, or data-flow as a full page (vs the current canvas-embedded approach):
  - App.tsx: add Route before the catchall `path="/project/:projectId/:viewSlug"` line (214)
  - ScopePage (scope.tsx): current slug mapping at 196-226 already passes 'data-dictionary' and 'journeys' through to activeSystemViewType verbatim — no change needed for URL-based view activation
  - ViewTabStrip legacyRouteFor() (view-tab-strip.tsx:36-56): journeys and data-flow currently map to 'disabled'; change to a path string to enable routing

Adding a new system view to the registry:
  1. Add entry to VIEW_REGISTRY in view-registry.ts
  2. Add the new key to SYSTEM_VIEW_TYPES in lib/db/src/schema/canvas-views.ts
  3. Run db generate + migrate
  4. The view is automatically seeded into new projects via SYSTEM_VIEWS_TO_SEED (seedSystemViewsForProject in services/views.ts)
  5. Add a render branch in ProjectCanvas.tsx (alongside showSystemContext/showDataDictionary/showDiscovery/showJourneys at lines 1335-1338 and the baseFlow useMemo at 1680-1700)
  6. If a route is needed: add to App.tsx + handle slug in scope.tsx

Adding a badge to nav items (badge support already exists):
  1. In project-nav-items.tsx NAV_DEFS: add `badge: "on-board" | "room"` to the item definition
  2. useProjectNavItems mapping already spreads badge through to AppSidebarItem via `badge: def.badge ? <BadgeComponent type={def.badge} /> : undefined`
  3. AppSidebarItem.badge?: ReactNode is defined in AppSidebar.tsx (line 138); NavItem renders it right-aligned at line 218 in expanded mode only — no change needed there

View tab strip is used from ProjectHeader (via scope.tsx ProjectLayout header child); the in-canvas view selector is ProjectViewsPanel, which does not use legacyRouteFor and never disables views.

Data dictionary YAML field for entity/field relationships:
  - entity ↔ field linked via artifactLinksTable.linkType='field-of-entity'
  - field is the source (sourceId=field.id), entity is the target (targetId=entity.id)
  - Field state is not yet tracked in journeyStepRunsTable; state comes from artifact row

Journey CI result ingest:
  - POST /api/v1/journeys/test-runs (journeys.ts) authenticated via Bearer MCP token
  - Matches journeySlug via artifact_search.slug join
  - Resolves stepKey→stepId via journeyStepsTable
  - Inserts into journeyStepRunsTable

--- risks ---
1. View tab strip disabled state: journeys and data-flow are registered in the view registry with full definitions, seeded into new projects, and renderable in-canvas via ProjectViewsPanel — but ViewTabStrip.legacyRouteFor() hard-returns 'disabled' for both. If both entry points aren't updated together, one will work and the other won't. The tab strip is used on legacy/public page routes; the ViewsPanel is inside the canvas.

2. Data Dictionary uses two separate fetch paths: useDataDictionaryCanvas fetches /api/projects/:id/data-dictionary (full entities+fields), while canvas-objects?view=data-dictionary (artifacts.ts:325) returns raw canvas objects filtered to entity/field/diagram types. These are not the same shape. Only the former produces EntityNode-ready data; the latter is used for positional layout lookups.

3. data-flow view type: it is in the registry (renderer: 'data-flow'), in SYSTEM_VIEW_TYPES, and will be seeded — but ProjectCanvas falls through to `{ nodes: [], edges: [] }` for it (line 1700). The renderer key 'data-flow' has no registered React Flow node or edge type. Adding data-flow requires a new render arm and custom node types.

4. Journey view is accessible in-canvas via ProjectViewsPanel but the URL /project/:id/journeys works only because ScopePage passes slug verbatim to activeSystemViewType at line 225. If a user navigates directly to this URL the canvas renders the journeys branch, but ViewTabStrip shows the tab as disabled — navigation from the tab strip won't work.

5. Topology is a workspace-scope surface (not a canvas view type). It has dedicated pages (topology-list.tsx, topology.tsx), routes in App.tsx, and nav entries in both app-layout.tsx workspaceItems and project-nav-items.tsx NAV_DEFS (Workspace section, absolute path). No topology SystemViewType or view-registry.ts entry is needed — topology is not a project-canvas view.

6. Connections page (/connections route) is outside AppLayout's workspaceItems array — it has no sidebar nav entry. It is reachable only via UserMenu or direct URL. New nav entry in app-layout.tsx would require adding it to the workspaceItems inline array.

7. canvas_object_layouts (per-view layout) relies on FK to canvas_views.id. Deprecated views (logical, deployment, structure, container) keep their DB rows so existing FK references stay valid. Seeding for new projects skips them via SYSTEM_VIEWS_TO_SEED filter — but old projects still have the rows and they will appear in listViewsForUser until the server-side filter in views.ts drops them.

--- keyFiles ---
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/services/view-registry.ts [1-360] — Single source of truth for all view definitions. Declares VIEW_REGISTRY (Record<SystemViewType, ViewDefinition>), SYSTEM_VIEWS_TO_SEED, getViewDefinition(), artifactTypeInView(). Includes data-dictionary (order 25), journeys (order 40), and data-flow (order 50) entries. data-flow has no page yet — description says 'v4.1 — not wireframed yet'.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/views.ts [66-343] — HTTP surface: GET /projects/:projectId/views returns system+saved split; GET /projects/:projectId/views/:viewKey/graph returns filtered artifact graph with per-view layouts; PUT /projects/:projectId/views/:viewKey/layouts upserts per-artifact positions. Deprecated views filtered out at the response boundary.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/hooks/use-project-views.ts [1-62] — React Query hook. Hits GET /api/projects/:id/views directly (Orval codegen deferred). Returns { system: ProjectView[], saved: ProjectView[] }. ProjectView interface includes definition.renderer: ViewRenderer, definition.hiddenInPhase, definition.allowedTypes etc.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/project/view-tab-strip.tsx [36-172] — Tab strip component. legacyRouteFor() maps view types to URL fragments: discovery→/discovery, work→/board, structure→/diagrams, journeys/data-flow→'disabled' (renders 'soon' badge), logical/deployment→null (root). Used on project header area for navigation-mode switching.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/App.tsx [129-218] — Full wouter route map. Project-specific routes: /project/:id, /project/:id/:viewSlug (catchall → ScopePage), /project/:id/architecture/:diagramId, /project/:id/pulls/:number, /project/:id/component/:domainSlug, /project/:id/code/:domainSlug/:componentSlug. No dedicated routes for data-dictionary, journeys, or data-flow — all handled by the :viewSlug catchall → ScopePage.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/pages/scope.tsx [90-248] — Universal project canvas page. Slug→view-type mapping at lines 196-226: '' or 'discovery' or 'board'→discovery, 'architecture'→system-context, 'container'→system-context+container level, else pass-through. setActiveSystemViewType reverses the mapping back to URL. Routes /project/:id/data-dictionary and /project/:id/journeys hit the :viewSlug catchall and route through here.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/project/ProjectCanvas.tsx [152-196, 1063-1175, 1335-1700] — Main canvas component. Registers EntityNode and JourneyContainerNode in CUSTOM_NODE_TYPES (lines 179-181). Render branching at lines 1335-1338: showSystemContext/showDataDictionary/showDiscovery/showJourneys booleans. useDataDictionaryCanvas hook at 1078-1127 fetches /api/projects/:id/data-dictionary. useJourneysCanvas hook at 1134-1175 fetches /canvas-objects?view=journeys. data-flow view type falls through to empty nodes at line 1700.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/diagrams/nodes/EntityNode.tsx [1-192] — Entity card for Data Dictionary view. Renders 320px card with accent stripe, name+nativeName chip, description, inline field table (KeyRound icon for PK, LinkIcon for FK, Hash for plain fields, NN badge for NOT NULL). Driven by EntityCardData shape from /data-dictionary endpoint. Registered as nodeType 'entity' in ProjectCanvas.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/diagrams/nodes/JourneyContainerNode.tsx [1-273] — Journey container node for Journeys view. Fetches steps from /artifacts/:id/content, fetches CI step-statuses from /api/v1/projects/:id/journeys/:slug/step-statuses. Renders step cards in a grid (WRAP_AT=5 per row). Dispatches workspec:open-journey-editor event for the edit pencil. Step status dots (green/red/grey) + staleness dimming.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/canvas/JourneyHealthPanel.tsx [1-137] — Aggregate journey health sidebar panel. Polls GET /api/v1/projects/:id/journeys for health summary (passing/total/lastRunAt per journey). Renders colored progress bars. Listens to workspec:scope-updated events to refresh.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/artifacts.ts [320-370, 1536-1683] — GET /projects/:projectId/data-dictionary (line 1539): returns entities array with pre-bundled fields. Field-entity join via artifact_links.link_type='field-of-entity'. YAML parsed for description/metadata including nativeName, primary_key, type_kind, nullable, references. Also GET /canvas-objects?view=data-dictionary filter at line 325.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/api-server/src/routes/journeys.ts [1-346] — Journey CI webhook API. POST /api/v1/journeys/test-runs writes journey_step_runs. GET /api/v1/projects/:projectId/journeys/:journeySlug/step-statuses returns latest per-step status for canvas overlay. GET /api/v1/projects/:projectId/journeys returns all journeys with aggregate health.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/layout/project-nav-items.tsx [1-139] — Single source of truth for project nav. NAV_DEFS array with section grouping: Board/Design/Registers/Deliver/Project/Workspace. Workspace section includes All projects and Topology (absolute path). useProjectNavItems() returns AppSidebarItem[]. BadgeComponent renders "ON BOARD" or "ROOM ↗" badges; badge?: "on-board" | "room" on ProjectNavConfig and AppSidebarItem.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/layout/AppSidebar.tsx [125-137, 186-228, 262-328] — AppSidebar component + AppSidebarItem interface. Section rendering in the map at line 280-296: detects section boundary, renders SidebarSectionHeader, then NavItem. NavItem at lines 186-228: expanded mode renders icon+label in flex row — badge insertion point is between the label span and closing button. Collapsed mode renders icon only with tooltip.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/layout/app-layout.tsx [40-98] — Workspace-level AppLayout. workspaceItems array: Dashboard, Discovery (hosted-mode only), Workflow, Topology (Boxes icon, /topology, active on startsWith('/topology')), Cost catalog, Settings, Users. Connections is routed separately at /connections (absolute path, user-scoped).
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/pages/settings/connections.tsx [34-144] — Connections page — /connections route. User-scoped MCP OAuth session management (list + revoke DCR sessions). Also includes ClaudeConnectionCard for personal Claude API token. Mounted in AppLayout. Not in AppSidebar nav; linked from UserMenu.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/canvas-views.ts [1-116] — DB schema for canvas_views table. kind enum: 'system' | 'saved'. SYSTEM_VIEW_TYPES enum includes 'data-dictionary', 'journeys', 'data-flow'. System views have null user_id; saved views have non-null user_id (CHECK constraint enforced). FK'd to canvas_object_layouts for per-view positions.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/lib/db/src/schema/user-journeys.ts [1-97] — DB schema for user_journeys, journey_steps, journey_step_runs. user_journeys is a companion table to artifacts (PK = artifact_id). journey_steps has stepKey (caller-controlled, unique per journey), orderIndex, actor, action, expectedState jsonb, linked feature/system-requirement slugs. journey_step_runs has status, durationMs, ranAt.
  /Users/brettsmith/GitHub/workspec/.claude/worktrees/elegant-banzai-357ede/artifacts/workspec/src/components/project/ProjectViewsPanel.tsx [56-246] — In-canvas view selector panel (React Flow Panel). Calls useProjectViews, applies phase-gating filter, renders system view list and saved views. Does not apply 'disabled' gate — passes viewType directly to onSelectSystemView. Used inside ProjectCanvas, not the ViewTabStrip.


============================== design-spec ==============================

--- summary ---
The WorkSpec "Morph + Tether" prototype and Shell frames define six tightly interlocking UI subsystems. Each is driven by a single shared canvas that re-represents its items between two lenses (Freeform / Structured) via a 280ms cross-fade with simultaneous scale micro-transforms — no items are hidden, they only change form. Items carry a flat placement record {x, y, lensOffset?} where the offset is nullable from day one; when a user "loosens" an item, writing lensOffset turns the item into a loose chip that glides to a diverged position in Structured while staying at its sketch position in Freeform.

Architecture rooms are tethered sub-canvases entered from an element, not from the nav. The tether bar provides a breadcrumb (Board button → element color swatch + name → room name), an Esc keyboard handler that pops back to the board, and a ghost of the originating element in the room canvas itself. The Atlas rail is a 320px right column that cycles through three states — PROPOSING (with reasoning stream and proposal cards), QUIET (shows a recency log of just-accepted proposals and any still-open ones), and listening (top-bar indicator only). Proposals are tombstoned on Dismiss so Atlas never re-surfaces them unless inputs materially change.

The rework halo is pure board-layer metadata: the element keeps its ink state, its VC border, its ‹/› build tag, and its arc-stage corner tag untouched; the halo is a coral dashed ring added on top as a fifth, transient channel. Links on a reworking element are flagged "contested" rather than "dangling" — traceability and gap detection understand the distinction. The Reconcile overlay tints domain cards by sync state (green SYNC / amber DRIFT / grey UNLINKED) without filtering or hiding anything; the "UNDER REWORK · DRIFT EXPECTED" quieting label appears inline in the drift digest to explain expected divergence without suppressing the finding.

The four-mechanics taxonomy bar is a persistent dark footer strip that pins the distinction between the four navigation modalities: Pill (total re-representation), Overlay (tint-not-filter), ON BOARD (partial projection sharing board logic), and ROOM ↗ (tethered surface with own spatial logic and breadcrumb home). The constraint stated explicitly is that a partial view — one that hides items — must never be placed in the lens pill.

--- dataModel ---
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

--- apis ---
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

--- integrationPoints ---
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

--- risks ---
LENS MORPH — both representations must exist in the DOM simultaneously (cross-fade); pointer-events must be toggled so only the active lens is interactive (ffPe / stPe switching). Using CSS visibility:hidden or display:none breaks the cross-fade. The outer container div for each item must be position:absolute at canvas coordinates; the inner freeform and structured slots are position:absolute inset:0 inside it.

LOOSE ITEM GLIDE — the translate() is applied to the outer container, not the inner slot. The transition must be on transform 0.28s ease at the container level so the item smoothly drifts to its structured home during the morph. The lensOffset stores the delta, not the absolute structured position. If lensOffset is null, the translate stays translate(0,0) in both lenses (no glide).

REWORK HALO — the halo div's inset values (-16px -52px -22px -18px) extend outside the element bounds and will be clipped by any parent with overflow:hidden. The canvas must not set overflow:hidden on the item container layer. The z-index of the halo must be below the item card but still above the canvas background.

ROOM VIEW — the room replaces the entire canvas area (showBoard / showRoom toggle). Camera position ("camera held") is a prototype note implying the canvas pan/zoom state should be preserved when entering and exiting a room, but the prototype does not implement this — implementors must decide whether to store and restore canvas transform on room entry/exit.

ATLAS TOMBSTONES — the prototype describes tombstoning semantically ("dismissals are tombstoned; Atlas re-proposes only if the sketch materially changes") but provides no implementation. The inputHash strategy (Coffers pattern) must be designed — what constitutes "material change" to canvas inputs needs a concrete definition.

STACKING RULE CONSTRAINTS — the four channels (form / border / corner tag / halo) are described as non-competing. In practice, halo is position:absolute with negative inset overhanging the card; if the card is inside a CSS grid with gap, the halo will overlap adjacent cards. Items under rework should either have extra canvas margin or the halo should use outline instead of an absolutely positioned div.

RECONCILE OVERLAY — "tints, never filters" means all domain cards remain visible; the amber tint (#fffdf4 background) is applied directly to the card, not via a CSS filter overlay. This means the reconcile state must be composited at render time into the card style, not via a global CSS class toggling a filter on the canvas.

FONT DEPENDENCIES — three non-system fonts are required: Inter Tight (weight 400/500/600/700), JetBrains Mono (400/500/600), Caveat (500/600/700). All handwritten/mono text will fall back incorrectly if these are not loaded. The prototype loads them from Google Fonts — production must ensure they are available in all rendering environments (especially PDF export or SSR).

INITIAL STATE — the prototype's JS state initializes as { lens: "structured", rework: false, room: false }, meaning the Structured lens is the default, not Freeform. This is the opposite of the conceptual "sketch first" framing; verify with product whether Freeform should be the default for new boards.

--- keyFiles ---
  /tmp/design-zQeI/end-to-end-product-flow/project/Morph + Tether Prototype.dc.html [1-270] — Interactive spec for lens morph, rework halo, tether/room mechanics, and loose-item glide behavior — all JS state and transition values live here
  /tmp/design-zQeI/end-to-end-product-flow/project/WorkSpec Shell.dc.html [88-92, 199-249, 306-428, 430-582, 886-980, 1001-1057] — Full shell prototype covering all seven screens: nav badge taxonomy (lines 88-92), structured lens board (306-428), architecture room + tether bar (430-582), flow-to-build (584-692), reconcile overlay (886-980), responses-to-review stacking rules (1001-1057), four-mechanics taxonomy bar (1045-1056)
