# Cross-App More Menu Acceptance Closure

Date: 2026-10-09

## Status

**HUMAN BROWSER ACCEPTED / PASS / CLOSED**

**(BOUNDED CROSS-APP MORE MENU PRESENTATION AND KEYBOARD PARITY)**

Accepted implementation revisions:

- ParameterPlotter: `1c02e24e226970d1b1c9123283d0733442cd4ce5`
- NarrativeLine: `0440459c054adc391b76c5626295172b1a1bc571`
- LiaisonScape: `fa890887365274a100c7e6712cb68a33019dc8c8`

ParameterPlotter's keyboard-navigation correction is commit
`e0b09f2f5446fd1a6b0eccff5db99950c6ebd345`, included in its accepted source
revision above.

## Human Browser evidence and accepted scope

Human reviewed the More menus in all three applications and confirmed the
visual alignment. This included the NarrativeLine reference presentation,
the corrected ParameterPlotter and LiaisonScape typography/density, and the
neutral secondary-action presentation of the NarrativeLine More trigger.
The Human had identified that ParameterPlotter used Tab between menu actions
while NarrativeLine and LiaisonScape used ArrowUp/Down. After the
ParameterPlotter keyboard correction, Human reported that it appeared fixed
and that no remaining problems were apparent.

This closes the reviewed cross-app differences: menu typography and visual
hierarchy, More-trigger presentation, and the reported ArrowUp/Down versus
Tab navigation difference. Each app retains its own menu items and actions.
The acceptance relies on Human Browser Review; it is not inferred from
automated checks.

## Interaction contract retained

- **NarrativeLine:** custom trigger/menu with first-item focus, wrapping
  ArrowUp/Down, Home/End, native Enter/Space activation, Escape focus return,
  and Tab dismissal without a focus trap. Outside-pointer dismissal and
  activation restore trigger focus.
- **LiaisonScape:** native `details/summary`, first-enabled-item focus,
  wrapping ArrowUp/Down, Home/End, native Enter/Space activation, Escape
  focus return, and Tab dismissal without preventing browser traversal.
  Outside-pointer dismissal closes without forcing focus back. Disabled
  actions are skipped by arrow navigation.
- **ParameterPlotter:** native `details/summary`, first-enabled-item focus,
  wrapping ArrowUp/Down, Home/End, native Enter/Space action activation,
  Escape focus return, and Tab/Shift+Tab dismissal without a focus trap.
  Outside click closes the disclosure; Open Dataset and Export retain their
  existing behavior and focus the trigger when they close the menu.

These descriptions record current implementation behavior. Human acceptance
does not imply that every transition in each list was individually exercised.

## Automated and non-Human evidence

Current automated verification:

- ParameterPlotter: `npm.cmd run check` passed; syntax check covered 33
  application modules and 134/134 tests passed.
- NarrativeLine: `npm.cmd test` passed, 350/350 tests.
- LiaisonScape: `npm.cmd test` passed, 658/658 tests. The run emitted
  non-failing jsdom `attachEvent` / `detachEvent` diagnostics in input-focus
  tests.

Earlier implementation checkpoints also record ParameterPlotter and
LiaisonScape lint/build results. These automated results are distinct from
Human Browser evidence. No Codex real-browser PASS is claimed for this
closure.

## Explicit limits and separate statuses

This is not acceptance of screen-reader output, every browser/viewport,
exhaustive disabled-item permutations, or all possible menu/Tab focus
destinations. Those remain **not verified / not claimed**; they do not reopen
the bounded Human-reviewed corrections. No new application-wide acceptance,
cross-app component contract, release readiness, or publication approval is
implied.

Earlier per-repository implementation checkpoints that recorded
`HUMAN BROWSER ACCEPTANCE PENDING` remain as historical evidence. This later
closure is their bounded disposition. The E2R-SPEC follow-up remains unchanged
because that repository was treated as read-only for this checkpoint; it still
contains its earlier planning status and should be synchronized separately if
current central planning requires it.

The Knowledge entry `cross-app-menu-typography-cascade.md` remains a
**Hypothesis**: this accepted result validates the bounded app corrections,
not a universal CSS-cascade rule.
