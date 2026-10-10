# BFCache Workspace Safety Verification

Date: 2026-10-11
Status: Codex Browser Verified for a BFCache-restored saved-but-modified Workspace and stale-writer refusal in isolated Edge. Human Browser Acceptance is PASS for the limited Test 28-A-K and Test 29-A-M observations recorded below, including one directly instrumented BFCache restoration of an unapplied Dimension draft; broader safety coverage remains pending. Cross-Context Workspace Safety is not closed. PUBLIC RELEASE NO-GO remains in force.

## Authority and implementation reviewed

The adopted contract is E2R-SPEC docs/cross-app/cross-context-workspace-safety-design-2026-10-10.md. The applicable Knowledge records are decisions/cross-context-workspace-safety.md and playbooks/workspace-safety-review-and-acceptance.md. They require stale writers to stop, unresolved work to remain protected, coordination state not to become a permanent lock after BFCache or closure, and recovery paths to remain available. This checkpoint verifies ParameterPlotter behavior only and does not revise that contract.

ParameterPlotter's cross-tab-workspace.js removes its status marker and releases the tab Web Lock on pagehide. On pageshow with event.persisted, it clears transient coordination failure and registers a fresh tab lock/status. Workspace writes and replacements still use the exclusive write lock and compare the stored Workspace string with the tab's expected revision through saveIfCurrent. A mismatch refuses the write and keeps the newer persisted copy. The persisted workspace key is e2r-parameter-plotter-local-workspace-v2; tab locks use the e2r:parameter-plotter:workspace-tab: namespace.

## Browser environment and BFCache evidence

Codex used Microsoft Edge 154.0.4258.62 headless with a new isolated profile, disposable built-in Ashen Crown sample data, and a temporary same-origin static server at http://127.0.0.1:5312/. The temporary server served the app with Cache-Control: public, max-age=120 and an /away.html history destination. It did not change repository or production server settings.

An initial check against the ordinary ParameterPlotter development server did not enter BFCache: after Back, pageshow.persisted was false and Edge's PerformanceNavigationTiming.notRestoredReasons reported response-cache-control-no-store and response-cache-control-no-store-with-js-network-request. That run is classified as a non-BFCache navigation, not a BFCache result. The cacheable temporary server was then used for the actual BFCache checks.

In the cacheable environment, the page emitted pagehide.persisted=true on leaving and pageshow.persisted=true on history return. This is direct evidence that the old Document was restored from BFCache rather than reloaded.

## Codex Browser Verification: saved Workspace and stale writer

1. Tab A opened the disposable Ashen Crown sample and applied a temporary Dataset title. Its saved workspace had datasetModified=true and contained ten Entities.
2. Tab A navigated to the same-origin away page. The observed pagehide.persisted=true confirmed the page entered BFCache; the coordinator released its active marker/lock.
3. Tab B opened ParameterPlotter and used New Dataset. The replacement confirmation completed successfully while A was suspended; the saved raw Workspace changed to the new empty Dataset (zero Entities). This verifies that the BFCache-suspended tab does not leave an active peer marker that permanently blocks a safe replacement.
4. Back restored Tab A with pageshow.persisted=true. Its old title and ten-Entity in-memory page state remained visible while localStorage contained Tab B's newer zero-Entity Workspace. The restored tab reacquired its tab lock and active status; the two live tab locks were visible in navigator.locks.query().
5. Tab A then applied another title edit. The stale revision was refused with the specific message: ?Another ParameterPlotter tab changed the saved workspace. This tab did not overwrite it. Export any work you need to keep, then reload before continuing.? The saved raw Workspace remained byte-for-byte equal to Tab B's new Dataset. No replacement or stale write was accepted.

This verifies BFCache restoration, stale-revision refusal, preserved old in-memory work, a non-permanent suspended lock, and visible Export/Reload recovery guidance for the tested saved-but-modified Dataset path. Export and Reload were not themselves executed as recovery actions.

## Pending-draft and recovery limits

A separate BFCache restoration of a live, unapplied form draft was not completed in the original Codex browser run. ParameterPlotter's beforeunload guard prompts when pending drafts or degraded work are present; continuing navigation requires explicitly accepting the browser's leave-page confirmation. Human later performed this bounded disposable-draft test with that action explicitly approved; see Test 29 below. The earlier automated checks and coordinator lifecycle test remain automation evidence, not proof of form restoration.

