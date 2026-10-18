# Workspace Brand Initial Focus Correction

Date: 2026-10-18

Status: **LOCAL CORRECTION VERIFIED / HOME-COMMON UI HUMAN ACCEPTED / CLOSED (BOUNDED)**

The subsequent 2026-10-18 Human decision is recorded in the
[Home/common UI formal acceptance](home-common-ui-human-acceptance-closure-2026-10-18.md).
The pre-review evidence and plan below retain their original checkpoint meaning.

## Authority and problem

Human adopted the [Cross-App Header / Brand / Focus Navigation decision](../../e2r-spec/docs/cross-app/cross-app-header-brand-focus-navigation-decision-2026-10-18.md)
and approved a ParameterPlotter-specific correction: focus the existing
actionable Workspace brand link on arrival, rather than its non-actionable `h1`
wrapper. This does not change the brand's Home navigation meaning, the initial
focus policy of either sibling application, or E2R data semantics.

During Home/common UI Human Browser Review, Human observed that the first
Workspace focus ring surrounded the brand but Enter sometimes did not navigate
Home. One Tab left a similar ring around the brand; Enter then worked. The
earlier SAE-04 Human Browser PASS (bounded), including its initial failure
report and successful recheck, remains historical evidence and is not revoked.

Source audit and a separate isolated Codex Chrome reproduction identified the
condition: `document.activeElement` was the Workspace `h1[tabindex=-1]` on
arrival, then its nested `a[data-go-home]` after Tab. Both elements had similar
`:focus-visible` outlines, but only the link had native Enter activation and
the existing Home click handler. This later evidence belongs to the still-open
Home/common UI review, not to a reopened Single Active Editor closure.

## Bounded implementation

At the current ParameterPlotter HEAD `d02c9a057c7976cb82dae298befb9c6f5344cbb3`
plus the protected pre-existing worktree changes, `main.js` now focuses the
existing `header h1.app-brand a[data-go-home]` after Workspace rendering. The
same helper is used for Continue Editing, degraded Return to Workspace, and
accepted incoming Dataset activation (including New, Sample, file, and Handoff
paths through that activation function). The wrapper `h1` no longer receives
programmatic focus or an added `tabindex` on those entries.

The brand link, Home button, click navigation, Home return focus, CSS focus
styles, Dataset replacement, save/Export/recovery, ownership, and URL fragment
handling were not changed. `#home` can still coexist with a visible Workspace;
that independent URL observation is outside this correction.

## Verification and evidence classes

- **Automated Test Verified:** `npm.cmd run check` passed: syntax for 42
  application modules and 238/238 tests. The real-module DOM integration script
  passed its 12 scenarios. Its added direct assertions verify the actionable
  link as `activeElement` and the absence of a second focusable brand heading
  after Continue, degraded Return, accepted Handoff Dataset, and New Dataset.
  It also verifies a brand-link click returns Home and restores focus to
  Continue. This DOM test does not simulate native Tab or Enter.
- **Codex Browser Verified:** Isolated Chrome 155.0.8059.82 with a dedicated
  temporary profile and server on `127.0.0.1:5496` confirmed link focus after
  EN New and Continue, JA Continue and accepted Sample, and EN/JA Continue at
  390px. Enter on the focused brand link returned Home; the Home Continue
  control received focus. The first Tab from the brand link reached the
  localized Header Home button, rather than another brand focus stop. A pointer
  click on the brand also returned Home. The focus ring followed native
  `:focus-visible` input-modality behavior; a pointer-triggered transition may
  not show it. No horizontal document overflow was observed in the tested
  normal and narrow viewports.
- **Source Audit:** The three entry paths call the same link-focus helper.
  Existing `data-go-home` handling and Home return focus remain unchanged.
  Degraded Return was exercised in the DOM integration environment but not
  through a new real-browser write-refusal injection in this correction pass.
- **Human Browser Evidence at this verification checkpoint:** Human's original
  focus/Enter mismatch initiated this correction. At this pre-review checkpoint,
  the corrected worktree had **not** received a new Human Browser PASS. The
  subsequent Human review and bounded acceptance are recorded separately in
  the [formal acceptance](home-common-ui-human-acceptance-closure-2026-10-18.md).
  Codex browser and automated results remain supplementary evidence only.

The isolated browser used only a disposable Workspace. The Human's browser,
saved Workspace, and existing localhost server on port 5492 were not touched.
Browser/assistive-technology combinations beyond the stated Chrome profile,
widths, locale operations, and entry paths remain unverified.

## Human review plan at the pre-acceptance checkpoint (historical)

With the corrected source, use the Human's own review environment to enter
Workspace via Continue Editing. Confirm that the first indicated brand focus
is the Home link, Enter returns Home immediately, and a new entry followed by
one Tab moves to the Header Home control rather than a second brand focus stop.
Repeat the arrival/Enter check in the other locale and at a narrow width.
The separate degraded Return and Dataset acceptance paths have automated
coverage; revisit them in the browser only if Human review or context warrants.

At this checkpoint Home/common UI Human Visual Acceptance was **PENDING**. Its
2026-10-18 Human decision is **HUMAN ACCEPTED / CLOSED (BOUNDED)** as recorded
above. Single Active Editor and Generated Extension Declaration Integrity retain
their bounded formal closures. Workspace Notification UI overall acceptance,
Product Acceptance, and Public Release remain pending / NO-GO in their separate
scopes.
