# ParameterPlotter Stale-Writer Export and Reload Recovery Verification

Date: 2026-10-11
Status: Human Browser Test 30-A-N remains ACCEPTED / PASS only for its recorded operations. Test 31's isolated warning transition remains Codex Browser Verified. Test 32 is a Human-reported safety incident whose central Workspace replacement sequence was reproduced in an isolated Codex Edge profile; the save-gate transition and storage result are documented below. No runtime fix or Acceptance change has been made. Cross-Context Workspace Safety remains open. PUBLIC RELEASE NO-GO remains in force.

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
- At the time of this audit, the peer message from `workspaceSaveFailureMessage()` called the peer's state “unapplied work.” That label covered more than an unsubmitted form: an Apply-ed Dataset can be saved locally while still marked modified relative to its last E2R Export. The copy-only follow-up below corrects this wording.
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

No Cross-Context Workspace Safety violation or data-loss defect was confirmed in this audit. The evidence identified a terminology and sequencing clarity issue. At that checkpoint, a copy-only follow-up was left for Human direction; the authorized refinement and its verification are recorded below. No safety semantics or Human Acceptance status changed in that audit.

### Evidence boundary

- **Human Browser evidence:** Test 30-A-N, recorded above, observed the peer-work refusal, successful Export, later stale-revision warning, Reload to A2, and subsequent save. The Human did not measure exact transition timing or internal state.
- **Codex Browser Verified:** the Test 31 isolated Edge reproduction reached the same two messages in sequence without a second Apply in B; saved storage remained on A2. The browser UI reported the Export handoff, but the downloaded file was not independently inspected in Test 31. This is browser implementation evidence, not Human Acceptance.
- **Source review:** explains the active peer marker, separate peer and revision guards, and Export's scheduled persistence save.
- **Automated Test (Test 31 checkpoint):** the recorded `npm.cmd run check` completed successfully, including syntax checks for 37 modules and 167/167 tests. This was automated evidence, not Human Browser Acceptance.
- **Not established:** byte-for-byte preservation in the Human run; all browser timing paths; all conflict causes; every blocked or failed download path; whether a Human would find revised copy clearer. Test 30-A-N remains accepted only for its recorded interactions. Cross-Context Workspace Safety remains open and PUBLIC RELEASE NO-GO remains in force.

## Test 31 follow-up — recovery warning copy refinement

Date: 2026-10-11. This is an authorized UI-copy, test, and documentation follow-up to the Test 31 audit. It does not create a new Human Acceptance result or alter Cross-Context Workspace Safety status.

- Peer-work copy now describes another tab as having “work that needs protection,” rather than “unapplied work.” It explains that this tab's save was stopped, its current Dataset remains in memory, and the saved Workspace was not replaced. Recovery guidance covers applying or cancelling open input and exporting Dataset changes that need to be kept.
- The Home early warning and replacement refusal use the same broader description. An unknown peer state explicitly says that the app cannot confirm that another tab has work needing protection; the fail-closed replacement guard remains unchanged.
- Stale-revision recovery copy distinguishes the browser-local Workspace save from E2R JSON Export. It says that the current in-memory changes remain, asks the user to export needed work and verify the download, then reload and choose **Continue Editing** to open the latest saved Workspace. The app does not claim that a browser download completed merely because it invoked the download action.
- The Export lifecycle notice now says that the browser was asked to download the JSON, that completion cannot be confirmed by the app, and that browser-local Workspace saving is separate. Export and persistence behavior are unchanged.
- Test 30-A-N remains Human Browser ACCEPTED / PASS only for its recorded operations. Test 31 remains Codex Browser Verified for the isolated sequence; this copy refinement is not a new Human Acceptance. Cross-Context Workspace Safety remains open and PUBLIC RELEASE NO-GO remains in force.
- **Automated Test (copy follow-up):** focused feedback/Home/wiring tests passed 30/30. `npm.cmd run check` passed syntax checks for 37 application modules and the full suite passed 167/167. `npm.cmd run build` built 59 static Pages files. These results validate code and rendered strings, not browser download completion or Human acceptance of the revised wording.
- **Safety boundary:** no peer-work predicate, Web Lock behavior, stale-revision comparison, workspace serialization, Export baseline, or Reload behavior was changed. The export notice now explicitly limits its claim to requesting a browser download and says completion must be checked by the user; browser-local Workspace persistence is described as separate.
- **Human Acceptance:** no new Human Browser test was performed or inferred. Test 30-A-N remains accepted only for its previously recorded interactions. The new copy has not yet received Human Browser review. Cross-Context Workspace Safety remains open and PUBLIC RELEASE NO-GO remains in force.

## Test 32 — peer-refusal followed by Export-triggered Workspace save

Status: Safety incident under investigation. Human Browser evidence is recorded separately from the Codex reproduction. This section does not alter prior Test 30 acceptance or claim broader acceptance. Runtime was not changed.

### Human Browser report