This checkpoint did not test abnormal process termination, all form types, production GitHub Pages headers, production HTTPS/CORS Handoff, other browsers, screen readers, or ParameterPlotter ? NarrativeLine during BFCache traversal. Current NarrativeLine source uses narrativeline.lastDataset and e2r:narrativeline:workspace-tab:; the existing 2026-10-10 same-origin checkpoint records PP/NarrativeLine storage and lock separation. No BFCache-specific cross-app scenario is claimed here.

## Automated verification

- node --test cross-tab-workspace.test.mjs: PASS, 8/8 tests.
- npm.cmd run check: PASS, syntax check for 37 application modules and 167/167 tests.
- npm.cmd run build: PASS, 59 static Pages files.

The added test models pagehide releasing the tab record/lock and a persisted pageshow reacquiring them with the same pending-work status. It is automation coverage for the coordinator lifecycle, not browser BFCache proof or Human Acceptance.

## Acceptance and release boundary

Codex Browser Verified: a real Edge BFCache cycle for a saved-but-modified workspace, successful safe replacement in another tab while the first was suspended, preserved newer storage, restored old page, and stale-write refusal. The non-BFCache no-store run is recorded separately as an environment limitation.

At the time of this original Codex checkpoint, Human Browser Acceptance for BFCache traversal and workspace actions was pending. Human later reported the bounded Test 28-A-K observations in the follow-up below. Cross-Context Workspace Safety as a whole remains pending, including abnormal termination recovery, exhaustive cross-tab form coverage, production same-origin/HTTPS/CORS behavior, and BFCache scenarios beyond the bounded Dimension-form test below. The prior Quadrant Tests 23-27 Human closure remains unchanged. PUBLIC RELEASE NO-GO remains in force.

## Human Browser follow-up: Test 28-A-K (limited acceptance)

Human used Microsoft Edge InPrivate with the cacheable local environment at `http://127.0.0.1:5312/`, the same-origin history destination `http://127.0.0.1:5312/away.html`, and The Ashen Crown. The following is Human-reported browser evidence, distinct from the Codex Browser Verification above.

| Tests | Human result | Confirmed scope |
|---|---|---|
| 28-A-C | PASS | Home loaded; The Ashen Crown loaded; the title was changed to `Ashen Crown BFCache Test A` and applied; the applied notice appeared, the pending-edit warning cleared, and the browser reported the workspace saved locally. On the first attempted navigation, the browser's leave-page prompt appeared while the title was unapplied; Human chose Cancel, applied the title, and then navigated without the prompt. This is expected pending-edit protection, not a failure. |
| 28-D-G | PASS | Tab A navigated to the same-origin `away.html`. With A left there, Tab B opened ParameterPlotter and explicitly confirmed `Discard and Create Dataset`. Tab B showed 0 Entities, 0 Dimensions, and 0 Assessments and reported the workspace saved locally. |
| 28-H-J | PASS | Browser Back returned to A, whose old view still showed title `Ashen Crown BFCache Test A` and 10 Entities / 7 Dimensions / 70 Assessments. Applying title `Ashen Crown BFCache Test A2` was refused as a saved-revision conflict; the UI reported that the newer workspace was not overwritten and showed Export / Reload recovery guidance. The browser-local workspace was marked Degraded / unsaved. |
| 28-K | PASS | Reloading B and choosing Continue Editing restored the empty Dataset: blank title, 0 Entities, 0 Dimensions, and 0 Assessments; the workspace was saved locally. This confirms the newer Dataset remained available after A's stale save attempt, within the visible UI and reload steps performed. |

### Human evidence boundary

This is HUMAN BROWSER ACCEPTED / PASS only for the listed Edge InPrivate actions and visible results. Human observed Back restoring A's old screen, but did not inspect `pageshow.persisted`; therefore these tests do not establish that Human's Back navigation was a BFCache restoration. The earlier isolated Codex Edge run separately established actual BFCache entry and restoration using `pagehide.persisted=true` and `pageshow.persisted=true`, along with lock/status re-registration and stale-writer refusal. Do not merge those evidence sources.

