# ParameterPlotter Cross-Tab Replacement Refusal Feedback

Date: 2026-10-10
Status: Codex implementation and browser verification complete; Human Browser Acceptance pending

## Human Browser failure

During Human Browser Acceptance on the same-origin fixture at
`http://127.0.0.1:5308/e2r-parameter-plotter/`, tab A had an unapplied
Dimension form. In tab B, the Human selected New Dataset and confirmed
“Discard and Create Dataset”. The dialog remained visible without explaining
that the peer-work safety check had refused the replacement. The Human did not
observe evidence that saved Dataset content had changed.

## Cause

`activateIncoming()` already runs the replacement inside the workspace write
lock. When another active ParameterPlotter tab reports loss-sensitive work,
the guard returns `blockedByPeer` before `saveIfCurrent()` is called. Thus the
observed behavior was a feedback-state failure, not evidence that the guard
allowed a write.

The failure branch previously assigned `fileError` and `lifecycleNotice`, then
called `render()`. Workspace rendering displays those messages, but Home
rendering uses `homeError` and its own handoff/peer fields. Meanwhile the
replacement candidate remained set, so `renderHome()` continued drawing the
confirmation dialog. The refusal reason therefore had no visible Home surface.

## Change

- A failed Home replacement now clears the modal candidate and retains a
  separate refusal notice containing the reason and safe next step.
- For peer work, the notice explains that this attempt did not change the
  saved workspace and offers Retry and Cancel. The duplicate early peer warning
  is suppressed while this same cause is described in the refusal notice.
- Cancel dismisses only the replacement candidate, refreshes the peer status,
  and restores focus to the originating Home action where available. The early
  warning returns while peer work remains and clears when it is resolved.
- Retry passes the same incoming candidate through the normal write lock and
  saved-revision check again. Attempt tokens make a canceled in-flight attempt
  unable to proceed to a write.
- Stale saved revisions and writes whose result cannot be verified receive
  reload-oriented guidance and no blind Retry action. Workspace-origin
  failures continue to use the existing Workspace lifecycle notice.
- Existing locale selection and Home peer-status refresh remain active.

No Dataset semantics, stored data format, Application Version, or safety guard
was changed. This is implementation evidence for the existing adopted safety
contract; E2R-SPEC and shared Knowledge remain unchanged.

## Evidence

### Automated

- Focused feedback and wiring tests: PASS.
- `npm.cmd run check`: PASS; syntax checked 36 modules and all 160 tests passed.
- Static build to the same-origin fixture: PASS.
- `git diff --check` and cached diff check: PASS.

### Codex browser verification

Used an isolated CDP browser context, disposable bundled Ashen Crown data, and
same-origin tabs served by port 5308. The build output was placed at the
ParameterPlotter path used by the fixture.

- Reproduced the old build's refusal: confirmation stayed open, no refusal
  alert appeared, and saved storage remained byte-identical.
- With the fixed build, exercised the confirmed New Dataset modal path while
  another tab had a real unapplied Dimension form. Confirmation closed, a
  refusal alert appeared in Home, the duplicate early warning was suppressed,
  and saved workspace bytes were unchanged.
- Cancel dismissed candidate-specific feedback; the peer warning remained
  while peer work existed. Resolving the peer form cleared the warning.
- In a separate scenario, a real dirty numeric Assessment input caused the
  other tab's replacement to be refused with saved workspace bytes unchanged.
- After resolving the Dimension draft, Retry accepted the same candidate.
- At 390 CSS pixels, the refusal and both actions stayed within the viewport
  (document scroll width equaled client width); locale control was present.
- Home locale control remained available after refusal and at narrow width.

These are Codex browser checks, not Human Browser Acceptance. This checkpoint
focused on the reported replacement-feedback path. It does not establish the
full PP × PP or PP × NarrativeLine acceptance, every browser, production
GitHub Pages, or every failure mode.

## Remaining Human review

Please repeat the reported same-origin PP × PP operation with an unapplied
Dimension form, confirm the refusal explanation and unchanged current Dataset,
then cancel or resolve the peer draft and use Retry. Also confirm the same
feedback remains usable at 390px and that the Home locale control remains
available. Full cross-context acceptance and production verification remain
separate and pending. Publication remains NO-GO.
