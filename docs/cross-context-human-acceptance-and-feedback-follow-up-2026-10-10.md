# Cross-Context Human Acceptance and Feedback Follow-up

Date: 2026-10-10
Status: Human-reported scenarios recorded as PASS; feedback follow-up is Codex-verified and awaits Human Browser review. Full Cross-Context Workspace Safety acceptance and publication remain pending / NO-GO.

## Authority and scope

The adopted safety contract remains in E2R-SPEC's `docs/cross-app/cross-context-workspace-safety-design-2026-10-10.md`. The applicable reusable guidance is `ai-knowledge/decisions/cross-context-workspace-safety.md` and `ai-knowledge/playbooks/workspace-safety-review-and-acceptance.md`. This checkpoint records ParameterPlotter evidence and implements application feedback for the existing contract; it does not revise the contract or shared Knowledge.

Related implementation records: [Cross-Tab Early Warning on Home](cross-tab-early-warning-home-2026-10-10.md), [local same-origin verification](local-same-origin-cross-app-workspace-safety-verification-2026-10-10.md), [replacement refusal feedback](cross-tab-replacement-refusal-feedback-2026-10-10.md), and [Home locale control regression](home-locale-control-regression-2026-10-10.md).

## Human Browser evidence

The following outcomes were reported from Human-operated Edge InPrivate tests on the same-origin local fixture. They are recorded as Human Browser PASS only for the described actions and environment.

### ParameterPlotter with ParameterPlotter

- Two tabs open without work did not show a peer-work warning.
- An unapplied Dimension draft in one tab was reported by the other tab's Home warning.
- Replacement from the other tab was refused while the draft existed; the refusal was understandable and did not show a duplicate early-warning explanation.
- Canceling the replacement restored the early warning while peer work remained.
- Canceling the unapplied Dimension draft cleared the warning automatically; replacement then succeeded.
- An unapplied numeric Assessment input was reported as peer work and also protected a replacement attempt.
- Canceling that candidate restored the warning; closing the tab with the unapplied numeric draft cleared it.
- A stale tab's Assessment save was refused after another tab had accepted a newer Dataset. The newer Dataset remained after the old tab reloaded; the old tab could then reload and resume the current Dataset.
- Home locale selection remained available and usable through the reported Home redraws.

One earlier observation saw a warning before numeric editing. A fresh InPrivate retest reported no warning at two-tab startup or after sample loading, with the warning appearing only after an actual unapplied numeric edit. The differing observations are retained; the fresh retest does not retroactively erase the earlier observation.

### ParameterPlotter with NarrativeLine

- NarrativeLine's unapplied title did not create a ParameterPlotter peer-work warning, and ParameterPlotter replacement succeeded while the NarrativeLine draft remained.
- ParameterPlotter's unapplied Dimension draft did not create a NarrativeLine peer-work warning, and NarrativeLine replacement succeeded while the ParameterPlotter draft remained.
- In one sequence, ParameterPlotter initially refused replacement because its saved revision was stale. After ParameterPlotter reloaded/resynchronized, replacement succeeded while NarrativeLine work remained. This is recorded as a stale-revision protection and recovery observation, not as an unrelated-app false conflict.

These results support app-specific workspace independence for the reported actions. They are not exhaustive proof that every storage key or edit path is independent.

## UX follow-up and cause

Human review identified two duplicate-message cases:

1. After an old tab's Assessment write was correctly rejected, a broad degraded-workspace explanation could accompany the specific saved-revision conflict message.
2. A Home replacement refusal repeated the same cause in the refusal body and its Details text.

The first occurred because the save failure path replaced the result-specific persistence reason with a generic peer-or-unknown message whenever loss-sensitive work remained, then also copied that message to a lifecycle notice. The second occurred because Home rendered a Details paragraph even when the refusal copy already stated the complete peer-work or stale-revision cause.

The update now preserves the specific stale-revision message, distinguishes known peer work from an unverified coordination failure, and avoids a second lifecycle notice for the same save refusal. Home omits duplicate Details text for peer-work and stale-revision refusals. Peer replacement still fails before the saved-workspace write; Retry uses the regular write-lock and saved-revision checks. No safety gate was bypassed.

## Codex verification

### Automated checks

- `npm.cmd run check`: PASS; syntax checked 37 application modules and 164/164 tests passed.
- `npm.cmd run build` with `PARAMETER_PLOTTER_BUILD_OUTPUT` pointed at the same-origin fixture: PASS; 59 static files were built. The built `main.js` matched the repository source hash when copied to the fixture.
- Focused workspace-save feedback tests verify that stale conflicts retain their specific recovery text, known peer work is distinct from uncertainty, and unclassified failures do not invent a cause.

### Isolated Edge checks

Codex used a separate headless Edge profile and the local same-origin fixture at `http://127.0.0.1:5308/`; this is Codex verification, not Human Browser Acceptance.

- With a real unapplied Dimension form in tab A and a separate dirty Dataset title in tab B, New Dataset showed the existing confirmation. After confirmation, the candidate dialog closed, one peer-work refusal appeared, the duplicate peer warning and Details paragraph were absent, and the serialized saved workspace was unchanged.
- Cancel dismissed only the candidate-specific feedback and restored the peer warning while tab A still had its draft. Canceling tab A's draft cleared the warning. A subsequent explicit New Dataset confirmation succeeded.
- At a 390 CSS-pixel viewport, the same refusal retained its explanation and locale control, rendered one feedback surface without duplicate warning/Details, and had `scrollWidth === clientWidth === 390`.
- A separate stale-writer check changed a valid Assessment in the older tab after another tab had saved a new Dataset. The newer serialized workspace remained byte-identical, and the old tab showed the specific saved-revision recovery message directing the user to Export needed work and reload.

These checks use actual rendered app pages and user-like actions with disposable local data. They do not establish broad browser compatibility, all edit-form coverage, strict BFCache behavior, crash recovery, production Pages, HTTPS/CORS Handoff, or Human acceptance of this follow-up.

## Remaining acceptance boundary

Human Browser review is still needed for the corrected specific stale-save feedback and the corrected replacement-refusal display, including the 390px layout. The Human-reported scenarios above remain accepted only as individually described.

Still pending beyond this checkpoint:

- exhaustive cross-tab tests for every authoring form;
- strict BFCache and abnormal-termination recovery checks;
- production GitHub Pages same-origin deployment and production HTTPS/CORS Startup Handoff;
- ParameterPlotter early-warning acceptance on all real authoring paths;
- complete Cross-Context Workspace Safety acceptance.

The later Tests 16–22 review and the bounded Quadrant narrow-viewport fix are
recorded in [Quadrant Narrow-Viewport Fix and Human Acceptance Checkpoint](quadrant-narrow-viewport-acceptance-checkpoint-2026-10-11.md).

No Handoff, persistence, locale, Dataset, schema, Validator, Candidate status, or Application Version contract changed. No public action was taken. Publication remains NO-GO.
