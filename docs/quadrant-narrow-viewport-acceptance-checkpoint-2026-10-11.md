# Quadrant Narrow-Viewport Fix and Human Acceptance Checkpoint

Date: 2026-10-11

Status: Quadrant Footer and Pointer-to-Keyboard Focus improvements are HUMAN BROWSER ACCEPTED / PASS / CLOSED for the bounded observations in Tests 23-27 below. Earlier FAIL and PENDING entries are retained as history and superseded by the post-fix Human results. Cross-Context Workspace Safety full acceptance and production verification remain pending. PUBLIC RELEASE remains NO-GO.

## Human Browser Acceptance evidence

This records the Human's Edge Browser Review. PASS applies only to the listed actions and viewport; it is not a blanket application or browser-matrix acceptance.

| Test | Human-reported result | Acceptance boundary |
|---|---|---|
| 16 | PASS | Replacement refusal no longer duplicates the same cause; Retry/Cancel and Home language selection remain available. |
| 17 | PASS | Cancel removes candidate-specific feedback and restores the peer-work early warning. |
| 18 | PASS | Canceling the peer's unapplied Dimension clears the early warning automatically. |
| 19 | PASS | After the conflict is resolved, replacement with a new empty Dataset succeeds. |
| 20 | PASS | The stale tab's Assessment save is refused with a specific saved-revision conflict reason, without duplicate warning; Export and Reload recovery guidance is present. This covers the observed operation only. |
| 21 | PASS | Reloading the tab containing the newer empty Dataset preserves it; the older tab cannot overwrite it with an Assessment edit. |
| 22 — Home | PASS | At 390px the early warning wraps, the language control is visible, and Home centering and actions remain usable. |
| 22 — Matrix | PASS | At 390px the table scrolls horizontally to its final Dimension; its selector, Assessment input, and delete action can be reached. Matrix horizontal scrolling is accepted for this layout. |
| 22 — Quadrant | VISUAL FAIL | At 390px multiple explanatory paragraphs below the plot overlapped and could not be read. This was the initial failure; Human later confirmed the corrected rendering in Tests 23-24 below. |

## Quadrant defect and correction

In the `max-width:720px` rule, every `.quadrant-plot-layout + .plot-foot > p` was assigned `grid-row:2` while spanning both grid columns. The keyboard help and midpoint explanation therefore occupied the same grid cell. At 390px in the pre-fix build, browser geometry showed both nonempty paragraphs at the same top and bottom coordinates.

The narrow rule now uses automatic row placement for each paragraph. The paragraphs continue to span the full footer width, while the Clear action and plotted-count remain on the first row. No plot geometry, Assessment, coordinate, drag, keyboard, persistence, or safety behavior was changed.

## Codex verification

Verification used the isolated headless Edge profile and current static build served on the existing same-origin fixture. This is Codex Browser Verification, not Human Browser Acceptance.

