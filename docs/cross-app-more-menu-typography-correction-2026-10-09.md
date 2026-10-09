# Cross-App More Menu Typography Correction

Date: 2026-10-09

## Evidence and cause

Human Browser Review after the earlier presentation changes reported that the
ParameterPlotter and LiaisonScape popup text still looked larger than
NarrativeLine. The NarrativeLine reference is source commit
`46e7fd27c4af9270f60521ed212c19269fa3b877`; the target baselines were
ParameterPlotter `c99b1a2a99ce8c9ea37929221130fba42eb39853` and LiaisonScape
`ffc19576a66dde879344cdb6d598e6fbca64fe8e`.

The mismatch was in the final cascade, not the popup's overall application
font or its common panel treatment. NarrativeLine's late ordinary-control
rule resolves `.workspace-more-item` to 15px text and 120% line height. Both
targets used `font: inherit` on menu rows after the shared 15px control rule,
which reset the font size to the inherited root value: 18px at desktop widths
and, under each app's responsive root rule, 16px at its smaller breakpoints.
Their rows also retained 40px minimum height and 8px-by-12px padding, versus
NarrativeLine's 36px and 5px-by-9px control geometry. The existing 2px row gap,
4px panel padding, border, radius, hover surface, and shadow already matched
the reference treatment.

## Correction

ParameterPlotter's More rows and LiaisonScape's More rows now explicitly
resolve the inherited font family with 15px text, 120% line height, 36px
minimum height, and 5px-by-9px padding. LiaisonScape's narrow trigger label is
also held at 15px rather than shrinking to 14.4px. Popup width remains
content-driven and application-specific. NarrativeLine remained read-only.

The existing native disclosure structures, action contents, disabled states,
localized labels, Escape/outside dismissal, Tab behavior, focus management,
and LiaisonScape's app-managed arrow/Home/End navigation were left intact.

## Verification and acceptance

ParameterPlotter `npm.cmd run check` passed with 32 application modules and
128/128 tests. Its focused More-menu test passed 2/2. LiaisonScape's focused
More-menu presentation and interaction tests passed 2/2; its full suite passed
658/658, `npm.cmd run lint` passed, and `npm.cmd run build` passed. The full
LiaisonScape test run emitted existing non-failing jsdom `attachEvent` /
`detachEvent` diagnostics in tests that focus inputs.

Computer Use initialization failed with
`helper_unknown_error: setup refresh had errors`. A separate headless Edge CDP
launch did not expose the requested local debugging endpoint. No live computed
style or geometry measurement was obtained in this checkpoint. The CSS
cascade and declarations were inspected in source; local app endpoints
responded over HTTP, but that is not a browser visual check. Human Browser
Acceptance remains **PENDING**. Review should compare the open menus in
NarrativeLine, ParameterPlotter, and LiaisonScape at equivalent desktop and
narrow widths, in EN and JA, and verify open/close, focus, disabled entries,
and app-specific actions.
