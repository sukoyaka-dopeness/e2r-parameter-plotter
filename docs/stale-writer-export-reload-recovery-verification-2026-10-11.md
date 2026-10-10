# ParameterPlotter Stale-Writer Export and Reload Recovery Verification

Date: 2026-10-11
Status: Codex Browser Verified for the isolated stale-writer, Export, Reload, and subsequent-save sequence below. Human Browser Test 30-A-N is ACCEPTED / PASS for the bounded operations recorded below. Test 31 reproduced and traced the warning transition; no unsafe overwrite was observed, while warning wording remains a UX clarity concern for Human review. Cross-Context Workspace Safety remains open. PUBLIC RELEASE NO-GO remains in force.

## Scope and authority

This checkpoint verifies ParameterPlotter's existing stale-revision recovery path. It does not change the persistence model or safety contract. The applicable contract is E2R-SPEC `docs/cross-app/cross-context-workspace-safety-design-2026-10-10.md`; applicable Knowledge is `decisions/cross-context-workspace-safety.md` and `playbooks/workspace-safety-review-and-acceptance.md`.

The Human's 2026-10-11 crash-recovery decision is recorded in `docs/abnormal-termination-workspace-recovery-verification-2026-10-11.md`: recover the last Apply-saved browser-local Workspace; do not promise crash recovery for unapplied form input; keep normal departure protection; leave draft autosave/recovery as a separate future design question. That decision is specific to ParameterPlotter and is not generalized to other E2R applications.

## Isolated browser setup

Codex used Microsoft Edge 154.0.4258.62 with a new isolated headless profile at `C:\Users\extra\AppData\Local\Temp\e2r-pp-reload-probe-b2210a8056ac43358fc590266f5e8848` and a dedicated download folder under that profile. Edge root PID was 21676, launched with `--user-data-dir` set to that profile and CDP port 9340. The app was served from the local ParameterPlotter source at `http://127.0.0.1:5312/`; the server was separately owned and was not terminated. No Human browser profile or personal file was used.

The built-in disposable Ashen Crown Dataset was used throughout: 10 Entities, 7 Dimensions, 70 Assessments. No canonical or bundled Dataset was changed.

## Human Browser Test 30-A-N — bounded acceptance

The Human used Microsoft Edge InPrivate at `http://127.0.0.1:5312/` with The Ashen Crown (10 Entities / 7 Dimensions / 70 Assessments).

1. Tab A applied the title `Stale Recovery Baseline A`, confirmed `Saved locally`, and used More → Export E2R JSON. The Human's submitted JSON contained that title.
2. Tab B used Continue Editing and showed the saved baseline. Tab A then applied `Newer Saved Workspace A2`; Tab B remained on its older view.
3. Tab B applied `Stale Writer Unsaved Candidate B`. The first refusal was explicitly a peer-work refusal, with the message: “Another ParameterPlotter tab has unapplied work. This tab kept its changes in memory; the saved workspace was not replaced.” It was not identified as a stale-revision refusal. Tab A separately exported `Newer Saved Workspace A2`.
4. Tab B successfully exported E2R JSON. The Human's submitted file contained `Stale Writer Unsaved Candidate B` and retained 10 Entities / 7 Dimensions / 70 Assessments. This is Human evidence that the refused tab's in-memory Dataset was downloaded. The Human's inspection is distinct from the earlier Codex Validator result for a different isolated browser download; no validator result is attributed to this Human file.
5. Before the Human chose Reload, a warning appeared: “Another ParameterPlotter tab changed the saved workspace. This tab did not overwrite it. Export any work you need to keep, then reload before continuing.” The Human did not perform another Apply immediately before observing this warning. The reason the displayed refusal state changed from the earlier peer-work message is not established; these are recorded as separate observations without inferring an unobserved transition.
6. After confirming the rescue Export, the Human reloaded Tab B, chose Continue Editing, and confirmed `Newer Saved Workspace A2`, 10 / 7 / 70 counts, `Saved locally`, and removal of the degraded / unsaved warning.
7. Tab B applied `Post Reload Recovery Save B`. The title-applied message and `Saved locally` state appeared, with 10 / 7 / 70 counts and no save-conflict warning.

**Human Browser Acceptance: Test 30-A-N ACCEPTED / PASS, limited to the observed sequence above.** This does not establish byte-level storage equality, Web Lock internals, all refusal causes, every Export failure path, or other browsers/environments. The first refusal and the later pre-reload warning remain distinct observations; the reason for their displayed-message change is unresolved, not a confirmed safety defect by itself.

## Stale-writer and recovery sequence

