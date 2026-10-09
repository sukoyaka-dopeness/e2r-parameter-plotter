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
