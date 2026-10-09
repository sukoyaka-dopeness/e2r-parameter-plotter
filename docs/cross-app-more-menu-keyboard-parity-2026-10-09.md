# Cross-App More Menu Keyboard Parity

Date: 2026-10-09

## Audit

ParameterPlotter used a native `details/summary` disclosure with a labeled
`group` containing native Open Dataset and Export buttons. It had no Arrow,
Home, or End focus navigation and did not move focus into the actions when the
disclosure opened. Escape closed the disclosure and restored trigger focus;
Tab was not specially managed; outside click dismissed it. Open Dataset
restored trigger focus before opening the file picker, while Export closed the
disclosure without doing so.

NarrativeLine uses a custom `button` disclosure with `aria-haspopup="menu"`, a
`menu`, and `menuitem` buttons. Opening focuses the first item; ArrowUp/Down
wrap and Home/End select endpoints; native buttons handle Enter/Space. Escape
closes and restores trigger focus. Tab closes without preventing the browser's
normal traversal. Outside pointer dismissal restores trigger focus, and
activation closes and restores focus before running the action.

LiaisonScape keeps native `details/summary`, focuses the first enabled action
when opened, supports wrapping ArrowUp/Down and Home/End while skipping
disabled actions, and uses native buttons for Enter/Space. Tab closes without
preventing traversal; Escape closes and restores trigger focus; outside
pointer dismissal closes without forcing focus back. Its action list is
application-managed and does not assign menu/menuitem roles.

## ParameterPlotter change

ParameterPlotter retains its native disclosure and app-specific actions. Its
panel now exposes `role="menu"` with `menuitem` buttons, and the trigger
declares `aria-haspopup="menu"`. Opening focuses the first enabled action.
ArrowUp/Down cycle enabled actions; Home/End move to the first/last. Enter and
Space remain native button activation. Escape closes and restores the More
trigger. Tab and Shift+Tab close the disclosure without preventing native
browser traversal or trapping focus. Outside click remains a dismissal, and
Open Dataset / Export close before performing their existing action; both
return focus to the trigger where appropriate.

The human-selected text-row presentation and its focus-visible styling are
unchanged. This checkpoint does not change NarrativeLine or LiaisonScape.

## Verification and acceptance

`npm.cmd run check` passed: syntax checked 33 application modules and all
134 tests passed. Focused keyboard tests cover opening focus, wrapping,
Home/End, disabled actions, Tab/Shift+Tab, Escape focus return, and native
Enter/Space behavior. Existing checks continue to cover Dataset acquisition,
Export, outside dismissal, and action wiring.

Computer Use could not initialize: `cua.getState()` failed because Windows
sandbox setup refresh reported `helper_unknown_error`. No Codex real-browser
PASS is claimed. Human Browser Acceptance for this keyboard change remains
**PENDING**. Review should verify first-item focus on open; ArrowUp/Down,
Home/End, Enter/Space; natural Tab/Shift+Tab exit and dismissal; Escape focus
return; disabled Export behavior; pointer opening/outside dismissal; and
keyboard operation in EN/JA at normal and narrow widths.
