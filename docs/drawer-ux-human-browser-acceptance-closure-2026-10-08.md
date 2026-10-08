# Right Drawer UX Human Browser Acceptance — 2026-10-08

Status: **HUMAN BROWSER ACCEPTED / PASS / CLOSED**
**(BOUNDED PARAMETERPLOTTER DRAWER UX IMPROVEMENT)**

Accepted source: `020734933114b5dccda64b461d379f18c4802822`
(`0207349`, “Align Drawer action controls and reveal entity menu”).

Human reviewed the implementation in Edge InPrivate at
`http://127.0.0.1:4183/` and reported PASS for the following bounded scope:

- Workspace and right Drawer ordinary-action button sizing is aligned in EN
  and JA, at ordinary and narrow widths.
- Primary, Secondary, and Destructive actions retain distinct visual roles.
- Opening an Entity action menu scrolls only as much as needed to show its
  actions; an already visible menu does not cause unnecessary scrolling.
- The background Workspace does not scroll when the menu is revealed.
- Tab, Escape, and focus behavior pass in the reviewed flows.
- Edit and Delete actions work, including their confirmation and cancellation
  flows.

Human confirmed the visual distinction after reviewing the meaning of the
Primary action. This review accepts only the two Drawer improvements in the
listed source. It does not establish behavior in every browser or viewport,
screen-reader behavior, or untested operation paths.

## Evidence types

The implementation checkpoint records `npm.cmd run check` as PASS, including
syntax validation of 27 application modules and 100/100 tests. It also records
HTTP 200 responses for the application and the changed JavaScript and CSS.
These are automated and server-response checks. Codex Computer Use did not
produce browser evidence because its helper failed to initialize with
`helper_unknown_error: setup refresh had errors`. Human Browser Review is the
separate acceptance evidence above.

The earlier implementation checkpoint and Human-observed OPEN entries remain
as dated history. This review is their later formal disposition for the two
Drawer issues; it does not rewrite the earlier observations.

## Separate status

- ParameterPlotter Candidate 0.2.0 integration, EN/JA locale, The Ashen Crown
  canonical JA text repair, and The Ashen Crown EN bundled sample retain their
  previously recorded bounded Accepted / Closed statuses.
- Dimension Assessment Candidates `0.1.0` and `0.2.0` remain non-Stable.
- The Human-selected Cross-App More-menu presentation remains OPEN and
  unimplemented.
- No Product-wide, Cross-App, Stable, release, deployment, or publication
  acceptance is implied.

## New Human-observed View Header follow-up

Status: **OPEN / NOT IMPLEMENTED / NOT HUMAN-ACCEPTED**

During the same Human Browser Review, the following independent presentation
issues were observed:

1. On the Profile view, the lower part of the `g` in the Entity switcher label
   “Neil Armstrong” appeared clipped. The relationship to descenders,
   line-height, text-area height, or overflow is unknown. Inspect the current
   DOM, CSS, and browser rendering before proposing a correction.
2. Across Profile, Radar, Quadrant, and Matrix, the vertical alignment and
   height of the View title, supporting text, Entity switcher, and navigation
   controls appeared inconsistent. Review the shared View Header in context
   of each view's content and conditions. No fixed-height solution or other
   implementation approach is selected.

These are Human observations, not confirmed source-level causes. They are
independent of the Drawer Closure and remain unimplemented and unaccepted.

Human also noted a purple/navy hue difference between ParameterPlotter Primary
buttons and other E2R applications. Human explicitly accepts the current hue
for now; this is non-blocking and creates no required correction in this
checkpoint.