1. Tab A opened the Ashen Crown sample, applied the title `Stale Recovery Baseline A`, and exported it to establish a clean saved/export baseline.
2. Tab B opened the same saved Workspace and continued editing from that revision.
3. Tab A applied `Newer Saved Workspace A2` and exported it. The saved browser-local Workspace therefore had a new revision while Tab B retained the earlier snapshot.
4. Tab B applied the title `Stale Writer Unsaved Candidate B`. Its save was refused with the existing saved-revision conflict message. Tab B retained that title in memory, while browser storage still contained `Newer Saved Workspace A2`. No stale overwrite occurred.
5. From Tab B, Codex used More → Export E2R JSON. Edge reported the download completed at the isolated download path as `parameterplotter-dataset.e2r.json` (24,727 bytes). The downloaded JSON parsed successfully and contained the stale tab's rescue title `Stale Writer Unsaved Candidate B`, 10 Entities, 7 Dimensions, and 70 Assessments. The bundled E2R Validator returned `valid: true` with zero diagnostics. Thus Export captured the stale tab's in-memory Dataset while leaving the newer browser-local Workspace intact.
6. Codex reloaded Tab B. The app's normal `beforeunload` confirmation appeared; Codex accepted it only for this disposable test after the Export had completed. Reload returned to Home, where Continue Editing was available. Browser storage still held `Newer Saved Workspace A2`.
7. Continue Editing restored the saved winner with 10 / 7 / 70 counts and a saved-local-workspace status. No stale-revision warning remained. `navigator.locks.query()` showed two held ParameterPlotter tab locks after reload; the stale revision did not block recovery.
8. Tab B then applied `Post Reload Recovery Save B`. The save succeeded, browser storage held that title, the workspace status was saved locally, and the 10 / 7 / 70 counts remained intact.

## Evidence classification and limits

- **Codex Browser Verified:** actual browser UI action reached stale-revision refusal, kept the newer saved revision, downloaded and inspected the stale tab's E2R JSON, reloaded to the newer saved Workspace, and successfully saved a subsequent edit.
- **Automated Test PASS:** before this documentation-only update, `npm.cmd run check` passed syntax checks for 37 application modules and all 167/167 tests; `npm.cmd run build` built 59 static Pages files. These checks supplement but do not replace the browser sequence.
- **Human Browser Acceptance:** Test 30-A-N is accepted for the bounded Human sequence above. The separate Codex sequence remains Codex evidence and is not relabeled as Human-tested.
- This was one isolated Edge/profile and one disposable Dataset. It does not establish browser-wide behavior, every recovery/failure path, production Pages behavior, or full Cross-Context Workspace Safety acceptance.

No runtime, test, Dataset, schema, Candidate status, or Application Version changes were made. The existing fail-closed and stale-revision guards remain in place. The Export/Reload path succeeded, so no implementation fix was needed for this tested case.

## Remaining safety work

Still pending are Human Browser Acceptance of the abnormal-termination findings; exhaustive form-specific cross-tab coverage; BFCache recovery operations not exercised; ParameterPlotter × NarrativeLine BFCache interaction; production GitHub Pages same-origin and HTTPS/CORS Handoff checks; and full Cross-Context Workspace Safety acceptance. Test 30 does not establish byte-level storage equality, Web Lock internals, all conflict causes, or every Export failure path. PUBLIC RELEASE NO-GO remains in force.

## Test 31 — cross-tab warning transition audit

Date: 2026-10-11. This is a Codex audit and reproduction, not a new Human Acceptance result. The test used a new isolated Edge profile and the disposable Ashen Crown Dataset on the cacheable local fixture at `http://127.0.0.1:5312/`. Browser profile and download state were isolated from the Human's browser and workspaces. No process termination was performed.

### Source behavior

- `workspace-recovery.js` defines loss-sensitive work as Dataset changes since the Export baseline, a pending draft, or degraded persistence. `main.js` publishes that aggregate state to the ParameterPlotter tab marker.
- A replacement or workspace save enters `createWorkspaceCoordinator().withWriteLock()`. If another live ParameterPlotter tab's status is active, the operation returns `blockedByPeer` before `saveIfCurrent()` compares serialized revisions or writes the shared Workspace.
- The peer message comes from `workspaceSaveFailureMessage()` and currently calls the peer's state “unapplied work.” That label covers more than an unsubmitted form: an Apply-ed Dataset can be saved locally while still marked modified relative to its last E2R Export.
- `exportCurrentDataset()` downloads the current Dataset, calls `exportBaseline()` (which changes the serialized workspace baseline and clears Dataset-modified state), then schedules a browser-local workspace save. If this tab's `expectedWorkspaceRaw` is older than the current saved value, `saveIfCurrent()` rejects that scheduled write with the stale-revision message. The rejection preserves the stored newer revision and marks the local tab degraded.

