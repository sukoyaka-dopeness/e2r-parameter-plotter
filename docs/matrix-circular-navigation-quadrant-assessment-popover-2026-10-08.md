# Matrix Circular Navigation and Quadrant Assessment Popover - 2026-10-08

**Status: IMPLEMENTED / AUTOMATED CHECKS PASS / HUMAN BROWSER ACCEPTANCE PENDING**

Base source: `9f37d9d33516441bb7fc4ab17464e2d1fea80d88`.

## Matrix page navigation

The Matrix Header Previous and Next controls now wrap across the available
Dimension pages. The page count is rendered with the Header navigator so the
action can calculate the next page from the current rendered page set. A
single-page or empty Matrix keeps both Header arrows disabled. The minimap
continues to select its existing relative page target and does not acquire
cyclic behavior. Entity order, Matrix page size, cell editing, and persisted
Matrix state are unchanged. The existing Header focus helper still restores
keyboard-initiated navigation to the same direction after rerender; pointer
activation does not request focus restoration. Native buttons support both
Enter and Space.

## Quadrant Assessment viewing

The plotted point remains a native button. Focus alone does not open content;
keyboard Enter/Space activation and an un-dragged primary pointer click open a
non-modal, read-only Assessment details popover. Opening selects the Entity,
then focuses the popover heading. The popover lists every Dataset Dimension
and its recorded value. Explicit zero and negative values are formatted as
values; absent Assessment records use the existing localized `No assessment`
copy. It does not create or edit values. Dataset-authored Entity and Dimension
names are protected from lexical UI translation.

Escape and the Close button dismiss the popover and restore focus to the point
when that point still exists. The Dimension list is keyboard-focusable and
internally scrollable. Pointer movement past the existing drag threshold keeps
the existing coordinate-authoring path; only an unmoved pointer release opens
the popover. Pointer cancellation does not open it. The existing context-menu
path closes the popover before showing its menu. Opening/closing the popover
does not mutate Dataset assessment data.

The popover is anchored inside the Quadrant plot, constrained to the plot's
available width and height, and scrolls internally when its Dimension list is
long. No viewport-specific visual review was available in this checkpoint.

## Verification and acceptance boundary

Automated verification: `npm.cmd run check` passed with 30 application
modules syntax-checked and 114/114 tests passing. Tests cover Matrix wrap
calculation in both directions, one/empty-page safety, rendered page-count and
single-page controls, popover value/missing distinctions and escaping,
Quadrant rendering, locale handling, and separation of point keyboard
activation, pointer drag, Escape, and focus restoration paths.

Computer Use initialization failed on its first attempt with `trusted Node
process exited unexpectedly; kernel reset`. The permitted retry exited with
`windows sandbox failed: helper_unknown_error: setup refresh had errors`.
No Codex real-browser result is claimed. Human Browser Acceptance for this
checkpoint remains pending. Review should cover
Matrix first/last-page wrap with repeated Enter/Space and focus retention;
Quadrant point Tab/Enter/Space and mouse click; zero, negative, and unassessed
values; Escape/Close focus return; drag and right-click preservation; EN/JA,
long Dimension lists, and narrow viewport containment.

The prior View Header visual and keyboard improvements remain under their
existing Pending Human Browser Acceptance. Drawer UX remains Accepted / Closed.
The independent Cross-App More-menu presentation follow-up remains OPEN and
unimplemented. No sample, Dataset, schema, Validator, or other application was
changed.
