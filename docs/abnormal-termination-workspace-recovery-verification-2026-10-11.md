# ParameterPlotter Abnormal-Termination Workspace Recovery Verification

Date: 2026-10-11
Status: Source review, automated verification, and one Human-approved isolated Edge browser-process-tree termination test completed. The saved workspace survived restart and coordination recovered; the unsaved Dimension form draft did not survive. Test 36 Human Acceptance is prepared but has not been performed; no abnormal termination was run during this preparation. Human Browser Acceptance remains PENDING. Cross-Context Workspace Safety remains open. PUBLIC RELEASE NO-GO remains in force.

## Authority and existing behavior reviewed

The adopted contract is E2R-SPEC `docs/cross-app/cross-context-workspace-safety-design-2026-10-10.md`; applicable Knowledge is `decisions/cross-context-workspace-safety.md` and `playbooks/workspace-safety-review-and-acceptance.md`. The contract requires recoverable coordination after abnormal termination, no permanent stale lock, protection of saved revisions from stale writers, and fail-closed behavior when safety cannot be verified. This checkpoint evaluates ParameterPlotter only and does not change that contract.

Current implementation evidence:

- `model.js` persists the last accepted browser-local workspace under `e2r-parameter-plotter-local-workspace-v2`. `saveIfCurrent` compares the current stored serialized workspace with the tab's expected revision before saving; storage read failure or a changed revision refuses the write and marks persistence degraded.
- `cross-tab-workspace.js` uses same-app Web Locks named `e2r:parameter-plotter:workspace-tab:<tabId>` and `e2r:parameter-plotter:workspace-write`. The status marker is advisory; peer activity is considered only when a matching Web Lock is held. A write rechecks held locks under the exclusive write lock and removes markers whose lock is no longer held.
- On `pagehide`, page script removes its marker and releases its tab lock. On persisted `pageshow`, it acquires a fresh registration. These are normal lifecycle and BFCache paths; they do not prove what occurs when script cleanup cannot run during a process crash.
- Pending Dimension and Assessment form values are represented in live form/runtime state and marked as pending work. `beforeunload` can request confirmation for pending drafts. The serialized browser workspace contains the Dataset and workspace UI state, not arbitrary live form input. A crash cannot show a browser leave-page confirmation; survival of such input after an abnormal process exit is not established by source inspection or this checkpoint's tests.

## Automated and normal-restart evidence

Automated verification on 2026-10-11:

- `npm.cmd run check`: PASS; syntax checked 37 application modules and 167/167 tests passed, including stale-revision rejection, fail-closed behavior when Web Locks are unavailable, peer-work isolation, and pagehide / persisted-pageshow coordinator lifecycle coverage.
- `npm.cmd run build`: PASS; 59 static Pages files built.

Codex used Microsoft Edge 154.0.4258.62 with a new, isolated headless profile at `C:\Users\extra\AppData\Local\Temp\e2r-pp-abnormal-check-1312ef2c1c1448c7b0ba4047e7b5c4b9` and the local cacheable fixture at `http://127.0.0.1:5312/`. This is a dedicated profile, not the Human's browser profile. Only the ParameterPlotter page target was open in that profile.

With the built-in disposable Ashen Crown Dataset, Codex observed a saved workspace containing 10 Entities, 7 Dimensions, and 70 Assessments. A normal `Page.reload` retained that saved workspace. Codex then sent DevTools `Browser.close` (graceful browser shutdown), relaunched Edge with the same isolated profile, chose Continue Editing, and observed the same counts and one held ParameterPlotter tab lock. Old inactive status markers remained in localStorage, but were not active peers or held locks. This verifies normal reload and graceful shutdown / restart only; it is explicitly NOT abnormal-termination evidence.

After that baseline, Codex opened a new Dimension form and entered `Abnormal Termination Draft - disposable` without saving. The visible pending-edit warning was present. The saved local workspace remained the Ashen Crown sample with 10 / 7 / 70 counts and did not contain the draft Dimension. One ParameterPlotter page was open, with one active tab marker and its Web Lock held. At this point no destructive action had been performed; the exact proposed test and risk were then presented to the Human for approval.

## Approved abnormal-termination test and evidence

The Human explicitly approved one force termination of the exact isolated Edge process tree described below. Approval was limited to this one test. It did not authorize terminating any other process, deleting the profile, or testing other crash modes.

Immediately before termination, Codex revalidated the root `msedge.exe` PID `16056`, its `--headless=new`, `--remote-debugging-port=9335`, and isolated `--user-data-dir` command-line arguments. CDP port 9335 belonged to PID 16056. The sole page target was `FBD5435C3BFB4A19A630A532F2BEBF46` at `http://127.0.0.1:5312/`. The root's exact descendants, all `msedge.exe` processes whose command lines referenced the isolated profile, were `30616` (Crashpad), `24052` (GPU), `28348` (Network Service), `30716` (Storage Service), `26344` and `4864` (Renderer), and `28616` (Search Indexer). The shell parent PID `34892` was excluded. The target still contained the disposable Ashen Crown workspace (10 Entities / 7 Dimensions / 70 Assessments) and the unsaved draft `Abnormal Termination Draft - disposable`. No other target was open. The fixture server on port 5312 was separately owned by PID 31316 and was not in the termination tree.

