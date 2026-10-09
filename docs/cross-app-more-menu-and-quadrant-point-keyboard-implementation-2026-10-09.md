# More Menu Presentation and Quadrant Point Keyboard Activation

Date: 2026-10-09

Base: `71719f5cd2a6693fe77e1565a106572ec3a3d412`.

## Changes

The Workspace More menu retains its native `details/summary` disclosure, current Open Dataset and Export actions, localization, and responsive placement. Its popup and item rows now use the Human-selected NarrativeLine reference: compact text rows, transparent row backgrounds, inherited 18px application typography, aligned start text, 2px row gap, 4px panel padding, 12rem minimum width, 8px trigger gap, and matching border, hover, and shadow treatment. No menu actions or keyboard contracts were added or removed.

Quadrant plotted-point native button activation by Enter or Space now selects the same Entity as the existing pointer-drag release selection. The delegated click path handles only a native keyboard-style click (`detail === 0`); pointer selection continues through the existing drag interaction. Selection updates the existing workspace state, does not touch Assessment values, does not change views, and restores focus to the same point with document scroll preserved. Arrow-key Assessment editing, pointer dragging, right-click / Shift+F10, and the withdrawn all-Dimension popover remain unchanged.

No dedicated View switching shortcuts were added.

## Verification and acceptance boundary

Focused tests cover the disclosure and text-row style contract, app action retention, keyboard activation event classification, same-point focus restoration wiring, and preservation of the pointer selection/drag path. `npm.cmd run check` passed with 32 application modules and 128/128 tests. Computer Use could not initialize: its retry ended with `windows sandbox failed: helper_unknown_error: setup refresh had errors`; no Codex real-browser PASS is claimed. Human Browser Acceptance for the new visual changes and Quadrant activation behavior is **PENDING**. Review should cover EN/JA, ordinary and narrow widths, menu open/dismiss/focus behavior, Open/Export and app-specific actions, Quadrant Enter/Space selection, preserved focus and scroll, unchanged Assessment data, and coexistence with arrows, drag, and context menu.

NarrativeLine is the visual reference and was not changed. LiaisonScape has a separate implementation result. Existing accepted Phase 1 and Drawer checkpoints remain bounded to their accepted source revisions and do not automatically accept this new source.
