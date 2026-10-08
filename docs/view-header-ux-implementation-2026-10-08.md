# View Header UX bounded implementation — 2026-10-08

**Status: IMPLEMENTED / AUTOMATED CHECKS PASS / HUMAN BROWSER ACCEPTANCE PENDING**

Base source: `c99a091b2a69b97bb1d5f3babacf0eb9f95a77d5`.

## Findings and changes

The Entity pager's current-name button had a 42px fixed height and a 1.1 line
height. Its name was forced onto one line with hidden overflow and an ellipsis,
and the pager button itself also hid overflow. Those rules could truncate a
long name and clip text at the line box boundary, consistent with the Human
observation of the `g` descender in “Neil Armstrong”.

The shared `.view-head` used a centered flex row. Profile, Radar, Quadrant,
and Matrix supply different amounts of heading text and different controls, so
centering made the control's vertical position depend on the height of its
neighbor. This was a layout relationship, not a reason to remove view-specific
information or impose one fixed header height.

The bounded correction uses a two-column grid on wider screens and a single
column at the existing 720px breakpoint. Both columns start at the top; the
header keeps its natural content height. Pager names can wrap, the current
button grows when needed, and neither the button nor the name clips overflow.
Pager metadata can wrap as well. Existing view controls, labels, focus styles,
and view-specific content remain intact.

## Automated and browser evidence

`view-header.test.mjs` checks the shared header markup for all four renderers,
retention of the primary Entity and Matrix navigation controls, natural-height
top-aligned CSS, the narrow single-column rule, and wrapping/visible overflow
for the Entity name. These are source and renderer regression checks, not
visual acceptance.

`npm.cmd run check` passed: syntax validation covered 27 application modules,
and all 102 tests passed.

An isolated headless Microsoft Edge session connected to the running app at
`http://127.0.0.1:4183/` through the E2R CDP helper. The bundled sample was
opened in that temporary browser profile. EN and JA were each measured at
1280px, 700px, and 390px for Profile, Radar, Quadrant, and Matrix. In all
states, the heading and control top edges aligned, and the document had no
horizontal overflow. Header height remained content-driven: the longer
Quadrant copy could make its header taller without shifting the control's top
edge. `Neil Armstrong` fit within the pager, and long Japanese and long
unbroken English test names wrapped with the button growing to its content;
the live computed style used normal whitespace and visible overflow.

This was Codex browser geometry evidence only. View tabs were activated to
render each view; this did not constitute a Human visual review or a complete
keyboard, paging, accessibility, or cross-browser interaction test. A CDP
screenshot capture timed out, so no screenshot evidence was obtained. Human
Browser Acceptance remains pending.

## Human review still required

- Review EN and JA at ordinary and narrow widths across all four views.
- Confirm the full descender in `Neil Armstrong`, and long Japanese and long
  English Entity names, remain visually legible without overlap.
- Confirm header title, supporting copy, and controls have a natural shared
  top alignment while view-specific content remains present.
- Exercise Entity paging, Matrix paging, view switching, keyboard focus, and
  narrow-layout selection controls.

The accepted Drawer UX checkpoint remains closed and unchanged. The separate
Cross-App More-menu follow-up and the non-blocking Primary hue observation
were not changed. No Human Acceptance status was expanded by this checkpoint.