Human confirmed the conflict and recovery guidance was displayed, but did not execute Export or Reload recovery in A. Human did not inspect localStorage byte equality or Web Lock internals. No Human PASS is claimed for those internal states or actions.

### Current pending scope and protected follow-up

Test 29 resolves the previously pending, bounded Human check of one unapplied Dimension form restored through a directly observed BFCache cycle, followed by Cancel. The following remain unverified: actual Export / Reload recovery from A; BFCache traversal while ParameterPlotter and NarrativeLine are both in use; abnormal-termination recovery; exhaustive cross-tab coverage of every form; production GitHub Pages same-origin behavior; production HTTPS/CORS Handoff; and full Cross-Context Workspace Safety acceptance. The Test 29 observation does not guarantee restoration when BFCache is not used (including ordinary reload or browser termination).

At the time of this Test 28 checkpoint, the unapplied-Dimension BFCache navigation test was deferred because accepting the browser leave-page prompt could discard the disposable draft. Human subsequently approved and performed the specific Test 29 action recorded below. That approval does not authorize additional destructive tests. The previously documented pending-draft automated and Codex evidence remains distinct from this Human report. PUBLIC RELEASE NO-GO remains in force.

## Human Browser closure: Test 29-A-M (pending Dimension draft)

Human used Microsoft Edge InPrivate at `http://127.0.0.1:5312/`, with same-origin destination `http://127.0.0.1:5312/away.html` and the disposable The Ashen Crown sample. Human reported the following bounded results:

| Tests | Human result | Confirmed scope |
|---|---|---|
| 29-A-D | PASS | The Ashen Crown showed 10 Entities, 7 Dimensions, and 70 Assessments. Human opened the new Dimension form and entered `BFCache Draft Test` without saving it. |
| 29-E-G, first traversal | PASS for the observed form-restoration state; BFCache status uninstrumented | With `BFCache Draft Test` still unapplied, Human attempted navigation to `away.html`. Edge showed its leave-page confirmation and Human explicitly chose Move. After reaching `away.html` and using Back, the Dimension Pool and new-Dimension form remained open, the text and pending-edit warning were retained, and Dataset counts were unchanged. `pagehide.persisted` / `pageshow.persisted` were not measured during this traversal, so this observation alone does not prove BFCache entry. |
| 29-H-L, second traversal | PASS; actual BFCache directly observed | Human installed temporary `pagehide` / `pageshow` persisted-state listeners in DevTools, saw `BFCache probe ready`, accepted the leave-page prompt for the disposable draft, navigated to `away.html`, and returned with Back. The form and `BFCache Draft Test` input remained. Console reported `{ pagehide: true, pageshow: true }`, direct evidence that this traversal entered and returned from BFCache. |
| 29-M | PASS | Human clicked Cancel after restoration. The new-Dimension form closed, the pending-edit warning cleared, the Dimension Pool remained open, and counts remained 10 Entities, 7 Dimensions, and 70 Assessments. |

### Acceptance boundary and superseded pending status

HUMAN BROWSER ACCEPTED / PASS applies to the exact Edge InPrivate operations above: preserving one unapplied Dimension form through the instrumented BFCache cycle and canceling it after return. The first traversal is recorded separately because its BFCache status was not instrumented. The prior pending statement in this checkpoint was accurate when written and is superseded only for this bounded form and Cancel path.

Human did not inspect Web Lock internals, localStorage bytes, or other form types. This does not promise restoration after a normal reload or browser/process termination when BFCache is not used. It also does not claim the instrumented traversal verified export/reload recovery or cross-app BFCache behavior. The Codex Browser Verification earlier in this file remains a separate evidence source and is not being recast as Human evidence.

The BFCache pending-draft Dimension-form acceptance item is closed for this observed case. Cross-Context Workspace Safety remains open. Remaining work includes abnormal-termination recovery; Export / Reload recovery after a stale-writer refusal; exhaustive cross-tab coverage of all forms; BFCache use with ParameterPlotter and NarrativeLine together; production GitHub Pages same-origin and HTTPS/CORS Handoff verification; and broader browser coverage. Do not start abnormal-termination or other destructive recovery tests without the Human review and safety approval required for that specific operation. PUBLIC RELEASE NO-GO remains in force.