The Human used Edge InPrivate with two same-origin tabs at `http://127.0.0.1:5312/` and The Ashen Crown (10 Entities / 7 Dimensions / 70 Assessments). Tab A applied `Test 32 Protected Work A`; Tab B continued from that saved Workspace and applied `Test 32 Blocked Work B`. B's Apply was refused as peer work, and the UI said B remained in memory while the saved Workspace was not replaced. A's E2R JSON contained title A. B then exported a second E2R JSON containing title B. After B pressed F5, no departure dialog appeared; Continue Editing restored title B. Tab A still displayed title A, while the Human's read-only `localStorage` expression returned `Test 32 Blocked Work B` twice. The submitted files preserve both Dataset versions. The Human did not instrument the exact write time or `saveIfCurrent()` result.

### Isolated Codex Edge reproduction and source trace

Codex reproduced the core sequence in a newly launched, isolated headless Edge profile using the local fixture and disposable bundled Ashen Crown. No Human browser, profile, Workspace, or download file was accessed. The browser sequence was performed through its CDP target; its reload operation is not evidence about a physical F5 key or the native beforeunload prompt.

1. Tab A opened the sample, applied title A, and localStorage held title A with `ui.datasetModified: true`.
2. Tab B started after A's Apply and used Continue Editing. It loaded title A and the same saved raw revision, including `ui.datasetModified: true`; therefore B itself registered as active loss-sensitive work before its own title edit.
3. B applied title B. Its `scheduleWorkspaceSave()` reached `withWriteLock()`, saw A active, and returned `blockedByPeer` before calling `saveIfCurrent()`. localStorage still contained A. B retained title B in memory and showed degraded persistence.
4. A exported. `exportBaseline()` cleared A's in-memory `datasetModified`, so A's peer marker became inactive. A's scheduled browser-local save then saw B active and was refused by the peer gate. Because A no longer had loss-sensitive state after Export, the failure branch did not mark A degraded or surface a save refusal. Storage still held A with `ui.datasetModified: true`, while A's UI reported “Workspace saved in this browser.” The downloaded file was not independently inspected in this Codex run.
5. B exported. Its `exportBaseline()` cleared B's Dataset-modified flag, but its persistence was still degraded, so its marker remained active. The newly scheduled save saw no active peer other than B itself (which is excluded from peer results). Since A's prior save had been refused before `saveIfCurrent()`, localStorage still exactly matched B's `expectedWorkspaceRaw` from Continue Editing. `saveIfCurrent()` therefore passed its revision comparison and `save()` wrote B without a new Dataset replacement confirmation.
6. The shared key then contained title B, and the serialized raw string contained it twice: once in the Dataset metadata title and once inside the serialized `ui.datasetBaseline`. A CDP page reload returned to Home; Continue Editing loaded B as the saved Workspace. This confirms the shared-storage result in the isolated profile, not Human's exact native F5/beforeunload behavior.

### Safety assessment and comparison with Tests 30–31

- The initial B peer-work refusal worked as coded: at that moment A was active, and the write did not reach storage.
- The later B write was not a stale-revision failure that bypassed `saveIfCurrent()`. The revision guard saw the same raw revision B had loaded and correctly accepted it. The issue is that a peer refusal is not sticky across later save attempts: Export schedules a new Workspace save, which reruns the peer check against current markers. A's Export had made A inactive, while A's own baseline save was refused due to B, so the raw revision stayed at A's already-saved version. B then passed the unchanged revision check and wrote its in-memory version.
- Thus the actual behavior is a deferred/new persistence attempt initiated by Export after the peer condition changes, not an unguarded raw `localStorage.setItem` and not a stale revision mismatch. It can replace the shared Workspace after a prior Apply was refused, without the Dataset replacement confirmation surface. Whether an explicit Export should also authorize this browser-local Workspace replacement is a user-facing safety/semantic decision; this audit does not assume that it does.
- Test 31 had a different ordering: B held an older raw revision before A applied A2. A's Apply changed the stored serialized revision, so B's later Export-triggered save reached `saveIfCurrent()` and was rejected as stale. In Test 32, B opened A after A's Apply, so its expected raw revision already matched storage. A's Export-time local save was then blocked by B's active marker and left storage unchanged. This difference explains why the stale-revision guard protected the Test 31 sequence but did not prevent Test 32's later write.
- Test 30's bounded Human PASS remains historical evidence for the specific recovery sequence it observed. It neither tested nor disproves this Test 32 ordering. Test 32 does not retroactively alter Test 30's recorded interactions; it exposes a separate state-transition path requiring resolution.
- The evidence establishes that the shared Workspace changed from A to B in the isolated reproduction, and the Human independently observed the same key value. Both JSON exports were reported by the Human as available, so this run did not establish loss of those two exported copies. It does establish that the application's prior “saved workspace was not replaced” notice did not remain true after the later Export-triggered save. A remains on its old in-memory view while the next Continue Editing loads B.

### Scope, tests, and unresolved design boundary