Codex ran `taskkill.exe /PID 16056 /T /F`. The command reported termination of the enumerated descendants and root. Follow-up inspection found none of those processes remaining and CDP port 9335 stopped; the fixture server on port 5312 remained listening. This is evidence of an abrupt termination of the isolated browser process tree, followed by a same-profile restart. It does not establish renderer-only crash behavior or native Edge session-restore behavior.

After restart, a new isolated Edge root PID `29776` used the same profile and CDP port; one ParameterPlotter page target was open. Home offered Continue Editing. The persisted local workspace still contained the Ashen Crown sample with 10 Entities / 7 Dimensions / 70 Assessments. The unsaved Dimension form and its `Abnormal Termination Draft - disposable` input were gone, and the new session did not show that draft as saved work. Thus the last saved Dataset survived, but arbitrary pending form input was not crash-recovered. This matches the current persistence boundary found in source; it is a recovery limitation, not evidence that the saved Dataset was lost.

On Continue Editing, the workspace opened successfully and a fresh ParameterPlotter tab Web Lock was held. An old localStorage status marker from the crashed tab remained marked active but had no corresponding held lock, so it was not treated as a live peer and did not block recovery. Codex then applied the disposable title `After Abnormal Restart - disposable`; the save succeeded with the Dataset counts intact, a fresh lock remained held, and the stale crashed-tab marker was cleaned during the write. This demonstrates recovery and a subsequent write after this tested browser-process termination. It did not exercise an old live tab attempting a stale write concurrently.

The disposable profile was retained after the test. No Human browser profile, other application process, server process, production setting, or repository data was terminated or modified by the abnormal-exit action.

## Evidence classification and acceptance boundary

- Automated Test PASS: modeled tests and application checks listed above; not proof of process-crash lifecycle.
- Codex Browser Verified (normal lifecycle): disposable Dataset survived reload and graceful browser close/restart; the tab lock was reacquired.
- Codex Browser Verified (one approved abnormal process-tree termination): saved Ashen Crown workspace survived; restart registered a fresh lock; the crashed tab's stale marker did not block; a later save succeeded and cleaned that marker.
- Codex Browser Verified limitation: the unsaved Dimension draft did not survive abnormal termination. It was not present in the saved Dataset and was not represented as saved after restart. This checkpoint does not establish crash recovery for pending forms.
- Human Browser Acceptance for this abnormal-termination checkpoint: PENDING.

Previously accepted Quadrant Tests 23-27 and Human BFCache Tests 28-A-K / 29-A-M remain unchanged. Test 29's direct `pagehide.persisted=true` / `pageshow.persisted=true` evidence proves one BFCache cycle only, not crash recovery.

Still pending: Human Browser Acceptance of the abnormal-termination findings; all-form cross-tab coverage; BFCache operation between ParameterPlotter and NarrativeLine; production GitHub Pages same-origin and HTTPS/CORS Handoff; and full Cross-Context Workspace Safety acceptance. Stale-writer Export / Reload was tested separately; see `docs/stale-writer-export-reload-recovery-verification-2026-10-11.md`. This single crash test does not cover renderer-only crash, another live tab during termination, or native browser session restore. PUBLIC RELEASE NO-GO remains in force.

## Human decision: ParameterPlotter crash recovery scope

The Human adopted the following ParameterPlotter-specific policy on 2026-10-11:

- The recovery target after abnormal termination is the last Apply-saved browser-local Workspace.
- Restoration of unapplied form input after a crash is not guaranteed at this time.
- Autosaving and crash recovery for unapplied forms remain a separate future design question.
- The existing protection for unapplied work during normal page departure remains in force.
- This decision does not automatically apply to NarrativeLine or LiaisonScape.

This policy does not waive existing safety for Dataset replacement, normal page departure, BFCache restoration, or saved-revision conflicts. No runtime behavior was changed to record this decision. Human Browser Acceptance of the Codex crash test remains PENDING, and Cross-Context Workspace Safety remains open.

The unresolved future question is how, if at all, ParameterPlotter should preserve unapplied form drafts across abnormal termination. That work requires a separate design decision before implementation; the current adopted recovery baseline is the last Apply-saved browser-local Workspace.

## Test 36 - Human abnormal-termination acceptance preparation

Date: 2026-10-11. Preparation only; no acceptance operation, browser termination, page reload, profile cleanup, or test Dataset editing was performed by Codex.

### Existing recovery boundary and evidence

The existing ParameterPlotter decision remains: recover the last Apply-edited Dataset whose browser-local Workspace save succeeded. Unapplied form drafts are not promised after abnormal termination; draft autosave/recovery remains a separate future design question. Normal page-departure beforeunload protection remains in force. This is ParameterPlotter-specific and is not generalized to other applications.

The current implementation stores the saved Workspace under localStorage key e2r-parameter-plotter-local-workspace-v2. A successful Apply schedules a guarded browser-local save; the UI distinguishes saved, saving, and degraded/unsaved states. E2R JSON Export is a separate file-download request and does not prove that the browser-local Workspace was saved. The live form draft itself is not serialized into that Workspace. Cross-tab writes continue to use the Web Lock, saved-revision check, and the Test 34 serialized write gate.