### Isolated Edge reproduction

1. Tab A opened the disposable sample, applied and exported `Stale Recovery Baseline A`.
2. Tab B reloaded, used Continue Editing, and opened the same saved baseline.
3. Tab A applied `Newer Saved Workspace A2`. It showed `Saved locally` and “changes not exported”; this loss-sensitive state kept Tab A's peer marker active.
4. Tab B applied `Stale Writer Unsaved Candidate B`. The write was refused as peer work, and the visible message said another tab had unapplied work. Storage still named `Newer Saved Workspace A2`.
5. Tab A exported A2, which established the current Export baseline and cleared its active-work marker.
6. Without another Apply in Tab B, Tab B used More → Export E2R JSON. The application displayed its Export handoff notice, then Export's scheduled workspace save compared Tab B's old expected serialized revision with the newer saved revision. The UI changed to “Another ParameterPlotter tab changed the saved workspace…”; storage still named A2. Thus the message changed after a distinct write attempt initiated by Export, not because a second user Apply was made. The Test 31 browser run did not independently confirm a downloaded file on disk; Test 30's Human evidence above did confirm the successful download and file contents for its run.

This reproduces the reported order and provides a source-consistent cause for the transition. It demonstrates that the first refusal and later stale-revision warning were two different guards at two different moments. The initial peer guard prevented the write while A had loss-sensitive work; the later compare-before-write guard prevented the old B snapshot from replacing A2.

### Safety and UX assessment

- **Safety:** no unsafe write was observed. In this reproduction, the browser-local saved Dataset remained `Newer Saved Workspace A2` after both the peer-work refusal and B's later stale-revision rejection. B's Export remained a separate rescue path for its in-memory Dataset. Reload remains the route back to the current saved Workspace.
- **Reason accuracy:** the later stale-revision copy matches the compare-before-write result. The first peer result accurately identifies the guard category, but “unapplied work” is ambiguous/inexact when the peer has already applied and locally saved a Dataset that has not yet been exported. The app's broad peer flag also includes pending drafts and degraded state, so the text should describe potentially loss-sensitive work rather than imply only an unsubmitted form.
- **Transition:** after B exports, Export also schedules a local Workspace save. Because B retains the earlier expected revision, that save detects the intervening stored revision and replaces the peer refusal's degraded message with the more specific revision conflict. Human Test 30's report that no second Apply occurred is consistent with this path. The exact event timing in the Human run was not instrumented; this causal path is confirmed in Codex reproduction and source, not directly measured in the Human session.
- **Recovery UX:** after the stale message appears, its instruction to Export any work needed can sound redundant because B just initiated Export. Human Test 30 confirms that the Human's Export completed and contained B's work. The Test 31 Codex run confirms the app's Export action and resulting save refusal, but did not independently verify the file on disk. The warning still instructs reload only after work has been exported; it does not erase the in-memory Dataset or authorize overwriting the newer revision.

No Cross-Context Workspace Safety violation or data-loss defect was confirmed in this audit. The evidence does identify a terminology and sequencing clarity issue. A copy-only follow-up could describe peer state as “work that could be lost if this shared workspace changes” and distinguish downloaded Export completion from a later browser-local save conflict. Whether to make this UX wording change is left for Human direction; no runtime or acceptance status was changed here.

### Evidence boundary

- **Human Browser evidence:** Test 30-A-N, recorded above, observed the peer-work refusal, successful Export, later stale-revision warning, Reload to A2, and subsequent save. The Human did not measure exact transition timing or internal state.
- **Codex Browser Verified:** the Test 31 isolated Edge reproduction reached the same two messages in sequence without a second Apply in B; saved storage remained on A2. The browser UI reported the Export handoff, but the downloaded file was not independently inspected in Test 31. This is browser implementation evidence, not Human Acceptance.
- **Source review:** explains the active peer marker, separate peer and revision guards, and Export's scheduled persistence save.
- **Automated Test:** existing tests cover peer status, stale revision refusal, and feedback wording as separate branches; they do not model this end-to-end UI timing sequence. No test suite was changed or rerun for this documentation-only audit.
- **Not established:** byte-for-byte preservation in the Human run; all browser timing paths; all conflict causes; every blocked or failed download path; whether a Human would find revised copy clearer. Test 30-A-N remains accepted only for its recorded interactions. Cross-Context Workspace Safety remains open and PUBLIC RELEASE NO-GO remains in force.
