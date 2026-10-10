# Quadrant Narrow-Viewport Fix and Human Acceptance Checkpoint

Date: 2026-10-11

Status: Human PASS recorded for Tests 16-24 within the listed boundaries, including Tests 23-24 for the explanatory paragraphs only. The separate plotted-count polish in this follow-up is Codex-verified; Human review remains pending. Cross-Context Workspace Safety full acceptance and production verification remain pending. Publication remains NO-GO.

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
| 22 — Quadrant | VISUAL FAIL | At 390px multiple explanatory paragraphs below the plot overlapped and could not be read. This is the defect addressed by this checkpoint; it is not Human-accepted yet. |

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

Human Browser review is still needed to confirm that the corrected Quadrant explanations are readable at 390px and that normal-width presentation remains acceptable. Tests 16–21 and the reported Home/Matrix parts of Test 22 remain limited Human PASS; Codex verification does not upgrade the Quadrant result.

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

Human review remains pending for the plotted-count placement at 390px and 1280px. Tests 23-24 remain accepted only for the paragraph-overlap correction. Home, Matrix, workspace safety, and the previous acceptance boundaries are unchanged. Publication remains NO-GO.
