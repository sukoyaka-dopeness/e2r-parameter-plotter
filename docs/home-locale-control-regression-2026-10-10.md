# Home Locale Control Regression

**Date:** 2026-10-10
**Status:** Codex Browser Verified; Human Browser Acceptance pending. Publication remains NO-GO.

## Finding

In the same-origin fixture at `http://127.0.0.1:5308/e2r-parameter-plotter/`, a second ParameterPlotter tab with active unapplied work caused the Home peer-status warning to appear. The Header language control was then absent. The current `render()` wrapper normally renders the Home surface and appends `localeControlMarkup(locale)` to its Header. `refreshHomePeerWorkStatus()` bypassed that wrapper by invoking `renderHome()` directly, replacing the Header without restoring its language control. The asynchronous peer-status update therefore exposed a second Home rendering path and caused the regression.

## Change

The peer-status refresh now calls the normal `render()` entry point when the active surface is Home. Peer queries, warning state, and same-app coordination remain active. This reuses the established Header/locale rendering path and preserves current locale preference, startup locale, and Handoff resolution behavior. The assessment draft safety logic from the preceding checkpoint is unchanged.

A regression assertion was added to `interaction-wiring.test.mjs` to require the Home peer-status update to use the complete render path.

## Verification

The prior fixture build reproduced the failure in isolated Edge: after a peer tab created an unapplied Dimension draft, Home showed the peer warning but had zero `.locale-control` buttons. After rebuilding the current source into the fixture and opening a fresh isolated browser context:

- Home retained one language control after the initial peer-status check.
- Switching from Japanese to English updated `document.documentElement.lang` and left the control available.
- Opening the Ashen Crown workspace showed one language control in the Workspace Header.
- At 390px, both Home and the Workspace Header kept the control inside the viewport; document `scrollWidth` equalled `clientWidth` (390px) in both surfaces.
- At 1280px, both Home and the Workspace Header kept the control visible and within the viewport; document `scrollWidth` equalled `clientWidth` (1280px).
- Creating and cancelling an unapplied Dimension form in one tab caused the other tab's warning to appear and clear; the Home language control remained present throughout.
- At a 390px viewport with the warning visible, the control remained within the viewport and document `scrollWidth` equalled `clientWidth` (390px).

The browser was isolated Headless Edge controlled by local CDP because CUA initialization was unavailable. This is Codex Browser Verification, not Human Browser Acceptance. The test was limited to the local same-origin fixture and the exercised locale/status paths; it does not establish production or screen-reader acceptance.

Automated validation: ParameterPlotter syntax check passed (36 modules), tests passed (156/156), build passed. `git diff --check` passed; Git emitted only the existing LF-to-CRLF working-copy notices.

## Boundaries and remaining acceptance

No locale precedence, storage ownership, Handoff, Dataset, or cross-tab safety contract changed. The locale button was tested for visibility and locale switching; Dataset language remained independent. Human should recheck the Home initial state, a peer warning appearing/clearing, language switching while Home is updated, and the Workspace Header at ordinary and 390px widths. Broader PP × PP and PP × NarrativeLine Human Acceptance remains pending, as does production same-origin verification.

The existing staged/unstaged work in this repository was preserved. No commit was created because `main.js` has overlapping staged and unstaged safety changes; this checkpoint's changes remain uncommitted and separate from the existing index state. `.github/FUNDING.yml` was left untouched. No public action was performed.
