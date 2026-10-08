# View Header Keyboard Focus Investigation — 2026-10-08

**Status: IMPLEMENTED / AUTOMATED CHECKS PASS / HUMAN BROWSER ACCEPTANCE PENDING**

Base source: `23116f1ab1b5a24d0bb57c7d07294599eb4969b3`.

## View Header navigation focus

The delegated click handler updated the selected Entity or page and called
`update()`. `update()` saves and renders synchronously, and `render()` replaces
the application root with `root.innerHTML`. That destroys the activated
navigation button. No logical focus restoration followed the Entity, Quadrant
waiting-Entity, or Matrix page update, so keyboard activation left focus without
an actionable Header control.

The bounded fix records a navigation focus request only for a native
keyboard-style activation (`click.detail === 0`) of an arrow inside the shared
View Header control. After the render, it focuses the same direction and role
with `preventScroll`. Pointer clicks, view switching, Matrix minimap paging, and
other actions do not request restoration. If that arrow is disabled by the new
state, such as Next at the final Matrix page, focus moves to the remaining
enabled arrow in that same Header navigator. Entity paging retains its existing
cyclic behavior. Quadrant waiting-Entity arrows retain their existing enabled
and cyclic behavior.

Automated regression tests cover keyboard-only request capture, exclusion of
non-Header controls, same-direction restoration, no-scroll focus, disabled
Matrix-boundary fallback, and wiring in all three navigation handlers.
`npm.cmd run check` passed with 28 application modules syntax-checked and
106/106 tests passing.

Codex browser interaction verification was attempted against a temporary local
server at `http://127.0.0.1:4184/`. The Computer Use runtime failed twice during
initialization with `trusted Node process exited unexpectedly; kernel reset`.
No browser interaction PASS is claimed. Human Browser Acceptance remains
pending for the full View Header checkpoint.

## Quadrant plotted-point keyboard investigation

Each plotted point is rendered as a native `<button>` with a computed
accessible name containing the Entity name and the two displayed values. The
point label is a separate button that selects the Entity. Focus styling
highlights the point and raises its plot item in stacking order. The plotted
point button participates in Tab order because it is a native button; it does
not declare a slider role or a `tabindex` override.

This behavior is visible in `views.js` (`data-point`, `aria-label`, and the
separate `data-select-entity` button), `main.js` (the `pointerdown` handler and
absence of a `data-point` keyboard action), and `quadrant-drag.js` (pointer
release selects when the point was not dragged).

Pointer input is handled from `pointerdown`: dragging a point authors the two
selected Dimension values through the existing placement path, while a
non-drag pointer release selects the Entity. There is no `keydown` handler for
`data-point`, so Arrow keys do not move its coordinates. Enter/Space produce a
native button click, but the delegated click handler has no `data-point` action;
keyboard activation of that particular point control currently has no action.
The separate Entity-label button selects the Entity with Enter/Space. Keyboard
users can inspect and edit recorded values through Profile's numeric/slider
controls and Matrix's numeric controls, and can select Quadrant axes through
native selects. Matrix and Radar also retain their own documented keyboard
editing controls.

This investigation does not adopt keyboard coordinate editing or change the
point's focusability. The focusable button's no-op keyboard activation is an
accessibility concern to review with Human; resolving it would change the
Quadrant point's interaction contract. No Quadrant runtime change was made in
this checkpoint.

## Scope and status

This follow-up does not close the View Header Human Browser Acceptance. The
Drawer UX acceptance remains Accepted / Closed. The independent Cross-App More
menu presentation follow-up remains OPEN. No Dataset, sample, schema, Validator,
or E2R-SPEC files were changed.
