# ParameterPlotter Abnormal-Termination Workspace Recovery Verification

Date: 2026-10-11
Status: Safe source review, automated verification, and isolated normal-restart browser baseline completed. Abnormal termination is NOT tested; exact isolated Edge process-tree termination is pending explicit Human approval. Cross-Context Workspace Safety remains open. PUBLIC RELEASE NO-GO remains in force.

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

After that baseline, Codex opened a new Dimension form and entered `Abnormal Termination Draft - disposable` without saving. The visible pending-edit warning was present. The saved local workspace remained the Ashen Crown sample with 10 / 7 / 70 counts and did not contain the draft Dimension. One ParameterPlotter page was open, with one active tab marker and its Web Lock held. No destructive action has been performed.

## Abnormal-termination test authorization gate

No renderer crash, browser crash, forced process termination, abnormal tab exit, or profile deletion has been performed. These actions require the Human's explicit approval for the exact target and operation.

Proposed next test, only if approved: force-terminate the isolated Edge browser process tree to model a browser-process abnormal exit, then relaunch the same isolated profile and inspect recovery. This is not authorization to terminate any other Edge process or to test renderer-only crash behavior.

At the time this checkpoint was prepared, the launched root process was `msedge.exe` PID `16056`, started by Codex with `--headless=new`, `--remote-debugging-port=9335`, and the isolated `--user-data-dir` shown above. Its current descendant process IDs were `30616` (Crashpad), `24052` (GPU), `28348` (Network Service), `30716` (Storage Service), `26344` and `4864` (renderer processes), and `28616` (Edge Search Indexer). The CDP page target was `FBD5435C3BFB4A19A630A532F2BEBF46`, URL `http://127.0.0.1:5312/`; `/json/list` showed only that page. These PIDs are a point-in-time inventory and must be rechecked immediately before any approved action. If the root PID, profile path, target, process ancestry, or command lines no longer match, stop and obtain renewed approval. Do not terminate the shell parent or any process based only on its `msedge.exe` name.

Potential loss is limited to the isolated profile: the unapplied Dimension draft may be lost, and its browser tab/runtime state will end. The last confirmed saved workspace is the disposable Ashen Crown Dataset. No Human browser profile, other E2R app, production setting, or repository data is in this process tree. After approval, stop if another target/tab appears, if any process in the candidate list lacks the isolated profile/ownership relationship, if the saved workspace no longer matches 10 / 7 / 70, or if the test would touch any process outside the enumerated isolated tree. If safe restart or storage inspection cannot be established, do not retry destructive actions; retain the profile and report the failure state.

## Evidence classification and acceptance boundary

- Automated Test PASS: modeled tests and application checks listed above; not proof of process-crash lifecycle.
- Codex Browser Verified: disposable Dataset survived normal reload and graceful browser close/restart; pending form was visible and absent from saved Dataset before any crash test.
- Abnormal termination: NOT TESTED pending explicit Human approval.
- Human Browser Acceptance for this abnormal-termination checkpoint: PENDING.

Previously accepted Quadrant Tests 23-27 and Human BFCache Tests 28-A-K / 29-A-M remain unchanged. Test 29's direct `pagehide.persisted=true` / `pageshow.persisted=true` evidence proves one BFCache cycle only, not crash recovery.

Still pending after any bounded abnormal-termination test: Human acceptance; crash/recovery behavior not directly exercised by Human; BFCache Export / Reload recovery actions; all-form cross-tab coverage; ParameterPlotter × NarrativeLine BFCache operation; production GitHub Pages same-origin and HTTPS/CORS Handoff; and full Cross-Context Workspace Safety acceptance. PUBLIC RELEASE NO-GO remains in force.