- Before the fix, at a 390px viewport, the keyboard help and midpoint explanation had identical vertical bounds (y=1202.8–1240.2px); overlap was reproduced. The measured document width was 390px.
- After the fix, with The Ashen Crown loaded and two populated axes selected, ten plot points rendered. At 390px, the two nonempty explanatory paragraphs occupied separate rows, had no vertical intersection, and `scrollWidth` equaled `clientWidth` (390px).
- At 1280px, both explanatory paragraphs remained separate and readable; `scrollWidth` equaled `clientWidth` (1265 CSS pixels in the browser's available layout area).
- An ArrowUp edit changed the focused plotted Entity's Y value from 3 to 4, refreshed its accessible name and live status, and retained point focus.
- The isolated build's `second-pass.css` hash matched the source file.

Automated verification:

- `npm.cmd run check`: PASS; syntax checked 37 application modules and all 165/165 tests passed.
- `npm.cmd run build` to the local same-origin fixture: PASS; 59 static files built.
- `git diff --check`: PASS for this checkpoint.
- ParameterPlotter has no separate lint script.

Home and Matrix's 390px Human PASS results above are retained as Human evidence. The runtime change is limited to the narrow Quadrant footer rule; this Codex browser run did not repeat their complete interactions.

## Safety and acceptance boundary

The existing Cross-Context Workspace Safety decision and playbook remain applicable: E2R-SPEC `docs/cross-app/cross-context-workspace-safety-design-2026-10-10.md`, Knowledge `decisions/cross-context-workspace-safety.md`, and `playbooks/workspace-safety-review-and-acceptance.md`. No safety contract, locale behavior, Dataset, schema, Validator, Candidate state, or Application Version changed.

At the time of this checkpoint, Human review of the corrected Quadrant explanations was pending. That pending state was later resolved by Human Tests 23-24, recorded below. Tests 16-21 and the reported Home/Matrix parts of Test 22 remain limited Human PASS; this later Quadrant closure does not broaden those boundaries.

Other pending scope remains unchanged: exhaustive cross-tab form coverage, strict BFCache and abnormal-termination recovery, production GitHub Pages same-origin behavior, production HTTPS/CORS Handoff, and complete Cross-Context Workspace Safety acceptance. Publication remains NO-GO.


## Follow-up: plotted-count hierarchy and Tests 23-24

Human Browser Acceptance evidence:

| Test | Human-reported result | Acceptance boundary |
|---|---|---|
| 23 | PASS | At 390px, the explanatory paragraphs no longer overlap and are readable; no observed issue with the graph/explanation arrangement. This confirms the paragraph-overlap correction only. |
| 24 | PASS | At 1280px, the explanatory paragraphs no longer overlap and are readable. This confirms the paragraph correction only. |
| Follow-up observation | UX issue reported | At 1280px, "0 plotted" appeared mixed into the explanatory text. This is a distinct follow-up and was not included in Tests 23-24 PASS. |

### Count placement finding and correction

Before this follow-up, the shared `.plot-foot .small { flex: 1 }` rule also applied to the plotted-count `span`. At 1280px, browser geometry showed the midpoint explanation and count sharing one flex row, each taking about half of the available width. This made the count read as part of the explanatory copy. The count now has a dedicated footer row wrapper and a compact neutral status treatment. On narrow screens it remains aligned with the optional Clear control row, with its badge visually distinct. Count text and calculation are unchanged.

### Codex verification and remaining acceptance

The isolated Edge browser fixture at `http://127.0.0.1:5308/e2r-parameter-plotter/` was used with a disposable Ashen Crown sample. At 390px and 1280px, the two explanation paragraphs remained separate and the count badge was visually distinct. Both zero-count and populated-count states were checked; populated axes showed ten points. Document width matched the viewport at 390px and the available 1265px layout width at the 1280px emulation. ArrowUp changed the focused point Y value from 3 to 4, retained focus, and updated the accessible name and live value status. This is Codex Browser Verification, not Human Browser Acceptance.

At the time of this follow-up, plotted-count placement remained pending Human review. Human subsequently confirmed the plotted-count presentation in screenshots at 390px and 1280px; see the bounded closure below. Tests 23-24 still cover paragraph readability only. Home, Matrix, and workspace-safety boundaries are unchanged. Publication remains NO-GO.


## Follow-up: pointer-to-keyboard focus and Human Tests 25-26

### Human Browser evidence

| Test | Human-reported result | Acceptance boundary |
|---|---|---|
| 25 | PASS | With The Ashen Crown and Command Authority / Combat Capability selected, ten Entities were plotted and the `10 plotted` count displayed normally. This records the reported sample/axis result only. |
| 26 - Tab-origin editing | PASS | ArrowUp edited the point reached by keyboard focus. |
| 26 - Mouse-to-keyboard | FAIL | Clicking Rowan Vale selected it, but ArrowUp did not edit it; subsequent Tab appeared to skip that point. This is the observed interaction that motivated the correction. |
| 26 - corrected interaction | PENDING at that time; superseded below | The post-fix Human retest is recorded in the formal closure section. |

### Cause and correction

Quadrant points are native buttons in ordinary document Tab order. Arrow editing is routed only when the event target is the focused `[data-point]` button. The pointer drag handler calls `preventDefault()` on pointerdown, which suppresses the browser default focus transfer. A click then updated `s.selected` and rerendered, but did not restore DOM focus. The mouse-selected Entity and keyboard editing target therefore diverged; Tab continued from the prior focus location, making the clicked point appear skipped.

After a completed point click, the app now clears the previous keyboard announcement, updates the selected Entity, rerenders, restores focus to that same point with `preventScroll`, and restores the prior document scroll position. Drag-to-place/return callbacks are unchanged. Native button semantics, Tab order, point role, arrow mapping, Assessment validation and immediate save path are unchanged.

### Codex verification

On the isolated Edge fixture at `http://127.0.0.1:5308/e2r-parameter-plotter/`, a disposable English Ashen Crown Dataset was loaded and the requested axes selected. Before the correction, clicking Rowan Vale left `document.activeElement` at `BODY`; Rowan became selected but ArrowUp did not change its label/value. After the correction, the same pointer click left Rowan Vale selected and focused (`focusIndex` 3 in the plotted-point list). ArrowUp changed Combat Capability from 5 to 6, retained focus on Rowan, and updated its accessible name and polite status. Tab then followed native document order to Rowan's adjacent label button; the clicked dot was not skipped from the current focus position. This is Codex Browser Verification, not Human Browser Acceptance.

At 390px and 1280px emulation, document width matched the available viewport width (390px and 1265px respectively), with no horizontal overflow. The operation used the existing selected/Focus visual emphasis and did not alter the plotted-count or footer layout. Screen-reader output was not tested. At the time of this follow-up, plotted-count responsive placement was pending Human review; subsequent screenshot confirmation and Test 25 are recorded in the closure below.

Automated verification after this correction: `npm.cmd run check` passed syntax checks for 37 application modules and all 166/166 tests. `scripts/build-pages.mjs` built 59 static files into the isolated same-origin fixture; the fixture CSS hash matched source. The existing pointer drag path is preserved by code inspection and the interaction regression test; a new drag gesture was not performed in this browser run.

At the time of this entry, Human retest of Test 26 was pending. Human later confirmed click followed by ArrowUp and separately confirmed the next Tab destination in Test 27; see the formal closure below. Cross-Context Workspace Safety full acceptance and publication remain pending / NO-GO.


## Formal closure: Quadrant Footer and Pointer-to-Keyboard Focus

Human Browser Acceptance is PASS / CLOSED for the limited Quadrant observations in Tests 23-27. The prior Test 22 visual failure and Test 26 pointer-to-keyboard failure remain in the history above; the later Human checks below supersede their former pending/failed current status only for the corrected behavior they exercised.

| Test / observation | Human result | Confirmed scope |
|---|---|---|
| 23 | PASS | At 390px, the Quadrant explanatory paragraphs no longer overlap and are readable. |
| 24 | PASS | At 1280px, the explanatory paragraphs remain separate and readable. |
| Plotted count | PASS | Human screenshots at 390px and 1280px show "0 plotted" visually independent from explanatory text. |
| 25 | PASS | The Ashen Crown with Command Authority / Combat Capability plots ten Entities and displays "10 plotted". |
| 26, after correction | PASS | Human clicked a plotted Entity and successfully used ArrowUp. Tab-origin Arrow editing was already Human PASS. |
| 27 | PASS | After clicking Rowan Vale, one Tab press moved focus to that point's Name label, matching the existing Tab order. |

### Evidence boundaries

Human-confirmed actions are the viewport observations and pointer/keyboard actions listed above. Separately, Codex Browser Verification confirmed the edited Assessment value, accessible name and polite status update, and focus retention. The automated interaction regression test and code review confirm the existing drag path remains wired; a drag gesture was not performed during the Codex browser run. No screen-reader device or runtime review was performed. No PASS is claimed for other operations, viewports, browsers, or assistive technologies.

### Closure boundary and remaining safety work

This closes only the Quadrant footer presentation and pointer-to-keyboard focus improvement represented by Tests 23-27. It does not close Cross-Context Workspace Safety. Pending work includes strict BFCache behavior, abnormal-termination recovery, exhaustive cross-tab coverage of all forms, production GitHub Pages same-origin behavior, production HTTPS/CORS Handoff, and untested browser/viewport/assistive-technology combinations. PUBLIC RELEASE NO-GO remains in force. Preserve these boundaries in successor acceptance records.