Prior evidence remains bounded:

- **Automated Test:** existing checks cover saved revision conflicts, fail-closed coordination, peer-work isolation, and pagehide / persisted-pageshow coordination lifecycle. These do not simulate browser-process crashes by themselves.
- **Codex Browser Verified:** the prior isolated Edge test observed the saved Ashen Crown Dataset (10 Entities / 7 Dimensions / 70 Assessments) after abrupt termination of one Human-approved disposable Edge process tree and restart using the same profile. The unsaved Dimension draft was absent; a fresh tab lock was acquired, a stale marker did not block Continue Editing, and a later Apply saved. This was one browser-process-tree test, not renderer-only crash or native session-restore coverage.
- **Human Browser Acceptance:** still pending. The prior Codex evidence does not establish Human acceptance.

### Prepared Human environment

- Local source checkout HEAD: 9a0cf1fd90afb95af48d39357ccb8db974f10d74. Test 34 runtime repair 6087be6729498774d4247863327b27fc8386e80d is an ancestor of this checkout.
- Current-worktree HTTP server: http://127.0.0.1:5334/ (HTTP 200). It is separate from ports 5312, 5322, and 5331 and serves the current ParameterPlotter worktree.
- A new regular Edge instance was opened at the app Home using an explicit separate user-data directory: C:\Users\extra\AppData\Local\Temp\e2r-pp-test36-human-acceptance-20261011. It was not started with InPrivate or headless flags; Edge sync was disabled. Root PID at preparation was 4664. The profile directory is separate from the Human's existing Edge profile. Its local browser storage persists across Edge process exit while the directory remains; it is not an InPrivate profile. Because it is under Temp, do not allow cleanup to remove it before the test and evidence review. No Dataset was loaded and no acceptance action was performed in this window.
- Server and profile are prepared for Human-controlled testing. Codex has not opened DevTools or read/changed this profile's storage.

### Proposed Human scenario and expected result

1. Confirm the visible Edge window is the dedicated Test 36 profile, not InPrivate, and the address is http://127.0.0.1:5334/. Do not use the regular profile or the 5312 / 5322 / 5331 environments.
2. Open the bundled The Ashen Crown sample. Confirm 10 Entities / 7 Dimensions / 70 Assessments. Apply a disposable title such as Test 36 Saved Baseline. Wait until the UI explicitly reports the browser-local Workspace saved. Do not leave a form draft open; this test is for the adopted saved-Workspace recovery boundary.
3. Record a screenshot of the saved title, counts, and save status. If a separate E2R JSON backup is desired, use a dedicated download directory and confirm the file exists; treat it only as a file backup, not as evidence of browser-local Workspace persistence. Export is optional and not required for this recovery test.
4. Stop before any force termination. Codex must revalidate and present the exact root process, all descendants tied to this user-data directory, the disposable saved Dataset at risk, and the recovery path. A separate explicit Human approval is required for the specific termination operation. This preparation does not authorize it.
5. Only after that approval, terminate only the revalidated dedicated Edge process tree. Do not terminate by process name, do not close other Edge processes, and stop if any process ownership or profile argument is ambiguous.
6. Relaunch Edge in regular mode with the same user-data directory and open a fresh ParameterPlotter page. Do not mistake a restored in-memory page/tab for the saved Workspace: use Home / Continue Editing from a new page when available. Confirm Test 36 Saved Baseline, counts 10/7/70, and a saved-local-Workspace status.
7. Apply a second disposable title, such as Test 36 Recovery Save, and confirm that the recovered session can save and that no stale-tab warning remains. Capture the result. Do not create an unapplied form draft or test its crash recovery.

Expected acceptance would cover only one abnormal termination of the dedicated Edge process tree, saved Workspace recovery, and a later successful save in this profile. It would not establish unapplied-draft recovery, renderer-only crashes, operating-system/browser data loss, other browsers, other forms, cross-app interaction, production hosting, or universal crash recovery.

### Safety stops and recovery

Stop without terminating anything if the profile path or Edge mode is uncertain, an unexpected tab/process is present, the test Dataset is not disposable, the Apply save status is not confirmed, a pending draft is visible, another app is open in the profile, or the isolated server is unavailable. If the Workspace is not recoverable after an approved test, keep the profile and evidence intact; reopen the bundled sample in that same dedicated profile only if Human directs it. Do not clear localStorage or delete the profile as a recovery shortcut. Preserve any optional exported file in the dedicated download location.

If an actual process-tree termination is needed, its approval request must state the freshly observed PID tree and command lines, profile ownership, target origin, possible loss of the browser session or any unconfirmed in-memory work, expected effect on other applications (none if isolation is revalidated), and the exact relaunch/recovery procedure. Approval for one test applies only to that revalidated process tree and one termination.

No abnormal termination was run for Test 36 preparation. Human Browser Acceptance remains PENDING; Cross-Context Workspace Safety remains open; PUBLIC RELEASE NO-GO remains in force.
