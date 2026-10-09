# Radar and Quadrant Keyboard Assessment Editing - 2026-10-09

**Status: IMPLEMENTED / AUTOMATED CHECKS PASS / HUMAN BROWSER ACCEPTANCE PENDING**

Implementation is based on source `f12f3b71b02ca384ed0f085d138ae59d6c388740`.
It preserves the separate one-axis Radar and two-axis Quadrant editing roles.

## Radar keyboard adjustment

The effective capture-phase Radar handler at the source revision already used
the intended local increments: `1` for integer-only Dimensions and `0.05` for
other Dimensions. It validated the candidate against that Dimension and did
not clamp it to the generic `-1..1` plot-position interval. An earlier
bubble-phase handler still contained the superseded generic clamp. This
checkpoint removed that stale handler path and centralized the step and value
acceptance logic. Modified arrow chords are left to the browser; only plain
arrow keys edit values.

The `0.05` continuous adjustment is the existing Radar interaction guidance,
not a new portable precision rule. `decimalPlaces` remains a display/random
hint; keyboard edits use exact decimal addition and are not rounded to that
hint. A step that would cross the Dimension's MIN/MAX or violate its
integer-only constraint is rejected without changing the stored Assessment.
No existing out-of-range record is repaired or normalized.

This describes the original `e726fba` implementation. Human Browser Review
later found that 0.05 gave too little movement for wide ranges, and that
Quadrant edits could move the page while the full view rerendered. The
follow-up at the end of this document supersedes the original keyboard-step
policy and records the bounded scroll correction; this historical section is
retained as evidence of the original implementation.

## Quadrant keyboard editing

When a plotted point has focus, plain Left/Right adjust its selected X
Assessment down/up; Up/Down adjust its selected Y Assessment up/down. The same
Dimension-local step policy and validation used for Radar applies. A key press
immediately writes only that Entity's selected axis value through the existing
`setValue` and browser-local save path. The other axis and other records stay
unchanged. At a range or integer boundary the value stays unchanged and a
localized status explains the result.

Focus returns to the same plotted point after each successful update. A visible
EN/JA instruction describes the axis mapping and is referenced by each point's
`aria-describedby`. The point's accessible name continues to contain the
Entity name and current X/Y values; a polite live status reports both current
axis names and values after keyboard editing. Dataset-authored names and
Dimension labels are preserved in their original language.

Only unmodified arrow keys are intercepted. Alt/Ctrl/Meta/Shift arrow chords,
including browser navigation shortcuts, are not consumed. Enter/Space, point
role, Tab order, mouse selection and drag, and right-click / Shift+F10 remain
unchanged. The withdrawn all-Dimension Assessment Details popover was not
reintroduced.

## Verification and acceptance

Focused regression tests cover independent asymmetric ranges, negative and
zero values, integer-only steps, decimal arithmetic without rounding,
range rejection, axis mapping, authored-name preservation, and focus/key
routing. `npm.cmd run check` passed: 30 application modules syntax-checked and
116/116 tests passed.

Computer Use initialization failed with
`helper_unknown_error: setup refresh had errors`; no Codex real-browser test
was completed. Human Browser Acceptance remains pending for Radar and
Quadrant, including keyboard focus retention, repeated edits, narrow EN/JA
layout, read-only behavior, and continued drag/context-menu behavior. No
screen-reader output was tested. View Header UX acceptance also remains
pending. Drawer UX remains Accepted / Closed, and the independent Cross-App
More-menu presentation follow-up remains OPEN.

## Human Browser Review follow-up: scroll and range-derived steps - 2026-10-09

**Status: IMPLEMENTED / AUTOMATED CHECKS PASS / HUMAN BROWSER ACCEPTANCE PENDING**

Human Browser Review confirmed that Quadrant arrow-key editing changed the
focused point's X/Y Assessment, but the page scrolled vertically during Up/Down
edits. Source inspection found that the capture-phase handler prevented the
plain arrow key's browser default, then changed one value, replaced the app
root through `update()`/`render()`, and restored focus to a newly rendered
point with `preventScroll`. It did not preserve the document scroll position
around the full-root replacement. The browser-level contribution of rerender
layout versus focus restoration could not be isolated in this environment;
the implementation now preserves the document scrollport around that
Quadrant update and focus restoration. A handled plain arrow remains
prevented even when the value is already at a boundary. Modified arrow chords
continue to pass through to browser behavior.

Radar and Quadrant now share a range-derived keyboard step. Decimal
Dimensions use one tenth of `(MAX - MIN)`, calculated through the existing
decimal arithmetic helpers; this does not create a stored precision rule and
does not use `decimalPlaces` to round values. Integer-only Dimensions narrower
than 20 use a step of 1. At widths of 20 or more, the tenth-range step is
rounded to the nearest integer using JavaScript `Math.round` (positive half
values round upward), with a minimum step of 1. A final step is limited to the
nearest valid endpoint, using `ceil(MIN)` and `floor(MAX)` for integer-only
Dimensions. An existing value that is invalid for its Dimension is left
untouched. The test-policy threshold and rounding choice follow the Human's
instruction for this trial; no E2R precision or schema contract was added.

The Radar chart's visible instruction now describes the range-proportional
step rather than the superseded fixed 0.05 step. Its focus status announces
the actual formatted step for the selected Dimension in EN/JA. Dimension
names remain Dataset-authored text.

Focused tests cover decimal and integer step examples, the width-20 threshold,
nearest-integer rounding, fractional integer bounds, endpoint arrival and
repeated boundary keys, invalid existing values, independent Quadrant axes,
scroll capture/restoration, and modified-key routing. `npm.cmd run check`
passed: 31 application modules syntax-checked and 118/118 tests passed.
Computer Use initialization failed before a browser window could be selected
(`orchestrator_helper_report_read_failed`, while reading `setup_error.json`),
so no Codex real-browser result is claimed. Human Browser Acceptance for
Radar / Quadrant and View Header remains pending. Human review should verify
repeated Up/Down edits and boundary keys do not move the page, value/Focus
updates remain visible, the changed range-step guidance is clear in EN/JA,
and drag/context-menu behavior remains intact.