- `scheduleWorkspaceSave()` is shared by Dataset edits, form submissions, assessment persistence, and Export's local-save scheduling. Therefore the non-sticky peer refusal pattern is not limited to title editing. A later call can retry the current in-memory state if peer markers clear and `expectedWorkspaceRaw` still matches. This audit did not run every form/acquisition path; it establishes a shared save-gate concern, not exhaustive reproduction for each control.
- Existing automated tests verify that `saveIfCurrent()` rejects a raw revision mismatch, that Web Locks coordination reports active peers, and that the replacement flow refuses peer work. They do not model the two-tab orchestration where a peer refusal is followed by Export, the other tab's Export save is blocked, and the first tab's later save succeeds against the unchanged raw revision.
- `npm.cmd run check` during this investigation passed syntax checks for 37 application modules and 167/167 tests. This is not evidence that the Test 32 ordering is safe; the orchestration case is not covered by those tests.
- No runtime fix was made, as requested. Potential next-step choices for Human review are: (a) make a refused candidate remain blocked until a clearly deliberate retry/resolve action; (b) separate E2R JSON Export from Workspace persistence so Export alone cannot commit a previously refused in-memory candidate; or (c) adopt another bounded rule that preserves apply/export semantics and makes the save authorization explicit. These choices affect recovery UX and persistence semantics, so this document does not select one.
- **Open:** determine the intended authorization meaning of Export after a peer refusal, whether refusal state must persist across automatic saves, and how the originating tab is informed when an Export-time Workspace save is refused. Until a Human-approved implementation and focused regression verification exist, treat this path as a safety issue, keep Cross-Context Workspace Safety pending, and retain PUBLIC RELEASE NO-GO.

## Test 32 safety fix — rejected Workspace write isolation

Status: Runtime fix implemented and Codex-verified in an isolated Edge profile. Human Browser Acceptance for the fix is pending. The incident record above remains the historical account of the failure and reproduction; this section records the later Human-approved resolution.

### Adopted Human principles

The Human approved these rules for ParameterPlotter:

1. Export is not approval to replace the shared browser-local Workspace.
2. A refused Workspace write must not later succeed implicitly through automatic saving.
3. The UI must report the browser-local Workspace save result accurately.

These rules preserve the existing Dataset replacement confirmation, Web Lock coordination, saved-revision comparison, fail-closed behavior, and Export / Reload recovery. They are not promoted to other E2R applications.

### Implementation

- Added a tab-lifetime Workspace write gate shared by automatic Workspace saves and incoming Dataset replacement writes. A refused or unverifiable write remains latched for the page lifetime; Export, later state notifications, and automatic saves cannot retry it against a changed peer state or unchanged serialized revision.
- Reload is the normal recovery boundary: a fresh page reads the currently persisted Workspace. Where an existing replacement flow already offers an explicit Retry, that user action clears the local gate only for the retry attempt, which re-runs the existing peer and saved-revision checks. It does not bypass either check.
- E2R JSON Export remains available for the in-memory Dataset and does not clear the write refusal. Its browser download request remains a separate notice; the app still does not claim that a file completed downloading. When the associated browser-local save is refused, both facts remain visible: the JSON download was requested, while Workspace saving is degraded or paused.
- Workspace status now shows a pending save until the asynchronous result is known, changes to saved only after verified success, and changes to degraded / unsaved after refusal even if Export has just cleared the Dataset-modified flag. This corrects the earlier Test 32-A status that could continue to read as saved after the browser-local write had been refused.
- No serialization format, Dataset content, schema, Candidate status, or Application Version changed.

### Verification

- **Automated Test PASS:** the Test 32 sequence is covered by a two-tab gate orchestration test: B's initial peer refusal, A's Export-time peer refusal, then B's Export follow-up. The saved revision remains A and no write is made after B's refusal. Additional tests cover sticky stale-revision and coordination failures, explicit replacement Retry, normal successful writes, and accurate save-status copy.
- **Codex Browser Verified:** Microsoft Edge 154 headless, launched by Codex with a newly created unique profile and download folder. The app was served from the working tree at `http://127.0.0.1:5321/`; two tabs shared that exact origin and used the disposable bundled Ashen Crown sample. B's Apply was refused while A was active. A's Export downloaded and parsed as title A, while its Workspace-save refusal changed its UI to degraded / unsaved. B's Export downloaded and parsed as title B, but the shared localStorage Workspace remained title A. After closing the isolated A tab, reloading B and choosing Continue Editing restored A; a subsequent edit saved successfully. The test kept separate copies of both same-named browser downloads for JSON inspection.
- The first browser attempt used an old temporary profile that contained restored tabs and a Japanese locale. It was not counted as verification. A subsequent run used a new GUID-named profile; its test completed successfully. The app server and browser profiles were isolated from the Human's existing `5312` environment and its downloads.
- **Final automated verification:** `npm.cmd run check` passed syntax checks for 38 application modules and all 176/176 tests. `npm.cmd run build` generated 60 static Pages files. `git diff --check` passed.

### Acceptance and release boundary

- Test 30-A-N remains Human Browser ACCEPTED / PASS only for its recorded operations. Test 31 remains Codex Browser Verified for its recorded ordering and copy review. Neither result is rewritten by this fix.
- The Test 32 Human Browser report remains an Incident / FAIL history. This Codex result does not promote the fix to Human Acceptance; Human review of the repaired ordering and status feedback is pending.
- Cross-Context Workspace Safety remains pending overall. PUBLIC RELEASE NO-GO remains in force.
