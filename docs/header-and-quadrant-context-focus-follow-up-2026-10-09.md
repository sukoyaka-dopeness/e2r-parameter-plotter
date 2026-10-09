# Header Navigation and Quadrant Context Menu Focus Follow-up - 2026-10-09

**Status: IMPLEMENTED / AUTOMATED CHECKS PASS / HUMAN BROWSER ACCEPTANCE PENDING**

Base source: `a926a90726fdab07541626c601f218ddaffbb992`.

## View Header navigation scroll

The three rerendering Header navigation paths (Entity paging, Quadrant
waiting-Entity paging, and Matrix paging) restored keyboard focus with
`preventScroll`, but did not preserve the document scroll offset across the
full-root render. Human Browser Review observed large vertical movement when
Enter activated the Radar and Quadrant Entity arrows. The exact browser-level
trigger was not isolated; the source path did replace the root and restore
focus without scroll preservation.

Keyboard-originated navigation now captures the document scroll position
before changing state. After rendering, it restores that position, restores
focus to the same direction (or the existing enabled-arrow fallback), then
minimally reveals the focused control if changed layout left it outside the
viewport. Pointer activation does not request focus restoration or scroll
management. This is shared by the Header pagers and Matrix navigator; cyclic
navigation semantics are unchanged.

Focused tests cover page-position restoration after a simulated scroll-anchor
shift, minimal reveal for a control moved offscreen, focus restoration, and
continued Matrix-boundary fallback.

## Quadrant context menu focus order

The menu was rendered at the end of the application root, before the Footer.
Its native sequential focus order therefore continued to the distant Credits
control after the last menu item. The menu is now moved directly after the
control that invoked it (the plotted point or Entity label). The first menu
item receives focus on opening. Native Tab and Shift+Tab order can then leave
the menu through the neighboring plot controls; focus leaving the menu removes
it without intercepting Tab or adding a focus trap. Escape removes the menu
and restores focus to the original point or label with `preventScroll`.

The existing context-menu actions, Profile transition, Return to waiting
action, right-click and Shift+F10 invocation, and visible focus outline remain
unchanged. Focus movement alone does not mutate Dataset state.

Focused tests cover placing the menu after either invoker, Escape dismissal
and focus restoration, and the non-trapping focus-exit wiring. The existing
context-menu item actions remain in the current delegated click handler.

## Verification and remaining Human review

`npm.cmd run check` passed: 32 application modules syntax-checked and 125/125
tests passed. `git diff --check` also passed.

Computer Use initialization failed before a browser window could be observed
(`trusted Node process exited unexpectedly; kernel reset`). No Codex real-
browser result is claimed. Human Browser Acceptance remains pending for View
Header, Radar, and Quadrant behavior.

Human review should verify:

- Enter and Space repeatedly switch Entities in Radar and Quadrant without
  unnecessary vertical movement, while an offscreen focused arrow remains
  reachable.
- The Matrix navigator retains cyclic movement and focus at page boundaries.
- Shift+F10 from a plotted point and right-click from either plotted control
  open the menu; Tab and Shift+Tab leave through adjacent plot controls;
  Escape returns focus to the invoking control.
- Menu actions still open Profile or return the Entity to waiting, in EN/JA
  and at ordinary/narrow widths.
- Existing Quadrant keyboard editing, point visibility follow, dragging, and
  focus outline remain intact.

The independent Cross-App More-menu presentation follow-up remains OPEN.
Drawer UX remains Accepted / Closed. Quadrant point Enter/Space semantics,
Candidate status, and all other existing Acceptance checkpoints are unchanged.
